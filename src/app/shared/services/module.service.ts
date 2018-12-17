import { Injectable } from '@angular/core';
import { AllModules, Modules } from './data/modules-data';
import { ModuleTypes } from './data/module-types-data';
import { StationModule } from './model/model';

@Injectable()
export class ModuleService {
  getProductionModules(): StationModule[] {
    return AllModules
      .filter(x => x.type === ModuleTypes.production);
  }

  // noinspection JSMethodCanBeStatic
  getModule(id: string): StationModule {
    return Modules[id];
  }
}
