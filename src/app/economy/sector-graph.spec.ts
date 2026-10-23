import { describe, expect, it } from 'vitest';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { SectorGraph } from './sector-graph';

describe('SectorGraph', () => {
	// a - b - c, a one-way gate c > x, and x alone
	const graph = new SectorGraph([
		TradeRouteTesting.sector('a', ['b']),
		TradeRouteTesting.sector('b', ['a', 'c']),
		TradeRouteTesting.sector('c', ['b', 'x']),
		TradeRouteTesting.sector('x', []),
	]);

	it('finds the sectors by distance over two-way links', () => {
		expect(graph.rings('a', 5)).toEqual([
			{ sector: 'a', jumps: 0 },
			{ sector: 'b', jumps: 1 },
			{ sector: 'c', jumps: 2 },
		]);
		expect(graph.rings('x', 5)).toEqual([{ sector: 'x', jumps: 0 }]);
	});

	it('lists the sectors within some jumps, nearest first, and caches them', () => {
		expect(graph.within('a', 1)).toEqual(['a', 'b']);
		expect(graph.within('a', 0)).toEqual(['a']);
		expect(graph.within('a', 1)).toBe(graph.within('a', 1));
		expect(graph.within('unknown', 2)).toEqual([]);
	});

	it('gives the area around a centre as a set', () => {
		expect([...graph.area('b', 1)].sort()).toEqual(['a', 'b', 'c']);
		expect(graph.area('b', 1)).toBe(graph.area('b', 1));
		expect(graph.area('unknown', 1).size).toBe(0);
	});

	it('lists every sector', () => {
		expect(graph.sectors()).toEqual(['a', 'b', 'c', 'x']);
	});
});
