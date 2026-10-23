import type { GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { EnumLabels } from '../../core/enum-labels';
import type { EventRow, LossRow } from '../event-log-rows';
import { LogTime } from '../log-time';

/**
 * The data grid columns of the event log and the losses. The entry, sector and faction cells are rendered
 * by templates; their values here filter and sort.
 */
export class EventLogColumns {
	/** Newest first. */
	readonly newest: SortState = { key: 'when', direction: -1 };

	readonly events: GridColumn<EventRow>[] = [
		this.when<EventRow>((x) => x.entry.time, (x) => x.ago),
		this.gameTime<EventRow>((x) => x.entry.time),
		{
			key: 'category',
			caption: $localize`Category`,
			value: (x) => x.category,
			display: (x) => EnumLabels.label(`log:${x.category}`),
		},
		{
			key: 'entry',
			caption: $localize`Entry`,
			value: (x) => (x.entry.text ? `${x.entry.title} ${x.entry.text}` : x.entry.title),
			sortable: false,
			hideable: false,
		},
		{ key: 'faction', caption: $localize`Faction`, value: (x) => x.faction?.name ?? x.entry.factionName ?? '' },
		{ key: 'sector', caption: $localize`Sector`, value: (x) => x.sector?.name ?? '' },
	];

	readonly losses: GridColumn<LossRow>[] = [
		this.when<LossRow>((x) => x.loss.time, (x) => x.ago),
		this.gameTime<LossRow>((x) => x.loss.time),
		{
			key: 'name',
			caption: $localize`Name`,
			value: (x) => `${x.loss.name} (${x.loss.code})`,
			hideable: false,
		},
		{ key: 'sector', caption: $localize`Sector`, value: (x) => x.sector?.name ?? x.loss.location ?? '' },
		{
			key: 'killer',
			caption: $localize`Destroyed by`,
			value: (x) => (x.loss.killer ? `${x.loss.killer} (${x.loss.killerCode ?? '?'})` : ''),
		},
		{ key: 'commander', caption: $localize`Commander`, value: (x) => x.loss.commander ?? '', hidden: true },
	];

	/** How long before the save; sorts by the time. */
	private when<T>(time: (row: T) => number, ago: (row: T) => number): GridColumn<T> {
		return {
			key: 'when',
			caption: $localize`When`,
			value: time,
			// no-break spaces keep the short time on one line
			display: (x) => LogTime.ago(ago(x)).replace(/ /g, ' '),
			title: (x) => $localize`Play time ${LogTime.at(time(x))}:time:`,
			filterable: false,
		};
	}

	private gameTime<T>(time: (row: T) => number): GridColumn<T> {
		return {
			key: 'time',
			caption: $localize`Play time`,
			value: time,
			display: (x) => LogTime.at(time(x)),
			filterable: false,
			hidden: true,
		};
	}
}
