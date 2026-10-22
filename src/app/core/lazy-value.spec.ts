import { Injector, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LazyValue } from './lazy-value';

describe('LazyValue', () => {
	it('loads once when first asked for and keeps the value', async () => {
		const wanted = signal(false);
		let calls = 0;
		const lazy = runInInjectionContext(TestBed.inject(Injector), () => new LazyValue(wanted, async () => ++calls));
		TestBed.tick();
		await LazyValue.settled();
		expect(lazy.value()).toBeUndefined();

		wanted.set(true);
		TestBed.tick();
		await LazyValue.settled();
		expect(lazy.value()).toBe(1);
		wanted.set(false);
		wanted.set(true);
		TestBed.tick();
		await LazyValue.settled();
		expect(calls).toBe(1);
	});

	it('reports a failed load', async () => {
		const lazy = runInInjectionContext(
			TestBed.inject(Injector),
			() =>
				new LazyValue(
					() => true,
					() => Promise.reject(new Error('x'))
				)
		);
		TestBed.tick();
		await LazyValue.settled();
		expect(lazy.failed()).toBe(true);
		expect(lazy.value()).toBeUndefined();
	});
});
