import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FactionsComponent } from './components/factions.component';
import { FactionDetailComponent } from './components/faction-detail.component';
import { FactionModule } from './faction.module';

@NgModule({
  imports: [
    FactionModule,
    RouterModule.forChild([
      {
        path: 'factions',
        children: [
          { path: '', component: FactionsComponent },
          { path: ':id', component: FactionDetailComponent }
        ]
      }
    ])
  ]
})
export class FactionRoutingModule {
}
