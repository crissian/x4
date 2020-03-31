import { Race } from '../../shared/services/model/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { RaceService } from '../../shared/services/race.service';
import { EntityListComponent } from '../../shared/components/entity-list.component';

@Component({
  templateUrl: './races.component.html'
})
export class RacesComponent extends EntityListComponent<Race> implements OnInit {
  constructor(private raceService: RaceService,
              router: Router,
              route: ActivatedRoute,
              private titleService: Title) {
    super(raceService, router, route);
  }

  ngOnInit(): void {
    this.titleService.setTitle('X4: Foundations / Split Vendetta - Races');
    super.ngOnInit();
  }
}
