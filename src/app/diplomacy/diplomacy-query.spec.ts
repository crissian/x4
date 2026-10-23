import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { DiplomacyAction } from '../shared/services/model/diplomacy';
import { type DiplomacyModel, DiplomacyQuery } from './diplomacy-query';

describe('DiplomacyQuery', () => {
	const ids = { categories: ['influence'], agentTypes: ['negotiation'] };
	const none: DiplomacyModel = { category: '', agentType: '', search: '', shown: false };

	it('reads the defaults and drops unknown ids', () => {
		expect(DiplomacyQuery.read(convertToParamMap({ category: 'nope', tab: 'x' }), ids)).toEqual({
			tab: 'actions',
			model: none,
		});
	});

	it('round-trips a state', () => {
		const state = {
			tab: 'events' as const,
			model: { category: 'influence', agentType: 'negotiation', search: 'spy', shown: true },
		};
		const params = DiplomacyQuery.write(state);
		expect(params).toEqual({
			tab: 'events',
			category: 'influence',
			agent: 'negotiation',
			q: 'spy',
			shown: '1',
		});
		expect(DiplomacyQuery.read(convertToParamMap(params), ids)).toEqual(state);
		expect(DiplomacyQuery.write({ tab: 'actions', model: none })).toEqual({
			tab: null,
			category: null,
			agent: null,
			q: null,
			shown: null,
		});
	});

	it('filters the actions; shown only with diplomacy in the save', () => {
		const action = (id: string, category: string) =>
			({
				id,
				name: id,
				shortDescription: `${id} text`,
				category,
				agentType: 'negotiation',
			}) as DiplomacyAction;
		const actions = [action('spy', 'espionage'), action('trade', 'influence')];
		const ids = (model: Partial<DiplomacyModel>, save?: Parameters<typeof DiplomacyQuery.apply>[2]) =>
			DiplomacyQuery.apply(actions, { ...none, ...model }, save).map((x) => x.id);
		expect(ids({ category: 'espionage' })).toEqual(['spy']);
		expect(ids({ search: 'TRADE TE' })).toEqual(['trade']);
		expect(ids({ shown: true })).toEqual(['spy', 'trade']);
		expect(ids({ shown: true }, { found: false, actions: {} })).toEqual(['spy', 'trade']);
		expect(ids({ shown: true }, { found: true, actions: { spy: false, trade: true } })).toEqual(['trade']);
	});
});
