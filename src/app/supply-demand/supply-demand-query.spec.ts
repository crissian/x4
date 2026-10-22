import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { SupplyDemandLookups, SupplyDemandQuery } from './supply-demand-query';

describe('SupplyDemandQuery', () => {
	const lookups: SupplyDemandLookups = {
		faction: (id) => id === 'argon',
		group: (id) => id === 'hightech',
		sectorName: (id) => (id === 's1' ? 'Argon Prime' : undefined),
		sectorId: (name) => (name === 'Argon Prime' ? 's1' : undefined),
	};
	const read = (params: Record<string, string>) => SupplyDemandQuery.read(convertToParamMap(params), lookups);

	it('reads defaults from an empty query', () => {
		expect(read({})).toEqual(SupplyDemandQuery.DEFAULTS);
	});

	it('reads every param', () => {
		expect(
			read({
				scope: 'sector',
				sector: 's1',
				jumps: '5',
				group: 'hightech',
				player: '0',
				mined: '1',
				map: 'reach',
			})
		).toEqual({
			scope: 'sector',
			faction: '',
			sector: 'Argon Prime',
			jumps: 5,
			group: 'hightech',
			player: false,
			mined: true,
			map: 'reach',
		});
		expect(read({ scope: 'faction', faction: 'argon' }).faction).toBe('argon');
	});

	it('ignores unknown values and bad numbers', () => {
		expect(read({ scope: 'moon', faction: 'x', sector: 'x', group: 'x', jumps: '-1' })).toEqual(
			SupplyDemandQuery.DEFAULTS
		);
		expect(read({ map: 'x' }).map).toBe('local');
		expect(read({ jumps: 'abc' }).jumps).toBe(3);
		expect(read({ jumps: '0' }).jumps).toBe(0);
	});

	it('writes null for defaults and only the params the scope uses', () => {
		expect(SupplyDemandQuery.write(SupplyDemandQuery.DEFAULTS, lookups)).toEqual({
			scope: null,
			faction: null,
			sector: null,
			jumps: null,
			group: null,
			player: null,
			mined: null,
			map: null,
		});
		expect(SupplyDemandQuery.write({ ...SupplyDemandQuery.DEFAULTS, map: 'reach' }, lookups)['map']).toBe('reach');
		const model = { ...SupplyDemandQuery.DEFAULTS, scope: 'sector', sector: 'Argon Prime', jumps: 1, mined: true };
		expect(SupplyDemandQuery.write(model, lookups)).toMatchObject({
			scope: 'sector',
			sector: 's1',
			jumps: 1,
			mined: '1',
		});
		// a sector scope without a known sector writes nothing, as does a faction scope without a faction
		expect(SupplyDemandQuery.write({ ...model, sector: 'Arg' }, lookups)).toMatchObject({
			scope: null,
			sector: null,
			jumps: null,
		});
		expect(SupplyDemandQuery.write({ ...model, scope: 'faction', faction: 'argon' }, lookups)).toMatchObject({
			scope: 'faction',
			faction: 'argon',
			sector: null,
		});
		expect(SupplyDemandQuery.write({ ...model, scope: 'galaxy', faction: 'argon' }, lookups)['faction']).toBeNull();
	});

	it('puts a bad jumps number back at its default', () => {
		const model = { ...SupplyDemandQuery.DEFAULTS };
		expect(SupplyDemandQuery.clean({ ...model, jumps: -2 }).jumps).toBe(3);
		expect(SupplyDemandQuery.clean({ ...model, jumps: NaN }).jumps).toBe(3);
		expect(SupplyDemandQuery.clean({ ...model, jumps: 0 }).jumps).toBe(0);
	});
});
