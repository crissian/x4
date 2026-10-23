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

	it('tells the station kinds apart by macro', () => {
		expect(
			[
				'landmarks_kha_hive_01',
				'landmarks_kha_nest_01',
				'landmarks_kha_weaponplatform_01',
				'station_xen_shipyard_base_01',
				'station_xen_factory_base_01',
				'station_xen_defence_base_01',
				'asteroid_turret_m_01',
				'xenon_asteroid_01_base_01',
				'something_else',
			].map((x) => HostilePresence.kind(x))
		).toEqual([
			'hive',
			'nest',
			'weaponplatform',
			'shipyard',
			'factory',
			'defence',
			'turret',
			'asteroidbase',
			'other',
		]);
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
			(x) => x.known
		);
		expect(sectors).toEqual([
			{
				faction: 'xenon',
				sector: 's1',
				kinds: [
					{ kind: 'defence', count: 2 },
					{ kind: 'shipyard', count: 1 },
				],
				stations: 3,
				ships: [3, 1, 0, 0],
				shipTotal: 4,
			},
			{
				faction: 'khaak',
				sector: 's2',
				kinds: [{ kind: 'hive', count: 1 }],
				stations: 1,
				ships: [0, 0, 0, 0],
				shipTotal: 0,
			},
			{ faction: 'xenon', sector: 's4', kinds: [], stations: 0, ships: [0, 0, 1, 1], shipTotal: 2 },
		]);
	});
});
