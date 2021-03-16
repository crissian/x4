import { Component, OnInit } from '@angular/core';
import { EntityDetailsComponent } from '../../shared/components/entity-details.component';
import { Race } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {BASE_TITLE} from '../../shared/services/constants';

@Component({
  templateUrl: 'race-detail.component.html'
})
export class RaceDetailComponent extends EntityDetailsComponent<Race> implements OnInit {
  constructor(raceService: RaceService, route: ActivatedRoute, private titleService: Title) {
    super(raceService, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${BASE_TITLE} - Races`);
    super.ngOnInit();
  }

  onEntityLoaded(entity: Race) {
    this.titleService.setTitle(`${BASE_TITLE} - Races - ${entity.name}`);
  }
}
