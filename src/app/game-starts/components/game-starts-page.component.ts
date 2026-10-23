import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { RowNavigation } from '../../shared/components/row-navigation';
import { GAME_VERSIONS, GAME_VERSION_LOOKUP } from '../../shared/services/constants';
import type { GameStartSummary } from '../game-start-summary';
import { GameStartTypes } from '../game-start-types';
import { GameStartsStore } from '../game-starts-store';
import { GameStartCardComponent } from './game-start-card.component';
import { GameStartFiltersComponent } from './game-start-filters.component';

/** The game starts as comparison cards or a table, with the filters that answer "which start suits me?". */
@Component({
	imports: [RouterLink, DataGridComponent, GameStartCardComponent, GameStartFiltersComponent],
	templateUrl: './game-starts-page.component.html',
	providers: [GameStartsStore],
})
export default class GameStartsPageComponent {
	protected readonly store = inject(GameStartsStore);

	/** The types the advice box explains, each a link to its filter. */
	protected readonly advice = (['guided', 'assisted', 'sandbox'] as const).map((type) => ({
		type,
		label: GameStartTypes.label(type),
		hint: GameStartTypes.hint(type),
	}));

	protected readonly trackBy = (x: GameStartSummary) => x.start.id;

	protected readonly open = RowNavigation.to<GameStartSummary>('/game-starts', (x) => x.start.id);

	protected readonly columns: GridColumn<GameStartSummary>[] = [
		{
			key: 'name',
			caption: $localize`Name`,
			value: (x) => x.start.name,
			link: (x) => ['/game-starts', x.start.id],
		},
		{
			key: 'version',
			caption: $localize`DLC`,
			value: (x) => x.start.version,
			display: (x) => GAME_VERSIONS[x.start.version],
			lookup: GAME_VERSION_LOOKUP,
		},
		{
			key: 'type',
			caption: $localize`Type`,
			value: (x) => x.start.type,
			display: (x) => GameStartTypes.label(x.start.type),
			lookup: GameStartTypes.ORDER.map((value) => ({ value, label: GameStartTypes.label(value) })),
			sortValue: (x) => GameStartTypes.ORDER.indexOf(x.start.type),
		},
		{ key: 'money', caption: $localize`Money`, type: 'number', value: (x) => x.start.money },
		{
			key: 'ship',
			caption: $localize`Ship`,
			value: (x) => x.ship?.name ?? x.shipText ?? '',
			link: (x) => (x.ship ? ['/ships', x.ship.id] : undefined),
		},
		{
			key: 'location',
			caption: $localize`Location`,
			value: (x) => x.sector?.name ?? x.locationText ?? '',
			link: (x) => (x.sector ? ['/sectors', x.sector.id] : undefined),
		},
		{ key: 'property', caption: $localize`Property`, value: (x) => x.property ?? '', hidden: true },
		{ key: 'character', caption: $localize`Character`, value: (x) => x.start.character ?? '', hidden: true },
		{ key: 'unlock', caption: $localize`Unlock`, value: (x) => x.start.unlock ?? '' },
	];
}
