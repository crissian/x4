import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { RaceService } from '../shared/services/race.service';
import { RaceDetailComponent } from './components/race-detail.component';
import { RacesComponent } from './components/races.component';

export default [
	{ path: '', component: RacesComponent, title: `${BASE_TITLE} - ${$localize`Races`}` },
	{ path: ':id', component: RaceDetailComponent, title: EntityTitle.of(RaceService, $localize`Races`) },
] satisfies Routes;
