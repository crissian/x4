import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ActiveSave } from './active-save';
import type { SaveMap } from './map/save-map-model';
import { SavegameStatus, SavegameStore } from './savegame-store';

describe('ActiveSave', () => {
	const MAP: SaveMap = {
		sectors: ['cluster_14_sector001', 'cluster_07_sector001'].map((id) => ({
			id,
			owner: 'argon',
			contested: false,
			known: true,
		})),
		stations: [],
		playerShips: {},
	};

	function setup(data: Record<string, unknown> | null, status: SavegameStatus = 'ok') {
		const active = signal(data && { id: 'x', info: { saveName: 'Save', gameTime: 7380 }, data });
		TestBed.configureTestingModule({
			providers: [{ provide: SavegameStore, useValue: { active, status: () => status } }],
		});
		return { save: TestBed.inject(ActiveSave), active };
	}

	it('has nothing without an active save', () => {
		const { save } = setup(null);
		expect(save.status()).toBe('none');
		expect(save.map()).toBeUndefined();
		expect(save.sectors()).toEqual([]);
		expect(save.outdated()).toBe(false);
	});

	it('reads the extracted data of the active save', () => {
		const { save } = setup({ map: MAP, relations: { argon: 10 }, licences: { argon: ['x'] }, blueprints: ['a'] });
		expect(save.status()).toBe('ready');
		expect(save.map()).toBe(MAP);
		expect(save.relations()).toEqual({ argon: 10 });
		expect(save.licences()).toEqual({ argon: ['x'] });
		expect(save.blueprints()).toEqual(['a']);
		expect(save.representatives()).toBeUndefined();
		expect(save.sectors().map((x) => x.name)).toEqual(['Argon Prime', 'The Reach']);
		expect(save.gameTime()).toMatch(/2.*3/);
	});

	it('tells a save being read from one to load again', () => {
		expect(setup({}, 'updating').save.status()).toBe('loading');
		TestBed.resetTestingModule();
		const { save } = setup({}, 'reload-needed');
		expect(save.status()).toBe('reload-needed');
		expect(save.outdated()).toBe(true);
	});

	it('gives the status of other data', () => {
		const { save } = setup({ map: MAP }, 'reload-needed');
		expect(save.status()).toBe('ready');
		expect(save.statusOf(save.blueprints)()).toBe('reload-needed');
	});
});
