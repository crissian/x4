import { Routes } from '@angular/router';
import { StationCalculatorComponent } from './components/station-calculator.component';
import { WaresComponent } from './components/wares.component';
import { WareDetailComponent } from './components/ware-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'station-calculator',
    pathMatch: 'full' },
  {
    path: 'station-calculator',
    component: StationCalculatorComponent
  },
  {
    path: 'wares',
    children: [
      { path: '', component: WaresComponent },
      { path: ':id', component: WareDetailComponent }
    ]
  }
];
