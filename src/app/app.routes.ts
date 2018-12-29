import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'station-calculator',
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutComponent
  }
];
