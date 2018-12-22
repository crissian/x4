import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductionEffect, Ware } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';

export interface ProductionWareData {
  ware: Ware;
  amount: number;
}

interface ProductionData {
  time: number;
  amount: number;
  method: string;
  name: string;
  wares: ProductionWareData[];
  effects?: ProductionEffect[];
}

@Component({
  templateUrl: './ware-detail.component.html'
})
export class WareDetailComponent extends EntityDetailsComponent<Ware> implements OnInit {
  public entity: Ware;
  public waresUsedIn: any[] = [];
  public modulesUsedIn: any[] = [];
  public entityProduction: ProductionData[];

  constructor(private wareService: WareService, private moduleService: ModuleService,
              route: ActivatedRoute, private titleService: Title) {
    super(wareService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Wares');
    super.ngOnInit();
  }

  onEntityLoaded(entity: Ware) {
    this.titleService.setTitle(`X4:Foundations - Wares - ${this.entity.name}`);
    this.entityProduction = this.entity.production
      .map(x => {
        return {
          amount: x.amount,
          effects: x.effects,
          method: x.method,
          name: x.name,
          time: x.time,
          wares: x.wares.map(y => {
            return {
              ware: this.service.getEntity(y.ware),
              amount: y.amount
            };
          })
        };
      });

    this.waresUsedIn = this.wareService
      .getWaresUsingWare(entity.id);

    this.modulesUsedIn = this.moduleService
      .getModulesUsingWare(entity.id);
  }

  getTotalMin(production: ProductionData) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.min;
    });
    return total;
  }

  getTotalMax(production: ProductionData) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.max;
    });
    return total;
  }

  getTotalAvg(production: ProductionData) {
    let total = 0;
    production.wares.forEach(x => {
      total += x.amount * x.ware.price.avg;
    });
    return total;
  }

  // noinspection JSMethodCanBeStatic
  getProductionTime(amount: number) {
    const minutes = Math.trunc(amount / 60);
    const seconds = amount - minutes * 60;

    let result = '';
    if (minutes > 0) {
      result += ' ' + minutes + (minutes === 1 ? ' minute' : ' minutes');
    }
    if (seconds > 0) {
      if (minutes > 1) {
        result += ' ';
      }
      result += seconds + (seconds === 1 ? ' second' : ' seconds');
    }

    return result;
  }
}
