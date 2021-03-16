import { Component, OnInit } from '@angular/core';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductionEffect, Ware } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { Effects } from '../../shared/services/data/effects-data';
import { ShipService } from '../../shared/services/ship.service';
import {BASE_TITLE} from '../../shared/services/constants';

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
  efficiency?: ProductionEffect;
}

@Component({
  templateUrl: './ware-detail.component.html'
})
export class WareDetailComponent extends EntityDetailsComponent<Ware> implements OnInit {
  public waresUsedIn: any[] = [];
  public modulesUsedIn: any[] = [];
  public shipsUsedIn: any[] = [];
  public entityProduction: ProductionData[];

  constructor(private wareService: WareService,
              private moduleService: ModuleService,
              private shipService: ShipService,
              route: ActivatedRoute, private titleService: Title) {
    super(wareService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${BASE_TITLE} - Wares`);
    super.ngOnInit();
  }

  onEntityLoaded(entity: Ware) {
    this.titleService.setTitle(`${BASE_TITLE} - ${this.entity.name}`);
    this.entityProduction = this.entity.production
      .map<ProductionData>(x => {
        return {
          amount: x.amount,
          effects: x.effects,
          method: x.method,
          name: x.name,
          time: x.time,
          efficiency: x.effects == null ? null : x.effects.find(y => y.type == Effects.work),
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

    this.shipsUsedIn = this.shipService
      .getEntitiesUsingWare(this.entity.id);
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
      result += minutes + (minutes === 1 ? ' minute' : ' minutes');
    }
    if (seconds > 0) {
      if (minutes > 0) {
        result += ' ';
      }
      result += seconds + (seconds === 1 ? ' second' : ' seconds');
    }

    return result;
  }
}
