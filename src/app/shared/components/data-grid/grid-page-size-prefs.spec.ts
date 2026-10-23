import { beforeEach, describe, expect, it } from 'vitest';
import { GridPageSizePrefs } from './grid-page-size-prefs';

describe('GridPageSizePrefs', () => {
	beforeEach(() => localStorage.clear());

	it('keys the size per grid, or shares one key for grids without a key', () => {
		expect(GridPageSizePrefs.key('wares')).toBe('grid-page-size:wares');
		expect(GridPageSizePrefs.key(undefined)).toBe('grid-page-size');
	});

	it('reads the saved size when the grid offers it', () => {
		GridPageSizePrefs.write('k', 100);
		expect(GridPageSizePrefs.read('k', [10, 20, 50, 100])).toBe(100);
	});

	it('falls back to the default, or the largest size below it, or the first size', () => {
		expect(GridPageSizePrefs.read('k', [10, 20, 50, 100])).toBe(50);
		GridPageSizePrefs.write('k', 30);
		expect(GridPageSizePrefs.read('k', [10, 20, 50, 100])).toBe(50);
		expect(GridPageSizePrefs.read('k', [5, 25, 75])).toBe(25);
		expect(GridPageSizePrefs.read('k', [75, 150])).toBe(75);
	});

	it('ignores stored values that are not numbers', () => {
		localStorage.setItem('k', '"all"');
		expect(GridPageSizePrefs.read('k', [10, 20, 50, 100])).toBe(50);
	});
});
