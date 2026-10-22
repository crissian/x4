import { describe, expect, it } from 'vitest';
import type { SaveMap, SaveStation } from './save-map-model';
import { SaveTradeIndex } from './save-trade-index';
import type { StationNamer } from './station-name';

describe('SaveTradeIndex', () => {
	const station = (code: string, extra: Partial<SaveStation>): SaveStation => ({
		code,
		macro: 'station_gen_factory_base_01',
		owner: 'argon',
		sector: 'cluster_14_sector001',
		x: 0,
		z: 0,
		known: true,
		modules: [],
		...extra,
	});
	const namer = { name: (x: SaveStation) => `Station ${x.code}` } as StationNamer;
	const names = { owner: (id: string) => id.toUpperCase(), sector: () => 'Argon Prime' };
	const map: SaveMap = {
		sectors: [],
		playerShips: {},
		stations: [
			station('A', {
				offers: [
					{ ware: 'energycells', sell: true, price: 18, amount: 10 },
					{ ware: 'water', sell: false, price: 40, amount: 5 },
				],
			}),
			station('B', {
				offers: [
					{ ware: 'energycells', sell: true, price: 14, amount: 20 },
					{ ware: 'water', sell: false, price: 60, amount: 7, playerOnly: true },
				],
			}),
			station('HIDDEN', { known: false, offers: [{ ware: 'energycells', sell: true, price: 1, amount: 1 }] }),
		],
	};

	it('lists the known sellers cheapest first and the buyers highest price first', () => {
		const index = new SaveTradeIndex(map, namer, names);
		expect(index.forWare('energycells').sellers.map((x) => [x.id, x.price])).toEqual([
			['B', 14],
			['A', 18],
		]);
		expect(index.forWare('energycells').buyers).toEqual([]);
		expect(index.forWare('water').buyers[0]).toEqual({
			id: 'B',
			station: 'Station B',
			owner: 'ARGON',
			sector: 'cluster_14_sector001',
			sectorName: 'Argon Prime',
			price: 60,
			amount: 7,
			playerOnly: true,
		});
	});

	it('gives empty lists for a ware no known station trades', () => {
		expect(new SaveTradeIndex(map, namer, names).forWare('ore')).toEqual({ sellers: [], buyers: [] });
	});
});
