import {NgModule} from '@angular/core';
import {StationModule} from '../station/station.module';
import {RouterModule} from '@angular/router';
import {WaresComponent} from './components/wares.component';
import {WareDetailComponent} from './components/ware-detail.component';

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
      }
    ])
  ]
})
export class WareRoutingModule {
}
