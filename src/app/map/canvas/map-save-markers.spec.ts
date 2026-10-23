import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { MapLabel } from '../map-label';
import { MapSaveTesting } from '../map-save-testing';
import { MapStore } from '../map-store';
import { MapCanvasComponent } from './map-canvas.component';
import { MapSaveMarkers } from './map-save-markers';

const { A, B, station } = MapSaveTesting;

describe('MapSaveMarkers', () => {
	async function setup() {
		const testing = new MapSaveTesting();
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		await testing.load({
			sectors: [
				{ id: A, owner: 'argon', contested: false, known: true },
				{ id: B, owner: 'paranid', contested: true, known: false },
			],
			stations: [
				station({ code: 'AAA-111', name: 'Argon Wharf' }),
				station({ code: 'PPP-222', owner: 'player', macro: 'station_gen_tradestation_01', x: 10, z: 10 }),
				station({ code: 'FAR-999', x: 300, z: 401 }),
				station({ code: 'BBB-333', sector: B, owner: 'paranid', known: false }),
			],
			playerShips: { [A]: [1, 2, 0, 0, 3] },
		});
		const store = TestBed.inject(MapStore);
		const fixture = TestBed.createComponent(MapCanvasComponent);
		const zoom = async (scale: number) => {
			store.size.set({ width: 1000, height: 700 });
			store.view.update((view) => ({ ...view, w: 1000 / scale }));
			await fixture.whenStable();
		};
		await fixture.whenStable();
		return { fixture, element: fixture.nativeElement as HTMLElement, zoom, store };
	}

	it('draws dots when zoomed out and type icons when zoomed in', async () => {
		const { element, zoom } = await setup();
		await zoom(MapSaveMarkers.DETAIL_SCALE / 2);
		const markers = () => element.querySelectorAll('g[appMapSaveMarkers] g[data-sector]');
		expect(markers().length).toBe(4);
		expect(element.querySelector('g[appMapSaveMarkers] g[data-sector] text')).toBeNull();

		await zoom(MapSaveMarkers.DETAIL_SCALE * 2);
		const icons = (name: string) => element.querySelectorAll(`g[appMapSaveMarkers] svg.lucide-${name}`).length;
		expect(icons('arrow-left-right')).toBe(1);
		expect(icons('circle')).toBe(3);
		expect(element.querySelector('g[appMapSaveMarkers] g[data-sector] text')).toBeNull();

		await zoom(MapSaveMarkers.LABEL_SCALE * 2);
		const texts = [...element.querySelectorAll('g[appMapSaveMarkers] g[data-sector] text')].map((x) =>
			x.textContent?.trim()
		);
		expect(texts).toContain('Argon Wharf');
	});

	it('rings player stations', async () => {
		const { element, zoom } = await setup();
		for (const scale of [MapSaveMarkers.DETAIL_SCALE / 2, MapSaveMarkers.DETAIL_SCALE * 2]) {
			await zoom(scale);
			const rings = element.querySelectorAll('g[appMapSaveMarkers] circle[fill=none]');
			expect(rings.length).toBe(1);
		}
	});

	it('shows a ship badge per sector with the size split in its title', async () => {
		const { element, zoom } = await setup();
		await zoom(MapSaveMarkers.DETAIL_SCALE * 2);
		const badges = element.querySelectorAll('g[appMapCountBadge]');
		expect(badges.length).toBe(1);
		expect(badges[0].querySelector('text')?.textContent?.trim()).toBe('6');
		const title = badges[0].querySelector('title')?.textContent ?? '';
		expect(title).toContain('XS 1');
		expect(title).toContain('S 2');
		expect(title).toContain('XL 3');
		expect(title).not.toContain('M ');
	});

	it('keeps badges inside small sectors and hides their number', async () => {
		const { element, zoom, store } = await setup();
		await zoom(0.5);
		const circle = () => element.querySelector('g[appMapCountBadge] circle')!;
		const pixels = () => Number(circle().getAttribute('r')) * store.panZoom.scale();
		const small = pixels();
		expect(element.querySelector('g[appMapCountBadge] text')).toBeNull();
		await zoom(MapSaveMarkers.DETAIL_SCALE * 2);
		expect(pixels()).toBeGreaterThan(small);
		expect(element.querySelector('g[appMapCountBadge] text')).not.toBeNull();
	});

	it('dims unknown sectors and their names and hatches contested ones', async () => {
		const { element, zoom, store } = await setup();
		await zoom(MapSaveMarkers.DETAIL_SCALE / 2);
		const a = element.querySelector(`polygon[data-sector="${A}"]`)!;
		const b = element.querySelector(`polygon[data-sector="${B}"]`)!;
		expect(b.getAttribute('stroke')).toBe('#f87171');
		expect(b.getAttribute('stroke-dasharray')).toBeNull();
		expect(Number(b.getAttribute('fill-opacity'))).toBeLessThan(Number(a.getAttribute('fill-opacity')));

		const hatches = element.querySelectorAll('polygon[fill="url(#map-contested)"]');
		expect(hatches.length).toBe(1);
		expect(hatches[0].getAttribute('points')).toBe(b.getAttribute('points'));
		expect(hatches[0].getAttribute('pointer-events')).toBe('none');
		expect(element.querySelector('pattern#map-contested')).not.toBeNull();

		const label = (id: string) =>
			[...element.querySelectorAll('g[appMapLabels] text')].find(
				(x) => x.textContent?.trim() === MapLabel.wrap(store.shapeById.get(id)!.sector.name)[0]
			)!;
		expect(label(B).getAttribute('opacity')).toBe('0.5');
		expect(label(A).getAttribute('opacity')).toBeNull();
	});

	it('names every marker for assistive tech without a native tooltip', async () => {
		const { element } = await setup();
		expect(element.querySelector('g[appMapSaveMarkers] g[data-sector] > title')).toBeNull();
		const titles = [...element.querySelectorAll('g[appMapSaveMarkers] g[data-sector][role=img]')].map((x) =>
			x.getAttribute('aria-label')
		);
		expect(titles.length).toBe(4);
		expect(titles[0]).toContain('Argon Wharf');
	});

	it('shows the station tooltip with the far distance', async () => {
		const { fixture, element, zoom } = await setup();
		await zoom(MapSaveMarkers.DETAIL_SCALE * 2);
		const marker = element.querySelector('g[appMapSaveMarkers] g[data-sector]')!;
		marker.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }));
		await fixture.whenStable();
		const tooltip = element.querySelector('app-station-tooltip')!.textContent ?? '';
		expect(tooltip).toContain('Argon Wharf');
		expect(tooltip).toContain('AAA-111');

		const far = element.querySelectorAll('g[appMapSaveMarkers] g[data-sector]')[2];
		far.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 5 }));
		await fixture.whenStable();
		expect(element.querySelector('app-station-tooltip')!.textContent).toMatch(/50[1-9]|[6-9]\d\d km from/);
	});
});
