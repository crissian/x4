import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: WaresComponent },
      { path: ':id', component: WareDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class WareRoutingModule {
}
