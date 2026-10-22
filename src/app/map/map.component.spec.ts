import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LazyValue } from '../core/lazy-value';
import { describe, expect, it } from 'vitest';
import { SavegameStore, type SavegameStatus } from '../savegame/savegame-store';
import MapComponent from './map.component';
import { MapSaveLayer } from './save/map-save-layer';

describe('MapComponent', () => {
	async function setup() {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(MapComponent);
		await fixture.whenStable();
		const element: HTMLElement = fixture.nativeElement;
		const set = async (selector: string, value: string) => {
			const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
			control.value = value;
			control.dispatchEvent(new Event('input'));
			control.dispatchEvent(new Event('change'));
			await fixture.whenStable();
		};
		return { fixture, element, set };
	}

	it('renders the sectors', async () => {
		const { element } = await setup();
		expect(element.querySelectorAll('polygon').length).toBeGreaterThan(50);
	});

	it('plans a route from the panel fields', async () => {
		const { element, set } = await setup();
		await set('input[aria-label="From sector"]', 'Grand Exchange I');
		await set('input[aria-label="To sector"]', 'Argon Prime');
		expect(element.querySelector('app-map-route-panel ol')?.children.length).toBeGreaterThan(1);
		expect(element.querySelector('polyline')).toBeTruthy();

		await set('select[aria-label="Ship"]', 'ship_arg_l_destroyer_01_a');
		const speed = element.querySelector<HTMLInputElement>('app-map-route-panel input[type=number]')!;
		expect(speed.disabled).toBe(true);
		expect(speed.value).not.toBe('3000');
	});

	describe('with a save', () => {
		async function withSave(data: object | null, status: SavegameStatus = 'ok') {
			localStorage.removeItem('map-discovered-only');
			const store = { active: signal(data && { id: 'x', data }), activeId: signal('x'), status: () => status };
			TestBed.configureTestingModule({
				providers: [provideRouter([]), { provide: SavegameStore, useValue: store }],
			});
			const fixture = TestBed.createComponent(MapComponent);
			await fixture.whenStable();
			await LazyValue.settled();
			await fixture.whenStable();
			return { fixture, element: fixture.nativeElement as HTMLElement };
		}

		it('shows a loading note while the map data is missing', async () => {
			const { element } = await withSave({});
			expect(element.querySelector('[role=status]')?.textContent).toContain('Loading save');
		});

		it('shows a loading note while the active save is read from storage', async () => {
			const { element } = await withSave(null);
			expect(element.querySelector('[role=status]')?.textContent).toContain('Loading save');
		});

		it('asks to reload a save that cannot be updated', async () => {
			const { element } = await withSave({}, 'reload-needed');
			expect(element.querySelector('[role=status]')).toBeNull();
			const link = element.querySelector<HTMLAnchorElement>('a[href="/saves"]');
			expect(link?.textContent).toContain('Reload this save');
		});

		it('toggles discovered only with the checkbox', async () => {
			const { fixture, element } = await withSave({ map: { sectors: [], stations: [], playerShips: {} } });
			expect(element.querySelector('[role=status]')).toBeNull();
			const box = element.querySelector<HTMLInputElement>('input[type=checkbox]')!;
			box.click();
			await fixture.whenStable();
			expect(fixture.debugElement.injector.get(MapSaveLayer).discoveredOnly()).toBe(true);
		});
	});
});
