import { describe, expect, it } from 'vitest';
import { ResearchCost } from './research-cost';

describe('ResearchCost', () => {
	it('sums the amounts per ware, largest first', () => {
		expect(
			ResearchCost.sum([
				[
					{ ware: 'b', amount: 10 },
					{ ware: 'a', amount: 5 },
				],
				[{ ware: 'a', amount: 5 }],
			])
		).toEqual([
			{ ware: 'a', amount: 10 },
			{ ware: 'b', amount: 10 },
		]);
	});
});
