import { Component, Input } from '@angular/core';
import { ResourceCalculator, StationModuleModel, StationResourceModel } from './station-calculator.model';
import { WareService } from '../../shared/services/ware.service';
import { WareGroups } from '../../shared/services/data/ware-groups-data';

enum ResourcePriceType {
  expense,
  product
}

interface ResourcePricePercentage {
  resourcesPrice: number;
  productsPrice: number;
}

class ResourceSummaryModel {
  constructor(private model: StationResourceModel, private pricePercentage: ResourcePricePercentage,
              private priceType: ResourcePriceType,
              private warePrice: number = null) {
  }

  get name() {
    return this.model.ware.name;
  }

  get amount() {
    return this.model.amount;
  }

  get price() {
    if (this.warePrice != null) {
      return 0;
    }

    const percentage = this.priceType == ResourcePriceType.expense ? this.pricePercentage.resourcesPrice : this.pricePercentage.productsPrice;
    return this.model.ware.price.min + (this.model.ware.price.max - this.model.ware.price.min) * percentage / 100;
  }
}

class ModuleCostModel {
  constructor(private item: StationModuleModel, private component: StationSummaryComponent,
              private minPrice: number, private maxPrice) {
  }

  get module() {
    return this.item.module;
  }

  get count() {
    return this.item.count;
  }

  get price() {
    return this.item.count * (this.minPrice + (this.maxPrice - this.minPrice) * this.component.modulesResourcesPrice / 100);
  }
}

@Component({
  selector: 'app-station-summary',
  templateUrl: './station-summary.component.html'
})
export class StationSummaryComponent {
  static basicResources = [
    WareGroups.gases,
    WareGroups.minerals,
    WareGroups.ice
  ];

  private expandState: { [key: string]: boolean } = {};
  private _modules: StationModuleModel[];

  provideBasicResources = false;
  resourcesPrice = 50;
  productsPrice = 50;
  modulesResourcesPrice = 50;

  totalWorkforce = 0;
  totalWorkforceCapacity = 0;

  workforceNeeded: { amount: number, name: string, count: number }[] = [];
  workforceCapacity: { amount: number, name: string, count: number }[] = [];

  resourcesNeeded: ResourceSummaryModel[] = [];
  resourcesProduced: ResourceSummaryModel[] = [];
  moduleCosts: ModuleCostModel[];

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

  update() {
    this.totalWorkforce = 0;
    this.totalWorkforceCapacity = 0;

    this.workforceNeeded = [];
    this.workforceCapacity = [];

    this.resourcesNeeded = [];
    this.resourcesProduced = [];
    this.moduleCosts = [];

    if (this.modules == null) {
      return;
    }

    this.modules.forEach(item => {
      if (item.module != null && item.module.workForce != null) {
        if (item.module.workForce.max != null) {
          this.totalWorkforce += item.count * item.module.workForce.max;
          this.workforceNeeded.push({ amount: item.module.workForce.max, name: item.module.name, count: item.count });
        }
        if (item.module.workForce.capacity != null) {
          this.totalWorkforceCapacity += item.count * item.module.workForce.capacity;
          this.workforceCapacity.push({ amount: item.module.workForce.capacity, name: item.module.name, count: item.count });
        }
      }
      if (item.module != null) {
        const cost = this.getModuleCost(item);
        if (cost != null) {
          this.moduleCosts.push(this.getModuleCost(item));
        }
      }
    });

    const resources = ResourceCalculator.calculate(this.modules, this.totalWorkforce, this.totalWorkforceCapacity);
    resources.sort((a, b) => this.wareService.compareWares(a.ware, b.ware));

    resources.forEach(x => {
      if (x.amount < 0) {
        let warePrice: number = null;
        if (this.provideBasicResources && StationSummaryComponent.basicResources.indexOf(x.ware.group) >= 0) {
          warePrice = 0;
        }
        const model = new ResourceSummaryModel(x, this, ResourcePriceType.expense, warePrice);
        this.resourcesNeeded.push(model);
      } else if (x.amount > 0) {
        const model = new ResourceSummaryModel(x, this, ResourcePriceType.product);
        this.resourcesProduced.push(model);
      }
    });
  }

  get totalExpenses() {
    let totalExpenses = 0;

    this.resourcesNeeded.forEach(x => {
      totalExpenses += x.amount * x.price;
    });

    return totalExpenses;
  }

  get totalProfits() {
    let totalProfits = 0;

    this.resourcesProduced.forEach(x => {
      totalProfits += x.amount * x.price;
    });

    return totalProfits;
  }

  get totalModuleCost() {
    let total = 0;

    this.moduleCosts.forEach(x => {
      total += x.price;
    });

    return total;
  }

  private getModuleCost(item: StationModuleModel) {
    const production = item.module.production[0];
    if (!production) {
      return null;
    }

    let totalMin = 0;
    let totalMax = 0;

    production.wares
      .forEach(x => {
        const ware = this.wareService.getWare(x.ware);
        totalMin += ware.price.min * x.amount;
        totalMax += ware.price.max * x.amount;
      });

    return new ModuleCostModel(item, this, totalMin, totalMax);
  }

  toggleExpanded(key: string) {
    this.expandState[key] = !this.expandState[key];
  }
}
