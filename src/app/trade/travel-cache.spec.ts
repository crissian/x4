import { afterEach, describe, expect, it, vi } from 'vitest';
import { RoutePlanner } from '../map/route-planner';
import { TradeRouteTesting } from './trade-route-testing';
import { TravelCache } from './travel-cache';

describe('travel cache', () => {
	const options = { speed: 3000, charge: 5 };

	afterEach(() => vi.restoreAllMocks());

	it('reuses travel times per start sector', () => {
		const spy = vi.spyOn(RoutePlanner, 'travelTimes');
		const cache = new TravelCache(TradeRouteTesting.SECTORS, options);
		const first = cache.from('a');
		expect(cache.from('a')).toBe(first);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(cache.route('a', 'c')?.jumps).toBe(2);
		expect(cache.route('a', 'c')).toBe(cache.route('a', 'c'));
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined for unknown sectors', () => {
		const cache = new TravelCache(TradeRouteTesting.SECTORS, options);
		expect(cache.from('nope')).toBeUndefined();
		expect(cache.route('nope', 'a')).toBeUndefined();
		expect(cache.route('a', 'nope')).toBeUndefined();
		expect(cache.route('a', 'x')).toBeUndefined();
	});
});
