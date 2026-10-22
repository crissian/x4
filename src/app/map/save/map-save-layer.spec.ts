import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyValue } from '../../core/lazy-value';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import type { NamingTables } from '../../savegame/map/station-name';
import type { SavegameSummary } from '../../savegame/savegame-model';
import { SavegameStore, type SavegameStatus } from '../../savegame/savegame-store';
import type { SectorShape } from '../galaxy-layout';
import { MAP_SHAPES, MapSaveLayer } from './map-save-layer';
import { SiteNamingTables } from './site-naming-tables';

const SECTOR = 'cluster_01_sector001';

function station(extra: Partial<SaveStation> = {}): SaveStation {
	return {
		code: 'ABC-123',
		macro: 'station_gen_factory_01',
		owner: 'argon',
		sector: SECTOR,
		x: 0,
		z: 0,
		known: true,
		modules: [],
		...extra,
	};
}

describe('MapSaveLayer', () => {
	const active = signal<SavegameSummary | null>(null);
	const activeId = signal<string | null>(null);
	let status: SavegameStatus = 'ok';
	const shape = { x: 100, y: 50, r: 10 } as SectorShape;

	function save(map: Partial<SaveMap> | undefined): SavegameSummary {
		const data = map ? { map: { sectors: [], stations: [], playerShips: {}, ...map } } : {};
		return { id: 'x', data } as unknown as SavegameSummary;
	}

	/** The layer with the save active, once the lazily loaded naming data is in. */
	async function setup(map: Partial<SaveMap> | undefined) {
		active.set(save(map));
		activeId.set('x');
		const layer = TestBed.inject(MapSaveLayer);
		layer.stations();
		TestBed.tick();
		await LazyValue.settled();
		return layer;
	}

	beforeEach(() => {
		active.set(null);
		activeId.set(null);
		status = 'ok';
		localStorage.removeItem('map-discovered-only');
		const tables: Partial<NamingTables> = {
			factionShort: () => 'ARG',
			macroName: () => 'Base',
			text: () => 'Factory',
			sectorName: () => 'Sector',
			module: () => undefined,
		};
		TestBed.configureTestingModule({
			providers: [
				MapSaveLayer,
				{ provide: SavegameStore, useValue: { active, activeId, status: () => status } },
				{ provide: MAP_SHAPES, useValue: new Map([[SECTOR, shape]]) },
				{ provide: SiteNamingTables, useValue: tables },
			],
		});
	});

	it('is inactive while the save has no map data', async () => {
		const layer = await setup(undefined);
		expect(layer.active()).toBe(false);
		expect(layer.pending()).toBe(true);
		expect(layer.sectorIds()).toBeNull();
		expect(layer.stations()).toEqual([]);

		activeId.set(null);
		expect(layer.pending()).toBe(false);
	});

	it('is pending while the active save is read from storage', () => {
		activeId.set('x');
		const layer = TestBed.inject(MapSaveLayer);
		expect(layer.pending()).toBe(true);
		expect(layer.reloadNeeded()).toBe(false);
	});

	it('is pending until the naming data is loaded', async () => {
		active.set(save({}));
		activeId.set('x');
		const layer = TestBed.inject(MapSaveLayer);
		expect(layer.pending()).toBe(true);
		expect(layer.active()).toBe(false);
		TestBed.tick();
		await LazyValue.settled();
		expect(layer.pending()).toBe(false);
		expect(layer.active()).toBe(true);
	});

	it('asks for a reload instead of loading when the save cannot be updated', async () => {
		status = 'reload-needed';
		const layer = await setup(undefined);
		expect(layer.reloadNeeded()).toBe(true);
		expect(layer.pending()).toBe(false);
	});

	it('resolves zone and tempzone positions', async () => {
		const layer = await setup({
			stations: [
				station({ zone: 'zone001_cluster_01_sector001', x: 33.2, z: 3.2 }),
				station({ zone: 'tzonecluster_01_sector001shcon5_gatezone', x: 10, z: 0 }),
				station({ x: 100, z: -50 }),
			],
		});
		const [zone, tempzone, plain] = layer.stations();
		const scale = (shape.r * 0.7) / 500;
		expect(zone.x).toBeCloseTo(shape.x + (-166.8 + 33.2) * scale);
		expect(zone.y).toBeCloseTo(shape.y - (46.8 + 3.2) * scale);
		expect(tempzone.x).toBeCloseTo(shape.x + (39.9 + 10) * scale);
		expect(tempzone.y).toBeCloseTo(shape.y - 200 * scale);
		expect(plain.x).toBeCloseTo(shape.x + 100 * scale);
		expect(plain.y).toBeCloseTo(shape.y + 50 * scale);
	});

	it('skips stations in sectors or zones the site does not know', async () => {
		const layer = await setup({
			stations: [
				station(),
				station({ sector: 'unknown_sector' }),
				station({ zone: 'zone999_unknown', x: 1, z: 1 }),
			],
		});
		expect(layer.stations().length).toBe(1);
	});

	it('names and types stations through the tables', async () => {
		const layer = await setup({
			stations: [station(), station({ owner: 'player', macro: 'station_gen_tradestation_01', known: false })],
		});
		const [npc, player] = layer.stations();
		expect(npc).toMatchObject({ name: 'ARG Base', player: false, known: true });
		expect(player).toMatchObject({ type: 'tradestation', player: true, known: false });
	});

	it('marks far stations with their distance and draws them on the range edge in their direction', async () => {
		const layer = await setup({ stations: [station({ x: 300, z: 400 }), station({ x: 900, z: -1200 })] });
		const [near, far] = layer.stations();
		expect(near.farKm).toBeUndefined();
		expect(far.farKm).toBeCloseTo(1500);
		const dx = far.x - shape.x;
		const dy = far.y - shape.y;
		expect(Math.hypot(dx, dy)).toBeCloseTo(shape.r * 0.7);
		expect(Math.atan2(dy, dx)).toBeCloseTo(Math.atan2(1200, 900));
	});

	it('counts player ships per sector', async () => {
		const layer = await setup({ playerShips: { [SECTOR]: [1, 2, 3, 0, 4] } });
		expect(layer.playerShips().get(SECTOR)).toEqual({ total: 10, bySize: [1, 2, 3, 0, 4] });
	});

	it('discovered only defaults off and persists', async () => {
		const layer = await setup({});
		expect(layer.discoveredOnly()).toBe(false);
		layer.discoveredOnly.set(true);
		TestBed.tick();
		expect(localStorage.getItem('map-discovered-only')).toBe('true');
	});
});
