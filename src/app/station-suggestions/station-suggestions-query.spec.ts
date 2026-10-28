import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { StationSuggestionsLookups, StationSuggestionsQuery } from './station-suggestions-query';

const LOOKUPS: StationSuggestionsLookups = {
	ware: (id) => id === 'energycells',
	group: (id) => id === 'energy',
	sectorName: (id) => (id === 'ap' ? 'Argon Prime' : undefined),
	sectorId: (name) => (name === 'Argon Prime' ? 'ap' : undefined),
};

describe('StationSuggestionsQuery', () => {
	it('reads the defaults from an empty URL and writes nothing back', () => {
		const model = StationSuggestionsQuery.read(convertToParamMap({}), LOOKUPS);
		expect(model).toEqual(StationSuggestionsQuery.DEFAULTS);
		expect(Object.values(StationSuggestionsQuery.write(model, LOOKUPS)).every((x) => x === null)).toBe(true);
	});

	it('reads and writes every filter', () => {
		const params = {
			mode: 'here',
			loop: 'open',
			rank: 'payback',
			sector: 'ap',
			jumps: '5',
			hostile: '1',
			player: '0',
			group: 'energy',
		};
		const model = StationSuggestionsQuery.read(convertToParamMap(params), LOOKUPS);
		expect(model).toEqual({
			mode: 'here',
			loop: 'open',
			rank: 'payback',
			ware: '',
			sector: 'Argon Prime',
			jumps: 5,
			hideHostile: false,
			player: false,
			group: 'energy',
		});
		expect(StationSuggestionsQuery.write(model, LOOKUPS)).toEqual({ ...params, ware: null, jumps: 5 });
	});

	it('drops unknown values and jumps out of range', () => {
		const model = StationSuggestionsQuery.read(
			convertToParamMap({ mode: 'x', loop: 'x', rank: 'x', ware: 'nope', jumps: '9', group: 'x', sector: 'zz' }),
			LOOKUPS
		);
		expect(model).toEqual(StationSuggestionsQuery.DEFAULTS);
		expect(StationSuggestionsQuery.clean({ ...model, jumps: 0 }).jumps).toBe(3);
		expect(StationSuggestionsQuery.clean({ ...model, jumps: 6 }).jumps).toBe(6);
	});

	it('writes the ware in where to build only, the sector in what to build here only', () => {
		const model = { ...StationSuggestionsQuery.DEFAULTS, ware: 'energycells', sector: 'Argon Prime' };
		expect(StationSuggestionsQuery.write(model, LOOKUPS)).toMatchObject({ ware: 'energycells', sector: null });
		expect(StationSuggestionsQuery.write({ ...model, mode: 'here' }, LOOKUPS)).toMatchObject({
			ware: null,
			sector: 'ap',
		});
	});
});
