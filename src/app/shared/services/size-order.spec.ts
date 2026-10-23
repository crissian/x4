import { describe, expect, it } from 'vitest';
import { SizeOrder } from './size-order';

describe('SizeOrder', () => {
	it('sorts by size, smallest first, unknown last, keeping the order within a size', () => {
		const items = [
			{ id: 'a', size: 'Large' },
			{ id: 'b', size: 'Odd' },
			{ id: 'c', size: 'Extra Small' },
			{ id: 'd', size: 'Large' },
			{ id: 'e', size: 'Medium' },
		];
		expect(SizeOrder.sort(items, (x) => x.size).map((x) => x.id)).toEqual(['c', 'e', 'a', 'd', 'b']);
		expect(SizeOrder.rank('Extra Large')).toBe(4);
	});
});
