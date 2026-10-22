import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { WareService } from '../shared/services/ware.service';
import { WareDetailComponent } from './components/ware-detail.component';
import { WaresComponent } from './components/wares.component';

export default [
	{ path: '', component: WaresComponent, title: `${BASE_TITLE} - ${$localize`Wares`}` },
	{ path: ':id', component: WareDetailComponent, title: entityTitle(WareService, $localize`Wares`) },
] satisfies Routes;
