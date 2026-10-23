import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ResearchQuery } from './research-query';

describe('ResearchQuery', () => {
	const known = (id: string) => id === 'research_seta';

	it('reads the defaults from empty params', () => {
		expect(ResearchQuery.read(convertToParamMap({}), known)).toEqual({
			model: { search: '', hidden: false },
			view: 'tree',
			id: '',
		});
	});

	it('round-trips a state and drops unknown ids', () => {
		const state = { model: { search: 'tele', hidden: true }, view: 'list' as const, id: 'research_seta' };
		const params = ResearchQuery.write(state);
		expect(params).toEqual({ view: 'list', q: 'tele', hidden: '1', id: 'research_seta' });
		expect(ResearchQuery.read(convertToParamMap(params), known)).toEqual(state);
		expect(ResearchQuery.read(convertToParamMap({ id: 'nope' }), known).id).toBe('');
	});

	it('writes nulls for the defaults', () => {
		expect(ResearchQuery.write({ model: { search: ' ', hidden: false }, view: 'tree', id: '' })).toEqual({
			view: null,
			q: null,
			hidden: null,
			id: null,
		});
	});
});
