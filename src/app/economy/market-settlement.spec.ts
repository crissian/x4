import { describe, expect, it } from 'vitest';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { MarketSettlement } from './market-settlement';
import { SectorGraph, type SectorRing } from './sector-graph';

/** Reach over a small gate graph, the way `PlacementContext.reach` works it out. */
class SettlementTesting {
	/** a - b - c - d - e - f in a line */
	static readonly LINE: Record<string, string[]> = {
		a: ['b'],
		b: ['a', 'c'],
		c: ['b', 'd'],
		d: ['c', 'e'],
		e: ['d', 'f'],
		f: ['e'],
	};

	static reach(links: Record<string, string[]>): (sector: string, jumps: number) => SectorRing[] {
		const graph = new SectorGraph(Object.entries(links).map(([id, to]) => TradeRouteTesting.sector(id, to)));
		return (sector, jumps) => [...graph.rings(sector, jumps)];
	}

	static residual(net: Record<string, number>, links = SettlementTesting.LINE, maxJumps?: number) {
		return Object.fromEntries(
			MarketSettlement.residual(new Map(Object.entries(net)), SettlementTesting.reach(links), maxJumps)
		);
	}
}

describe('MarketSettlement', () => {
	it('supplies the nearest short sectors first', () => {
		expect(SettlementTesting.residual({ a: 50, b: -50, c: -50 })).toEqual({ c: 50 });
		expect(SettlementTesting.residual({ a: 100, b: -60, d: -100 })).toEqual({ d: 60 });
	});

	it('leaves the shortages beyond the jumps the supply travels', () => {
		expect(MarketSettlement.MAX_JUMPS).toBe(3);
		expect(SettlementTesting.residual({ a: 100, e: -50 })).toEqual({ e: 50 });
		expect(SettlementTesting.residual({ a: 100, e: -50 }, SettlementTesting.LINE, 4)).toEqual({});
	});

	it('tells the surplus and the shortage left per sector', () => {
		const settled = MarketSettlement.settled(
			new Map(Object.entries({ a: 500, b: -60, d: -100, f: -10 })),
			SettlementTesting.reach(SettlementTesting.LINE)
		);
		// a supplies b, then d; f is 5 jumps away
		expect(Object.fromEntries(settled)).toEqual({ a: 340, f: -10 });
	});

	it('keeps the leftover surplus out of the result and never goes below 0', () => {
		const result = SettlementTesting.residual({ a: 500, b: -60, c: 30, d: -10 });
		expect(result).toEqual({});
		expect(SettlementTesting.residual({ a: -20, f: -5 })).toEqual({ a: 20, f: 5 });
	});

	it('shares a surplus between equally near sectors by their shortage', () => {
		const result = SettlementTesting.residual({ b: 60, a: -60, c: -30 });
		expect(result['a']).toBeCloseTo(20);
		expect(result['c']).toBeCloseTo(10);
	});

	it('shares an oversubscribed sector between its suppliers and offers the rest again', () => {
		// one jump only: a and c both supply b, c also supplies d
		const net = { a: 100, c: 100, b: -100, d: -100 };
		const result = SettlementTesting.residual(net, SettlementTesting.LINE, 1);
		expect(result['b'] ?? 0).toBeCloseTo(0);
		expect(result['d']).toBeCloseTo(100 / 3);
		const reversed = Object.fromEntries(Object.entries(net).reverse());
		const again = SettlementTesting.residual(reversed, SettlementTesting.LINE, 1);
		expect(again['d']).toBeCloseTo(result['d']);
	});
});
