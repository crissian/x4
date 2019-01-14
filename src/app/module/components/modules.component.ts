import { Component, OnInit } from '@angular/core';
import { Race, StationModule } from '../../shared/services/model/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModuleService } from '../../shared/services/module.service';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { RaceService } from '../../shared/services/race.service';
import { EnumFn } from '../../core/services/enum-fn';

@Component({
   templateUrl: './modules.component.html'
})
export class ModulesComponent extends EntityListComponent<StationModule> implements OnInit {
   moduleTypes: string[];
   races: Race[];

   constructor(moduleService: ModuleService,
               private raceService: RaceService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(moduleService, router, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Modules');

      this.races = this.raceService.getEntities();
      this.moduleTypes = EnumFn.values(ModuleTypes);
      super.ngOnInit();
   }
}
