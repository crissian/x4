import { Routes } from '@angular/router';
import { StationCalculatorComponent } from './components/station-calculator.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'station-calculator',
    pathMatch: 'full' },
  {
    path: 'station-calculator',
    component: StationCalculatorComponent
  }
];
