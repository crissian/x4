import { describe, expect, it } from 'vitest';
import type { SaveRelations, SaveStation } from '../savegame/map/save-map-model';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import type { Sector } from '../shared/services/model/model';
import { EconomyTesting } from './economy-testing';
import { PlacementContext } from './placement-context';
import type { PlacementOptions } from './placement-model';
import { PlacementRanking } from './placement-ranking';
import { PlacementRecipes } from './placement-recipes';
import { PlacementScorer } from './placement-scorer';
import { StationAutofill } from '../station/components/station-autofill';

const ENERGY = 'energycells';
const HULL = 'hullparts';
const OPTIONS: PlacementOptions = { loop: 'open', jumps: 3, hideHostile: true, includePlayer: true };
const CLOSED: PlacementOptions = { ...OPTIONS, loop: 'closed' };

/** Hull parts factories in c, with `count` modules each: they use energy cells, graphene and refined metals. */
function context(
	stations: SaveStation[],
	relations?: SaveRelations,
	owners: Record<string, string> = {},
	sectors: readonly Sector[] = EconomyTesting.SECTORS
) {
	const economy = EconomyTesting.economy(stations);
	const recipes = new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules);
	const map = TradeRouteTesting.map(stations, owners);
	return new PlacementContext(economy, EconomyTesting.wares, recipes, sectors, map, relations);
}

/** The test sectors with an ore field in a. */
function withOre(): Sector[] {
	return EconomyTesting.SECTORS.map((x) =>
		x.id === 'a' ? { ...x, resources: [{ ware: 'ore' } as Sector['resources'][number]] } : x
	);
}

function hull(code: string, sector: string, count: number): SaveStation {
	return EconomyTesting.station(code, sector, { modules: [EconomyTesting.HULL_PARTS], moduleCounts: [count] });
}

describe('PlacementScorer', () => {
	it('weighs the sectors linearly by jumps', () => {
		expect([0, 1, 2, 3].map((x) => PlacementScorer.weight(x, 3))).toEqual([1, 0.75, 0.5, 0.25]);
		expect(PlacementScorer.weight(1, 1)).toBe(0.5);
	});

	it('has the inputs and resources factor', () => {
		expect(PlacementScorer.factor(0)).toBe(0.5);
		expect(PlacementScorer.factor(1)).toBe(1);
	});

	it('works out one energy module at full workforce with the sunlight', () => {
		const recipes = new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules);
		const recipe = recipes.recipe(ENERGY)!;
		expect(recipe.output).toBeGreaterThan(0);
		expect(PlacementRecipes.output(recipe, 0.5)).toBeCloseTo(recipe.output / 2);
		expect(recipes.recipe('ore')).toBeUndefined();
	});

	it('takes the weighted shortage left after the existing supply as absorbable', () => {
		const targets = [
			{ sector: 'a', jumps: 0, weight: 1, net: -100, left: 40, pull: 40 },
			{ sector: 'b', jumps: 2, weight: 0.5, net: 60, left: 0, pull: 0 },
			{ sector: 'c', jumps: 2, weight: 0.5, net: -20, left: 20, pull: 10 },
		];
		expect(PlacementScorer.absorbable(targets)).toBe(50);
		expect(PlacementScorer.absorbable([targets[1]])).toBe(0);
	});

	it('settles a nearby surplus before scoring the spots around it', () => {
		// energy cells made in a, one jump from b and two from the hull parts factories in c
		const energy = EconomyTesting.station('E', 'a', { modules: [EconomyTesting.ENERGY], moduleCounts: [2] });
		const world = context([hull('H', 'c', 400), energy]);
		const own = world.localNet(ENERGY, OPTIONS);
		const left = world.residual(ENERGY, OPTIONS).get('c') ?? 0;
		expect(left).toBeCloseTo(-(own.get('c') ?? 0) - (own.get('a') ?? 0));
		const spot = PlacementScorer.spot(world, ENERGY, 'c', OPTIONS)!;
		expect(spot.absorbable).toBeCloseTo(left);
		const a = spot.targets.find((x) => x.sector === 'a')!;
		expect(a).toMatchObject({ jumps: 2, left: 0, pull: 0 });
	});

	it('scores a spot by the modules the reach has room for', () => {
		const world = context([hull('H', 'c', 400)]);
		const recipe = world.recipes.recipe(ENERGY)!;
		const short = -(world.localNet(ENERGY, OPTIONS).get('c') ?? 0);
		const spot = PlacementScorer.spot(world, ENERGY, 'c', OPTIONS)!;
		expect(spot.absorbable).toBeCloseTo(short);
		expect(spot.modules).toBe(Math.floor(short / recipe.output));
		expect(spot.crPerHour).toBeCloseTo(spot.modules * recipe.output * spot.margin);
		expect(spot.coverage).toBe(1);
		// one jump away the shortage counts 75%; b has half the sunlight, so a module there makes half as much
		const next = PlacementScorer.spot(world, ENERGY, 'b', OPTIONS)!;
		expect(next.absorbable).toBeCloseTo(short * 0.75);
		expect(next.moduleOutput).toBeCloseTo(recipe.output / 2);
	});

	it('counts an input in reach only when it is made there and not short', () => {
		const world = context([hull('H', 'c', 400)]);
		const inputs = PlacementScorer.inputs(world, HULL, 'c', OPTIONS);
		expect(inputs.map((x) => x.ware).sort()).toEqual(['energycells', 'graphene', 'refinedmetals']);
		expect(inputs.every((x) => !x.covered)).toBe(true);
		expect(PlacementScorer.coverage(inputs)).toBe(0);
	});

	it('leaves the stations of hostile factions out of the demand and the supply when asked', () => {
		const xenon = (station: SaveStation): SaveStation => ({ ...station, owner: 'xenon' });
		const relations = { xenon: -1 };
		// a shortage held only by hostile stations gives no spot
		const demand = context([xenon(hull('H', 'c', 400))], relations);
		expect(PlacementScorer.spot(demand, ENERGY, 'c', OPTIONS)).toBeUndefined();
		expect(PlacementScorer.spot(demand, ENERGY, 'c', { ...OPTIONS, hideHostile: false })).toBeDefined();
		// a hostile surplus nearby does not supply the shortage
		const energy = EconomyTesting.station('E', 'b', { modules: [EconomyTesting.ENERGY], moduleCounts: [2] });
		const supply = context([hull('H', 'c', 400), xenon(energy)], relations);
		const short = -(supply.localNet(ENERGY, OPTIONS).get('c') ?? 0);
		expect(supply.localNet(ENERGY, OPTIONS).has('b')).toBe(false);
		expect(supply.residual(ENERGY, OPTIONS).get('c')).toBeCloseTo(short);
		expect(supply.residual(ENERGY, { ...OPTIONS, hideHostile: false }).get('c')).toBeLessThan(short);
	});

	it('leaves out hostile sectors when asked, and sectors whose owner bans the ware', () => {
		const world = context([hull('H', 'c', 400)], { xenon: -1 }, { c: 'xenon' });
		expect(PlacementScorer.spot(world, ENERGY, 'c', OPTIONS)).toBeUndefined();
		expect(PlacementScorer.spot(world, ENERGY, 'c', { ...OPTIONS, hideHostile: false })).toBeDefined();
		const banned = EconomyTesting.wares.getEntities().find((x) => x.illegal?.length)!;
		const owner = banned.illegal![0].id;
		expect(context([], {}, { a: owner }).illegal(banned.id, 'a')).toBe(true);
	});
});

