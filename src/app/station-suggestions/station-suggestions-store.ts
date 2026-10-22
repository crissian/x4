import { DestroyRef, Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { disabled, form, max, min } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { Economy } from '../economy/economy';
import { PlacementContext } from '../economy/placement-context';
import type { PlacementOptions, PlacementResult } from '../economy/placement-model';
import { PlacementRanking } from '../economy/placement-ranking';
import { PlacementRecipes } from '../economy/placement-recipes';
import { WareClasses } from '../economy/ware-classes';
import type { SaveMap, SaveRelations } from '../savegame/map/save-map-model';
import { SavegameFormat } from '../savegame/savegame-format';
import { SavegameStore } from '../savegame/savegame-store';
import type { WareGroup } from '../shared/services/model/model';
import { ModuleService } from '../shared/services/module.service';
import { ShipService } from '../shared/services/ship.service';
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
	private readonly savegames = inject(SavegameStore);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly sectorService = inject(SectorService);
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly shipService = inject(ShipService);

	readonly save = this.savegames.active;
	readonly saveMap = computed(() => this.save()?.data?.['map'] as SaveMap | undefined);
	private readonly relations = computed(() => this.save()?.data?.['relations'] as SaveRelations | undefined);
	/** The save has no map data and must be loaded again. */
	readonly saveOutdated = computed(() => {
		const save = this.save();
		return !!save && !this.saveMap() && this.savegames.status(save.id) === 'reload-needed';
	});
	readonly gameTime = computed(() => SavegameFormat.time(this.save()?.info.gameTime ?? 0));

	/** The sectors of the save, by name. */
	readonly sectors = computed(() => {
		const ids = new Set((this.saveMap()?.sectors ?? []).map((x) => x.id));
		return this.sectorService
			.getEntities()
			.filter((x) => ids.has(x.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	/** The placement context of the save; the station flows are worked out once per save. */
	readonly context = computed(() => {
		const map = this.saveMap();
		if (!map) {
			return undefined;
		}
		const building = WareClasses.buildingMaterials(
			this.shipService.getEntities(),
			this.moduleService.getEntities(),
			this.wareService.getEntities()
		);
		const sectors = this.sectorService.getEntities();
		const economy = new Economy(map, this.wareService, this.moduleService, sectors, building);
		const recipes = new PlacementRecipes(this.wareService, this.moduleService);
		return new PlacementContext(economy, this.wareService, recipes, sectors, map, this.relations(), building.only);
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

	private readonly lookups: StationSuggestionsLookups = {
		ware: (id) => !!id && !!this.wareService.getEntity(id),
		group: (id) => !!id && this.wareService.getEntities().some((x) => x.group?.id === id),
		sectorName: (id) => this.sectorService.getEntity(id)?.name,
		sectorId: (name) => {
			const key = name.trim().toLowerCase();
			return key ? this.sectorService.getEntities().find((x) => x.name.toLowerCase() === key)?.id : undefined;
		},
	};

	readonly model = signal<StationSuggestionsModel>(
		StationSuggestionsQuery.read(this.activatedRoute.snapshot.queryParamMap, this.lookups)
	);
	readonly form = form(this.model, (x) => {
		min(x.jumps, StationSuggestionsQuery.JUMPS.min);
		max(x.jumps, StationSuggestionsQuery.JUMPS.max);
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
			};
		},
		{
			equal: (a, b) =>
				a.loop === b.loop &&
				a.jumps === b.jumps &&
				a.hideHostile === b.hideHostile &&
				a.includePlayer === b.includePlayer,
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
	readonly selected = computed(() => {
		const rows = this.rows();
		const key = this.pickKey();
		return rows.find((x) => x.key === key) ?? rows[0];
	});

	/** The closed-loop station of the picked row: its modules sized like the calculator's autofill. */
	readonly chain = computed(() => {
		const row = this.selected();
		const context = this.context();
		const recipe = row && context && this.closed() ? context.recipes.recipe(row.ware) : undefined;
		if (!row || !context || !recipe) {
			return undefined;
		}
		return context.recipes.chains.chain(recipe.module, row.modules, context.sector(row.sector)?.sunlight ?? 1);
	});

	/** The URL params last written to, or read from, the URL. */
	private urlKey = '';

	constructor() {
		effect(() => {
			const queryParams = this.params(this.filterModel(), this.pickKey());
			const key = JSON.stringify(queryParams);
			if (key === this.urlKey) {
				return;
			}
			this.urlKey = key;
			untracked(
				() =>
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams,
						queryParamsHandling: 'merge',
						replaceUrl: true,
					})
			);
		});
		// the form follows URL changes it didn't write itself, such as the header link clearing the params
		const subscription = this.activatedRoute.queryParamMap.pipe(skip(1)).subscribe((params) => {
			const model = StationSuggestionsQuery.read(params, this.lookups);
			const pick = params.get('pick') ?? '';
			const key = JSON.stringify(this.params(StationSuggestionsQuery.clean(model), pick));
			if (key !== this.urlKey) {
				this.urlKey = key;
				this.model.set(model);
				this.pickKey.set(pick);
			}
		});
		inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
	}

	private params(model: StationSuggestionsModel, pick: string) {
		return { ...StationSuggestionsQuery.write(model, this.lookups), pick: pick || null };
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

	wareName(id: string): string {
		return this.wareService.getEntity(id)?.name ?? id;
	}
}
