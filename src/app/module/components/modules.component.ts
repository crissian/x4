import { Component, OnInit } from '@angular/core';
import { Race, StationModule } from '../../shared/services/model/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModuleService } from '../../shared/services/module.service';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { RaceService } from '../../shared/services/race.service';
import { EnumFn } from '../../core/services/enum-fn';
import { Effects } from '../../shared/services/data/effects-data';
import {BASE_TITLE} from '../../shared/services/constants';

@Component({
   templateUrl: './modules.component.html'
})
export class ModulesComponent extends EntityListComponent<StationModule> implements OnInit {
   moduleTypes: string[];
   races: Race[];

   calculateMaxEfficiency: (item) => number;
   calculateMaxEfficiencyDisplay: (item) => string;
   calculateProduct: (item) => string;

   constructor(moduleService: ModuleService,
               private raceService: RaceService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(moduleService, router, route);

      this.calculateMaxEfficiency = item => this.calculateMaxEfficiencyCore(item);
      this.calculateMaxEfficiencyDisplay = item => this.calculateMaxEfficiencyDisplayCore(item);

      this.calculateProduct = item => this.calculateProductCore(item);
   }

  override ngOnInit(): void {
      this.titleService.setTitle(`${BASE_TITLE} - Modules`);

      this.races = this.raceService.getEntities();
      this.moduleTypes = EnumFn.values(ModuleTypes);
      super.ngOnInit();
   }

   calculateProductCore(item: StationModule) {
      return item.product?.map(x => x.name)
         .join(', ');
   }

   calculateMaxEfficiencyCore(item: StationModule) {
      if (item.product != null) {
         const effect = item.product
            .map(x => x.production?.map(x => x.effects?.find(y => y.type === Effects.work)))
            .map(x => x[0])
            .filter(x => x != null)
            .map(x => x.product);

         if (effect?.length > 0) {
            return 100 * (1 + Math.max(...effect));
         }
      }

      return 100;
   }

   calculateMaxEfficiencyDisplayCore(item: StationModule) {
      if (item.product == null) {
         return '-';
      }

      const value = this.calculateMaxEfficiencyCore(item);
      return `${value}%`;
   }
}
