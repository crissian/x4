import { Dialog } from '@angular/cdk/dialog';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import { StationMarkersComponent } from '../../map/canvas/station-markers';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { SectorMapDialogComponent } from './sector-map-dialog.component';
import { SectorMapComponent } from './sector-map.component';

const ARGON_PRIME = 'cluster_14_sector001';

describe('SectorMapComponent', () => {
	async function setup(stations?: SaveStation[]) {
		const data = stations ? { map: { sectors: [], stations, playerShips: {} } } : {};
		const active = signal(stations ? { id: 'x', data } : null);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(stations ? 'x' : null), status: () => 'ok' },
				},
			],
		});
		const fixture = TestBed.createComponent(SectorMapComponent);
		fixture.componentRef.setInput('sector', ARGON_PRIME);
		await fixture.whenStable();
		TestBed.tick();
		await LazyValue.settled();
		fixture.detectChanges();
		const component = fixture.componentInstance;
		// jsdom has no layout: give the map a size
		const area = fixture.nativeElement.querySelector('.touch-none') as HTMLElement;
		area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 600 }) as DOMRect;
		component.size.set({ width: 1000, height: 600 });
		const zoomTo = async (scale: number) => {
			component.size.set({ width: 1000, height: 600 });
			component.view.update((view) => ({ ...view, w: 1000 / scale }));
			await fixture.whenStable();
		};
		return { component, element: fixture.nativeElement as HTMLElement, zoomTo };
	}

	function station(extra: Partial<SaveStation>): SaveStation {
		return {
			code: 'ABC-123',
			macro: 'station_gen_factory_01',
			owner: 'argon',
			sector: ARGON_PRIME,
			x: 0,
			z: 0,
			known: true,
			modules: [],
			...extra,
		};
	}

	it('draws the hex, the game start stations and the gates with links to their sectors', async () => {
		const { component, element } = await setup();
		expect(component.fromSave()).toBe(false);
		expect(element.querySelector('polygon')?.getAttribute('points')).toBe(component.shape()!.points);
		expect(component.markers().length).toBeGreaterThan(0);
		expect(component.markers().every((x) => x.sector === ARGON_PRIME)).toBe(true);
		expect(element.querySelectorAll('g[appStationMarkers] g[data-sector]').length).toBe(component.markers().length);
		expect(component.gates().length).toBeGreaterThan(0);
		const gate = component.gates()[0];
		expect(element.querySelector(`a[href="/sectors/${gate.sector.id}"]`)).not.toBeNull();
	});

	it('draws the save stations of the sector and names them when zoomed in', async () => {
		const { component, element, zoomTo } = await setup([
			station({ code: 'MINE-1', owner: 'player', name: 'My Dock' }),
			station({ code: 'ELSE-1', sector: 'cluster_01_sector001' }),
		]);
		expect(component.fromSave()).toBe(true);
		expect(component.markers().map((x) => x.id)).toEqual(['MINE-1']);
		await zoomTo(StationMarkersComponent.LABEL_SCALE / 2);
		expect(element.textContent).not.toContain('My Dock');
		await zoomTo(StationMarkersComponent.LABEL_SCALE * 2);
		expect(element.textContent).toContain('My Dock');
	});

	it('zooms with the buttons within limits and keeps the hex in reach', async () => {
		const { component } = await setup();
		const shape = component.shape()!;
		component.reset();
		const home = component.view().w;
		component.zoom(0.7);
		expect(component.view().w).toBeCloseTo(home * 0.7);
		for (let i = 0; i < 30; i++) {
			component.zoom(1.4);
		}
		expect(component.view().w).toBeCloseTo(shape.r * 6);
		component.view.set({ x: shape.x + 1000, y: shape.y + 1000, w: shape.r });
		component.zoom(1);
		const view = component.view();
		const size = component.size();
		expect(view.x + view.w / 2).toBeLessThanOrEqual(shape.x + shape.r + 1e-6);
		expect(view.y + (view.w * size.height) / size.width / 2).toBeLessThanOrEqual(shape.y + shape.r + 1e-6);
		component.reset();
		expect(component.view().w).toBeCloseTo(home);
	});

	it('opens the map enlarged in a dialog', async () => {
		const { element } = await setup();
		const open = vi.spyOn(TestBed.inject(Dialog), 'open').mockReturnValue(undefined as never);
		element.querySelector<HTMLButtonElement>('button[aria-label="Open a larger map"]')!.click();
		expect(open).toHaveBeenCalledWith(SectorMapDialogComponent, expect.objectContaining({ data: ARGON_PRIME }));
	});
});
