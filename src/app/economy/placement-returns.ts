import type { PlacementContext } from './placement-context';
import { type PlacementCost, PlacementCosts } from './placement-costs';
import type { PlacementLoop } from './placement-model';
import { type PlacementRecipe, PlacementRecipes } from './placement-recipes';

/**
 * What a suggested factory earns for what it costs: the margin per unit, the payback of a module and how the sector
 * sunlight compares with 100%. Pure maths over the recipe and the build cost.
 */
export class PlacementReturns {
	/** The sunlight the efficiency is measured against, 1 = 100%; brighter sectors don't score above it. */
	static readonly REFERENCE_SUNLIGHT = 1;

	/**
	 * Cr per unit sold at the given sunlight (1 = 100%): the average price in a closed loop, which makes its own
	 * inputs; the price less the inputs at average prices when they are bought.
	 */
	static margin(context: PlacementContext, recipe: PlacementRecipe, loop: PlacementLoop, sunlight: number): number {
		const price = context.price(recipe.ware);
		return loop === 'closed'
			? price
			: price - PlacementRecipes.inputCost(recipe, sunlight, (x) => context.price(x));
	}

	/**
	 * Hours one end-product module, with its share of the chain, takes to earn its build cost when it sells all it
	 * makes; infinite when it earns nothing. Doesn't depend on the demand, only on the sunlight.
	 */
	static modulePayback(
		context: PlacementContext,
		recipe: PlacementRecipe,
		cost: PlacementCost,
		loop: PlacementLoop,
		sunlight: number
	): number {
		const earned =
			PlacementRecipes.output(recipe, sunlight) * PlacementReturns.margin(context, recipe, loop, sunlight);
		return earned > 0 ? PlacementCosts.perModule(cost, sunlight) / earned : Infinity;
	}

	/**
	 * The payback of a module at 100% sunlight over its payback at this sunlight, 0..1: 1 where the sunlight
	 * doesn't matter or is 100% or more, about 0.05 for energy cells at 5%. A fixed reference, not the sunniest
	 * sector: a few sectors such as Avarice (1390%) would otherwise mark down every other sector.
	 */
	static efficiency(
		context: PlacementContext,
		recipe: PlacementRecipe,
		cost: PlacementCost,
		loop: PlacementLoop,
		sunlight: number
	): number {
		const here = PlacementReturns.modulePayback(context, recipe, cost, loop, sunlight);
		const reference = PlacementReturns.modulePayback(
			context,
			recipe,
			cost,
			loop,
			PlacementReturns.REFERENCE_SUNLIGHT
		);
		return Number.isFinite(here) && here > 0 ? Math.min(1, reference / here) : 0;
	}

	/** Hours a station takes to earn its build cost; infinite when it earns nothing. */
	static payback(buildCost: number, crPerHour: number): number {
		return crPerHour > 0 ? buildCost / crPerHour : Infinity;
	}
}
