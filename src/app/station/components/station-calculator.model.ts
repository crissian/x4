import { ModuleWorker, Production, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { ProductionMethods } from '../../shared/services/data/production-method-data';
import { Workers } from '../../shared/services/data/workers-data';


export interface WareGroupData {
  name: string;
  modules: StationModule[];
}

export interface WareProductionData {
  ware: Ware;
  count: number;
  amount: number;
  efficiency: number;
  name: string;
  total: number;
}

export class StationModuleModel {
  module: StationModule;
  needs: { amount: number, ware: Ware }[];
  production: { amount: number, ware: Ware };
  count: number;

  private _moduleId: string;

  constructor(private wareService: WareService, private moduleService: ModuleService, moduleId: string = '', count: number = 1) {
    this.moduleId = moduleId;
    this.count = count;
  }

  get moduleId() {
    return this._moduleId;
  }

  set moduleId(value: string) {
    if (value != this._moduleId) {
      this._moduleId = value;
      this.update();
    }
  }

  private update() {
    if (!this._moduleId) {
      this.module = null;
      this.production = null;
      this.needs = [];
    } else {
      this.module = this.moduleService.getModule(this.moduleId);
      this.needs = [];
      this.production = null;

      if (this.module.type == ModuleTypes.production) {
        const ware = this.module.product;

        let currentProd: Production;
        if (this.module.makerRace == null) {
          currentProd = ware.production.find(x => x.method == ProductionMethods.default);
        } else {
          currentProd = ware.production.find(x => x.method == this.module.makerRace.id) ||
            ware.production.find(x => x.method == ProductionMethods.default);
        }

        // cycles per hour
        const cycles = 3600 / currentProd.time;

        this.production = {amount: currentProd.amount * cycles, ware: ware};
        currentProd.wares
          .forEach(x => {
            const neededWare = this.wareService.getWare(x.ware);
            this.needs.push({amount: x.amount * cycles, ware: neededWare});
          });
      } else if (this.module.type == ModuleTypes.habitation) {
        const capacity = this.module.workForce.capacity;
        const worker: ModuleWorker = Workers.get(this.module.workForce.race.id);

        worker.consumption.forEach(x => {
          this.needs.push({ amount: x.amount * capacity / worker.amount, ware: x.ware });
        });
      }
    }
  }
}
