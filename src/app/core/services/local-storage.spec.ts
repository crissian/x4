import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorage } from './local-storage';

describe('LocalStorage', () => {
	beforeEach(() => localStorage.clear());

	it('builds ticks at the default except the changed keys', () => {
		expect(LocalStorage.ticks(['a', 'b', 'c'], false, ['b'])).toEqual({ a: false, b: true, c: false });
		expect(LocalStorage.ticks([0, 1], true, [1])).toEqual({ 0: true, 1: false });
	});

	it('stores ticks as the keys off the default and lets new keys start at it', () => {
		localStorage.setItem('ticks', JSON.stringify(['b', 'gone']));
		const ticks = TestBed.runInInjectionContext(() =>
			LocalStorage.persistedTicks('ticks', ['a', 'b', 'new'], false)
		);
		expect(ticks()).toEqual({ a: false, b: true, new: false });
		ticks.update((x) => ({ ...x, a: true }));
		TestBed.tick();
		expect(JSON.parse(localStorage.getItem('ticks')!)).toEqual(['a', 'b']);
	});

	it('falls back to the default for a stored value that is not a list', () => {
		localStorage.setItem('ticks', JSON.stringify({ a: true }));
		const ticks = TestBed.runInInjectionContext(() => LocalStorage.persistedTicks('ticks', ['a'], true));
		expect(ticks()).toEqual({ a: true });
	});
});
