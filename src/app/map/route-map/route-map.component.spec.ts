import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import { SavegameStore } from '../../savegame/savegame-store';
import { AppDialog } from '../../shared/components/modal/dialog';
import { RouteMapDialogComponent } from './route-map-dialog.component';
import { RouteMapComponent } from './route-map.component';

const ARGON_PRIME = 'cluster_14_sector001';
const SECOND_CONTACT = 'cluster_13_sector001';

describe('RouteMapComponent', () => {
	const active = signal<unknown>(null);
	const activeId = signal<string | null>(null);

	async function setup(path: readonly string[]) {
		active.set(null);
		activeId.set(null);
		TestBed.configureTestingModule({
			providers: [{ provide: SavegameStore, useValue: { active, activeId, status: () => 'ok' } }],
		});
		const fixture = TestBed.createComponent(RouteMapComponent);
		fixture.componentRef.setInput('path', path);
		await fixture.whenStable();
		TestBed.tick();
		await LazyValue.settled();
		fixture.detectChanges();
		return { fixture, component: fixture.componentInstance, element: fixture.nativeElement as HTMLElement };
	}

	it('draws a hex per path sector and a line through them', async () => {
		const { element } = await setup([ARGON_PRIME, SECOND_CONTACT]);
		expect(element.querySelectorAll('polygon[data-path]').length).toBe(2);
		const lines = element.querySelectorAll('polyline');
		expect(lines.length).toBe(1);
		expect(lines[0].getAttribute('points')!.trim().split(' ').length).toBe(2);
		// nearby sectors are drawn dimmed for context
		expect(element.querySelectorAll('polygon:not([data-path])').length).toBeGreaterThan(0);
	});

	it('marks the start and the end', async () => {
		const { element } = await setup([ARGON_PRIME, SECOND_CONTACT]);
		expect(element.querySelector('[data-end="start"]')).not.toBeNull();
		expect(element.querySelector('[data-end="end"]')).not.toBeNull();
	});

	it('draws nothing for an empty path', async () => {
		const { element } = await setup([]);
		expect(element.querySelector('polygon')).toBeNull();
		expect(element.querySelector('polyline')).toBeNull();
		expect(element.querySelector('[data-end]')).toBeNull();
	});

	it('ignores unknown sector ids', async () => {
		const { element } = await setup(['nowhere', ARGON_PRIME, 'cluster_999_sector001', SECOND_CONTACT]);
		expect(element.querySelectorAll('polygon[data-path]').length).toBe(2);
		expect(element.querySelector('polyline')!.getAttribute('points')!.trim().split(' ').length).toBe(2);
	});

	it('fits the path and refits when it changes', async () => {
		const { fixture, component } = await setup([ARGON_PRIME]);
		component.size.set({ width: 1000, height: 1000 });
		component.reset();
		const one = component.view().w;
		fixture.componentRef.setInput('path', [ARGON_PRIME, SECOND_CONTACT]);
		await fixture.whenStable();
		expect(component.view().w).toBeGreaterThan(one);
	});

	it('keeps a panned view when a save changes the owner colours', async () => {
		const { fixture, component, element } = await setup([ARGON_PRIME, SECOND_CONTACT]);
		const fill = () => element.querySelector('polygon[data-path]')!.getAttribute('fill');
		const before = fill();
		component.view.set({ x: 1, y: 2, w: 3 });
		const sectors = [ARGON_PRIME, SECOND_CONTACT].map((id) => ({
			id,
			owner: 'xenon',
			contested: false,
			known: true,
		}));
		active.set({ id: 'x', data: { map: { sectors, stations: [], playerShips: {} } } });
		activeId.set('x');
		TestBed.tick();
		await LazyValue.settled();
		await fixture.whenStable();
		fixture.detectChanges();
		expect(fill()).not.toBe(before);
		expect(component.view()).toEqual({ x: 1, y: 2, w: 3 });
	});

	it('outlines the warn sectors in red', async () => {
		const { fixture, element } = await setup([ARGON_PRIME, SECOND_CONTACT]);
		expect(element.querySelector('[data-warn]')).toBeNull();
		fixture.componentRef.setInput('warnSectors', [SECOND_CONTACT, 'nowhere']);
		await fixture.whenStable();
		const warn = element.querySelectorAll('[data-warn]');
		expect(warn.length).toBe(1);
		expect(warn[0].getAttribute('data-warn')).toBe(SECOND_CONTACT);
		expect(warn[0].getAttribute('stroke')).toBe('#ef4444');
	});

	it('expand opens the dialog', async () => {
		const path = [ARGON_PRIME, SECOND_CONTACT];
		const { element } = await setup(path);
		const open = vi.spyOn(AppDialog, 'open').mockReturnValue(undefined as never);
		element.querySelector<HTMLButtonElement>('button[aria-label="Open a larger map"]')!.click();
		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			RouteMapDialogComponent,
			expect.objectContaining({ data: { path, warnSectors: [] }, size: 'xl' })
		);
	});
});
