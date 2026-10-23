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

	it('values the wares at their prices, unknown ones at nothing', () => {
		const prices: Record<string, number> = { a: 2 };
		expect(
			ResearchCost.value(
				[
					{ ware: 'a', amount: 10 },
					{ ware: 'x', amount: 3 },
				],
				(id) => prices[id]
			)
		).toBe(20);
	});
});
