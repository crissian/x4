import { Routes } from '@angular/router';
import { BASE_TITLE } from '../shared/services/constants';
import { EntityTitle } from '../shared/services/entity-title';
import { EquipmentService } from '../shared/services/equipment.service';
import { EquipmentDetailComponent } from './components/equipment-detail.component';
import { EquipmentsComponent } from './components/equipments.component';

export default [
	{ path: '', component: EquipmentsComponent, title: `${BASE_TITLE} - ${$localize`Equipment`}` },
	{ path: ':id', component: EquipmentDetailComponent, title: EntityTitle.of(EquipmentService, $localize`Equipment`) },
] satisfies Routes;
