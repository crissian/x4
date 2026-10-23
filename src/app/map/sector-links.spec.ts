import { describe, expect, it } from 'vitest';
import type { Sector } from '../shared/services/model/model';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { SectorLinks } from './sector-links';

describe('SectorLinks', () => {
	const highway = (sector: Sector, to: string): Sector => ({
		...sector,
		highwayLinks: [{ sector: to, x: 1, z: 2 }],
	});

	it('lists the gates first, then the superhighway entries', () => {
		const sector = highway(TradeRouteTesting.sector('a', ['b']), 'c');
		expect(SectorLinks.exits(sector)).toEqual([
			{ from: 'a', to: 'b', type: 'gate', x: 0, z: 0 },
			{ from: 'a', to: 'c', type: 'highway', x: 1, z: 2 },
		]);
	});

	it('keeps only the links whose other side links back with the same type', () => {
		const sectors = [
			highway(TradeRouteTesting.sector('a', ['b', 'c']), 'b'),
			TradeRouteTesting.sector('b', ['a']),
			TradeRouteTesting.sector('c', []),
		];
		// a > c is one-way, a > b by highway has no highway back
		expect(SectorLinks.twoWay(sectors).map((x) => SectorLinks.key(x.from, x.to, x.type))).toEqual([
			'a>b:gate',
			'b>a:gate',
		]);
	});

	it('skips links to sectors outside the set and repeated links', () => {
		const sectors = [TradeRouteTesting.sector('a', ['b', 'b', 'z']), TradeRouteTesting.sector('b', ['a'])];
		expect(SectorLinks.twoWay(sectors).map((x) => `${x.from}>${x.to}`)).toEqual(['a>b', 'b>a']);
	});
});
