import { ModuleWorker, Production, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { ProductionMethods } from '../../shared/services/data/production-method-data';
import { Workers } from '../../shared/services/data/workers-data';
import { Effects } from '../../shared/services/data/effects-data';

export interface StationResourceItemModel {
  ware: Ware;
  count: number;
  amount: number;
  efficiency: number;
  name: string;
  total: number;
}

export interface StationResourceModel {
  ware: Ware;
  amount: number;
  items: StationResourceItemModel[];
  expanded?: boolean;
}

export interface WareGroupModel {
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
  production: { amount: number, ware: Ware, value: Production };

  private _count: number;
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

  get count() {
    return this._count;
  }

  set count(value: number) {
    if (value != this._count) {
      this._count = value;
      this.update();
    }
  }

  private update() {
    if (!this._moduleId) {
      this.module = null;
      this.production = null;
      this.needs = [];
    } else {
      this.module = this.moduleService.getEntity(this.moduleId);
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

        this.production = { amount: currentProd.amount * cycles, ware: ware, value: currentProd };
        currentProd.wares
          .forEach(x => {
            const neededWare = this.wareService.getEntity(x.ware);
            this.needs.push({ amount: x.amount * cycles, ware: neededWare });
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

export class ResourceCalculator {
  static calculate(modules: StationModuleModel[], totalWorkforce: number, totalWorkforceCapacity: number) {
    let multiplier = (totalWorkforceCapacity == 0 || totalWorkforce == 0) ? 0 : (totalWorkforceCapacity / totalWorkforce);
    if (multiplier > 1) {
      multiplier = 1;
    }

    let data = {};
    if (modules.length > 0) {
      data = modules
        .map<WareProductionData[]>(x => {
          const values: StationResourceItemModel[] = x.needs.map(y => {
            return {
              ware: y.ware,
              count: x.count,
              amount: -y.amount,
              efficiency: 100,
              name: x.module.name,
              total: x.count * -y.amount
            };
          });

          if (x.production) {
            const effect = x.production.value.effects ? x.production.value.effects.find(e => e.type == Effects.work) : null;
            const efficiency = effect == null ? 1 : (1 + effect.product * multiplier);

            values.push({
              ware: x.production.ware,
              count: x.count,
              amount: x.production.amount,
              efficiency: efficiency * 100,
              name: x.module.name,
              total: x.count * x.production.amount * efficiency
            });
          }

          return values;
        })
        .reduce((a, b) => {
          return a.concat(b);
        })
        .reduce(function (obj, item) {
          obj[item.ware.id] = obj[item.ware.id] || [];
          obj[item.ware.id].push(item);
          return obj;
        }, {});
    }

    const resources: StationResourceModel[] = [];

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        const values = <WareProductionData[]>data[prop];

        let sum = 0;
        values.forEach(x => {
          sum += x.total;
        });

        resources.push({
          ware: values[0].ware,
          amount: sum,
          items: values
        });
      }
    }

    return resources;
  }
}
