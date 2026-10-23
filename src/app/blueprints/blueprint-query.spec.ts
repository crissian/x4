import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { BlueprintQuery } from './blueprint-query';

describe('BlueprintQuery', () => {
	const read = (params: Record<string, string>) => BlueprintQuery.read(convertToParamMap(params));

	it('reads the defaults from no params, and writes none for them', () => {
		const state = read({});
		expect(state).toEqual({ model: BlueprintQuery.DEFAULTS, tab: 'progress', section: 'buy' });
		expect(Object.values(BlueprintQuery.write(state)).every((x) => x === null)).toBe(true);
	});

	it('reads and writes the shopping list section and filters', () => {
		const params = { tab: 'shopping', list: 'reputation', category: 'ship', faction: 'argon', afford: '1' };
		const state = read(params);
		expect(state.section).toBe('reputation');
		expect(state.model).toMatchObject({ category: 'ship', faction: 'argon', affordable: true });
		expect(BlueprintQuery.write(state)).toEqual({ ...params, q: null, complete: null });
	});

	it('ignores unknown sections and categories', () => {
		const state = read({ list: 'nope', category: 'nope' });
		expect(state.section).toBe('buy');
		expect(state.model.category).toBe('');
	});
});
