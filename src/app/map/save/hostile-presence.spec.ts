import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { HostilePresence } from './hostile-presence';

describe('HostilePresence', () => {
	const station = (owner: string, macro: string, sector: string, extra: Partial<SaveStation> = {}): SaveStation => ({
		code: macro,
		macro,
		owner,
		sector,
		x: 0,
		z: 0,
		known: true,
		modules: [],
		...extra,
	});

	it('groups the stations and ships of each faction by sector', () => {
		const sectors = HostilePresence.build(
			[
				station('xenon', 'station_xen_defence_base_01', 's1'),
				station('xenon', 'station_xen_shipyard_base_01', 's1'),
				station('xenon', 'station_xen_defence_base_01', 's1'),
				station('xenon', 'station_xen_defence_base_01', 's1', { state: 'wreck' }),
				station('khaak', 'landmarks_kha_hive_01', 's2'),
				station('khaak', 'landmarks_kha_nest_01', 's3', { known: false }),
				station('argon', 'station_arg_shipyard', 's1'),
			],
			{ xenon: { s1: [3, 1, 0, 0], s4: [0, 0, 1, 1] } },
			(x) => `name of ${x.macro}`,
			(x) => x.known
		);
		expect(sectors).toEqual([
			{
				faction: 'xenon',
				sector: 's1',
				kinds: [
					{ name: 'name of station_xen_defence_base_01', count: 2 },
					{ name: 'name of station_xen_shipyard_base_01', count: 1 },
				],
				stations: 3,
				ships: [3, 1, 0, 0],
				shipTotal: 4,
			},
			{
				faction: 'khaak',
				sector: 's2',
				kinds: [{ name: 'name of landmarks_kha_hive_01', count: 1 }],
				stations: 1,
				ships: [0, 0, 0, 0],
				shipTotal: 0,
			},
			{ faction: 'xenon', sector: 's4', kinds: [], stations: 0, ships: [0, 0, 1, 1], shipTotal: 2 },
		]);
	});
});
