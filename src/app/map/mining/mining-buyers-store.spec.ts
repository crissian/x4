import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap } from '../../savegame/map/save-map-model';
import { MapSaveTesting } from '../map-save-testing';
import { MiningBuyersStore } from './mining-buyers-store';

const { A, B } = MapSaveTesting;

/** A refinery and a trading station buying ore in A, an unknown buyer; B has no gate to A in this save. */
const map: Partial<SaveMap> = {
	sectors: [
		{ id: A, owner: 'teladi', contested: false, known: true },
		{ id: B, owner: 'argon', contested: false, known: true },
	],
	stations: [
		MapSaveTesting.station({
			code: 'REF-001',
			owner: 'teladi',
			modules: ['prod_gen_refinedmetals'],
			moduleCounts: [2],
			offers: [{ ware: 'ore', sell: false, price: 70, amount: 84_000 }],
		}),
		MapSaveTesting.station({
			code: 'TRD-002',
			offers: [{ ware: 'ore', sell: false, price: 50, amount: 500 }],
		}),
		MapSaveTesting.station({
			code: 'UNK-003',
			known: false,
			offers: [{ ware: 'ore', sell: false, price: 99, amount: 84_000 }],
		}),
	],
};

async function setup(data: Partial<SaveMap> | undefined) {
	const testing = new MapSaveTesting();
	TestBed.configureTestingModule({ providers: [MiningBuyersStore] });
	const store = TestBed.inject(MiningBuyersStore);
	await testing.load(data);
	TestBed.tick();
	await LazyValue.settled();
	return store;
}

describe('MiningBuyersStore', () => {
	it('is inactive without a save with map data', async () => {
		const store = await setup(undefined);
		expect(store.active()).toBe(false);
		expect(store.rows()).toEqual([]);
	});

	it('ranks the known buyers per mining sector', async () => {
		const store = await setup(map);
		expect(store.active()).toBe(true);
		const row = store.rows().find((x) => x.pair.sector === A);
		expect(row?.key).toBe('REF-001');
		expect(row?.owner).toBe('TEL');
		expect(store.rows().some((x) => x.key === 'UNK-003')).toBe(false);
	});

	it('lists the buyers of the selected sector and the miners they need', async () => {
		const store = await setup(map);
		store.toggle(A);
		expect(store.buyers().map((x) => x.key)).toEqual(['REF-001', 'TRD-002']);
		expect(store.selectedBuyer()?.key).toBe('REF-001');
		const needed = store.needed();
		expect(needed?.capacityMiners).toBeGreaterThan(0);
		expect(needed?.wantedNow).toBe(84_000);

		store.buyerModel.set({ buyer: 'TRD-002' });
		// a trading station uses none of the ore
		expect(store.needed()?.capacityMiners).toBeUndefined();

		store.toggle(A);
		expect(store.buyers()).toEqual([]);
	});
});
