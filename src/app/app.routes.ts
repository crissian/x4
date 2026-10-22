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
		title: `${BASE_TITLE} - ${$localize`About`}`,
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
		path: 'sectors',
		loadChildren: () => import('./sector/sector.routes'),
	},
	{
		path: 'map',
		loadComponent: () => import('./map/map.component'),
		title: `${BASE_TITLE} - ${$localize`Galaxy Map`}`,
	},
	{
		path: 'saves',
		loadComponent: () => import('./savegame/components/savegames-page.component'),
		title: `${BASE_TITLE} - ${$localize`Savegames`}`,
	},
	{
		path: 'station-calculator',
		loadComponent: () => import('./station/components/station-calculator.component'),
		title: `${BASE_TITLE} - ${$localize`Station Calculator`}`,
	},
];
