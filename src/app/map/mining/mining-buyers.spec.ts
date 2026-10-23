import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../../savegame/map/save-map-model';
import type { Ware } from '../../shared/services/model/model';
import { TradeRouteTesting } from '../../trade/trade-route-testing';
import { TravelCache } from '../../trade/travel-cache';
import { MiningBuyers, MiningBuyersInput } from './mining-buyers';

const { sector, station, buy, sell } = TradeRouteTesting;
const ore = { id: 'ore', name: 'Ore', volume: 10, transport: 'Solid', price: { min: 40, avg: 50, max: 60 } } as Ware;
// a <-> b <-> c <-> d
const sectors = [sector('a', ['b']), sector('b', ['a', 'c']), sector('c', ['b', 'd']), sector('d', ['c'])];

function rank(stations: SaveStation[], extra: Partial<MiningBuyersInput> = {}) {
	const cache = new TravelCache(sectors, { speed: 3000, charge: 5 });
	return MiningBuyers.rank(
		{ stations, ware: ore, sectors: new Map([['a', 1000]]), capacity: 10_000, fillMinutes: 10, ...extra },
		cache
	);
}

describe('MiningBuyers', () => {
	it('skips construction, wrecks, unknown, hostile, zero amount, sell and player only offers', () => {
		const pairs = rank(
			[
				station('ok', 'a', [buy('ore', 50, 5000)]),
				station('site', 'a', [buy('ore', 50, 5000)], { state: 'construction' }),
				station('wreck', 'a', [buy('ore', 50, 5000)], { state: 'wreck' }),
				station('unknown', 'a', [buy('ore', 50, 5000)], { known: false }),
				station('xenon', 'a', [buy('ore', 50, 5000)], { owner: 'xenon' }),
				station('empty', 'a', [buy('ore', 50, 0)]),
				station('seller', 'a', [sell('ore', 50, 5000)]),
				station('shady', 'a', [buy('ore', 50, 5000, true)]),
				station('other', 'a', [buy('silicon', 50, 5000)]),
			],
			{ relations: { xenon: -1 } }
		);
		expect(pairs.map((x) => x.station.code)).toEqual(['ok']);
	});

	it('uses the higher of two buy offers', () => {
		const [pair] = rank([station('s', 'a', [buy('ore', 40, 5000), buy('ore', 55, 3000)])]);
		expect(pair.price).toBe(55);
		expect(pair.wanted).toBe(3000);
	});

	it('caps the units at the offer and the hold, marking thin offers', () => {
		const [full, thin] = rank([
			station('full', 'a', [buy('ore', 60, 5000)]),
			station('thin', 'a', [buy('ore', 60, 300)]),
		]);
		expect(full.trip.units).toBe(1000);
		expect(full.thin).toBe(false);
		expect(thin.trip.units).toBe(300);
		expect(thin.thin).toBe(true);
	});

	it('travels 0 seconds to a buyer in the mining sector', () => {
		const [pair] = rank([station('s', 'a', [buy('ore', 50, 5000)])]);
		expect(pair.jumps).toBe(0);
		// 10 min + 60 s docking
		expect(pair.trip.tripTime).toBe(660);
	});

	it('keeps only buyers within 2 jumps of the home sector', () => {
		const stations = ['a', 'b', 'c', 'd'].map((id) => station(id, id, [buy('ore', 50, 5000)]));
		expect(new Set(rank(stations, { near: 'd' }).map((x) => x.station.code))).toEqual(new Set(['b', 'c', 'd']));
		expect(rank(stations).length).toBe(4);
	});

	it('sorts by credits per hour and keeps the best buyer per sector', () => {
		const pairs = rank(
			[
				station('near', 'a', [buy('ore', 50, 5000)]),
				station('rich', 'c', [buy('ore', 90, 5000)]),
				station('far', 'd', [buy('ore', 45, 5000)]),
			],
			{
				sectors: new Map([
					['a', 1000],
					['d', 500],
				]),
			}
		);
		expect(pairs.map((x) => x.trip.perHour)).toEqual([...pairs.map((x) => x.trip.perHour)].sort((a, b) => b - a));
		const best = MiningBuyers.bestPerSector(pairs);
		expect(best.map((x) => x.sector).sort()).toEqual(['a', 'd']);
		expect(best.find((x) => x.sector === 'a')?.station.code).toBe('rich');
		expect(MiningBuyers.buyersFor(pairs, 'a', 2).map((x) => x.station.code)).toEqual(['rich', 'near']);
	});

	it('finds nothing without a hold for the ware', () => {
		expect(rank([station('s', 'a', [buy('ore', 50, 5000)])], { capacity: 0 })).toEqual([]);
	});
});
