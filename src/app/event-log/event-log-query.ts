import type { ParamMap, Params } from '@angular/router';

export type EventLogTab = 'events' | 'losses';

/** The filter form of the event log page. */
export interface EventLogModel {
	/** part of an entry's title or text, or of a lost ship's name */
	search: string;
	/** a logbook category, `general` for entries without one; empty for all */
	category: string;
	/** events: the faction id or name an entry names; losses: the killer's faction id; empty for all */
	faction: string;
	/** a sector id; empty for all */
	sector: string;
	/** only what happened in the last that many hours before the save; empty for all time */
	since: string;
}

export interface EventLogState {
	tab: EventLogTab;
	model: EventLogModel;
}

/** Reads the event log page's tab and filters from the URL query params and writes them back, defaults left out. */
export class EventLogQuery {
	static readonly DEFAULTS: Readonly<EventLogModel> = { search: '', category: '', faction: '', sector: '', since: '' };
	/** The choices of the time filter, in hours. */
	static readonly SINCE = ['1', '3', '10', '24', '100'] as const;

	static read(params: ParamMap): EventLogState {
		const since = params.get('since') ?? '';
		return {
			tab: params.get('tab') === 'losses' ? 'losses' : 'events',
			model: {
				search: params.get('q') ?? '',
				category: params.get('category') ?? '',
				faction: params.get('faction') ?? '',
				sector: params.get('sector') ?? '',
				since: (EventLogQuery.SINCE as readonly string[]).includes(since) ? since : '',
			},
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write({ tab, model }: EventLogState): Params {
		return {
			tab: tab === 'events' ? null : tab,
			q: model.search.trim() || null,
			category: model.category || null,
			faction: model.faction || null,
			sector: model.sector || null,
			since: model.since || null,
		};
	}
}
