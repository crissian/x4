import { Injectable } from '@angular/core';
import { AllModules } from './data/modules-data';
import { StationModule } from './model/model';
import { EntityStore } from './entity.service';

@Injectable({ providedIn: 'root' })
export class ModuleService extends EntityStore<StationModule> {
	constructor() {
		super(AllModules);
	}

	getModulesByType(moduleType: string): StationModule[] {
		return this.getEntities().filter((x) => x.type == moduleType);
	}

	getModulesByMacro(macro: string) {
		return this.getEntities().filter((x) => x.macro === macro);
	}

	getModuleByWare(wareId: string, productionMethod = 'default'): StationModule | undefined {
		if (productionMethod === 'default') {
			let module = this.getEntities().find(
				(x) => x.product != null && x.product.find((y) => y.id == wareId) != null && x.makerRace == null
			);

			if (module == null) {
				module = this.getEntities().find(
					(x) => x.product != null && x.product.find((y) => y.id == wareId) != null
				);
			}
			return module;
		} else {
			return this.getEntities().find(
				(x) =>
					x.product != null &&
					x.product.find((y) => y.id == wareId) != null &&
					x.makerRace != null &&
					x.makerRace.id == productionMethod
			);
		}
	}

	getModulesUsingWare(wareId: string): StationModule[] {
		return this.getEntities().filter((x) => EntityStore.usesWare(x, wareId));
	}
}
