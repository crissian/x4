import { Injector, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { SaveStationNames } from './save-station-names';

describe('SaveStationNames', () => {
	const station = (owner: string): SaveStation => ({
		code: 'ABC-123',
		macro: 'station_gen_factory_01',
		owner,
		sector: 'cluster_14_sector001',
		x: 0,
		z: 0,
		known: true,
		modules: ['prod_gen_energycells'],
	});
	const MAP: SaveMap = { sectors: [], stations: [], playerShips: {} };

	function setup(map: SaveMap | null) {
		const active = signal(map && { id: 'x', info: { saveName: 'Save', gameTime: 0 }, data: { map } });
		TestBed.configureTestingModule({
			providers: [{ provide: SavegameStore, useValue: { active, status: () => 'ok' } }],
		});
		return TestBed.inject(SaveStationNames);
	}

	it('labels save stations with their owner, by code until the namer loads', async () => {
		const names = setup(MAP);
		expect(names.label(station('argon'))).toBe('ABC-123 (ARG)');
		TestBed.tick();
		await LazyValue.settled();
		expect(names.namer()).toBeDefined();
		const label = names.label(station('argon'));
		expect(label).not.toContain('ABC-123');
		expect(label).toMatch(/ARG/);
		expect(label.match(/ARG/g)).toHaveLength(1);
		expect(names.label(station('player'))).not.toContain('(');
	});

	it('loads the namer once', async () => {
		const names = setup(MAP);
		expect(await names.loadNamer()).toBe(await names.loadNamer());
	});

	it('gives owner short names, never for the player', () => {
		const names = setup(null);
		expect(names.ownerShort('argon')).toBe('ARG');
		expect(names.ownerShort('player')).toBeUndefined();
		expect(names.namer()).toBeUndefined();
	});

	it('names game start stations by owner and type', () => {
		const names = setup(null);
		expect(names.gameStart('argon', 'shipyard')).toBe('ARG Shipyard');
		expect(names.gameStart(undefined, 'wharf')).toBe('Wharf');
		expect(names.gameStart('argon', 'unknown')).toBe('ARG Other station');
	});

	it('loads the game start stations when asked for', async () => {
		const names = setup(null);
		const wanted = signal(false);
		const stations = runInInjectionContext(TestBed.inject(Injector), () => names.godStations(wanted));
		TestBed.tick();
		await LazyValue.settled();
		expect(stations()).toBeUndefined();
		wanted.set(true);
		TestBed.tick();
		await LazyValue.settled();
		expect(stations()?.length).toBeGreaterThan(0);
	});
});
