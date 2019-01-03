import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ShipsComponent },
      { path: ':id', component: ShipDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ShipRoutingModule {
}
