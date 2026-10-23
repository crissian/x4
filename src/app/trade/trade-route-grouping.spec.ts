import { describe, expect, it } from 'vitest';
import { TradeRouteGrouping } from './trade-route-grouping';
import type { TradeRoute } from './trade-route-model';
import { TradeRouteTesting as T } from './trade-route-testing';

describe('TradeRouteGrouping', () => {
	const route = (seller: string, buyer: string, ware: string, profitPerMinute: number): TradeRoute =>
		({
			key: `${seller}~${buyer}~${ware}`,
			ware,
			seller: T.station(seller, 'a', []),
			buyer: T.station(buyer, 'b', []),
			profitPerMinute,
		}) as TradeRoute;

	it('keeps the best ranked route per sell offer and counts the others', () => {
		const ranked = [
			route('S1', 'B1', 'ec', 900),
			route('S1', 'B2', 'ec', 800),
			route('S2', 'B1', 'ec', 700),
			route('S1', 'B3', 'ec', 600),
			route('S1', 'B1', 'water', 500),
		];
		const best = TradeRouteGrouping.bestPerOffer(ranked);
		expect(best.map((x) => [x.key, x.otherBuyers])).toEqual([
			['S1~B1~ec', 2],
			['S2~B1~ec', undefined],
			['S1~B1~water', undefined],
		]);
		// the input routes are left as they were
		expect(ranked[0].otherBuyers).toBeUndefined();
		expect(best[1]).toBe(ranked[2]);
	});

	it('keeps an empty list empty', () => {
		expect(TradeRouteGrouping.bestPerOffer([])).toEqual([]);
	});
});
