import { Component, Input, OnInit } from '@angular/core';
import { StationModuleModel, StationResourceItemModel, StationResourceModel, WareProductionData } from './station-calculator.model';
import { Effects } from '../../shared/services/data/effects-data';
import { WareService } from '../../shared/services/ware.service';

@Component({
  selector: 'app-station-resources',
  templateUrl: './station-resources.component.html'
})
export class StationResourcesComponent implements OnInit {
  private expandState: { [resourceId: number]: boolean } = {};
  private _modules: StationModuleModel[];

  totalWorkforce = 0;
  totalWorkforceCapacity = 0;
  resources: StationResourceModel[] = [];

  constructor(private wareService: WareService) {
  }

  get modules() {
    return this._modules;
  }

  @Input()
  set modules(value: StationModuleModel[]) {
    this._modules = value;
    this.update();
  }

  ngOnInit(): void {
  }

  toggleExpanded(item: any) {
    item.expanded = !item.expanded;
    this.expandState[item.ware.id] = item.expanded;
  }

  update() {
    this.totalWorkforce = 0;
    this.totalWorkforceCapacity = 0;

    if (this.modules == null) {
      return;
    }

    this.modules.forEach(item => {
      if (item.module != null && item.module.workForce != null) {
        if (item.module.workForce.max != null) {
          this.totalWorkforce += item.count * item.module.workForce.max;
        }
        if (item.module.workForce.capacity != null) {
          this.totalWorkforceCapacity += item.count * item.module.workForce.capacity;
        }
      }
    });

    let multiplier = (this.totalWorkforceCapacity == 0 || this.totalWorkforce == 0) ? 0 : (this.totalWorkforceCapacity / this.totalWorkforce);
    if (multiplier > 1) {
      multiplier = 1;
    }

    let data = {};
    if (this.modules.length > 0) {
      data = this.modules
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

    this.resources = [];

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        const values = <WareProductionData[]>data[prop];

        let sum = 0;
        values.forEach(x => {
          sum += x.total;
        });

        this.resources.push({
          ware: values[0].ware,
          amount: sum,
          items: values,
          expanded: this.expandState[values[0].ware.id]
        });
      }
    }

    this.resources.sort((a, b) => this.wareService.compareWares(a.ware, b.ware));
  }
}
