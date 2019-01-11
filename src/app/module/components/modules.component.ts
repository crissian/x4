import { Component, OnInit } from '@angular/core';
import { Race, StationModule } from '../../shared/services/model/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModuleService } from '../../shared/services/module.service';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { RaceService } from '../../shared/services/race.service';

@Component({
   templateUrl: './modules.component.html'
})
export class ModulesComponent extends EntityListComponent<StationModule> implements OnInit {
   moduleTypes: string[];
   races: Race[];

   constructor(moduleService: ModuleService,
               private raceService: RaceService,
               private router: Router,
               private route: ActivatedRoute,
               private titleService: Title) {
      super(moduleService);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Modules');

      this.races = this.raceService.getEntities();
      this.moduleTypes = Object.keys(ModuleTypes).map(x => ModuleTypes[x]);
      super.ngOnInit();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }
}
