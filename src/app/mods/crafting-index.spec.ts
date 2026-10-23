import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { CraftingIndex } from './crafting-index';
import { CraftingQuery } from './crafting-query';
import { ModTesting } from './mod-testing';

describe('CraftingIndex', () => {
	const index = new CraftingIndex(
		[
			ModTesting.mod('mod_damage', {
				ingredients: [
					{ ware: 'modpart_catalyst', amount: 3 },
					{ ware: 'modpart_chamber', amount: 1 },
				],
			}),
			ModTesting.mod('mod_scenario', {
				notForPlayer: true,
				ingredients: [{ ware: 'modpart_catalyst', amount: 1 }],
			}),
		],
		[
			ModTesting.item('modpart_catalyst', { name: 'Catalyst' }),
			ModTesting.item('modpart_chamber'),
			ModTesting.item('inv_kit', { ingredients: [{ ware: 'modpart_catalyst', amount: 2 }] }),
		]
	);

	it('lists the recipes of mods and items, without the scenario mods', () => {
		expect(index.recipes.map((x) => [x.ware.id, x.kind])).toEqual([
			['mod_damage', 'mod'],
			['inv_kit', 'item'],
		]);
		expect(index.recipe('modpart_chamber')).toBeUndefined();
	});

	it('finds the recipes an ingredient goes into, with how many of it', () => {
		expect(index.usedIn('modpart_catalyst').map((x) => [x.recipe.ware.id, x.amount])).toEqual([
			['mod_damage', 3],
			['inv_kit', 2],
		]);
		expect(index.usedIn('inv_kit')).toEqual([]);
	});

	it('links mods and items to their pages and names them', () => {
		expect(index.link('mod_damage')).toEqual(['/mods', 'mod_damage']);
		expect(index.link('inv_kit')).toEqual(['/mods/items', 'inv_kit']);
		expect(index.name('modpart_catalyst')).toBe('Catalyst');
		expect(index.name('unknown')).toBe('unknown');
	});
});

describe('CraftingQuery', () => {
	const known = { recipe: (id: string) => id === 'mod_damage', item: (id: string) => id === 'inv_kit' };
	const read = (params: Record<string, string>) => CraftingQuery.read(convertToParamMap(params), known);

	it('reads the defaults from no params, and writes none for them', () => {
		expect(read({})).toEqual(CraftingQuery.DEFAULTS);
		expect(Object.values(CraftingQuery.write(read({}))).every((x) => x === null)).toBe(true);
	});

	it('keeps known picks and a valid count, the count only with a pick', () => {
		expect(CraftingQuery.write(read({ craft: 'mod_damage', times: '3', have: 'inv_kit' }))).toEqual({
			craft: 'mod_damage',
			times: 3,
			have: 'inv_kit',
		});
		expect(read({ craft: 'nope', times: '0', have: 'nope' })).toEqual(CraftingQuery.DEFAULTS);
		expect(CraftingQuery.write({ craft: '', times: 4, have: '' })['times']).toBeNull();
		expect(CraftingQuery.times({ craft: 'x', times: 2.5, have: '' })).toBe(1);
	});
});
