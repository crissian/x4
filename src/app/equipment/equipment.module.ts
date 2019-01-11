import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { EquipmentsComponent } from './components/equipments.component';
import { EquipmentDetailComponent } from './components/equipment-detail.component';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      EquipmentRoutingModule,
      DxDataGridModule
   ],
   declarations: [
      EquipmentsComponent,
      EquipmentDetailComponent
   ]
})
export class EquipmentModule {
}
