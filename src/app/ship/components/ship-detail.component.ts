import { Component, OnInit } from '@angular/core';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { Ship, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShipService } from '../../shared/services/ship.service';

interface ProductionWareData {
  ware: Ware;
  amount: number;
}

interface ProductionData {
  time: number;
  amount: number;
  method: string;
  name: string;
  wares: ProductionWareData[];
}

@Component({
  templateUrl: './ship-detail.component.html'
})
export class ShipDetailComponent extends EntityDetailsComponent<Ship> implements OnInit {
  public entityProduction: ProductionData[];

  constructor(private wareService: WareService, entityService: ShipService,
              route: ActivatedRoute, private titleService: Title) {
    super(entityService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Ships');
    super.ngOnInit();
  }

  onEntityLoaded(entity: Ship) {
    this.titleService.setTitle(`X4:Foundations - Ships - ${this.entity.name}`);

    this.entityProduction = this.entity.production
      .map<ProductionData>(x => {
        return {
          amount: x.amount,
          effects: x.effects,
          method: x.method,
          name: x.name,
          time: x.time,
          wares: x.wares.map(y => {
            return {
              ware: this.wareService.getEntity(y.ware),
              amount: y.amount
            };
          })
        };
      });
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
