import {NgModule} from '@angular/core';
import {StationModule} from './station.module';
import {RouterModule} from '@angular/router';
import {StationCalculatorComponent} from './components/station-calculator.component';

@NgModule({
  imports: [
    StationModule,
    RouterModule.forChild([
      {
        path: 'station-calculator',
        component: StationCalculatorComponent
      }
    ])
  ]
})
export class StationRoutingModule {
}
