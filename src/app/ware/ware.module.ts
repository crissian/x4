import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';
import { EquipmentsComponent } from './components/equipments.component';

@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    WaresComponent,
    WareDetailComponent,
    ShipsComponent,
    ShipDetailComponent,
    EquipmentsComponent
  ]
})
export class WareModule {
}
