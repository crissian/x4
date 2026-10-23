import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { EnumLabels } from '../core/enum-labels';
import { QueryParamSync } from '../core/router/query-param-sync';
import { LogExtractor } from '../savegame/extractors/log-extractor';
import { ActiveSave } from '../savegame/active-save';
import { FactionService } from '../shared/services/faction.service';
import type { Ship } from '../shared/services/model/ship';
import { ShipService } from '../shared/services/ship.service';
import { SectorService } from '../shared/services/universe.service';
import { EventLogQuery, type EventLogModel, type EventLogTab } from './event-log-query';
import { EventLogRows, type EventLogLookups } from './event-log-rows';
import { LossSummaries } from './loss-summary';

/** A choice of a filter dropdown. */
export interface EventLogOption {
	value: string;
	label: string;
	count: number;
}

/**
 * State of the event log page: the logbook and losses of the active save, the filters (a signal form kept in the URL
 * query params) and the rows they leave. Provided by the page.
 */
@Injectable()
export class EventLogStore {
	private readonly activeSave = inject(ActiveSave);
	private readonly factions = inject(FactionService);
	private readonly sectors = inject(SectorService);

	readonly save = this.activeSave.save;
	readonly log = this.activeSave.log;
	readonly status = this.activeSave.statusOf(this.log);
	readonly gameTime = this.activeSave.gameTime;
	readonly maxEntries = LogExtractor.MAX_ENTRIES;

	private readonly initial = EventLogQuery.read(inject(ActivatedRoute).snapshot.queryParamMap);
	readonly tab = signal<EventLogTab>(this.initial.tab);
	readonly model = signal<EventLogModel>(this.initial.model);
	readonly form = form(this.model);

	private readonly lookups: EventLogLookups = (() => {
		const ships = new Map<string, Ship>();
		for (const ship of inject(ShipService).getEntities()) {
			if (!ships.has(ship.name)) {
				ships.set(ship.name, ship);
			}
		}
		const byShortName = new Map(
			this.factions
				.getEntities()
				.filter((x) => x.shortName)
				.map((x) => [x.shortName!, x])
		);
		return {
			faction: (id) => this.factions.getEntity(id),
			sector: (id) => this.sectors.getEntity(id),
			ship: (name) => ships.get(name),
			factionByShortName: (shortName) => byShortName.get(shortName),
		};
	})();

	private readonly saveTime = computed(() => this.save()?.info.gameTime ?? 0);
	readonly events = computed(() => EventLogRows.events(this.log()?.entries ?? [], this.saveTime(), this.lookups));
	readonly losses = computed(() => EventLogRows.losses(this.log()?.losses ?? [], this.saveTime(), this.lookups));
	readonly filteredEvents = computed(() => EventLogRows.filterEvents(this.events(), this.model()));
	readonly filteredLosses = computed(() => EventLogRows.filterLosses(this.losses(), this.model()));
	readonly summary = computed(() => LossSummaries.build(this.filteredLosses()));
	/** The log holds more entries than were kept. */
	readonly capped = computed(() => (this.log()?.total ?? 0) > (this.log()?.entries.length ?? 0));

	readonly categories = computed(() =>
		this.options(this.events(), (x) => x.category, (x) => EnumLabels.label(`log:${x.category}`))
	);
	/** The factions the entries name, or on the losses tab the killers' factions. */
	readonly factionOptions = computed(() =>
		this.tab() === 'losses'
			? this.options(this.losses(), (x) => x.killerFaction?.id ?? '', (x) => x.killerFaction?.name ?? '')
			: this.options(this.events(), (x) => x.factionKey, (x) => x.faction?.name ?? x.entry.factionName ?? '')
	);
	readonly sectorOptions = computed(() =>
		this.tab() === 'losses'
			? this.options(this.losses(), (x) => x.loss.sector ?? '', (x) => x.sector?.name ?? x.loss.sector ?? '')
			: this.options(this.events(), (x) => x.entry.sector ?? '', (x) => x.sector?.name ?? x.entry.sector ?? '')
	);

	readonly hasFilters = computed(() => {
		const model = this.model();
		return (Object.keys(EventLogQuery.DEFAULTS) as (keyof EventLogModel)[]).some((key) => model[key].trim() !== '');
	});

	constructor() {
		QueryParamSync.connect(
			computed(() => ({ tab: this.tab(), model: this.model() })),
			{ read: (params) => EventLogQuery.read(params), write: (state) => EventLogQuery.write(state) },
			({ tab, model }) => {
				this.tab.set(tab);
				this.model.set(model);
			}
		);
	}

	/** Sets one filter, e.g. from a summary tile. */
	filter(patch: Partial<EventLogModel>) {
		this.model.update((model) => ({ ...model, ...patch }));
	}

	clearFilters() {
		this.model.set({ ...EventLogQuery.DEFAULTS });
	}

	/** The distinct non-empty values with their count, by label. */
	private options<R>(rows: readonly R[], value: (row: R) => string, label: (row: R) => string): EventLogOption[] {
		const options = new Map<string, EventLogOption>();
		for (const row of rows) {
			const key = value(row);
			if (key) {
				const option = options.get(key) ?? { value: key, label: label(row) || key, count: 0 };
				option.count++;
				options.set(key, option);
			}
		}
		return [...options.values()].sort((a, b) => a.label.localeCompare(b.label));
	}
}
