import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { disabled, form, max, min } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { Economy } from '../economy/economy';
import { PlacementContext } from '../economy/placement-context';
import type { PlacementOptions, PlacementResult } from '../economy/placement-model';
import { PlacementRanking } from '../economy/placement-ranking';
import { PlacementRecipes } from '../economy/placement-recipes';
import { WareClasses } from '../economy/ware-classes';
import { ActiveSave } from '../savegame/active-save';
import { FilterLookups } from '../shared/services/filter-lookups';
import type { WareGroup } from '../shared/services/model/model';
import { ModuleService } from '../shared/services/module.service';
import { ShipListService } from '../shared/services/ship-list.service';
import { SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import {
	StationSuggestionsLookups,
	StationSuggestionsModel,
	StationSuggestionsQuery,
} from './station-suggestions-query';
import { StationSuggestionRow, StationSuggestionTexts } from './station-suggestions-row';

/**
 * State of the station suggestions page: the filters (a signal form kept in the URL query params), the placement
 * context of the active save, the ranked rows and the picked row. Provided by the page.
 */
@Injectable()
export class StationSuggestionsStore {
	private readonly activeSave = inject(ActiveSave);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly sectorService = inject(SectorService);
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly shipService = inject(ShipListService);

	readonly save = this.activeSave.save;
	readonly saveMap = this.activeSave.map;
	private readonly relations = this.activeSave.relations;
	readonly status = this.activeSave.status;
	readonly gameTime = this.activeSave.gameTime;
	/** The sectors of the save, by name. */
	readonly sectors = this.activeSave.sectors;

	/** The placement context of the save; the station flows are worked out once per save. */
	readonly context = computed(() => {
		const map = this.saveMap();
		if (!map) {
			return undefined;
		}
		const building = WareClasses.GAME_BUILDING;
		const sectors = this.sectorService.getEntities();
		const economy = new Economy(map, this.wareService, this.moduleService, sectors, building);
		const recipes = new PlacementRecipes(this.wareService, this.moduleService);
		// all building materials are marked: the demand of ship and station building is not counted for any of them
		const materials = new Set([...building.only, ...building.partly]);
		return new PlacementContext(
			economy,
			this.wareService,
			recipes,
			sectors,
			map,
			this.relations(),
			materials,
			this.shipService.getEntities()
		);
	});
	/** The wares a factory can be suggested for, by name. */
	readonly wares = computed(() =>
		(this.context()?.candidates() ?? [])
			.map((id) => ({ id, name: this.wareName(id), group: this.wareService.getEntity(id)?.group }))
			.sort((a, b) => a.name.localeCompare(b.name))
	);
	/** The ware groups of those wares, in the order of the ware lists. */
	readonly groups = computed(() => {
		const seen = new Map<string, WareGroup>();
		this.wares().forEach((x) => x.group && seen.set(x.group.id, x.group));
		return [...seen.values()].sort((a, b) => this.wareService.compareGroups(a, b));
	});

	private readonly lookups: StationSuggestionsLookups = new FilterLookups(this.sectorService, this.wareService);

	readonly model = signal<StationSuggestionsModel>(
		StationSuggestionsQuery.read(this.activatedRoute.snapshot.queryParamMap, this.lookups)
	);
	readonly form = form(this.model, (x) => {
		min(x.jumps, StationSuggestionsQuery.RANGES.jumps.min);
		max(x.jumps, StationSuggestionsQuery.RANGES.jumps.max);
		disabled(x.ware, ({ valueOf }) => valueOf(x.mode) !== StationSuggestionsQuery.WHERE);
		disabled(x.sector, ({ valueOf }) => valueOf(x.mode) !== StationSuggestionsQuery.HERE);
	});
	private readonly filterModel = computed(() => StationSuggestionsQuery.clean(this.model()));
	private readonly pickKey = signal(this.activatedRoute.snapshot.queryParamMap.get('pick') ?? '');

	readonly here = computed(() => this.filterModel().mode === StationSuggestionsQuery.HERE);
	readonly closed = computed(() => this.filterModel().loop === StationSuggestionsQuery.CLOSED);
	readonly jumps = computed(() => this.filterModel().jumps);
	/** The sector of what to build here, undefined in the other mode or for an unknown name. */
	readonly centre = computed(() => (this.here() ? this.lookups.sectorId(this.filterModel().sector) : undefined));
	/** Kept while the values stay the same. */
	readonly options = computed<PlacementOptions>(
		() => {
			const model = this.filterModel();
			return {
				loop: model.loop,
				jumps: model.jumps,
				hideHostile: model.hideHostile,
				includePlayer: model.player,
				rank: model.rank,
			};
		},
		{
			equal: (a, b) =>
				a.loop === b.loop &&
				a.jumps === b.jumps &&
				a.hideHostile === b.hideHostile &&
				a.includePlayer === b.includePlayer &&
				a.rank === b.rank,
		}
	);
	/** The centre is owned by a faction hostile to the player and hostile sectors are left out. */
	readonly centreHostile = computed(() => {
		const centre = this.centre();
		return !!centre && this.options().hideHostile && !!this.context()?.hostile(centre);
	});

	private readonly filteredWares = computed(() => {
		const { group, ware } = this.filterModel();
		const here = this.here();
		return this.wares()
			.filter((x) => (!group || x.group?.id === group) && (here || !ware || x.id === ware))
			.map((x) => x.id);
	});

	readonly result = computed<PlacementResult>(() => {
		const context = this.context();
		const centre = this.centre();
		if (!context || (this.here() && !centre)) {
			return { spots: [], total: 0 };
		}
		return centre
			? PlacementRanking.here(context, centre, this.filteredWares(), this.options())
			: PlacementRanking.where(context, this.filteredWares(), this.options());
	});
	readonly rows = computed<StationSuggestionRow[]>(() =>
		this.result().spots.map((x) => ({
			...x,
			key: StationSuggestionTexts.key(x.ware, x.sector),
			name: this.wareName(x.ware) + (x.building ? '*' : ''),
			sectorName: this.sectorName(x.sector),
			group: this.wareService.getEntity(x.ware)?.group?.id ?? '',
			contributors: StationSuggestionTexts.contributors(x.targets, (id) => this.sectorName(id)),
		}))
	);
	/** The row named in the URL, else the first. */
	readonly selected = computed(() => QueryParamSync.pick(this.rows(), this.pickKey(), (x) => x.key));

	/** The closed-loop station of the picked row: its modules sized like the calculator's autofill. */
	readonly chain = computed(() => {
		const row = this.selected();
		const context = this.context();
		const recipe = row && context && this.closed() ? context.recipes.recipe(row.ware) : undefined;
		if (!row || !context || !recipe) {
			return undefined;
		}
		return context.recipes.chains.chain(recipe.module, row.modules, this.chainSunlight());
	});
	/** The sunlight of the picked row's sector, which sizes its chain; 1 = 100%. */
	readonly chainSunlight = computed(() => {
		const row = this.selected();
		return (row && this.context()?.sector(row.sector)?.sunlight) ?? 1;
	});

	constructor() {
		// once the save is known, a ware no factory is suggested for, or a pick that is not in the table, is dropped
		effect(() => {
			if (!this.context()) {
				return;
			}
			const { ware } = this.model();
			if (ware && !this.wares().some((x) => x.id === ware)) {
				untracked(() => this.model.update((x) => ({ ...x, ware: '' })));
				return;
			}
			// while a sector name is being typed there is no table yet, so the pick is kept
			const pick = this.pickKey();
			const typing = this.here() && !this.centre();
			if (pick && !typing && !this.rows().some((x) => x.key === pick)) {
				untracked(() => this.pickKey.set(''));
			}
		});
		// the filters and the pick are kept in the URL
		QueryParamSync.connect(
			computed(() => ({ model: this.filterModel(), pick: this.pickKey() })),
			{
				read: (params) => ({
					model: StationSuggestionsQuery.read(params, this.lookups),
					pick: params.get('pick') ?? '',
				}),
				write: ({ model, pick }) => ({
					...StationSuggestionsQuery.write(model, this.lookups),
					pick: pick || null,
				}),
			},
			({ model, pick }) => {
				this.model.set(model);
				this.pickKey.set(pick);
			}
		);
	}

	select(row: StationSuggestionRow): void {
		this.pickKey.set(row.key);
	}

	/** Shows what to build in a sector, as a click on the map does. */
	showSector(sectorId: string): void {
		const name = this.sectorService.getEntity(sectorId)?.name;
		if (name) {
			this.pickKey.set('');
			this.model.update((x) => ({ ...x, mode: StationSuggestionsQuery.HERE, sector: name }));
		}
	}

	sectorName(id: string): string {
		return this.sectorService.getEntity(id)?.name ?? id;
	}

	moduleName(id: string): string {
		return this.moduleService.getEntity(id)?.name ?? id;
	}

	shipName(id: string): string {
		return this.shipService.getEntity(id)?.name ?? id;
	}

	wareName(id: string): string {
		return this.wareService.getEntity(id)?.name ?? id;
	}
}
