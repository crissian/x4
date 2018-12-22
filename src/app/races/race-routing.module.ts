import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RacesComponent } from './components/races.component';
import { RaceDetailComponent } from './components/race-detail.component';
import { RaceModule } from './race.module';


@NgModule({
  imports: [
    RaceModule,
    RouterModule.forChild([
      {
        path: 'races',
        children: [
          { path: '', component: RacesComponent },
          { path: ':id', component: RaceDetailComponent }
        ]
      }
    ])
  ]
})
export class RaceRoutingModule {
}
