import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Faction } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { FactionService } from '../../shared/services/faction.service';
import { DecimalPipe } from '@angular/common';


@Component({
  templateUrl: './faction-detail.component.html'
})
export class FactionDetailComponent extends EntityDetailsComponent<Faction> implements OnInit {
  public numberPipe: DecimalPipe;

  constructor(service: FactionService, private moduleService: ModuleService,
              route: ActivatedRoute, private titleService: Title, @Inject(LOCALE_ID) private locale: string) {
    super(service, route);

    this.numberPipe  = new DecimalPipe(locale);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4:Foundations - Factions');
    super.ngOnInit();
  }

  onEntityLoaded(entity: Faction) {
    this.titleService.setTitle(`X4:Foundations - Factions - ${this.entity.name}`);
  }
}
