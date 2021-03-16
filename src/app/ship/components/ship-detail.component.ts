import {Component, OnInit} from '@angular/core';
import {EntityDetailsComponent} from '../../shared/components/entity-details.component';
import {Dock, Ship, Slot, SlotSummary, Ware} from '../../shared/services/model/model';
import {WareService} from '../../shared/services/ware.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ShipService} from '../../shared/services/ship.service';
import {BASE_TITLE} from '../../shared/services/constants';

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
      this.titleService.setTitle(`${BASE_TITLE} - Ships`);
      super.ngOnInit();
   }

   onEntityLoaded(entity: Ship) {
      this.titleService.setTitle(`${BASE_TITLE} - ${entity.name}`);

      this.entityProduction = entity.production
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

   get mainShields() {
      if (!this.entity.shields) {
         return [];
      }

      return this.entity.shields.filter(x => !x.group);
   }

   get additionalShields() {
      if (!this.entity.shields) {
         return [];
      }

      return this.entity.shields.filter(x => x.group);
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
            slots.push({size: key, capacity: valueObj[key]});
         });

      return slots;
   }
}
