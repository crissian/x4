import { describe, expect, it } from 'vitest';
import { PriceRangePipe } from './price-range.pipe';

describe('PriceRangePipe', () => {
	const pipe = new PriceRangePipe();

	it('formats the lowest and highest price as whole numbers', () => {
		expect(pipe.transform({ min: 1200, max: 1800.4 })).toBe('1,200 - 1,800');
	});

	it('is empty without a price', () => {
		expect(pipe.transform(undefined)).toBe('');
		expect(pipe.transform(null)).toBe('');
	});
});
