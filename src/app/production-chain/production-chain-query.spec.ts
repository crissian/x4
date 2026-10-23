import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ProductionChainQuery } from './production-chain-query';

describe('ProductionChainQuery', () => {
	const query = new ProductionChainQuery((id) => ['default', 'teladi'].includes(id));

	it('reads the defaults from an empty URL and writes them as nothing', () => {
		const settings = query.read(convertToParamMap({}));
		expect(settings).toEqual(ProductionChainQuery.DEFAULTS);
		expect(Object.values(query.write(settings)).every((x) => x === null)).toBe(true);
	});

	it('round-trips the settings', () => {
		const params = { pm: 'teladi', n: '3', o: 'graphene:default,hullparts:teladi' };
		const settings = query.read(convertToParamMap(params));
		expect(settings).toEqual({
			direction: 'inputs',
			method: 'teladi',
			modules: 3,
			overrides: { graphene: 'default', hullparts: 'teladi' },
			depth: 1,
		});
		expect(query.write(settings)).toEqual({ dir: null, lv: null, ...params, n: 3 });
	});

	it('keeps the used-by levels and drops the module count when going up', () => {
		const settings = query.read(convertToParamMap({ dir: 'usedby', lv: '0', n: '4' }));
		expect(settings).toMatchObject({ direction: 'usedBy', depth: 0, modules: 4 });
		expect(query.write(settings)).toMatchObject({ dir: 'usedby', lv: 0, n: null });
	});

	it('falls back on unknown or broken values', () => {
		const settings = query.read(convertToParamMap({ dir: 'x', pm: 'nope', n: '0', o: 'a:b,broken,:c,d:' }));
		expect(settings).toMatchObject({ direction: 'inputs', method: 'default', modules: 1, overrides: { a: 'b' } });
		expect(ProductionChainQuery.clean({ ...settings, modules: 2.5 }).modules).toBe(1);
	});
});
