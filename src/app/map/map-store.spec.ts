import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MapStore } from './map-store';

describe('MapStore', () => {
	function setup() {
		TestBed.configureTestingModule({ providers: [MapStore] });
		return TestBed.inject(MapStore);
	}

	it('plans a route between sectors picked by name', () => {
		const store = setup();
		store.routeModel.update((x) => ({ ...x, from: 'grand exchange i', to: 'Argon Prime' }));
		expect(store.route()?.jumps).toBeGreaterThan(0);

		store.swapRoute();
		expect(store.routeModel().from).toBe('Argon Prime');
	});

	it('takes the travel speed from the picked ship', () => {
		const store = setup();
		store.routeModel.update((x) => ({ ...x, ship: 'ship_arg_l_destroyer_01_a' }));
		TestBed.tick();
		expect(store.routeModel().speed).not.toBe(3000);
		expect(store.routeForm.speed().disabled()).toBe(true);
	});

	it('keeps the content pack choice as a list of shown versions', () => {
		const store = setup();
		store.versions.update((x) => x.map((_, i) => i !== 1));
		TestBed.tick();
		expect(JSON.parse(localStorage.getItem('map-versions') ?? '[]')).not.toContain(1);
		expect(store.visibleShapes().length).toBeLessThan(store.layout.shapes.length);
		localStorage.removeItem('map-versions');
	});
});
