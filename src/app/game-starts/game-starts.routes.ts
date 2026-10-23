import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { GameStartDetailComponent } from './components/game-start-detail.component';
import GameStartsPageComponent from './components/game-starts-page.component';
import { GameStartService } from './game-start.service';

export default [
	{ path: '', component: GameStartsPageComponent, title: `${BASE_TITLE} - ${$localize`Game starts`}` },
	{
		path: ':id',
		component: GameStartDetailComponent,
		title: EntityTitle.of(GameStartService, $localize`Game starts`),
	},
] satisfies Routes;
