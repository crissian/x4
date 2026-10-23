import { ModuleTypes } from '../shared/services/data/module-types-data';
import { ProductionMethods } from '../shared/services/data/production-method-data';
import type { Production, StationModule, Ware } from '../shared/services/model/model';
import type { ModuleService } from '../shared/services/module.service';
import type { WareService } from '../shared/services/ware.service';
import { StationModuleModel } from '../station/components/station-calculator.model';

/** A production method a chain can prefer, with its display name. */
export interface ChainMethodOption {
	id: string;
	name: string;
}

/**
 * The recipes of a production chain: which production method a ware is made with, the module making it that way
 * and what one such module makes per hour (the station calculator's numbers, without workforce bonus and at full
 * sunlight). Module lookups are cached.
 */
export class ChainRecipes {
	private readonly moduleCache = new Map<string, StationModule | undefined>();
	private readonly outputCache = new Map<string, number>();

	constructor(
		private readonly wares: WareService,
		private readonly modules: ModuleService
	) {}

	/**
	 * The production the ware is made with: the overriding method, else the preferred one, else the default,
	 * else any but recycling, else the only one. Undefined for a ware nobody makes (a raw resource).
	 */
	static pick(ware: Ware, preferred: string, override?: string): Production | undefined {
		const productions = ware.production ?? [];
		const byMethod = (method?: string) => (method ? productions.find((x) => x.method === method) : undefined);
		return (
			byMethod(override) ??
			byMethod(preferred) ??
			byMethod(ProductionMethods.default) ??
			productions.find((x) => x.method !== ProductionMethods.recycling) ??
			productions[0]
		);
	}

	/** The production method the module makes the ware with (the calculator's choice: its queued method, else the default). */
	static methodOf(module: StationModule, ware: Ware): string {
		if (module.type === ModuleTypes.processingmodule) {
			return ProductionMethods.processing;
		}
		const queued = module.queue?.find((x) => x.ware.id === ware.id)?.method;
		return ware.production?.some((x) => x.method === queued) ? queued! : ProductionMethods.default;
	}

	/** The methods a chain can prefer, in data order: the default one first, processing left out (scrap has no other). */
	static methodOptions(wares: readonly Ware[], defaultName: string): ChainMethodOption[] {
		const result: ChainMethodOption[] = [{ id: ProductionMethods.default, name: defaultName }];
		for (const production of wares.flatMap((x) => x.production ?? [])) {
			if (production.method !== ProductionMethods.processing && !result.some((x) => x.id === production.method)) {
				result.push({ id: production.method, name: production.name });
			}
		}
		return result;
	}

	/** The module making the ware with the method; one without maker race when there are several. */
	module(ware: Ware, method: string): StationModule | undefined {
		const key = `${ware.id}|${method}`;
		if (!this.moduleCache.has(key)) {
			const candidates = this.modules
				.getEntities()
				.filter((x) => ChainRecipes.makes(x, ware.id) && ChainRecipes.methodOf(x, ware) === method);
			this.moduleCache.set(key, candidates.find((x) => !x.makerRace) ?? candidates[0]);
		}
		return this.moduleCache.get(key);
	}

	/** Units of the ware one module makes per hour, the recipe's own rate when no module makes it that way. */
	output(ware: Ware, production: Production, module: StationModule | undefined): number {
		const key = `${ware.id}|${production.method}|${module?.id ?? ''}`;
		let result = this.outputCache.get(key);
		if (result === undefined) {
			const made = module
				? new StationModuleModel(this.wares, this.modules, module.id, 1).production?.find(
						(x) => x.ware.id === ware.id
					)?.amount
				: undefined;
			result = made || (production.amount * 3600) / production.time;
			this.outputCache.set(key, result);
		}
		return result;
	}

	private static makes(module: StationModule, ware: string): boolean {
		return module.type === ModuleTypes.processingmodule
			? (module.processing?.some((x) => x.ware.id === ware) ?? false)
			: module.type === ModuleTypes.production && (module.product?.some((x) => x.id === ware) ?? false);
	}
}
