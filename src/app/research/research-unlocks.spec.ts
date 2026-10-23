import { describe, expect, it } from 'vitest';
import { ResearchUnlocks } from './research-unlocks';

describe('ResearchUnlocks', () => {
	it('finds the research a module blueprint needs', () => {
		expect(ResearchUnlocks.of('module_arg_def_claim_01').map((x) => x.id)).toEqual(['research_module_defence']);
	});

	it('finds the research whose script hands out a ship blueprint', () => {
		expect(ResearchUnlocks.of('ship_ter_s_fighter_04_a').map((x) => x.id)).toEqual([
			'research_ship_ter_s_fighter_01',
		]);
	});

	it('is empty for wares no research unlocks', () => {
		expect(ResearchUnlocks.of('energycells')).toEqual([]);
		expect(ResearchUnlocks.of(undefined)).toEqual([]);
	});
});
