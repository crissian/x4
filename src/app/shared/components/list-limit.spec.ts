import { signal } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { ListLimit } from './list-limit';

describe('ListLimit', () => {
	it('shows the first rows until expanded', () => {
		const items = signal([1, 2, 3, 4, 5, 6, 7]);
		const list = new ListLimit(items, 5);
		expect(list.visible()).toEqual([1, 2, 3, 4, 5]);
		expect(list.hiddenCount()).toBe(2);

		list.toggle();
		expect(list.visible()).toEqual([1, 2, 3, 4, 5, 6, 7]);
		list.toggle();
		expect(list.visible()).toEqual([1, 2, 3, 4, 5]);
	});

	it('hides nothing when the list fits', () => {
		const list = new ListLimit(signal([1, 2]), 5);
		expect(list.visible()).toEqual([1, 2]);
		expect(list.hiddenCount()).toBe(0);
	});
});
