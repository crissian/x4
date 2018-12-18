import { Injectable } from '@angular/core';
import { AllModules, Modules } from './data/modules-data';
import { ModuleTypes } from './data/module-types-data';
import { StationModule } from './model/model';

@Injectable()
export class ModuleService {
  getProductionModules(): StationModule[] {
    return this.allModules
      .filter(x => x.type === ModuleTypes.production);
  }

  // noinspection JSMethodCanBeStatic
  getModule(id: string): StationModule {
    return Modules[id];
  }

  getModuleByWare(wareId: string, productionMethod: string = 'default'): StationModule {
    if (productionMethod === 'default') {
      let module = this.allModules
        .find(x => x.product != null && x.product.id == wareId && x.makerRace == null);
      if (module == null) {
        module = this.allModules
          .find(x => x.product != null && x.product.id == wareId);
      }
      return module;
    } else {
      return this.allModules
        .find(x => x.product != null && x.product.id == wareId && x.makerRace != null && x.makerRace.id == productionMethod);
    }
  }

  get allModules(): StationModule[] {
    return AllModules;
  }
}
