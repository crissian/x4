import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { DiplomacyService } from '../shared/services/diplomacy.service';
import { EntityTitle } from '../shared/services/entity-title';
import { DiplomacyActionDetailComponent } from './components/diplomacy-action-detail.component';
import { DiplomacyPageComponent } from './components/diplomacy-page.component';

export default [
	{ path: '', component: DiplomacyPageComponent, title: `${BASE_TITLE} - ${$localize`Diplomacy`}` },
	{
		path: ':id',
		component: DiplomacyActionDetailComponent,
		title: EntityTitle.of(DiplomacyService, $localize`Diplomacy`),
	},
] satisfies Routes;
