import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { EquipmentsComponent } from './components/equipments.component';
import { EquipmentDetailComponent } from './components/equipment-detail.component';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      NgxDatatableModule,
      EquipmentRoutingModule
   ],
   declarations: [
      EquipmentsComponent,
      EquipmentDetailComponent
   ]
})
export class EquipmentModule {
}
