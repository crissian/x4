import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from "./about.component";

export const routes: Routes = [
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
    loadChildren: () => import('./ship/ships.module').then(m => m.ShipsModule)
  },
  {
    path: 'equipment',
    loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
  },
  {
    path: 'factions',
    loadChildren: () => import('./faction/faction.module').then(m => m.FactionModule)
  },
  {
    path: 'races',
    loadChildren: () => import('./races/race.module').then(m => m.RaceModule)
  },
  {
    path: 'modules',
    loadChildren: () => import('./module/module.module').then(m => m.ModuleModule)
  },
  {
    path: 'wares',
    loadChildren: () => import('./ware/ware.module').then(m => m.WareModule)
  },
  {
    path: 'station-calculator',
    loadChildren: () => import('./station/station.module').then(m => m.StationModule)
  }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
