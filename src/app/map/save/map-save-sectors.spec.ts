import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MapSaveTesting } from '../map-save-testing';
import { MapSaveSectors } from './map-save-sectors';

const { A, B, station } = MapSaveTesting;
const C = 'cluster_02_sector001';

describe('MapSaveSectors', () => {
	it('is empty without a save', async () => {
		const testing = new MapSaveTesting();
		await testing.load(undefined);
		const sectors = TestBed.inject(MapSaveSectors);
		expect(sectors.unknown().size).toBe(0);
		expect(sectors.contested().size).toBe(0);
		expect(sectors.presence().size).toBe(0);
	});

	it('collects unknown and contested sectors', async () => {
		const testing = new MapSaveTesting();
		await testing.load({
			sectors: [
				{ id: A, owner: 'argon', contested: false, known: true },
				{ id: B, owner: 'paranid', contested: true, known: false },
				{ id: C, owner: 'argon', contested: true, known: true },
			],
		});
		const sectors = TestBed.inject(MapSaveSectors);
		expect([...sectors.unknown()]).toEqual([B]);
		expect([...sectors.contested()]).toEqual([B, C]);
	});

	it('counts player ships and stations per sector', async () => {
		const testing = new MapSaveTesting();
		await testing.load({
			stations: [
				station({ owner: 'player' }),
				station({ code: 'P2', owner: 'player' }),
				station({ code: 'P3', owner: 'player', sector: B }),
				station({ code: 'X', owner: 'argon', sector: C }),
			],
			playerShips: { [A]: [0, 1, 2, 0, 0], [C]: [0, 0, 1, 0, 0] },
		});
		const presence = TestBed.inject(MapSaveSectors).presence();
		expect(presence.get(A)).toEqual({ ships: { total: 3, bySize: [0, 1, 2, 0, 0] }, stations: 2 });
		expect(presence.get(B)).toEqual({ ships: undefined, stations: 1 });
		expect(presence.get(C)).toEqual({ ships: { total: 1, bySize: [0, 0, 1, 0, 0] }, stations: 0 });
		expect(presence.size).toBe(3);
	});
});
