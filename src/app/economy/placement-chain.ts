import { ModuleTypes } from '../shared/services/data/module-types-data';
import type { ModuleService } from '../shared/services/module.service';
import type { WareService } from '../shared/services/ware.service';
import { ModuleRow, ResourceCalculator, StationModuleModel } from '../station/components/station-calculator.model';

/** A closed-loop station: the end-product modules and the production chain the autofill adds for them. */
export interface PlacementChain {
	/** module id and count, the end-product modules first */
	modules: ModuleRow[];
	/** the mined wares the chain needs, per hour, brought by the player's own miners */
	mined: { ware: string; amount: number }[];
	/** the short wares no production module makes and that are not mined */
	missing: string[];
	/** workers the modules need at full workforce */
	workforce: number;
}

/**
 * Closed-loop stations sized like the station calculator's "Autofill Modules": N end-product modules, then the
 * modules for every ware the station is short of, until only the mined wares are left. Cached per ware, count and
 * sunlight. `fill` is the calculator's autofill algorithm, kept here as a pure static method.
 */
export class PlacementChains {
	private readonly cache = new Map<string, PlacementChain>();

	constructor(
		private readonly wares: WareService,
		private readonly modules: ModuleService,
		private readonly isMined: (ware: string) => boolean
	) {}

	/**
	 * The closed-loop station of `count` modules of `module`.
	 * @param sunlight 1 = 100%
	 */
	chain(module: string, count: number, sunlight: number): PlacementChain {
		const key = `${module}|${count}|${sunlight}`;
		let result = this.cache.get(key);
		if (!result) {
			result = this.build(module, count, sunlight);
			this.cache.set(key, result);
		}
		return result;
	}

	/** The mined wares the chain of one module needs, whatever their amount. */
	minedWares(module: string): string[] {
		return this.chain(module, 1, 1).mined.map((x) => x.ware);
	}

	/**
	 * The rows with production modules added (or counted up) for each ware the station is short of, until no
	 * short ware has a module that makes it: the station calculator's "Autofill Modules". Wares without a
	 * production module, such as the mined ones, stay short. The rows passed in are not changed.
	 * @param sunlight in percent, 100 = full
	 * @param partialWorkforce the workers at work
	 */
	static fill(
		wares: WareService,
		modules: ModuleService,
		rows: readonly ModuleRow[],
		sunlight: number,
		partialWorkforce: number
	): ModuleRow[] {
		const result = rows.map((x) => ({ ...x }));
		const toModels = () =>
			result.map((x) => new StationModuleModel(wares, modules, x.moduleId, Number(x.count) || 0));
		const habitat = toModels().find((x) => x.module?.type === ModuleTypes.habitation);
		const method = habitat?.module?.makerRace?.id ?? 'default';

		let didChange = true;
		while (didChange) {
			didChange = false;
			for (const resource of ResourceCalculator.calculate(toModels(), sunlight, partialWorkforce)) {
				if (resource.amount >= 0) {
					continue;
				}
				const module =
					modules.getModuleByWare(resource.ware.id, method) || modules.getModuleByWare(resource.ware.id);
				if (module == null) {
					continue;
				}
				didChange = true;
				const productions = module.product?.find((x) => x.id == resource.ware.id)?.production ?? [];
				const production =
					productions.find((p) => p.method == method) || productions.find((p) => p.method == 'default');
				if (!production) {
					continue;
				}
				const count = Math.ceil(-resource.amount / (production.amount * (3600 / production.time)));
				const existing = result.find((m) => m.moduleId == module.id);
				if (existing == null) {
					result.push({ moduleId: module.id, count });
				} else {
					existing.count += count;
				}
			}
		}
		return result;
	}

	private build(module: string, count: number, sunlight: number): PlacementChain {
		// no habitat, so no workforce bonus: the calculator's sizing; the bonus only adds output, never inputs
		const rows = PlacementChains.fill(this.wares, this.modules, [{ moduleId: module, count }], sunlight * 100, 0);
		const models = rows.map((x) => new StationModuleModel(this.wares, this.modules, x.moduleId, x.count));
		const mined: PlacementChain['mined'] = [];
		const missing: string[] = [];
		for (const resource of ResourceCalculator.calculate(models, sunlight * 100, 0)) {
			if (resource.amount >= 0) {
				continue;
			}
			if (this.isMined(resource.ware.id)) {
				mined.push({ ware: resource.ware.id, amount: -resource.amount });
			} else {
				missing.push(resource.ware.id);
			}
		}
		mined.sort((a, b) => b.amount - a.amount);
		return {
			modules: rows,
			mined,
			missing,
			workforce: ResourceCalculator.calculateWorkforce(models).value,
		};
	}
}
