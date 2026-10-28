import { describe, expect, it } from 'vitest';
import { Mining } from '../map/mining';
import type { SaveStation } from '../savegame/map/save-map-model';
import { Size } from '../shared/services/data/size-data';
import type { Sector } from '../shared/services/model/model';
import { ShipListService } from '../shared/services/ship-list.service';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { EconomyTesting } from './economy-testing';
import { PlacementContext } from './placement-context';
import { PlacementMiners } from './placement-miners';
import type { PlacementOptions } from './placement-model';
import { PlacementRanking } from './placement-ranking';
import { PlacementRecipes } from './placement-recipes';
import { PlacementScorer } from './placement-scorer';

const ENERGY = 'energycells';
const CLOSED: PlacementOptions = { loop: 'closed', jumps: 3, hideHostile: true, includePlayer: true };
const ships = new ShipListService().getEntities();
const ware = (id: string) => EconomyTesting.wares.getEntity(id);

function hull(code: string, sector: string, count: number): SaveStation {
	return EconomyTesting.station(code, sector, { modules: [EconomyTesting.HULL_PARTS], moduleCounts: [count] });
}

/** The test sectors a <-> b <-> c with ore in a and hull parts factories in c, priced with the ship list. */
function world(withShips = true): PlacementContext {
	const sectors = EconomyTesting.SECTORS.map((x) =>
		x.id === 'a' ? { ...x, resources: [{ ware: 'ore' } as Sector['resources'][number]] } : x
	);
	const stations = [hull('H', 'c', 400)];
	return new PlacementContext(
		EconomyTesting.economy(stations),
		EconomyTesting.wares,
		new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules),
		sectors,
		TradeRouteTesting.map(stations),
		undefined,
		new Set(),
		withShips ? ships : []
	);
}

describe('PlacementMiners', () => {
	const miners = (fields: string[]) => new PlacementMiners(ships, EconomyTesting.SECTORS, ware, () => fields);

	it('picks the L miner with the most hold per credit for a ware', () => {
		const ore = ware('ore')!;
		const miner = miners([]).miner('ore')!;
		expect(miner.size).toBe(Size.large);
		expect(Mining.canMine(miner, ore)).toBe(true);
		const value = (x: typeof miner) => Mining.minerCapacity(x, ore) / x.price.avg;
		const others = Mining.minersFor(ships, ore).filter((x) => x.size === Size.large && x.price.avg > 0);
		expect(others.every((x) => value(x) <= value(miner))).toBe(true);
		expect(miners([]).miner(ENERGY)).toBeUndefined();
	});

	it('needs more miners the farther the field, and prices them by the hull', () => {
		const here = miners(['a']).needs('a', [{ ware: 'ore', amount: 10000 }])[0];
		const far = miners(['a']).needs('c', [{ ware: 'ore', amount: 10000 }])[0];
		expect(here).toMatchObject({ ware: 'ore', field: 'a' });
		expect(here.count).toBeGreaterThan(0);
		expect(far.count).toBeGreaterThan(here.count);
		expect(far.cost).toBeCloseTo(far.count * ships.find((x) => x.id === far.miner)!.price.avg);
		// twice the ore takes twice the miners: costs stay linear in the modules
		expect(miners(['a']).needs('c', [{ ware: 'ore', amount: 20000 }])[0].count).toBeCloseTo(2 * far.count);
	});

	it('counts the miners as infinite without a reachable field, and none without a ship list', () => {
		expect(miners(['x']).needs('a', [{ ware: 'ore', amount: 100 }])[0].cost).toBe(Infinity);
		expect(miners([]).needs('a', [{ ware: 'ore', amount: 100 }])[0].field).toBeUndefined();
		const none = new PlacementMiners([], EconomyTesting.SECTORS, ware, () => ['a']);
		expect(none.needs('a', [{ ware: 'ore', amount: 100 }])).toEqual([]);
		expect(PlacementMiners.cost([])).toBe(0);
	});

	it('adds the miners of a closed-loop chain to its build cost', () => {
		const priced = PlacementScorer.spot(world(), 'refinedmetals', 'c', CLOSED)!;
		const bare = PlacementScorer.spot(world(false), 'refinedmetals', 'c', CLOSED)!;
		expect(priced.miners.map((x) => x.ware)).toContain('ore');
		expect(priced.minerCost).toBeGreaterThan(0);
		expect(priced.buildCost).toBeCloseTo(bare.buildCost + priced.minerCost);
		expect(priced.payback).toBeGreaterThan(bare.payback);
		expect(priced.score).toBe(bare.score);
		expect(bare.miners).toEqual([]);
	});
});

describe('the rank option', () => {
	it('ranks by the score, the Cr per hour or the payback', () => {
		const context = world();
		for (const rank of ['score', 'income', 'payback'] as const) {
			const spots = PlacementRanking.where(context, context.candidates(), { ...CLOSED, rank }).spots;
			expect(spots.length).toBeGreaterThan(1);
			const values = spots.map((x) => PlacementRanking.value(x, rank));
			expect(values).toEqual([...values].sort((a, b) => b - a));
		}
		const spot = PlacementScorer.spot(context, ENERGY, 'c', CLOSED)!;
		expect(PlacementRanking.value(spot)).toBe(spot.score);
		expect(PlacementRanking.value(spot, 'income')).toBe(spot.crPerHour);
		expect(PlacementRanking.value(spot, 'payback')).toBeCloseTo(1 / spot.payback);
	});
});
