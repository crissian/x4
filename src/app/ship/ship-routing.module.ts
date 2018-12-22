import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';
import { ShipsModule } from './ships.module';

@NgModule({
  imports: [
    ShipsModule,
    RouterModule.forChild([
      {
        path: 'ships',
        children: [
          { path: '', component: ShipsComponent },
          { path: ':id', component: ShipDetailComponent }
        ]
      }
    ])
  ]
})
export class ShipRoutingModule {
}
