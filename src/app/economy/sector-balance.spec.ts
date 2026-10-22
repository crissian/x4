import { describe, expect, it } from 'vitest';
import { SectorBalances } from './sector-balance';

const balance = (produced: number, consumed: number) => ({ produced, consumed, net: produced - consumed });

describe('SectorBalances', () => {
	it('is -1 with nothing made, +1 with nothing used and 0 when balanced', () => {
		expect(SectorBalances.ratio(balance(0, 500))).toBe(-1);
		expect(SectorBalances.ratio(balance(500, 0))).toBe(1);
		expect(SectorBalances.ratio(balance(300, 300))).toBe(0);
	});

	it('divides the net by the larger side', () => {
		expect(SectorBalances.ratio(balance(90, 100))).toBeCloseTo(-0.1);
		expect(SectorBalances.ratio(balance(110, 100))).toBeCloseTo(10 / 110);
		expect(SectorBalances.ratio(balance(100, 300))).toBeCloseTo(-2 / 3);
	});

	it('stays within the bounds and orders by balance', () => {
		const ratios = [
			balance(0, 9),
			balance(1, 9),
			balance(5, 9),
			balance(9, 9),
			balance(9, 5),
			balance(9, 1),
			balance(9, 0),
		].map((x) => SectorBalances.ratio(x));
		expect(ratios).toEqual([...ratios].sort((a, b) => a - b));
		expect(Math.min(...ratios)).toBeGreaterThanOrEqual(-1);
		expect(Math.max(...ratios)).toBeLessThanOrEqual(1);
	});

	it('finds the sectors where nothing happens', () => {
		expect(SectorBalances.idle(balance(0, 0))).toBe(true);
		expect(SectorBalances.idle(balance(0, 1))).toBe(false);
		expect(SectorBalances.idle(balance(1, 0))).toBe(false);
		expect(SectorBalances.ratio(balance(0, 0))).toBe(0);
	});
});
