import { Component, OnInit } from '@angular/core';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { Equipment, Ware } from '../../shared/services/model/model';
import { ActivatedRoute } from '@angular/router';
import { EquipmentService } from '../../shared/services/equipment.service';
import { Title } from '@angular/platform-browser';
import { WareService } from '../../shared/services/ware.service';

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
   templateUrl: './equipment-detail.component.html'
})
export class EquipmentDetailComponent extends EntityDetailsComponent<Equipment> implements OnInit {
   entityProduction: ProductionData[];

   constructor(service: EquipmentService, private wareService: WareService,
               route: ActivatedRoute, private titleService: Title) {
      super(service, route);

   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations / Split Vendetta - Equipment');
      super.ngOnInit();
   }

   onEntityLoaded(entity: Equipment) {
      this.titleService.setTitle(`X4: Foundations / Split Vendetta - ${entity.name}`);
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

}
