import {NgModule} from '@angular/core';
import {StationModule} from '../station/station.module';
import {RouterModule} from '@angular/router';
import {WaresComponent} from './components/wares.component';
import {WareDetailComponent} from './components/ware-detail.component';
import { ShipsComponent } from './components/ships.component';
import { ShipDetailComponent } from './components/ship-detail.component';

@NgModule({
  imports: [
    StationModule,
    RouterModule.forChild([
      {
        path: 'wares',
        children: [
          { path: '', component: WaresComponent },
          { path: ':id', component: WareDetailComponent }
        ]
      },
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
export class WareRoutingModule {
}
