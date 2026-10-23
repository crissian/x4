import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { DiplomacyAction } from '../shared/services/model/diplomacy';
import { type DiplomacyModel, DiplomacyQuery } from './diplomacy-query';

describe('DiplomacyQuery', () => {
	const ids = { categories: ['influence'], agentTypes: ['negotiation'], risks: ['none', 'low'] };
	const none: DiplomacyModel = { category: '', agentType: '', risk: '', search: '', shown: false };

	it('reads the defaults and drops unknown ids', () => {
		expect(DiplomacyQuery.read(convertToParamMap({ category: 'nope', tab: 'x' }), ids)).toEqual({
			tab: 'actions',
			model: none,
		});
	});

	it('round-trips a state', () => {
		const state = {
			tab: 'events' as const,
			model: { category: 'influence', agentType: 'negotiation', risk: 'low', search: 'spy', shown: true },
		};
		const params = DiplomacyQuery.write(state);
		expect(params).toEqual({
			tab: 'events',
			category: 'influence',
			agent: 'negotiation',
			risk: 'low',
			q: 'spy',
			shown: '1',
		});
		expect(DiplomacyQuery.read(convertToParamMap(params), ids)).toEqual(state);
		expect(DiplomacyQuery.write({ tab: 'actions', model: none })).toEqual({
			tab: null,
			category: null,
			agent: null,
			risk: null,
			q: null,
			shown: null,
		});
	});

	it('filters the actions; shown only with diplomacy in the save', () => {
		const action = (id: string, risk: string) =>
			({
				id,
				name: id,
				shortDescription: `${id} text`,
				category: 'influence',
				agentType: 'negotiation',
				risk,
			}) as DiplomacyAction;
		const actions = [action('spy', 'low'), action('trade', 'none')];
		const ids = (model: Partial<DiplomacyModel>, save?: Parameters<typeof DiplomacyQuery.apply>[2]) =>
			DiplomacyQuery.apply(actions, { ...none, ...model }, save).map((x) => x.id);
		expect(ids({ risk: 'low' })).toEqual(['spy']);
		expect(ids({ search: 'TRADE TE' })).toEqual(['trade']);
		expect(ids({ shown: true })).toEqual(['spy', 'trade']);
		expect(ids({ shown: true }, { found: false, actions: {} })).toEqual(['spy', 'trade']);
		expect(ids({ shown: true }, { found: true, actions: { spy: false, trade: true } })).toEqual(['trade']);
	});
});
