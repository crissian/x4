import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { SectorService } from '../shared/services/universe.service';
import { SectorDetailComponent } from './components/sector-detail.component';
import { SectorsComponent } from './components/sectors.component';

export default [
	{ path: '', component: SectorsComponent, title: `${BASE_TITLE} - Sectors` },
	{ path: ':id', component: SectorDetailComponent, title: entityTitle(SectorService, 'Sectors') },
] satisfies Routes;
