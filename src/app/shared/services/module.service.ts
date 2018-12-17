import { Injectable } from '@angular/core';
import { AllModules } from './data/modules-data';
import { ModuleTypes } from './data/module-types-data';
import { StationModule } from './model/model';

@Injectable()
export class ModuleService {
  getProductionModules(): StationModule {
    return AllModules
      .filter(x => x.type === ModuleTypes.production);
  }
}
