import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { StationNamer } from '../../savegame/map/station-name';
import { SiteNamingTables } from './site-naming-tables';

describe('SiteNamingTables', () => {
	const tables = () => TestBed.inject(SiteNamingTables);

	it('resolves a construction plan basename', () => {
		expect(tables().text('{20102,1441}')).toBe('Xenon Wharf');
		expect(tables().text('{20201, 7404}')).toBe('Allographyne Scrap Processing Factory');
	});

	it('resolves a station name a map zone gives', () => {
		expect(tables().text('{20103,3701}')).toBe('Diplomatic Outpost');
	});

	it('resolves a station name a mission script gives', () => {
		expect(tables().text('{30225,1012}')).toBe('Solborn Militia Outpost');
	});

	it('leaves plot texts unresolved, so the namer falls back to the built name', () => {
		expect(tables().text('{30225,1015}')).toBeUndefined();
		const station: SaveStation = {
			code: 'ABC-123',
			macro: 'station_gen_factory_01_macro',
			owner: 'argon',
			sector: 'cluster_01_sector001',
			x: 0,
			z: 0,
			known: true,
			name: '{30225,1015}',
			basename: '{20102,1441}',
			modules: [],
		};
		expect(new StationNamer(tables()).name(station)).toBe('ARG Xenon Wharf');
	});

	it('looks up station macros and modules by their lowercase id', () => {
		expect(tables().macroName('Landmarks_Gen_PirateStation_01_macro')).toBe('Tidebreak');
		expect(tables().module('buildmodule_gen_ships_l')?.type).toBe('Build Module');
	});
});
