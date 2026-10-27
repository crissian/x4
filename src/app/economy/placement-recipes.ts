import { Effects } from '../shared/services/data/effects-data';
import { ModuleTypes } from '../shared/services/data/module-types-data';
import { ProductionMethods } from '../shared/services/data/production-method-data';
import type { StationModule } from '../shared/services/model/model';
import type { ModuleService } from '../shared/services/module.service';
import type { WareService } from '../shared/services/ware.service';
import { StationCalculatorModel, StationModuleModel } from '../station/components/station-calculator.model';
import { PlacementChains } from './placement-chain';
import { PlacementCosts } from './placement-costs';
import { WareClasses } from './ware-classes';

/** What one production module of a ware makes and needs per hour, at full workforce and full sunlight. */
export interface PlacementRecipe {
	ware: string;
	/** the module the numbers are for */
	module: string;
	/** units per hour */
	output: number;
	/** input units per hour */
	inputs: { ware: string; amount: number }[];
	/** the module's output scales with the sector sunlight (energy cells) */
	solar: boolean;
}

/**
 * One production module per ware, with the station calculator maths (`StationModuleModel` and the workforce
 * bonus of `StationCalculatorModel.amountPerCycle`): the module that queues the ware with the default production
 * method, else the first that makes it. Recyclers and modules making several wares are left out. Cached per ware.
 */
export class PlacementRecipes {
	static readonly ENERGY = 'energycells';

	private readonly byWare = new Map<string, PlacementRecipe | undefined>();
	private modulesByWare?: Map<string, StationModule[]>;
	private chainCache?: PlacementChains;
	private costCache?: PlacementCosts;

	constructor(
		private readonly wares: WareService,
		private readonly modules: ModuleService
	) {}

	/** The closed-loop chains, with the mined wares left to the player's miners. */
	get chains(): PlacementChains {
		this.chainCache ??= new PlacementChains(this.wares, this.modules, (id) => {
			const ware = this.wares.getEntity(id);
			return !!ware && WareClasses.isMined(ware);
		});
		return this.chainCache;
	}

	/** The build costs of the suggested stations, at average prices. */
	get costs(): PlacementCosts {
		this.costCache ??= new PlacementCosts(
			this.modules,
			() => this.chains,
			(id) => this.wares.getEntity(id)?.price.avg ?? 0,
			(id) => !!this.modules.getEntity(id)?.product?.some((x) => x.id === PlacementRecipes.ENERGY)
		);
		return this.costCache;
	}

	recipe(ware: string): PlacementRecipe | undefined {
		if (!this.byWare.has(ware)) {
			this.byWare.set(ware, this.build(ware));
		}
		return this.byWare.get(ware);
	}

	/** Output per hour of one module in a sector with the given sunlight (1 = 100%). */
	static output(recipe: PlacementRecipe, sunlight: number): number {
		return recipe.solar ? recipe.output * sunlight : recipe.output;
	}

	/** Input cost per unit made at the given prices; the inputs don't change with the sunlight, the output does. */
	static inputCost(recipe: PlacementRecipe, sunlight: number, price: (ware: string) => number): number {
		const output = PlacementRecipes.output(recipe, sunlight);
		const cost = recipe.inputs.reduce((sum, x) => sum + x.amount * price(x.ware), 0);
		return output > 0 ? cost / output : Infinity;
	}

	private build(ware: string): PlacementRecipe | undefined {
		const candidates = this.producers().get(ware) ?? [];
		const module =
			candidates.find(
				(x) =>
					(x.queue?.find((y) => y.ware.id === ware)?.method ?? ProductionMethods.default) ===
					ProductionMethods.default
			) ?? candidates[0];
		if (!module) {
			return undefined;
		}
		const model = new StationModuleModel(this.wares, this.modules, module.id, 1);
		const production = model.production?.find((x) => x.ware.id === ware);
		if (!production || production.amount <= 0) {
			return undefined;
		}
		const perCycle = production.value.amount;
		const effect = production.value.effects?.find((x) => x.type === Effects.work);
		const efficiency = effect ? StationCalculatorModel.amountPerCycle(perCycle, effect.product) / perCycle : 1;
		return {
			ware,
			module: module.id,
			output: production.amount * efficiency,
			inputs: model.needs.map((x) => ({ ware: x.ware.id, amount: x.amount })),
			solar: ware === PlacementRecipes.ENERGY,
		};
	}

	/** Production modules making exactly one ware, by that ware. */
	private producers(): Map<string, StationModule[]> {
		if (!this.modulesByWare) {
			this.modulesByWare = new Map();
			for (const module of this.modules.getEntities()) {
				if (
					module.type !== ModuleTypes.production ||
					module.product?.length !== 1 ||
					StationCalculatorModel.isRecycler(module)
				) {
					continue;
				}
				const id = module.product[0].id;
				this.modulesByWare.set(id, [...(this.modulesByWare.get(id) ?? []), module]);
			}
		}
		return this.modulesByWare;
	}
}
