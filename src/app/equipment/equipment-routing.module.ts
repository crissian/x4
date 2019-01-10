import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipmentsComponent } from './components/equipments.component';
import { EquipmentDetailComponent } from './components/equipment-detail.component';

@NgModule({
   imports: [
      RouterModule.forChild([
         { path: '', component: EquipmentsComponent },
         { path: ':id', component: EquipmentDetailComponent }
      ])
   ],
   exports: [
      RouterModule
   ]
})
export class EquipmentRoutingModule {
}
