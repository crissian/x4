import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../savegame/map/save-map-model';
import type { EmpireShipRow } from './empire-model';
import { EmpireStationLookups, EmpireStations } from './empire-stations';

describe('EmpireStations', () => {
	const lookups: EmpireStationLookups = {
		sectorName: (id) => id.toUpperCase(),
		stationName: (x) => x.name ?? x.code,
		products: (id) => (id === 'prod_ec' ? ['energycells'] : id === 'prod_mix' ? ['hullparts', 'energycells'] : []),
		wareName: (id) => ({ energycells: 'Energy Cells', hullparts: 'Hull Parts', water: 'Water' })[id] ?? id,
	};
	const station = (code: string, extra: Partial<SaveStation> = {}): SaveStation => ({
		code,
		macro: 'station_gen_factory_base_01',
		owner: 'player',
		sector: 's1',
		x: 0,
		z: 0,
		known: true,
		modules: [],
		...extra,
	});
	const ship = (depth: number, commanderId: string | undefined, subordinates: number) =>
		({ depth, commanderId, subordinates, size: 'Medium' }) as EmpireShipRow;

	it('joins the map stations of the player with their money, storage and commanded ships', () => {
		const rows = EmpireStations.build(
			[
				station('BBB-2', { name: 'Zeta Works', modules: ['prod_ec', 'prod_mix', 'dock'], moduleCounts: [4, 1, 1] }),
				station('AAA-1', { name: 'Alpha', state: 'construction' }),
				station('NPC-1', { owner: 'argon' }),
				station('WRK-1', { state: 'wreck' }),
			],
			[{ id: '[0x5]', code: 'BBB-2', sector: 's1', money: 5000, storage: { water: 10, energycells: 900 } }],
			[ship(0, '[0x5]', 2), ship(1, '[0x5]', 0), ship(0, undefined, 0)],
			lookups
		);
		expect(rows.map((x) => x.name)).toEqual(['Alpha', 'Zeta Works']);
		expect(rows[1]).toEqual({
			id: '[0x5]',
			code: 'BBB-2',
			name: 'Zeta Works',
			sector: 's1',
			sectorName: 'S1',
			state: undefined,
			modules: 6,
			products: ['Energy Cells', 'Hull Parts'],
			storage: [
				{ ware: 'energycells', name: 'Energy Cells', amount: 900 },
				{ ware: 'water', name: 'Water', amount: 10 },
			],
			money: 5000,
			ships: 3,
		});
		expect(rows[0]).toMatchObject({ id: 'AAA-1', state: 'construction', money: 0, storage: [], ships: 0 });
	});

	it('sums up money, ships by size and stations', () => {
		const ships = [{ size: 'Small' }, { size: 'Small' }, { size: 'Large' }] as EmpireShipRow[];
		const summary = EmpireStations.summary(100, ships, [{ money: 7 }, { money: 3 }] as never);
		expect(summary).toEqual({
			money: 100,
			ships: 3,
			bySize: [
				{ size: 'Extra Large', count: 0 },
				{ size: 'Large', count: 1 },
				{ size: 'Medium', count: 0 },
				{ size: 'Small', count: 2 },
			],
			stations: 2,
			stationMoney: 10,
		});
	});
});
