import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Faction } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { FactionService } from '../../shared/services/faction.service';

@Component({
   templateUrl: './factions.component.html'
})
export class FactionsComponent extends EntityListComponent<Faction> implements OnInit {
   constructor(factionService: FactionService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(factionService, router, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations / Split Vendetta - Factions');
      super.ngOnInit();
   }
}
