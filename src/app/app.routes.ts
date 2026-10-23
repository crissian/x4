import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { GameText } from './core/game-text';
import { BASE_TITLE } from './shared/services/constants';

/**
 * Texts files of the game data a lazy route uses, fetched along with its code: the data files of a route
 * fetch their texts while they evaluate, one after another, so they find them in flight.
 */
const TEXTS = {
	/** races, factions and wares, which most data files reference */
	base: ['race', 'factions', 'ware-groups', 'wares'],
	universe: ['clusters', 'sectors'],
} as const;

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
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'ships', 'equipment'],
				() => import('./ship/ship.routes')
			),
	},
	{
		path: 'equipment',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, 'ships', 'equipment'], () => import('./equipment/equipment.routes')),
	},
	{
		path: 'factions',
		loadChildren: () => GameText.withTexts(TEXTS.base, () => import('./faction/faction.routes')),
	},
	{
		path: 'races',
		loadChildren: () => GameText.withTexts(TEXTS.base, () => import('./races/race.routes')),
	},
	{
		path: 'modules',
		loadChildren: () => GameText.withTexts([...TEXTS.base, 'modules'], () => import('./module/module.routes')),
	},
	{
		path: 'wares',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, ...TEXTS.universe, 'modules'], () => import('./ware/ware.routes')),
	},
	{
		path: 'sectors',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, ...TEXTS.universe, 'modules'], () => import('./sector/sector.routes')),
	},
	{
		path: 'map',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules', 'ship-list'],
				() => import('./map/map.component')
			),
		title: `${BASE_TITLE} - ${$localize`Galaxy Map`}`,
	},
	{
		path: 'trade-routes',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'ship-list'],
				() => import('./trade/components/trade-routes-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Trade Routes`}`,
	},
	{
		path: 'supply-demand',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules'],
				() => import('./supply-demand/components/supply-demand-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Supply & Demand`}`,
	},
	{
		path: 'station-suggestions',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules'],
				() => import('./station-suggestions/components/station-suggestions-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Station Suggestions`}`,
	},
	{
		path: 'blueprints',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules', 'ships', 'equipment'],
				() => import('./blueprints/components/blueprints-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Blueprints`}`,
	},
	{
		path: 'game-starts',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'ship-list', 'game-starts'],
				() => import('./game-starts/game-starts.routes')
			),
	},
	{
		path: 'saves',
		loadComponent: () => import('./savegame/components/savegames-page.component'),
		title: `${BASE_TITLE} - ${$localize`Savegames`}`,
	},
	{
		path: 'station-calculator',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, 'modules'],
				() => import('./station/components/station-calculator.component')
			),
		title: `${BASE_TITLE} - ${$localize`Station Calculator`}`,
	},
];