describe('PlacementRanking', () => {
	it('shares the demand between the spots of a ware', () => {
		const world = context([hull('H', 'c', 400)]);
		const short = -(world.localNet(ENERGY, OPTIONS).get('c') ?? 0);
		const spots = PlacementRanking.greedy(world, ENERGY, OPTIONS);
		expect(spots[0].sector).toBe('c');
		const sold = spots.reduce((sum, x) => sum + x.modules * x.moduleOutput, 0);
		expect(sold).toBeLessThanOrEqual(short + 1e-6);
		// on its own, b would count the same shortage again
		expect(PlacementRanking.spots(world, ENERGY, OPTIONS).has('b')).toBe(true);
	});

	it('ranks the wares of one sector and lists none where nothing is short', () => {
		const world = context([hull('H', 'c', 400)]);
		const here = PlacementRanking.here(world, 'c', world.candidates(), OPTIONS);
		expect(here.spots.map((x) => x.ware)).toContain(ENERGY);
		expect(here.spots[0].score).toBeGreaterThanOrEqual(here.spots.at(-1)!.score);
		expect(PlacementRanking.here(world, 'x', world.candidates(), OPTIONS).total).toBe(0);
	});
});

describe('closed loop', () => {
	const recipes = () => new PlacementRecipes(EconomyTesting.wares, EconomyTesting.modules);

	it('fills the chain like the calculator autofill, leaving the mined wares short', () => {
		const recipe = recipes().recipe(HULL)!;
		const chain = recipes().chains.chain(recipe.module, 2, 1);
		expect(chain.modules[0]).toEqual({ moduleId: recipe.module, count: 2 });
		const made = chain.modules.map((x) => EconomyTesting.modules.getEntity(x.moduleId)?.product?.[0].id);
		expect(made).toEqual(expect.arrayContaining([ENERGY, 'graphene', 'refinedmetals']));
		expect(chain.mined.map((x) => x.ware)).toContain('ore');
		expect(chain.missing).toEqual([]);
		expect(chain.workforce).toBeGreaterThan(0);
		const rows = StationAutofill.fill(EconomyTesting.wares, EconomyTesting.modules, chain.modules, 100, 0);
		expect(rows).toEqual(chain.modules);
	});

	it('sells at the average price and weighs the resources by distance', () => {
		const world = context([hull('H', 'c', 400)], undefined, {}, withOre());
		const spot = PlacementScorer.spot(world, ENERGY, 'c', CLOSED)!;
		expect(spot.margin).toBe(world.price(ENERGY));
		expect(spot.inputs).toEqual([]);
		const metals = PlacementScorer.resources(world, 'refinedmetals', 'c', CLOSED);
		expect(metals.find((x) => x.ware === 'ore')).toEqual({ ware: 'ore', jumps: 2, weight: 0.5 });
		expect(
			PlacementScorer.resourceCoverage([
				{ ware: 'ore', jumps: 2, weight: 0.5 },
				{ ware: 'ice', weight: 0 },
			])
		).toBe(0.25);
	});

	it('ranks by score', () => {
		const world = context([hull('H', 'c', 400)], undefined, {}, withOre());
		const spots = PlacementRanking.where(world, world.candidates(), CLOSED).spots;
		expect(spots.length).toBeGreaterThan(0);
		spots.slice(1).forEach((x, i) => expect(x.score).toBeLessThanOrEqual(spots[i].score));
	});
});
