import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../savegame/map/save-map-model';
import { TradeRouteFinder } from './trade-route-finder';
import type { TradeFilters, TradeInput } from './trade-route-model';
import { TradeRouteTesting as T } from './trade-route-testing';

describe('trade route finder', () => {
	const find = (stations: SaveStation[], extra: Partial<TradeInput> = {}) =>
		TradeRouteFinder.find(T.input(stations, extra));
	const filters = (extra: Partial<TradeFilters>): TradeFilters => ({
		hideHostile: true,
		playerOnly: true,
		hideIllegal: false,
		...extra,
	});

	it('pairs a seller with a richer buyer', () => {
		const s1 = T.station('S1', 'a', [T.sell('ec', 10, 5000)]);
		const b1 = T.station('B1', 'c', [T.buy('ec', 16, 400)]);
		const { routes, total } = find([s1, b1]);
		expect(total).toBe(1);
		expect(routes.length).toBe(1);
		const route = routes[0];
		expect(route.key).toBe('S1~B1~ec');
		expect(route.seller).toBe(s1);
		expect(route.buyer).toBe(b1);
		expect(route.buyPrice).toBe(10);
		expect(route.sellPrice).toBe(16);
		expect(route.margin).toBe(6);
		expect(route.units).toBe(400);
		expect(route.profit).toBe(2400);
		expect(route.jumps).toBe(2);
		expect(route.travelSeconds).toBeGreaterThan(0);
		expect(route.startSeconds).toBe(0);
		expect(route.seconds).toBe(route.travelSeconds + 120);
		expect(route.profitPerMinute).toBe(2400 / (route.seconds / 60));
		expect(route.thin).toBe(false);
		expect(route.playerOnly).toBe(false);
		expect(route.illegalSectors).toEqual([]);
	});

	it('caps units by the hold', () => {
		const routes = find([
			T.station('S1', 'a', [T.sell('ec', 10, 5000)]),
			T.station('B1', 'c', [T.buy('ec', 16, 5000)]),
		]).routes;
		expect(routes[0].units).toBe(500);
		expect(routes[0].profit).toBe(3000);
	});

	it('trades within a sector with zero jumps', () => {
		const routes = find([
			T.station('S1', 'a', [T.sell('ec', 10, 100)]),
			T.station('B1', 'a', [T.buy('ec', 16, 100)]),
		]).routes;
		expect(routes[0].jumps).toBe(0);
		expect(routes[0].travelSeconds).toBe(0);
		expect(routes[0].seconds).toBe(120);
	});

	it('skips wares the ship cannot carry', () => {
		const result = find([
			T.station('S1', 'a', [T.sell('water', 10, 100)]),
			T.station('B1', 'c', [T.buy('water', 16, 100)]),
		]);
		expect(result).toEqual({ routes: [], total: 0 });
	});

	it('skips unprofitable and same-station pairs', () => {
		expect(
			find([T.station('S1', 'a', [T.sell('ec', 10, 100)]), T.station('B1', 'c', [T.buy('ec', 10, 100)])]).total
		).toBe(0);
		expect(
			find([T.station('S1', 'a', [T.sell('ec', 10, 100)]), T.station('B1', 'c', [T.buy('ec', 9, 100)])]).total
		).toBe(0);
		expect(find([T.station('S1', 'a', [T.sell('ec', 10, 100), T.buy('ec', 16, 100)])]).total).toBe(0);
	});

	it('skips unreachable and unknown sectors', () => {
		const seller = T.station('S1', 'a', [T.sell('ec', 10, 100)]);
		expect(() => find([seller, T.station('B1', 'x', [T.buy('ec', 16, 100)])])).not.toThrow();
		expect(find([seller, T.station('B1', 'x', [T.buy('ec', 16, 100)])]).total).toBe(0);
		expect(find([seller, T.station('B1', 'nope', [T.buy('ec', 16, 100)])]).total).toBe(0);
		expect(
			find([T.station('S1', 'nope', [T.sell('ec', 10, 100)]), T.station('B1', 'a', [T.buy('ec', 16, 100)])]).total
		).toBe(0);
	});

	it('skips unknown wares', () => {
		expect(
			find([
				T.station('S1', 'a', [T.sell('modware', 10, 100)]),
				T.station('B1', 'c', [T.buy('modware', 16, 100)]),
			]).total
		).toBe(0);
	});

	it('skips construction sites, wrecks and empty offers', () => {
		const buyer = T.station('B1', 'c', [T.buy('ec', 16, 100)]);
		expect(find([T.station('S1', 'a', [T.sell('ec', 10, 100)], { state: 'construction' }), buyer]).total).toBe(0);
		expect(find([T.station('S1', 'a', [T.sell('ec', 10, 100)], { state: 'wreck' }), buyer]).total).toBe(0);
		expect(find([T.station('S1', 'a', [T.sell('ec', 10, 0)]), buyer]).total).toBe(0);
		expect(
			find([T.station('S1', 'a', [T.sell('ec', 10, 100)]), T.station('B1', 'c', [T.buy('ec', 16, 0)])]).total
		).toBe(0);
		expect(find([T.station('S1', 'a', []), buyer]).total).toBe(0);
		expect(
			find([
				T.station('S1', 'a', [T.sell('ec', 10, 100)]),
				T.station('B1', 'c', [T.buy('ec', 16, 100)], { state: 'wreck' }),
			]).total
		).toBe(0);
	});

	it('hides hostile owners at -0.01 and below', () => {
		const seller = T.station('S1', 'a', [T.sell('ec', 10, 100)]);
		const split = T.station('B1', 'c', [T.buy('ec', 16, 100)], { owner: 'split' });
		expect(find([seller, split], { relations: { split: -0.01 } }).total).toBe(0);
		expect(find([seller, split], { relations: { split: -0.0099 } }).total).toBe(1);
		const splitSeller = T.station('S2', 'a', [T.sell('ec', 10, 100)], { owner: 'split' });
		expect(
			find([splitSeller, T.station('B2', 'c', [T.buy('ec', 16, 100)])], { relations: { split: -1 } }).total
		).toBe(0);
		const player = T.station('P1', 'c', [T.buy('ec', 16, 100)], { owner: 'player' });
		expect(find([seller, player], { relations: { player: -1 } }).total).toBe(1);
		expect(
			find([seller, split], { relations: { split: -1 }, filters: filters({ hideHostile: false }) }).total
		).toBe(1);
		expect(find([seller, split], { relations: undefined }).total).toBe(1);
		expect(TradeRouteFinder.isHostile('split', { split: -0.01 })).toBe(true);
		expect(TradeRouteFinder.isHostile('split', { split: -0.0099 })).toBe(false);
		expect(TradeRouteFinder.isHostile('split', {})).toBe(false);
		expect(TradeRouteFinder.isHostile('player', { player: -1 })).toBe(false);
		expect(TradeRouteFinder.isHostile('split', undefined)).toBe(false);
	});

	it('player-only offers follow the filter and are marked', () => {
		const stations = [
			T.station('S1', 'a', [T.sell('ec', 10, 100, true)]),
			T.station('B1', 'c', [T.buy('ec', 16, 100)]),
		];
		expect(find(stations, { filters: filters({ playerOnly: false }) }).total).toBe(0);
		const kept = find(stations, { filters: filters({ playerOnly: true }) }).routes;
		expect(kept.length).toBe(1);
		expect(kept[0].playerOnly).toBe(true);
		const buyerOnly = [
			T.station('S1', 'a', [T.sell('ec', 10, 100)]),
			T.station('B1', 'c', [T.buy('ec', 16, 100, true)]),
		];
		expect(find(buyerOnly, { filters: filters({ playerOnly: false }) }).total).toBe(0);
		expect(find(buyerOnly).routes[0].playerOnly).toBe(true);
	});

	describe('illegal wares', () => {
		const stations = [
			T.station('S1', 'a', [T.sell('spice', 10, 100)]),
			T.station('B1', 'c', [T.buy('spice', 16, 100)]),
		];
		const illegal = (owners: Record<string, string>, list = stations, extra: Partial<TradeInput> = {}) =>
			find(list, { map: T.map(list, owners), ...extra }).routes[0]?.illegalSectors;

		it('lists the loaded leg sectors where the ware is illegal', () => {
			expect(illegal({ c: 'argon' })).toEqual(['c']);
			expect(illegal({ a: 'argon' })).toEqual(['a']);
			expect(illegal({ a: 'argon', c: 'argon' })).toEqual(['a', 'c']);
			expect(illegal({})).toEqual([]);
			const ec = [T.station('S1', 'a', [T.sell('ec', 10, 100)]), T.station('B1', 'c', [T.buy('ec', 16, 100)])];
			expect(illegal({ a: 'argon', c: 'argon' }, ec)).toEqual([]);
		});

		it('counts a sector passed through', () => {
			expect(illegal({ b: 'argon' })).toEqual(['b']);
		});

		it('ignores the sectors off the loaded leg, such as the empty leg to the seller', () => {
			const filter = filters({ near: 'b' });
			expect(illegal({ b: 'argon' }, stations, { filters: filter })).toEqual(['b']);
			const seller = [
				T.station('S1', 'b', [T.sell('spice', 10, 100)]),
				T.station('B1', 'c', [T.buy('spice', 16, 100)]),
			];
			// near a: the empty leg a > b is not checked, and the loaded leg b > c holds no argon sector
			expect(illegal({ a: 'argon' }, seller, { filters: filters({ near: 'a' }) })).toEqual([]);
		});

		it('hides the illegal routes when asked', () => {
			const owners = { b: 'argon' };
			const hidden = find(stations, { map: T.map(stations, owners), filters: filters({ hideIllegal: true }) });
			expect(hidden.total).toBe(0);
			expect(hidden.routes).toEqual([]);
			const legal = find(stations, { map: T.map(stations), filters: filters({ hideIllegal: true }) });
			expect(legal.total).toBe(1);
		});
	});

	it('marks thin routes', () => {
		const route = (amount: number) =>
			find([T.station('S1', 'a', [T.sell('ec', 10, 5000)]), T.station('B1', 'c', [T.buy('ec', 16, amount)])])
				.routes[0];
		expect(route(200).thin).toBe(false);
		expect(route(40).thin).toBe(true);
	});

	it('near sector adds the empty leg and limits jumps', () => {
		const stations = [
			T.station('SA', 'a', [T.sell('ec', 10, 100)]),
			T.station('SB', 'b', [T.sell('ec', 10, 100)]),
			T.station('B1', 'c', [T.buy('ec', 16, 100)]),
		];
		const near = find(stations, { filters: filters({ near: 'c', maxJumps: 1 }) }).routes;
		expect(near.map((x) => x.seller.code)).toEqual(['SB']);
		expect(near[0].startSeconds).toBeGreaterThan(0);
		expect(near[0].seconds).toBe(near[0].startSeconds + near[0].travelSeconds + 120);
		expect(near[0].jumps).toBe(1);
		const all = find(stations).routes;
		expect(all.length).toBe(2);
		expect(all.every((x) => x.startSeconds === 0)).toBe(true);
	});

	it('filters by ware', () => {
		const stations = [
			T.station('S1', 'a', [T.sell('ec', 10, 100), T.sell('spice', 10, 100)]),
			T.station('B1', 'c', [T.buy('ec', 16, 100), T.buy('spice', 16, 100)]),
		];
		expect(find(stations).total).toBe(2);
		const routes = find(stations, { filters: filters({ ware: 'spice' }) }).routes;
		expect(routes.map((x) => x.ware)).toEqual(['spice']);
	});

	it('sorts by profit per minute and keeps the top 200', () => {
		const stations: SaveStation[] = [];
		for (let i = 0; i < 10; i++) {
			stations.push(T.station(`S${i}`, i % 2 ? 'a' : 'b', [T.sell('ec', 10 + i, 100)]));
		}
		for (let i = 0; i < 25; i++) {
			stations.push(T.station(`B${i}`, i % 3 ? 'c' : 'a', [T.buy('ec', 30 + i, 100)]));
		}
		const { routes, total } = find(stations);
		expect(total).toBe(250);
		expect(routes.length).toBe(200);
		for (let i = 1; i < routes.length; i++) {
			expect(routes[i - 1].profitPerMinute).toBeGreaterThanOrEqual(routes[i].profitPerMinute);
		}
	});

	it('keeps the best buyer per sell offer before the top 200', () => {
		const stations = [];
		for (let i = 0; i < 10; i++) {
			stations.push(T.station(`S${i}`, 'a', [T.sell('ec', 10 + i, 100)]));
		}
		for (let i = 0; i < 25; i++) {
			stations.push(T.station(`B${i}`, 'b', [T.buy('ec', 30 + i, 100)]));
		}
		const { routes, total } = find(stations, { filters: filters({ bestPerOffer: true }) });
		expect(total).toBe(10);
		expect(new Set(routes.map((x) => x.seller.code)).size).toBe(10);
		expect(routes.every((x) => x.buyer.code === 'B24' && x.otherBuyers === 24)).toBe(true);
	});

	it('gives the capacity for the ware transport', () => {
		const ship = { capacity: { container: 3000, solid: 1000 }, speed: 1, charge: 1 };
		expect(TradeRouteFinder.capacityFor(ship, { volume: 1, transport: 'solid', illegalIn: [] })).toBe(1000);
		expect(TradeRouteFinder.capacityFor(ship, { volume: 1, transport: 'liquid', illegalIn: [] })).toBe(0);
	});
});
