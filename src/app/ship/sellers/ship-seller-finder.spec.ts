import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { Size } from '../../shared/services/data/size-data';
import type { Faction, Ship } from '../../shared/services/model/model';
import { ShipService } from '../../shared/services/ship.service';
import { ShipSellerFinder } from './ship-seller-finder';

const ARGON_PRIME = 'cluster_14_sector001';
const THE_REACH = 'cluster_07_sector001';

describe('ShipSellerFinder', () => {
	async function setup(ship: () => Ship, data?: Record<string, unknown>) {
		localStorage.removeItem('ship-sellers-from');
		const active = signal(data ? { id: 'x', data } : null);
		TestBed.configureTestingModule({
			providers: [ShipSellerFinder, { provide: SavegameStore, useValue: { active } }],
		});
		const finder = TestBed.inject(ShipSellerFinder);
		finder.connect(signal(ship()));
		TestBed.tick();
		await LazyValue.settled();
		return finder;
	}

	const behemoth = () => TestBed.inject(ShipService).getEntity('ship_arg_l_destroyer_01_a')!;
	const large = (...owners: string[]) =>
		({
			id: 'x',
			size: Size.large,
			owners: owners.map((id) => ({ id }) as Faction),
			license: 'militaryship',
		}) as Ship;

	it('lists the game start shipyards of the selling factions, with the requirement only', async () => {
		const finder = await setup(behemoth);
		expect(finder.fromSave()).toBe(false);
		const rows = finder.rows()!;
		expect(rows.map((x) => x.id)).toEqual(['shipyard_argon_01']);
		expect(rows[0]).toMatchObject({ name: 'ARG Shipyard', sectorId: ARGON_PRIME, known: true });
		expect(rows[0].faction?.name).toBe('Argon Federation');
		expect(rows[0].standing).toEqual({ status: 'unknown', needed: 20 });
		expect(rows[0].time).toBeUndefined();
	});

	it('sorts by travel time from the picked sector, ignoring case', async () => {
		const finder = await setup(() => large('paranid', 'argon'));
		expect(finder.rows()!.map((x) => x.owner)).toEqual(['argon', 'paranid']);
		finder.model.set({ from: ' the reach ' });
		expect(finder.from()?.id).toBe(THE_REACH);
		const rows = finder.rows()!;
		expect(rows[0]).toMatchObject({ id: 'shipyard_argon_01', jumps: 1 });
		expect(rows[0].time).toBeGreaterThan(0);
		expect(rows[1].jumps!).toBeGreaterThan(1);
		expect(rows[1].time!).toBeGreaterThan(rows[0].time!);
	});

	it('keeps the name order when the from text names no sector', async () => {
		const finder = await setup(() => large('paranid', 'argon'));
		finder.model.set({ from: 'Nowhere' });
		expect(finder.from()).toBeUndefined();
		expect(finder.rows()!.map((x) => [x.owner, x.time])).toEqual([
			['argon', undefined],
			['paranid', undefined],
		]);
	});

	it('uses the save stations, relations and licences', async () => {
		const map: SaveMap = {
			sectors: [
				{ id: ARGON_PRIME, owner: 'argon', contested: false, known: true },
				{ id: THE_REACH, owner: 'argon', contested: false, known: true },
			],
			playerShips: {},
			stations: [
				{
					code: 'YRD-1',
					macro: 'station',
					owner: 'argon',
					sector: ARGON_PRIME,
					x: 0,
					z: 0,
					known: true,
					name: 'Big Yard',
					modules: ['buildmodule_gen_ships_l'],
				},
				{
					code: 'YRD-2',
					macro: 'station',
					owner: 'teladi',
					sector: 'cluster_99_sector001',
					x: 0,
					z: 0,
					known: false,
					name: 'Far Yard',
					modules: ['buildmodule_gen_ships_l'],
				},
			],
		};
		const finder = await setup(() => large('argon', 'teladi'), {
			map,
			relations: { argon: 0.02, teladi: 0.02 },
			licences: { militaryship: ['argon'] },
		});
		expect(finder.fromSave()).toBe(true);
		expect(finder.sectors().map((x) => x.id)).toEqual([ARGON_PRIME, THE_REACH]);
		finder.model.set({ from: 'The Reach' });
		const rows = finder.rows()!;
		expect(rows.map((x) => [x.name, x.standing.status, x.jumps, x.known])).toEqual([
			['Big Yard', 'ok', 1, true],
			['Far Yard', 'ceremony', undefined, false],
		]);
	});
});
