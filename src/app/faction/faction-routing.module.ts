import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FactionsComponent } from './components/factions.component';
import { FactionDetailComponent } from './components/faction-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: FactionsComponent },
      { path: ':id', component: FactionDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class FactionRoutingModule {
}
