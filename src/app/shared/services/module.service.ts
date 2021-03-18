import { Injectable } from '@angular/core';
import { AllModules, Modules } from './data/modules-data';
import { StationModule } from './model/model';
import { EntityService } from './entity.service';

@Injectable()
export class ModuleService implements EntityService<StationModule> {
   getModulesByType(moduleType: string): StationModule[] {
      return this.getEntities()
         .filter(x => x.type == moduleType);
   }

   getEntity(id: string): StationModule {
      return Modules[id];
   }

   getModulesByMacro(macro: string) {
      return this.getEntities()
         .filter(x => x.macro === macro);
   }

   getModuleByWare(wareId: string, productionMethod: string = 'default'): StationModule {
      if (productionMethod === 'default') {
         let module = this.getEntities()
            .find(x => x.product != null && x.product.id == wareId && x.makerRace == null);
         if (module == null) {
            module = this.getEntities()
               .find(x => x.product != null && x.product.id == wareId);
         }
         return module;
      } else {
         return this.getEntities()
            .find(x => x.product != null && x.product.id == wareId && x.makerRace != null && x.makerRace.id == productionMethod);
      }
   }

   getEntities(): StationModule[] {
      return AllModules;
   }

   getModulesUsingWare(wareId: any) {
      return AllModules
         .filter(x => this.isUsing(x, wareId));
   }

   private isUsing(module: StationModule, wareId: string) {
      for (let i = 0; i < module.production.length; i++) {
         const production = module.production[i];
         if (production.wares.find(y => y.ware == wareId) != null) {
            return true;
         }
      }

      return false;
   }
}
