import { describe, expect, it } from 'vitest';
import { EmpireBalance } from './empire-balance';

describe('EmpireBalance', () => {
	const name = (id: string) => ({ name: id.toUpperCase(), mined: id === 'water' });

	it('sums the flows of the stations per ware, the largest shortage first', () => {
		const rows = EmpireBalance.rows(
			[
				[
					{ ware: 'energycells', produced: 1000, consumed: 0 },
					{ ware: 'hullparts', produced: 0, consumed: 0 },
				],
				[
					{ ware: 'energycells', produced: 0, consumed: 300 },
					{ ware: 'graphene', produced: 0, consumed: 200 },
					{ ware: 'water', produced: 50, consumed: 50 },
				],
			],
			name
		);
		expect(rows).toEqual([
			{ id: 'graphene', name: 'GRAPHENE', produced: 0, consumed: 200, net: -200, stations: 1, mined: false },
			{ id: 'water', name: 'WATER', produced: 50, consumed: 50, net: 0, stations: 1, mined: true },
			{
				id: 'energycells',
				name: 'ENERGYCELLS',
				produced: 1000,
				consumed: 300,
				net: 700,
				stations: 2,
				mined: false,
			},
		]);
		expect(EmpireBalance.share(rows[0])).toBe(-1);
		expect(EmpireBalance.share(rows[2])).toBeCloseTo(0.7);
	});
});
