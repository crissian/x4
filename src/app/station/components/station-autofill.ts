import { ModuleTypes } from '../../shared/services/data/module-types-data';
import type { ModuleService } from '../../shared/services/module.service';
import type { WareService } from '../../shared/services/ware.service';
import { ModuleRow, ResourceCalculator, StationModuleModel } from './station-calculator.model';

/**
 * The station calculator's "Autofill Modules", shared with the station suggestions' closed-loop chains: production
 * modules are added (or counted up) for every ware the station is short of, until no short ware has a module that
 * makes it.
 */
export class StationAutofill {
	/** a guard against data that would keep adding modules forever */
	static readonly MAX_ROUNDS = 100;

	/**
	 * The rows with the production modules added. Wares without a production module, such as the mined ones, stay
	 * short. The rows passed in are not changed.
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
		for (let round = 0; didChange && round < StationAutofill.MAX_ROUNDS; round++) {
			didChange = false;
			for (const resource of ResourceCalculator.calculate(toModels(), sunlight, partialWorkforce)) {
				if (resource.amount >= 0) {
					continue;
				}
				const module =
					modules.getModuleByWare(resource.ware.id, method) || modules.getModuleByWare(resource.ware.id);
				const productions = module?.product?.find((x) => x.id == resource.ware.id)?.production ?? [];
				const production =
					productions.find((p) => p.method == method) || productions.find((p) => p.method == 'default');
				if (module == null || !production) {
					continue;
				}
				const count = Math.ceil(-resource.amount / (production.amount * (3600 / production.time)));
				if (!(count > 0)) {
					continue;
				}
				const existing = result.find((m) => m.moduleId == module.id);
				if (existing == null) {
					result.push({ moduleId: module.id, count });
				} else {
					existing.count = (Number(existing.count) || 0) + count;
				}
				didChange = true;
			}
		}
		return result;
	}
}
