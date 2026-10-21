import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import MapComponent from './map.component';

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
});
