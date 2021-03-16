import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Faction} from '../../shared/services/model/model';
import {ModuleService} from '../../shared/services/module.service';
import {EntityDetailsComponent} from '../../shared/components/entity-details.component';
import {FactionService} from '../../shared/services/faction.service';
import {BASE_TITLE} from '../../shared/services/constants';

@Component({
   templateUrl: './faction-detail.component.html'
})
export class FactionDetailComponent extends EntityDetailsComponent<Faction> implements OnInit {
   constructor(service: FactionService, private moduleService: ModuleService,
               route: ActivatedRoute, private titleService: Title) {
      super(service, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle(`${BASE_TITLE} - Factions`);
      super.ngOnInit();
   }

   onEntityLoaded(entity: Faction) {
      this.titleService.setTitle(`${BASE_TITLE} - ${this.entity.name}`);
   }
}
