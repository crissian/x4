import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { ShipService } from '../shared/services/ship.service';
import { ShipDetailComponent } from './components/ship-detail.component';
import { ShipsComponent } from './components/ships.component';

export default [
	{ path: '', component: ShipsComponent, title: `${BASE_TITLE} - Ships` },
	{ path: ':id', component: ShipDetailComponent, title: entityTitle(ShipService, 'Ships') },
] satisfies Routes;
