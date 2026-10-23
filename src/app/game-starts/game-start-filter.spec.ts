import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { GameStartDetails } from './game-start-details';
import { GameStartFilter } from './game-start-filter';
import type { GameStart } from './game-start-model';
import { GameStartQuery } from './game-start-query';
import { GameStartSummaries } from './game-start-summary';
import { GameStartTypes } from './game-start-types';

const start = (id: string, values: Partial<GameStart> = {}): GameStart => ({
	id,
	name: id,
	version: 0,
	type: 'sandbox',
	info: [],
	money: 0,
	...values,
});

const ALL_OWNED = [true, true, true, true, true, true, true, true];

describe('GameStartFilter', () => {
	const starts = [
		start('sandbox'),
		start('guided', { type: 'guided', recommendation: 10 }),
		start('guided-dlc', { type: 'guided', version: 4, recommendation: 21 }),
		start('assisted', { type: 'assisted', character: 'Fomo Fi' }),
		start('tutorial', { type: 'tutorial' }),
		start('scenario', { type: 'scenario', version: 5 }),
	];
	const ids = (type: Parameters<typeof GameStartTypes.matches>[0], search = '', owned = ALL_OWNED) =>
		GameStartFilter.apply(starts, { type, search, owned }).map((x) => x.id);

	it('shows the new game starts by DLC and type, story first', () => {
		expect(ids('')).toEqual(['guided', 'assisted', 'sandbox', 'guided-dlc']);
	});

	it('filters story starts, single types and everything', () => {
		expect(ids('story')).toEqual(['guided', 'assisted', 'guided-dlc']);
		expect(ids('tutorial')).toEqual(['tutorial']);
		expect(ids('all')).toHaveLength(6);
	});

	it('hides the starts of DLCs not owned, never the base game', () => {
		const owned = ALL_OWNED.map((_, i) => i !== 4 && i !== 0);
		expect(ids('', '', owned)).toEqual(['guided', 'assisted', 'sandbox']);
	});

	it('searches the name and character', () => {
		expect(ids('all', 'fomo')).toEqual(['assisted']);
	});
});

describe('GameStartQuery', () => {
	it('reads the defaults from no params and writes none for them', () => {
		const model = GameStartQuery.read(convertToParamMap({}));
		expect(model).toEqual(GameStartQuery.DEFAULTS);
		expect(Object.values(GameStartQuery.write(model)).every((x) => x === null)).toBe(true);
	});

	it('reads and writes the type, search and view, ignoring unknown types', () => {
		const params = { type: 'story', q: 'herald', view: 'table' };
		expect(GameStartQuery.write(GameStartQuery.read(convertToParamMap(params)))).toEqual(params);
		expect(GameStartQuery.read(convertToParamMap({ type: 'nope' })).type).toBe('');
	});
});

describe('GameStartSummaries', () => {
	it('names the ship and sector, else the start menu lines', () => {
		const value = start('x', {
			ship: 'ship_a',
			sector: 'nowhere',
			ships: [{ ware: 'ship_b', count: 2 }, { ware: 'ship_c' }],
			info: [
				{ key: 'location', label: 'Location', text: 'Simulation' },
				{ key: 'property', label: 'Property', text: 'None' },
			],
		});
		const summary = GameStartSummaries.of(
			value,
			(id) => ({ id, name: 'Ship A' }),
			() => undefined
		);
		expect(summary).toMatchObject({
			ship: { id: 'ship_a' },
			shipText: undefined,
			sector: undefined,
			locationText: 'Simulation',
			property: 'None',
			extraShips: 3,
		});
	});
});

describe('GameStartDetails', () => {
	it('lists the reputations friendliest first', () => {
		const rows = GameStartDetails.reputations(
			[
				{ faction: 'a', relation: -0.032 },
				{ faction: 'b', relation: 0.01 },
			],
			(x) => Math.round(x * 1000)
		);
		expect(rows.map((x) => [x.faction, x.reputation])).toEqual([
			['b', 10],
			['a', -32],
		]);
	});

	it('splits the blueprints by page', () => {
		const result = GameStartDetails.blueprints(
			start('x', { blueprints: [{ ware: 'module_a', page: 'modules' }, { ware: 'paintmod_0001' }] })
		);
		expect(result.modules.map((x) => x.ware)).toEqual(['module_a']);
		expect(result.other.map((x) => x.ware)).toEqual(['paintmod_0001']);
	});
});
