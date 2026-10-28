import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../savegame/map/save-map-model';
import { Production } from '../shared/services/production';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import { EconomyTesting } from './economy-testing';
import { PlacementContext } from './placement-context';
import { PlacementCosts } from './placement-costs';
import type { PlacementOptions } from './placement-model';
import { PlacementRanking } from './placement-ranking';
import { PlacementRecipes } from './placement-recipes';
import { PlacementReturns } from './placement-returns';
import { PlacementScorer } from './placement-scorer';

const ENERGY = 'energycells';
const HULL = 'hullparts';
const OPEN: PlacementOptions = { loop: 'open', jumps: 3, hideHostile: true, includePlayer: true };
const CLOSED: PlacementOptions = { ...OPEN, loop: 'closed' };

const recipes = () => new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules);
const price = (ware: string) => EconomyTesting.price(ware);

function hull(code: string, sector: string, count: number): SaveStation {
	return EconomyTesting.station(code, sector, { modules: [EconomyTesting.HULL_PARTS], moduleCounts: [count] });
}

/** The test sectors a <-> b <-> c with the sunlight of Gaian Prophecy, 1 and Pluto, and hull parts factories in c. */
function solarSystem(): PlacementContext {
	const sunlight: Record<string, number> = { a: 2.08, b: 1, c: 0.05 };
	const sectors = EconomyTesting.SECTORS.map((x) => ({ ...x, sunlight: sunlight[x.id] ?? 1 }));
	const stations = [hull('H', 'c', 400)];
	const economy = EconomyTesting.economy(stations);
	return new PlacementContext(
		economy,
		EconomyTesting.wares,
		recipes(),
		sectors,
		TradeRouteTesting.map(stations),
		undefined
	);
}

describe('PlacementCosts', () => {
	it('prices a module by its build recipe at average prices', () => {
		const all = recipes();
		const costs = all.costs;
		const module = EconomyTesting.modules.getEntity(all.recipe(HULL)!.module)!;
		expect(costs.module(module.id)).toBeGreaterThan(0);
		expect(costs.module(module.id)).toBeCloseTo(Production.cost(module.production[0], price));
		expect(costs.module('nothing')).toBe(0);
	});

	it('costs one module when the inputs are bought, whatever the sunlight', () => {
		const all = recipes();
		const recipe = all.recipe(HULL)!;
		const cost = all.costs.cost(recipe, 'open');
		expect(cost).toEqual({ fixed: all.costs.module(recipe.module), solar: 0 });
		expect(PlacementCosts.total(cost, 3, 0.05)).toBeCloseTo(3 * cost.fixed);
	});

	it('shares the closed-loop chain out per module, its energy cell modules divided by the sunlight', () => {
		const all = recipes();
		const recipe = all.recipe(HULL)!;
		const cost = all.costs.cost(recipe, 'closed');
		expect(cost.fixed).toBeGreaterThan(all.costs.module(recipe.module));
		expect(cost.solar).toBeGreaterThan(0);
		expect(PlacementCosts.perModule(cost, 0.5)).toBeCloseTo(cost.fixed + 2 * cost.solar);
		expect(PlacementCosts.perModule(cost, 0)).toBe(Infinity);
		expect(PlacementCosts.total(cost, 4, 1)).toBeCloseTo(4 * (cost.fixed + cost.solar));
	});

	it('counts the energy cell modules of an energy cell station fully: their number already follows the sunlight', () => {
		const all = recipes();
		const recipe = all.recipe(ENERGY)!;
		expect(all.costs.cost(recipe, 'closed')).toEqual({ fixed: all.costs.module(recipe.module), solar: 0 });
	});
});

describe('PlacementReturns', () => {
	it('pays a module back slower in the dark, measured against 100% sunlight', () => {
		const world = solarSystem();
		const recipe = world.recipes.recipe(ENERGY)!;
		const cost = world.recipes.costs.cost(recipe, 'closed');
		const full = PlacementReturns.modulePayback(world, recipe, cost, 'closed', 1);
		const dark = PlacementReturns.modulePayback(world, recipe, cost, 'closed', 0.05);
		expect(dark).toBeCloseTo(full / 0.05);
		expect(PlacementReturns.efficiency(world, recipe, cost, 'closed', 0.05)).toBeCloseTo(0.05);
		expect(PlacementReturns.efficiency(world, recipe, cost, 'closed', 0.5)).toBeCloseTo(0.5);
		// brighter sectors count as 100%, so a few very bright ones (Avarice, 1390%) don't mark the others down
		expect(PlacementReturns.efficiency(world, recipe, cost, 'closed', 1)).toBe(1);
		expect(PlacementReturns.efficiency(world, recipe, cost, 'closed', 13.9)).toBe(1);
	});

	it('marks a closed-loop chain down less than its energy cells: only their share of the cost grows', () => {
		const world = solarSystem();
		const recipe = world.recipes.recipe(HULL)!;
		const cost = world.recipes.costs.cost(recipe, 'closed');
		const efficiency = PlacementReturns.efficiency(world, recipe, cost, 'closed', 0.5);
		expect(efficiency).toBeCloseTo((cost.fixed + cost.solar) / (cost.fixed + 2 * cost.solar));
		expect(efficiency).toBeGreaterThan(0.5);
	});

	it('keeps the efficiency at 1 where the sunlight changes nothing', () => {
		const world = solarSystem();
		const recipe = world.recipes.recipe(HULL)!;
		const cost = world.recipes.costs.cost(recipe, 'open');
		expect(PlacementReturns.efficiency(world, recipe, cost, 'open', 0.05)).toBe(1);
	});

	it('works out the payback in hours', () => {
		expect(PlacementReturns.payback(1000, 250)).toBe(4);
		expect(PlacementReturns.payback(1000, 0)).toBe(Infinity);
	});
});

describe('the ranking with build costs', () => {
	it('scores a spot by its Cr per hour, resources factor and efficiency, and works out its payback', () => {
		const world = solarSystem();
		const spot = PlacementScorer.spot(world, ENERGY, 'c', CLOSED)!;
		expect(spot.sunlight).toBe(0.05);
		expect(spot.buildCost).toBeCloseTo(
			spot.modules * world.recipes.costs.module(world.recipes.recipe(ENERGY)!.module)
		);
		expect(spot.payback).toBeCloseTo(spot.buildCost / spot.crPerHour);
		expect(spot.score).toBeCloseTo(spot.crPerHour * PlacementScorer.factor(spot.coverage) * spot.efficiency);
	});

	it('suggests the energy cells for a dark sector in the sunny sector nearby, not in the dark one', () => {
		const world = solarSystem();
		const [best] = PlacementRanking.greedy(world, ENERGY, CLOSED);
		// b has full sunlight one jump from the demand; a is brighter still but two jumps away, and counts as 100%
		expect(best.sector).toBe('b');
		const dark = PlacementScorer.spot(world, ENERGY, 'c', CLOSED)!;
		// the dark spot sells more, but needs 20 times the modules per unit made
		expect(dark.crPerHour).toBeGreaterThan(best.crPerHour);
		expect(dark.modules).toBeGreaterThan(best.modules);
		expect(dark.payback).toBeCloseTo(best.payback * 20);
	});
});
