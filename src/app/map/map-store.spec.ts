import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LazyValue } from '../core/lazy-value';
import type { SavegameSummary } from '../savegame/savegame-model';
import { SavegameStore } from '../savegame/savegame-store';
import { GodStations } from '../shared/services/data/god-stations-data';
import { FactionService } from '../shared/services/faction.service';
import { MAP_PROVIDERS } from './map-providers';
import { MapSaveTesting } from './map-save-testing';
import { MapStations } from './map-stations';
import { MapStore } from './map-store';
import { MapSaveLayer } from './save/map-save-layer';

describe('MapStore', () => {
	function setup() {
		TestBed.configureTestingModule({
			providers: [
				...MAP_PROVIDERS,
				{ provide: SavegameStore, useValue: { active: signal(null), activeId: signal(null) } },
			],
		});
		return TestBed.inject(MapStore);
	}

	describe('with a save', () => {
		const { A, B } = MapSaveTesting;

		async function load(map: Parameters<MapSaveTesting['load']>[0]) {
			const testing = new MapSaveTesting();
			await testing.load(map);
			return TestBed.inject(MapStore);
		}

		it('limits sectors to the save', async () => {
			const store = await load({ sectors: [{ id: A, owner: 'argon', contested: false, known: true }] });
			expect(store.visibleShapes().map((x) => x.sector.id)).toEqual([A]);
			expect(store.visibleLinks()).toEqual([]);
			expect(store.saveActive()).toBe(true);
			// the version choice does not apply
			store.versions.set(store.versions().map(() => false));
			expect(store.visibleShapes().length).toBe(1);
		});

		it('uses save owners for fills and legend', async () => {
			const store = await load({
				sectors: [
					{ id: A, owner: 'xenon', contested: false, known: true },
					{ id: B, owner: 'player', contested: false, known: true },
				],
			});
			const xenon = TestBed.inject(FactionService).getEntity('xenon')!;
			expect(store.fills().get(A)?.fill).toBe(xenon.color);
			expect(store.ownerLegend().map((x) => [x.id, x.count])).toEqual(
				expect.arrayContaining([
					['xenon', 1],
					['player', 1],
				])
			);
			expect(store.ownerLegend().reduce((a, x) => a + x.count, 0)).toBe(2);
		});

		it('labels ownerless sectors Unclaimed like the map without a save', async () => {
			const store = await load({
				sectors: [
					{ id: A, owner: 'ownerless', contested: false, known: true },
					{ id: B, owner: '', contested: false, known: true },
				],
			});
			const legend = store.ownerLegend();
			expect(legend.length).toBe(1);
			expect(legend[0]).toMatchObject({ id: '', count: 2, name: 'Unclaimed' });
		});

		it('discovered only hides unknown sectors, links and stations', async () => {
			const testing = new MapSaveTesting();
			const store = TestBed.inject(MapStore);
			const link = store.layout.links[0];
			const [from, to] = [link.from.sector.id, link.to.sector.id];
			const sectors = (known: boolean) => [
				{ id: from, owner: 'argon', contested: false, known: true },
				{ id: to, owner: 'argon', contested: false, known },
			];
			await testing.load({ sectors: sectors(true) });
			TestBed.inject(MapSaveLayer).discoveredOnly.set(true);
			expect(link).toBeDefined();
			expect(store.visibleShapes().length).toBe(2);
			expect(store.visibleLinks()).toContain(link);

			await testing.load({ sectors: sectors(false) });
			expect(store.visibleShapes().map((x) => x.sector.id)).toEqual([from]);
			expect(store.visibleLinks()).not.toContain(link);

			TestBed.inject(MapSaveLayer).discoveredOnly.set(false);
			expect(store.visibleShapes().length).toBe(2);
			expect(store.visibleLinks()).toContain(link);
		});

		it('hides abandoned ships outside the save and in unknown sectors', async () => {
			const known = 'cluster_01_sector001';
			const unknown = 'cluster_27_sector001';
			const outside = 'cluster_25_sector002';
			const store = await load({
				sectors: [
					{ id: known, owner: 'argon', contested: false, known: true },
					{ id: unknown, owner: 'argon', contested: false, known: false },
				],
			});
			const sectorsOf = () => new Set(store.abandoned().map((x) => x.item.sector));
			expect(sectorsOf()).toEqual(new Set([known, unknown]));
			expect(sectorsOf().has(outside)).toBe(false);

			TestBed.inject(MapSaveLayer).discoveredOnly.set(true);
			expect(sectorsOf()).toEqual(new Set([known]));
		});
	});

	it('without a save equals the game-start map', () => {
		const store = setup();
		const stations = TestBed.inject(MapStations);
		expect(store.saveActive()).toBe(false);
		expect(store.visibleShapes().length).toBe(store.layout.shapes.length);
		expect(store.visibleLinks().length).toBe(store.layout.links.length);
		expect(store.hidesUnknown()).toBe(false);
		const first = store.layout.shapes[0].sector;
		expect(TestBed.inject(MapSaveLayer).ownerOf(first)).toBe(first.owner);
		expect(stations.stations().length).toBe(GodStations.length);
	});

	it('plans a route between sectors picked by name', () => {
		const store = setup();
		store.routeModel.update((x) => ({ ...x, from: 'grand exchange i', to: 'Argon Prime' }));
		expect(store.route()?.jumps).toBeGreaterThan(0);

		store.swapRoute();
		expect(store.routeModel().from).toBe('Argon Prime');
	});

	it('takes the travel speed from the picked ship', () => {
		const store = setup();
		store.routeModel.update((x) => ({ ...x, ship: 'ship_arg_l_destroyer_01_a' }));
		TestBed.tick();
		expect(store.routeModel().speed).not.toBe(3000);
		expect(store.routeForm.speed().disabled()).toBe(true);
	});

	it('offers the ships of the save and takes the speed of their engines and their sector', async () => {
		const testing = new MapSaveTesting();
		const ship = { id: '[0x1]', code: 'ABC-001', macro: 'ship_arg_s_scout_01_a', sector: MapSaveTesting.B };
		const engine = { engine: 'engine_arg_s_travel_01_mk2', engines: 2 };
		const map = { sectors: [], stations: [], playerShips: {} };
		testing.active.set({ id: 'x', data: { map, ships: [{ ...ship, ...engine }] } } as unknown as SavegameSummary);
		testing.activeId.set('x');
		const store = TestBed.inject(MapStore);
		TestBed.tick();
		await LazyValue.settled();
		const own = store.routeOwnShips();
		expect(own.map((x) => x.key)).toEqual(['own-0x1']);
		store.routeModel.update((x) => ({ ...x, ship: 'own-0x1' }));
		TestBed.tick();
		expect(store.routeModel().speed).toBe(Math.round(own[0].travel!.speed));
		expect(store.routeModel().from).toBe('Argon Prime');
		// two engines, so faster than the model with one
		const model = store.routeShips.find((x) => x.id === ship.macro)!;
		expect(own[0].travel!.speed).not.toBe(model.travel!.speed);
	});

	it('offers the own miners of the resource and times them with their engines', async () => {
		const testing = new MapSaveTesting();
		const solid = { id: '[0x1]', code: 'ABC-001', macro: 'ship_arg_m_miner_solid_01_a', sector: MapSaveTesting.B };
		const gas = { id: '[0x2]', code: 'ABC-002', macro: 'ship_arg_m_miner_liquid_01_a', sector: MapSaveTesting.B };
		const engine = { engine: 'engine_arg_m_travel_01_mk3', engines: 1 };
		const map = { sectors: [], stations: [], playerShips: {} };
		const ships = [
			{ ...solid, ...engine },
			{ ...gas, ...engine },
		];
		testing.active.set({ id: 'x', data: { map, ships } } as unknown as SavegameSummary);
		testing.activeId.set('x');
		const store = TestBed.inject(MapStore);
		TestBed.tick();
		await LazyValue.settled();
		expect(store.ownMiners().map((x) => x.key)).toEqual(['own-0x1']);
		const model = store.miningModel().miner;
		store.miningModel.update((x) => ({ ...x, miner: 'own-0x1' }));
		const own = store.ownMiners()[0];
		expect(store.miner()?.id).toBe(solid.macro);
		expect(store.minerSpeed()).toBe(own.travel!.speed);
		// still a solid resource: the own miner stays; a gas: the largest gas miner model
		store.settings.update((x) => ({ ...x, resource: 'silicon' }));
		expect(store.miningModel().miner).toBe('own-0x1');
		store.settings.update((x) => ({ ...x, resource: 'hydrogen' }));
		expect(store.ownMiners().map((x) => x.key)).toEqual(['own-0x2']);
		expect(store.miningModel().miner).toBe(store.miners()[0].id);
		expect(store.miningModel().miner).not.toBe(model);
	});

	it('keeps the content pack choice as a list of shown versions', () => {
		const store = setup();
		store.versions.update((x) => x.map((_, i) => i !== 1));
		TestBed.tick();
		expect(JSON.parse(localStorage.getItem('map-versions') ?? '[]')).not.toContain(1);
		expect(store.visibleShapes().length).toBeLessThan(store.layout.shapes.length);
		localStorage.removeItem('map-versions');
	});
});
