import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { LocalStorage } from '../core/services/local-storage';
import { GAME_VERSIONS } from '../shared/services/constants';
import { ShipListService } from '../shared/services/ship-list.service';
import { SectorService } from '../shared/services/universe.service';
import { GameStartFilter } from './game-start-filter';
import type { GameStart } from './game-start-model';
import { GameStartQuery, type GameStartsModel } from './game-start-query';
import { GameStartSummaries, type GameStartSummary } from './game-start-summary';
import { GameStartTypes } from './game-start-types';
import { GameStartService } from './game-start.service';

/**
 * State of the game starts page: the filters (a signal form kept in the URL query params), the content packs the
 * viewer owns (kept in local storage) and the starts they leave. Provided by the page.
 */
@Injectable()
export class GameStartsStore {
	private readonly ships = inject(ShipListService);
	private readonly sectors = inject(SectorService);
	private readonly starts = inject(GameStartService).getEntities();

	readonly typeFilters = GameStartTypes.FILTERS.map((value) => ({ value, label: GameStartTypes.filterLabel(value) }));
	/** The DLCs, for the owned checkboxes. */
	readonly dlcs = GAME_VERSIONS.map((label, version) => ({ version, label })).slice(1);

	readonly model = signal<GameStartsModel>(GameStartQuery.read(inject(ActivatedRoute).snapshot.queryParamMap));
	readonly form = form(this.model);

	/** Owned content packs, indexed by version; stored as the list of the ones not owned, so new DLCs start owned. */
	readonly owned = LocalStorage.persistedSignal<boolean[]>(
		'game-starts-owned',
		GAME_VERSIONS.map(() => true),
		{
			parse: (value) => (Array.isArray(value) ? GAME_VERSIONS.map((_, i) => !value.includes(i)) : undefined),
			serialize: (value) => value.flatMap((owned, i) => (owned ? [] : [i])),
		}
	);
	readonly ownedForm = form(this.owned);
	readonly notOwnedCount = computed(() => this.owned().filter((x) => !x).length);

	readonly filtered = computed<GameStartSummary[]>(() => {
		const { type, search } = this.model();
		return GameStartFilter.apply(this.starts, {
			type,
			search: search.trim().toLowerCase(),
			owned: this.owned(),
		}).map((x) => this.summary(x));
	});

	/** How many starts the DLC choice hides. */
	readonly hiddenByDlc = computed(() => {
		const { type } = this.model();
		const owned = this.owned();
		return this.starts.filter((x) => GameStartTypes.matches(type, x) && !GameStartFilter.owned(x, owned)).length;
	});

	constructor() {
		QueryParamSync.connect(
			this.model,
			{ read: (params) => GameStartQuery.read(params), write: (state) => GameStartQuery.write(state) },
			(state) => this.model.set(state)
		);
	}

	reset(): void {
		this.model.set({ ...GameStartQuery.DEFAULTS, view: this.model().view });
		this.owned.set(GAME_VERSIONS.map(() => true));
	}

	private summary(start: GameStart): GameStartSummary {
		return GameStartSummaries.of(
			start,
			(id) => this.ships.getEntity(id),
			(id) => this.sectors.getEntity(id)
		);
	}
}
