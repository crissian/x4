import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MapSaveTesting } from './map-save-testing';
import { MapStations } from './map-stations';
import { MapStore } from './map-store';
import { MapSaveLayer } from './save/map-save-layer';

const { A, B, station } = MapSaveTesting;

describe('MapStations', () => {
	function setup() {
		const testing = new MapSaveTesting();
		return { testing, stations: TestBed.inject(MapStations), store: TestBed.inject(MapStore) };
	}

	it('lists the game start stations without a save', () => {
		const { stations } = setup();
		expect(stations.stations().length).toBeGreaterThan(20);
		expect(stations.typeList().map((x) => x.id)).not.toContain('factory');
		expect(stations.stationMarkers().every((x) => x.known && !x.player)).toBe(true);
	});

	it('lists save stations with factory and other toggles', async () => {
		const { testing, stations } = setup();
		await testing.load({
			sectors: [{ id: A, owner: 'argon', contested: false, known: true }],
			stations: [
				station({ code: 'F', modules: ['prod_gen_energycells'] }),
				station({ code: 'O' }),
				station({ code: 'T', macro: 'station_gen_tradestation_01', x: 300, z: 401 }),
			],
		});
		expect(stations.typeList().map((x) => x.id)).toContain('other');
		expect(stations.stationsModel().types['factory']).toBe(true);
		expect(stations.stationsModel().types['other']).toBe(true);
		const all = stations.stationMarkers();
		expect(all.map((x) => [x.id, x.typeId])).toEqual([
			['F', 'factory'],
			['O', 'other'],
			['T', 'tradestation'],
		]);
		expect(all[2].farKm).toBeGreaterThan(500);

		stations.stationsModel.update((x) => ({ ...x, types: { ...x.types, factory: false, other: false } }));
		expect(stations.stationMarkers().map((x) => x.id)).toEqual(['T']);
	});

	it('sells only from non-player stations of the owner that build the size', async () => {
		const { testing, stations } = setup();
		const shipyard = ['buildmodule_gen_ships_l', 'buildmodule_gen_ships_xl'];
		await testing.load({
			sectors: [
				{ id: A, owner: 'argon', contested: false, known: true },
				{ id: B, owner: 'argon', contested: false, known: false },
			],
			stations: [
				station({ code: 'OK', modules: shipyard }),
				station({ code: 'MINE', owner: 'player', modules: shipyard }),
				station({ code: 'OTHER', owner: 'xenon', modules: shipyard }),
				station({ code: 'FAR', sector: B, modules: shipyard, known: false }),
				station({ code: 'FACTORY' }),
				// builds XL ships only, so no destroyer
				station({ code: 'XL', modules: ['buildmodule_gen_ships_xl'] }),
			],
		});
		const ship = 'ship_arg_l_destroyer_01_a';
		expect(stations.buyOptions().some((x) => x.id === `ship:${ship}`)).toBe(true);
		stations.stationsModel.update((x) => ({ ...x, buy: `ship:${ship}` }));
		const sellers = stations.sellers();
		expect(sellers.map((x) => x.id).sort()).toEqual(['FAR', 'OK']);
		expect(sellers.find((x) => x.id === 'FAR')!.known).toBe(false);
		expect(sellers.find((x) => x.id === 'OK')!.known).toBe(true);
	});

	it('hides undiscovered stations from the map only when discovered only is on', async () => {
		const { testing, stations, store } = setup();
		await testing.load({
			sectors: [
				{ id: A, owner: 'argon', contested: false, known: true },
				{ id: B, owner: 'argon', contested: false, known: false },
			],
			stations: [station({ code: 'SEEN' }), station({ code: 'UNSEEN', known: false })],
		});
		expect(stations.stationMarkers().length).toBe(2);
		TestBed.inject(MapSaveLayer).discoveredOnly.set(true);
		expect(stations.stationMarkers().map((x) => x.id)).toEqual(['SEEN']);
		expect(stations.stationList().length).toBe(2);
		expect(store.hidesUnknown()).toBe(true);
	});
});
