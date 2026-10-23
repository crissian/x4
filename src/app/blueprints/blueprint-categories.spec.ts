import { describe, expect, it } from 'vitest';
import { BlueprintCategories } from './blueprint-categories';

describe('BlueprintCategories', () => {
	it('filters by category id, by kind or not at all', () => {
		expect(BlueprintCategories.includes('', 'ship-large')).toBe(true);
		expect(BlueprintCategories.includes('ship-large', 'ship-large')).toBe(true);
		expect(BlueprintCategories.includes('ship-large', 'ship-medium')).toBe(false);
		expect(BlueprintCategories.includes('ship', 'ship-medium')).toBe(true);
		expect(BlueprintCategories.includes('module', 'ship-medium')).toBe(false);
	});

	it('knows the valid filters', () => {
		expect(['', 'ship', 'equipment-weapons', 'nope', 'ship-x'].map((x) => BlueprintCategories.isFilter(x))).toEqual(
			[true, true, true, false, false]
		);
	});
});
