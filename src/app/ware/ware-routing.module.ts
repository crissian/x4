import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';
import { WareModule } from './ware.module';

@NgModule({
  imports: [
    WareModule,
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
