import { Component, OnInit } from '@angular/core';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { Race } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: 'race-detail.component.html'
})
export class RaceDetailComponent extends EntityDetailsComponent<Race> implements OnInit {
  constructor(raceService: RaceService, route: ActivatedRoute, private titleService: Title) {
    super(raceService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4: Foundations / Split Vendetta - Races');
    super.ngOnInit();
  }

  onEntityLoaded(entity: Race) {
    this.titleService.setTitle(`X4: Foundations / Split Vendetta - Races - ${entity.name}`);
  }
}
