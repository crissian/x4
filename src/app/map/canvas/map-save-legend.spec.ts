import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { MapSaveTesting } from '../map-save-testing';
import { MapHostiles } from '../save/map-hostiles';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapLegendComponent } from './map-legend.component';

describe('MapSaveLegend', () => {
	afterEach(() => {
		localStorage.removeItem('map-legend-open');
		localStorage.removeItem('map-hostile-layers');
	});

	async function legend(withSave: boolean) {
		localStorage.setItem('map-legend-open', 'true');
		const testing = new MapSaveTesting();
		if (withSave) {
			await testing.load({});
		}
		const fixture = TestBed.createComponent(MapLegendComponent);
		await fixture.whenStable();
		const text = () =>
			(fixture.nativeElement as HTMLElement).querySelector('app-map-save-legend')?.textContent ?? null;
		return { fixture, text };
	}

	it('explains the save facts only with a save', async () => {
		const { text } = await legend(true);
		expect(text()).toContain('From your save');
		expect(text()).toContain('Contested');
		expect(text()).toContain('Not discovered');
		expect(text()).toContain('Your ships');
		expect(text()).toContain('Your station');

		TestBed.resetTestingModule();
		expect((await legend(false)).text()).toBeNull();
	});

	it('leaves out undiscovered sectors while only discovered ones are drawn', async () => {
		const { fixture, text } = await legend(true);
		TestBed.inject(MapSaveLayer).discoveredOnly.set(true);
		await fixture.whenStable();
		expect(text()).toContain('Contested');
		expect(text()).not.toContain('Not discovered');
	});

	it("has the Xenon and Kha'ak layers off until turned on, and remembers them", async () => {
		const { fixture, text } = await legend(true);
		expect(text()).toContain('Xenon');
		const boxes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
			'app-map-save-legend input[type=checkbox]'
		);
		const xenon = [...boxes].find((x) => x.closest('label')?.textContent?.includes('Xenon'));
		expect(xenon?.checked).toBe(false);
		xenon!.click();
		await fixture.whenStable();
		expect(TestBed.inject(MapHostiles).layers()).toEqual({ xenon: true, khaak: false });
		expect(JSON.parse(localStorage.getItem('map-hostile-layers')!)).toEqual({ xenon: true, khaak: false });
	});
});
