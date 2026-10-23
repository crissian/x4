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
				[...TEXTS.base, ...TEXTS.universe, 'ships', 'equipment', 'equipment-mods', 'research'],
				() => import('./ship/ship.routes')
			),
	},
	{
		path: 'equipment',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, 'ships', 'equipment', 'equipment-mods'],
				() => import('./equipment/equipment.routes')
			),
	},
	{
		path: 'mods',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, 'equipment-mods'], () => import('./mods/mods.routes')),
	},
	{
		path: 'factions',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, 'equipment-mods', 'diplomacy'],
				() => import('./faction/faction.routes')
			),
	},
	{
		path: 'races',
		loadChildren: () => GameText.withTexts(TEXTS.base, () => import('./races/race.routes')),
	},
	{
		path: 'modules',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, 'modules', 'research'], () => import('./module/module.routes')),
	},
	{
		path: 'wares',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, ...TEXTS.universe, 'modules'], () => import('./ware/ware.routes')),
	},
	{
		path: 'production-chains',
		loadChildren: () =>
			GameText.withTexts([...TEXTS.base, 'modules'], () => import('./production-chain/production-chain.routes')),
	},
	{
		path: 'sectors',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules', 'data-vaults'],
				() => import('./sector/sector.routes')
			),
	},
	{
		path: 'map',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules', 'ship-list', 'data-vaults'],
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
		path: 'event-log',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'ships'],
				() => import('./event-log/components/event-log-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Event Log`}`,
	},
	{
		path: 'research',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, 'modules', 'ships', 'equipment', 'research'],
				() => import('./research/components/research-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Research`}`,
	},
	{
		path: 'diplomacy',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, 'equipment-mods', 'diplomacy'],
				() => import('./diplomacy/diplomacy.routes')
			),
	},
	{
		path: 'terraforming',
		loadChildren: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'research', 'terraforming'],
				() => import('./terraforming/terraforming.routes')
			),
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
		path: 'empire',
		loadComponent: () =>
			GameText.withTexts(
				[...TEXTS.base, ...TEXTS.universe, 'modules', 'ship-list', 'game-texts', 'ship-orders', 'fleet-assignments'],
				() => import('./empire/components/empire-page.component')
			),
		title: `${BASE_TITLE} - ${$localize`Empire`}`,
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
