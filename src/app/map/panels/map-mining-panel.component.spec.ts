import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap } from '../../savegame/map/save-map-model';
import { MapSaveTesting } from '../map-save-testing';
import { MapMiningPanelComponent } from './map-mining-panel.component';

const { A } = MapSaveTesting;

const map: Partial<SaveMap> = {
	sectors: [{ id: A, owner: 'teladi', contested: false, known: true }],
	stations: [
		MapSaveTesting.station({
			code: 'REF-001',
			owner: 'teladi',
			modules: ['prod_gen_refinedmetals'],
			offers: [{ ware: 'ore', sell: false, price: 70, amount: 84_000 }],
		}),
	],
};

async function render(data: Partial<SaveMap> | undefined) {
	const testing = new MapSaveTesting();
	TestBed.configureTestingModule({ providers: [provideRouter([])] });
	const fixture = TestBed.createComponent(MapMiningPanelComponent);
	await testing.load(data);
	TestBed.tick();
	await LazyValue.settled();
	await fixture.whenStable();
	return fixture;
}

describe('MapMiningPanelComponent', () => {
	it('shows the static sell price without a save', async () => {
		const fixture = await render(undefined);
		const element: HTMLElement = fixture.nativeElement;
		expect(element.textContent).toContain('Sell price');
		expect(element.querySelector('app-mining-buyers-table')).toBeNull();
	});

	it('ranks real buyers with a save and shows the miners needed', async () => {
		const fixture = await render(map);
		const element: HTMLElement = fixture.nativeElement;
		expect(element.textContent).not.toContain('Sell price');
		const button = element.querySelector<HTMLButtonElement>('app-mining-buyers-table button[aria-expanded]');
		expect(button).not.toBeNull();
		button!.click();
		await fixture.whenStable();
		const card = element.querySelector('[data-miners-needed]');
		expect(card?.querySelector('[data-capacity]')?.textContent).toContain('Built capacity');
		expect(card?.querySelector('[data-market]')?.textContent).toContain('Market now');
	});
});
