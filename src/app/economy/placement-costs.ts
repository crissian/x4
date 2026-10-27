import type { ModuleService } from '../shared/services/module.service';
import { Production } from '../shared/services/production';
import type { PlacementChains } from './placement-chain';
import type { PlacementLoop } from './placement-model';
import type { PlacementRecipe } from './placement-recipes';

/**
 * What one end-product module of a ware costs to build, with its share of the closed-loop chain: the part the
 * sunlight doesn't change, and the energy cell modules of the chain, whose number goes with 1 / sunlight.
 */
export interface PlacementCost {
	/** Cr per end-product module */
	fixed: number;
	/** Cr per end-product module at 100% sunlight, divided by the sector sunlight */
	solar: number;
}

/**
 * The build cost of the suggested stations at average prices: the production modules only, no habitats, docks or
 * ships. A closed-loop chain is sized once per ware for `SAMPLE` end-product modules at 100% sunlight and shared out
 * per module, so the costs are linear in the module count, an estimate of what the calculator's autofill builds.
 */
export class PlacementCosts {
	/** End-product modules the chain share is worked out for, so the autofill rounding up spreads thin. */
	static readonly SAMPLE = 10;

	private readonly cache = new Map<string, PlacementCost>();

	constructor(
		private readonly modules: ModuleService,
		private readonly chains: () => PlacementChains,
		private readonly price: (ware: string) => number,
		private readonly solar: (module: string) => boolean
	) {}

	/** Cr to build `modules` end-product modules (and their chain) in a sector with the given sunlight (1 = 100%). */
	static total(cost: PlacementCost, modules: number, sunlight: number): number {
		return modules * PlacementCosts.perModule(cost, sunlight);
	}

	/** Cr per end-product module, with its share of the chain, at the given sunlight; infinite without sunlight. */
	static perModule(cost: PlacementCost, sunlight: number): number {
		if (!cost.solar) {
			return cost.fixed;
		}
		return sunlight > 0 ? cost.fixed + cost.solar / sunlight : Infinity;
	}

	/** The cost split of one end-product module of the recipe, cached per module and loop. */
	cost(recipe: PlacementRecipe, loop: PlacementLoop): PlacementCost {
		const key = `${recipe.module}|${loop}`;
		let result = this.cache.get(key);
		if (!result) {
			result = loop === 'closed' ? this.chainCost(recipe) : { fixed: this.module(recipe.module), solar: 0 };
			this.cache.set(key, result);
		}
		return result;
	}

	/** Cr of one module at average prices. */
	module(id: string): number {
		return Production.cost(this.modules.getEntity(id)?.production?.[0], this.price);
	}

	/** The end-product modules count fully: their number already follows the sunlight when they make energy cells. */
	private chainCost(recipe: PlacementRecipe): PlacementCost {
		const result: PlacementCost = { fixed: 0, solar: 0 };
		for (const row of this.chains().chain(recipe.module, PlacementCosts.SAMPLE, 1).modules) {
			const cost = (row.count * this.module(row.moduleId)) / PlacementCosts.SAMPLE;
			if (row.moduleId !== recipe.module && this.solar(row.moduleId)) {
				result.solar += cost;
			} else {
				result.fixed += cost;
			}
		}
		return result;
	}
}
