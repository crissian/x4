import { Injectable } from '@angular/core';
import { Modules } from './data/modules-data';
import { ModuleTypes } from './data/module-types-data';

@Injectable()
export class ModuleService {
  getProductionModules() {
    return Modules.all
      .filter(x => x.type === ModuleTypes.production);
  }
}
