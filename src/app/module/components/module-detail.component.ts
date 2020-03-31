import { Component, OnInit } from '@angular/core';
import { Dock, Slot, SlotSummary, StationModule, Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ModuleService } from '../../shared/services/module.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';

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
  templateUrl: './module-detail.component.html'
})
export class ModuleDetailComponent extends EntityDetailsComponent<StationModule> implements OnInit {
  public entityProduction: ProductionData[];

  constructor(private wareService: WareService, moduleService: ModuleService,
              route: ActivatedRoute, private titleService: Title) {
    super(moduleService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4: Foundations / Split Vendetta - Modules');
    super.ngOnInit();
  }

  onEntityLoaded(entity: StationModule) {
    this.titleService.setTitle(`X4: Foundations / Split Vendetta - Modules - ${this.entity.name}`);

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

  getSlotsStr(value: (Slot | Dock)[]) {
    const slots = this.getSlots(value);
    if (slots.length == 0) {
      return '-';
    }

    return slots
      .map(x => `${x.capacity} x ${x.size}`)
      .join(', ');
  }

  getSlots(value: (Slot | Dock)[]) {
    if (!value) {
      return [];
    }

    const valueObj = value.reduce((obj, slot) => {
      obj[slot.size] = obj[slot.size] || 0;
      obj[slot.size] += (<Dock>slot).capacity || 1;
      return obj;
    }, {});

    const slots: SlotSummary[] = [];
    Object.keys(valueObj)
      .forEach(key => {
        slots.push({ size: key, capacity: valueObj[key] });
      });

    return slots;
  }
}
