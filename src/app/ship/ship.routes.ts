import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { ShipService } from '../shared/services/ship.service';
import { ShipCompareComponent } from './components/ship-compare.component';
import { ShipDetailComponent } from './components/ship-detail.component';
import { ShipLoadoutComponent } from './components/ship-loadout.component';
import { ShipsComponent } from './components/ships.component';

export default [
	{ path: '', component: ShipsComponent, title: `${BASE_TITLE} - ${$localize`Ships`}` },
	{ path: 'compare', component: ShipCompareComponent, title: `${BASE_TITLE} - ${$localize`Compare Ships`}` },
	{ path: ':id/loadout', component: ShipLoadoutComponent, title: EntityTitle.of(ShipService, $localize`Loadout`) },
	{ path: ':id', component: ShipDetailComponent, title: EntityTitle.of(ShipService, $localize`Ships`) },
] satisfies Routes;
