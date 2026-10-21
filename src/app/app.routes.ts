import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { BASE_TITLE } from './shared/services/constants';

export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: 'station-calculator',
		pathMatch: 'full',
	},
	{
		path: 'about',
		component: AboutComponent,
		title: `${BASE_TITLE} - About`,
	},
	{
		path: 'ships',
		loadChildren: () => import('./ship/ship.routes'),
	},
	{
		path: 'equipment',
		loadChildren: () => import('./equipment/equipment.routes'),
	},
	{
		path: 'factions',
		loadChildren: () => import('./faction/faction.routes'),
	},
	{
		path: 'races',
		loadChildren: () => import('./races/race.routes'),
	},
	{
		path: 'modules',
		loadChildren: () => import('./module/module.routes'),
	},
	{
		path: 'wares',
		loadChildren: () => import('./ware/ware.routes'),
	},
	{
		path: 'station-calculator',
		loadComponent: () => import('./station/components/station-calculator.component'),
		title: `${BASE_TITLE} - Station Calculator`,
	},
];
