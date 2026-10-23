import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ModQuery } from './mod-query';
import { ModTesting } from './mod-testing';

describe('ModQuery', () => {
	const stats = ['damage', 'cooling', 'capacity'];
	const read = (params: Record<string, string>) => ModQuery.read(convertToParamMap(params), stats);

	it('reads the defaults from no params, and writes none for them', () => {
		const model = read({});
		expect(model).toEqual(ModQuery.DEFAULTS);
		expect(Object.values(ModQuery.write(model)).every((x) => x === null)).toBe(true);
	});

	it('reads and writes the filters, dropping unknown values', () => {
		const params = { slot: 'shield', quality: '3', stat: 'capacity', q: 'bastion', scenario: '1' };
		expect(ModQuery.write(read(params))).toEqual(params);
		expect(read({ slot: 'hull', quality: '7', stat: 'speed' })).toEqual(ModQuery.DEFAULTS);
	});

	it('filters by slot, quality, a stat of the main or bonus effects, name and scenario', () => {
		const mods = [
			ModTesting.mod('a', { name: 'Piercer', quality: 1 }),
			ModTesting.mod('b', {
				quality: 2,
				effect: { stat: 'cooling', min: 1.1, max: 1.2 },
				bonus: { chance: 1, max: 1, effects: [{ stat: 'damage', min: 0.7, max: 0.75 }] },
			}),
			ModTesting.mod('c', { slot: 'shield', effect: { stat: 'capacity', min: 1.1, max: 1.2 } }),
			ModTesting.mod('d', { notForPlayer: true }),
		];
		const ids = (params: Record<string, string>) => ModQuery.apply(mods, read(params)).map((x) => x.id);

		expect(ids({})).toEqual(['a', 'b', 'c']);
		expect(ids({ scenario: '1' })).toEqual(['a', 'b', 'c', 'd']);
		expect(ids({ slot: 'weapon' })).toEqual(['a', 'b']);
		expect(ids({ quality: '2' })).toEqual(['b']);
		expect(ids({ stat: 'damage' })).toEqual(['a', 'b']);
		expect(ids({ q: 'pier' })).toEqual(['a']);
	});
});
