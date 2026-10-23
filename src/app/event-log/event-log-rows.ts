import type { SaveLogEntry, SaveLoss } from '../savegame/log/save-log-model';
import type { Faction } from '../shared/services/model/faction';
import type { Ship } from '../shared/services/model/ship';
import type { Sector } from '../shared/services/model/universe';
import type { EventLogModel } from './event-log-query';

/** A logbook entry with the game data it names. */
export interface EventRow {
	id: number;
	entry: SaveLogEntry;
	/** seconds between the entry and the save */
	ago: number;
	category: string;
	/** the faction filter value: the faction id or name */
	factionKey: string;
	faction?: Faction;
	sector?: Sector;
}

/** A lost ship with its ship type, matched by name, and the killer's faction, from the name prefix. */
export interface LossRow {
	id: number;
	loss: SaveLoss;
	ago: number;
	ship?: Ship;
	sector?: Sector;
	killerFaction?: Faction;
}

/** How rows look up the game data. */
export interface EventLogLookups {
	faction(id: string): Faction | undefined;
	sector(id: string): Sector | undefined;
	/** the ship type with the name, in the selected language */
	ship(name: string): Ship | undefined;
	/** the faction with the short name, e.g. `XEN` */
	factionByShortName(shortName: string): Faction | undefined;
}

/** Builds and filters the rows of the event log page. */
export class EventLogRows {
	/** The category of entries without one. */
	static readonly GENERAL = 'general';

	static events(entries: readonly SaveLogEntry[], saveTime: number, lookups: EventLogLookups): EventRow[] {
		return entries.map((entry, id) => ({
			id,
			entry,
			ago: Math.max(0, saveTime - entry.time),
			category: entry.category ?? EventLogRows.GENERAL,
			factionKey: entry.faction ?? entry.factionName ?? '',
			faction: entry.faction ? lookups.faction(entry.faction) : undefined,
			sector: entry.sector ? lookups.sector(entry.sector) : undefined,
		}));
	}

	static losses(losses: readonly SaveLoss[], saveTime: number, lookups: EventLogLookups): LossRow[] {
		return losses.map((loss, id) => {
			const prefix = loss.killer?.split(' ')[0];
			return {
				id,
				loss,
				ago: Math.max(0, saveTime - loss.time),
				ship: lookups.ship(loss.name),
				sector: loss.sector ? lookups.sector(loss.sector) : undefined,
				killerFaction: prefix ? lookups.factionByShortName(prefix) : undefined,
			};
		});
	}

	static filterEvents(rows: readonly EventRow[], model: EventLogModel): EventRow[] {
		const search = model.search.trim().toLowerCase();
		const since = EventLogRows.sinceSeconds(model);
		return rows.filter(
			(x) =>
				(!model.category || x.category === model.category) &&
				(!model.faction || x.factionKey === model.faction) &&
				(!model.sector || x.entry.sector === model.sector) &&
				x.ago <= since &&
				(!search ||
					x.entry.title.toLowerCase().includes(search) ||
					!!x.entry.text?.toLowerCase().includes(search))
		);
	}

	static filterLosses(rows: readonly LossRow[], model: EventLogModel): LossRow[] {
		const search = model.search.trim().toLowerCase();
		const since = EventLogRows.sinceSeconds(model);
		return rows.filter(
			(x) =>
				(!model.faction || x.killerFaction?.id === model.faction) &&
				(!model.sector || x.loss.sector === model.sector) &&
				x.ago <= since &&
				(!search ||
					[x.loss.name, x.loss.code, x.ship?.name, x.loss.killer].some((v) => v?.toLowerCase().includes(search)))
		);
	}

	private static sinceSeconds(model: EventLogModel): number {
		return model.since ? Number(model.since) * 3600 : Number.POSITIVE_INFINITY;
	}
}
