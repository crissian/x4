import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StationCalculatorComponent } from './components/station-calculator.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: StationCalculatorComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class StationRoutingModule {
}
