import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Faction } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { FactionService } from '../../shared/services/faction.service';

@Component({
  templateUrl: './faction-detail.component.html'
})
export class FactionDetailComponent extends EntityDetailsComponent<Faction> implements OnInit {
  constructor(service: FactionService, private moduleService: ModuleService,
              route: ActivatedRoute, private titleService: Title) {
    super(service, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4: Foundations / Split Vendetta - Factions');
    super.ngOnInit();
  }

  onEntityLoaded(entity: Faction) {
    this.titleService.setTitle(`X4: Foundations / Split Vendetta - ${this.entity.name}`);
  }
}
