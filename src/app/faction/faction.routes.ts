import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { FactionService } from '../shared/services/faction.service';
import { FactionDetailComponent } from './components/faction-detail.component';
import { FactionsComponent } from './components/factions.component';

export default [
	{ path: '', component: FactionsComponent, title: `${BASE_TITLE} - ${$localize`Factions`}` },
	{ path: ':id', component: FactionDetailComponent, title: entityTitle(FactionService, $localize`Factions`) },
] satisfies Routes;
