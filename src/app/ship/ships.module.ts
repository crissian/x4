import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ShipRoutingModule } from './ship-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxDatatableModule,
    ShipRoutingModule
  ],
  declarations: [
    ShipsComponent,
    ShipDetailComponent
  ]
})
export class ShipsModule {
}
