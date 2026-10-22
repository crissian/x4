import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyValue } from '../core/lazy-value';
import type { SaveMap, SaveStation } from '../savegame/map/save-map-model';
import type { SavegameSummary } from '../savegame/savegame-model';
import { SavegameStore } from '../savegame/savegame-store';
import { MAP_PROVIDERS } from './map-providers';
import { MapSaveLayer } from './save/map-save-layer';

/** Test helpers: the map providers over a fake active save. */
export class MapSaveTesting {
	static readonly A = 'cluster_01_sector001';
	static readonly B = 'cluster_14_sector001';

	readonly active = signal<SavegameSummary | null>(null);
	readonly activeId = signal<string | null>(null);

	static station(extra: Partial<SaveStation> = {}): SaveStation {
		return {
			code: 'ABC-123',
			macro: 'station_gen_factory_01',
			owner: 'argon',
			sector: MapSaveTesting.A,
			x: 0,
			z: 0,
			known: true,
			modules: [],
			...extra,
		};
	}

	constructor() {
		localStorage.removeItem('map-discovered-only');
		TestBed.configureTestingModule({
			providers: [
				...MAP_PROVIDERS,
				{
					provide: SavegameStore,
					useValue: { active: this.active, activeId: this.activeId, status: () => 'ok' },
				},
			],
		});
	}

	/**
	 * Activates a save with the given map data (undefined: a save without map data) and waits for the layer to
	 * load what it draws the save with.
	 */
	async load(map: Partial<SaveMap> | undefined) {
		const data = map ? { map: { sectors: [], stations: [], playerShips: {}, ...map } } : {};
		this.active.set({ id: 'x', data } as unknown as SavegameSummary);
		this.activeId.set('x');
		TestBed.inject(MapSaveLayer).stations();
		TestBed.tick();
		await LazyValue.settled();
	}
}
