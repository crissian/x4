import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RacesComponent } from './components/races.component';
import { RaceDetailComponent } from './components/race-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: RacesComponent },
      { path: ':id', component: RaceDetailComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RaceRoutingModule {
}
