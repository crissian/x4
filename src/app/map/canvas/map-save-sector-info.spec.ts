import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { SaveMap } from '../../savegame/map/save-map-model';
import { MapSaveTesting } from '../map-save-testing';
import { MapStore } from '../map-store';
import { MapTooltipComponent } from './map-popups';

const { A, B, station } = MapSaveTesting;

describe('MapSaveSectorInfo', () => {
	/** The sector tooltip over `sector` with the given save (undefined: no save). */
	async function tooltip(sector: string, map: Partial<SaveMap> | undefined) {
		const testing = new MapSaveTesting();
		if (map) {
			await testing.load(map);
		}
		const store = TestBed.inject(MapStore);
		const fixture = TestBed.createComponent(MapTooltipComponent);
		store.hovered.set({ shape: store.shapeById.get(sector)!, x: 0, y: 0 });
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		return [...element.querySelectorAll('app-map-save-sector-info li')].map((x) =>
			x.textContent?.replace(/\s+/g, ' ').trim()
		);
	}

	const save: Partial<SaveMap> = {
		sectors: [
			{ id: A, owner: 'argon', contested: false, known: true },
			{ id: B, owner: 'paranid', contested: true, known: false },
		],
		stations: [station({ owner: 'player', sector: B }), station({ code: 'P2', owner: 'player', sector: B })],
		playerShips: { [B]: [0, 3, 9, 0, 0] },
	};

	it('lists the save facts of a sector', async () => {
		expect(await tooltip(B, save)).toEqual([
			'Contested',
			'Not discovered',
			'Your ships: 12 (S 3, M 9)',
			'Your stations: 2',
		]);
	});

	it('shows nothing for a plain sector or without a save', async () => {
		expect(await tooltip(A, save)).toEqual([]);
		TestBed.resetTestingModule();
		expect(await tooltip(B, undefined)).toEqual([]);
	});

	it('shows stations without ships', async () => {
		expect(await tooltip(B, { ...save, playerShips: {} })).toEqual([
			'Contested',
			'Not discovered',
			'Your stations: 2',
		]);
	});
});
