import { MacroId } from '../core/macro-id';
import { ModuleTypes } from '../shared/services/data/module-types-data';
import { Workers } from '../shared/services/data/workers-data';
import type { Sector } from '../shared/services/model/model';
import type { ModuleService } from '../shared/services/module.service';
import type { WareService } from '../shared/services/ware.service';
import type { SaveStation } from '../savegame/map/save-map-model';
import { ResourceCalculator, StationModuleModel } from '../station/components/station-calculator.model';
import type { StationFlow, StationFlows } from './economy-model';

/**
 * Hourly flows of the stations of a save, at full input supply, with the station calculator maths: the workforce
 * bonus scales with the workers the station really has, energy cells with the sector sunlight, and habitats feed
 * the workers actually living there.
 */
export class StationFlowCalculator {
	private readonly sunlight = new Map<string, number>();
	private readonly models = new Map<string, StationModuleModel>();
	/** module ids by the macro id a save names them with */
	private readonly moduleByMacro = new Map<string, string>();

	constructor(
		private readonly wares: WareService,
		private readonly modules: ModuleService,
		sectors: readonly Sector[]
	) {
		for (const module of modules.getEntities()) {
			this.moduleByMacro.set(MacroId.of(module.macro), module.id);
		}
		for (const sector of sectors) {
			this.sunlight.set(sector.id, sector.sunlight ?? 1);
		}
	}

	/** Flows of every station that is up and running (construction sites and wrecks are left out). */
	all(stations: readonly SaveStation[]): StationFlows[] {
		return stations.filter((x) => !x.state).map((station) => ({ station, flows: this.flows(station) }));
	}

	flows(station: SaveStation): StationFlow[] {
		const byWare = new Map<string, StationFlow>();
		const flow = (ware: string) => {
			let item = byWare.get(ware);
			if (!item) {
				item = { ware, produced: 0, consumed: 0 };
				byWare.set(ware, item);
			}
			return item;
		};

		const workforce = Object.entries(station.workforce ?? {});
		const workers = workforce.reduce((sum, [, count]) => sum + count, 0);
		const models = station.modules.map((id, i) => this.model(id, station.moduleCounts?.[i] ?? 1));
		const sunlight = Math.round((this.sunlight.get(station.sector) ?? 1) * 100);

		for (const resource of ResourceCalculator.calculate(models, sunlight, workers)) {
			for (const item of resource.items) {
				// habitats are fed from the real workers below, not from their capacity
				if (item.type === ModuleTypes.habitation) {
					continue;
				}
				if (item.total > 0) {
					flow(item.ware.id).produced += item.total;
				} else if (item.total < 0) {
					flow(item.ware.id).consumed -= item.total;
				}
			}
		}

		for (const [race, count] of workforce) {
			if (count > 0 && Object.hasOwn(Workers, race)) {
				for (const need of StationModuleModel.workerNeeds(Workers.get(race), count)) {
					flow(need.ware.id).consumed += need.amount;
				}
			}
		}

		return [...byWare.values()];
	}

	private model(macroId: string, count: number): StationModuleModel {
		const key = `${macroId}*${count}`;
		let model = this.models.get(key);
		if (!model) {
			model = new StationModuleModel(this.wares, this.modules, this.moduleByMacro.get(macroId) ?? '', count);
			this.models.set(key, model);
		}
		return model;
	}
}
