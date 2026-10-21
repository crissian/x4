import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { entityTitle } from '../shared/services/entity-title';
import { EquipmentService } from '../shared/services/equipment.service';
import { EquipmentDetailComponent } from './components/equipment-detail.component';
import { EquipmentsComponent } from './components/equipments.component';

export default [
	{ path: '', component: EquipmentsComponent, title: `${BASE_TITLE} - Equipment` },
	{ path: ':id', component: EquipmentDetailComponent, title: entityTitle(EquipmentService, 'Equipment') },
] satisfies Routes;
