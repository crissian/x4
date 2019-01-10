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
   },
   {
      path: 'ships',
      loadChildren: './ship/ships.module#ShipsModule'
   },
   {
      path: 'equipment',
      loadChildren: './equipment/equipment.module#EquipmentModule'
   },
   {
      path: 'factions',
      loadChildren: './faction/faction.module#FactionModule'
   },
   {
      path: 'races',
      loadChildren: './races/race.module#RaceModule'
   },
   {
      path: 'modules',
      loadChildren: './module/module.module#ModuleModule'
   },
   {
      path: 'station-calculator',
      loadChildren: './station/station.module#StationModule'
   },
   {
      path: 'wares',
      loadChildren: './ware/ware.module#WareModule'
   }
];
