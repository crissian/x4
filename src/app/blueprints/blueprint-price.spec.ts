import { describe, expect, it } from 'vitest';
import { BlueprintPrice } from './blueprint-price';

describe('BlueprintPrice', () => {
	const price = { min: 80, max: 120, avg: 100 };

	it('asks the maximum price for modules', () => {
		expect(BlueprintPrice.of(price, 'module')).toBe(120);
	});

	it('asks ten times the average for ships and equipment', () => {
		expect(BlueprintPrice.of(price, 'ship')).toBe(1000);
		expect(BlueprintPrice.of(price, 'equipment')).toBe(1000);
		// the Argon Discoverer
		expect(BlueprintPrice.of({ min: 0, max: 0, avg: 131970 }, 'ship')).toBe(1319700);
	});

	it('is 0 without a price', () => {
		expect(BlueprintPrice.of(undefined, 'ship')).toBe(0);
	});
});
