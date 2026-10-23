import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { ActiveSave } from '../savegame/active-save';
import { BlueprintRules } from '../shared/services/data/blueprint-rules-data';
import { EquipmentService } from '../shared/services/equipment.service';
import { FactionService } from '../shared/services/faction.service';
import { ModuleService } from '../shared/services/module.service';
import { ShipService } from '../shared/services/ship.service';
import { BlueprintCatalog } from './blueprint-catalog';
import { BlueprintCategories } from './blueprint-categories';
import type { BlueprintItem, CategoryProgress, ReputationSeller, ShoppingList } from './blueprint-model';
import { BlueprintProgress } from './blueprint-progress';
import { BlueprintQuery, type BlueprintTab, type BlueprintsModel } from './blueprint-query';
import { BlueprintSellers } from './blueprint-sellers';
import { BlueprintShoppingList } from './blueprint-shopping-list';

/** A row of the "need more reputation" table: one seller of one item. */
export interface ReputationRow {
	item: BlueprintItem;
	seller: ReputationSeller;
}

/**
 * State of the blueprints page: the player's blueprints, licences and reputation from the active save, the progress
 * per category, the shopping list and the filters (a signal form kept in the URL query params). Provided by the page.
 */
@Injectable()
export class BlueprintsStore {
	private readonly activeSave = inject(ActiveSave);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly factions = inject(FactionService);

	readonly save = this.activeSave.save;
	private readonly blueprints = this.activeSave.blueprints;
	private readonly licences = computed(() => this.activeSave.licences() ?? {});
	private readonly relations = computed(() => this.activeSave.relations() ?? {});
	/** unknown for saves read before representatives were extracted */
	private readonly representatives = computed(() => {
		const ids = this.activeSave.representatives();
		return ids && new Set(ids);
	});
	readonly status = this.activeSave.statusOf(this.blueprints);
	readonly gameTime = this.activeSave.gameTime;
	readonly money = computed(() => this.save()?.info.money ?? 0);
	private readonly owned = computed(() => new Set(this.blueprints() ?? []));

	/** Every blueprint the player can own. */
	readonly catalog = BlueprintCatalog.build(
		inject(ModuleService).getEntities(),
		inject(ShipService).getEntities(),
		inject(EquipmentService).getEntities(),
		BlueprintRules.notForPlayer
	);
	/** The categories by kind, for the category filter. */
	readonly kinds = BlueprintCategories.KINDS.map((kind) => ({
		...kind,
		categories: BlueprintCategories.ALL.filter((x) => x.kind === kind.kind),
	}));

	readonly tab = signal<BlueprintTab>(BlueprintQuery.tab(this.activatedRoute.snapshot.queryParamMap));
	readonly model = signal<BlueprintsModel>(BlueprintQuery.read(this.activatedRoute.snapshot.queryParamMap));
	readonly form = form(this.model);
	private readonly search = computed(() => this.model().search.trim().toLowerCase());

	readonly progress = computed(() => BlueprintProgress.build(this.catalog, this.owned()));
	/** The progress categories the filters leave, each with the missing items matching the search. */
	readonly categories = computed<CategoryProgress[]>(() => {
		const { category, hideComplete } = this.model();
		const search = this.search();
		return this.progress()
			.categories.filter((x) => !category || x.category.id === category)
			.filter((x) => !hideComplete || x.owned < x.total)
			.map((x) => (search ? { ...x, missing: x.missing.filter((i) => this.matches(i, search)) } : x))
			.filter((x) => !search || x.missing.length > 0);
	});

	/** The shopping list of the items the filters leave. */
	readonly shopping = computed<ShoppingList>(() => {
		const { category } = this.model();
		const search = this.search();
		const representatives = this.representatives();
		return BlueprintShoppingList.build({
			items: this.catalog.filter((x) => (!category || x.category === category) && this.matches(x, search)),
			owned: this.owned(),
			licences: this.licences(),
			relations: this.relations(),
			sellers: (x) =>
				BlueprintSellers.of(
					x.owners,
					x.license,
					(id) => this.factions.getEntity(id),
					BlueprintRules.noSaleFactions,
					representatives
				),
			missionOnly: BlueprintRules.missionOnly,
			unlockedBy: BlueprintRules.unlockedBy,
		});
	});
	readonly reputationRows = computed<ReputationRow[]>(() =>
		this.shopping().reputation.flatMap(({ item, sellers }) => sellers.map((seller) => ({ item, seller })))
	);

	constructor() {
		// the tab and the filters are kept in the URL
		QueryParamSync.connect(
			computed(() => ({ model: this.model(), tab: this.tab() })),
			{
				read: (params) => ({ model: BlueprintQuery.read(params), tab: BlueprintQuery.tab(params) }),
				write: ({ model, tab }) => BlueprintQuery.write(model, tab),
			},
			({ model, tab }) => {
				this.model.set(model);
				this.tab.set(tab);
			}
		);
	}

	private matches(item: BlueprintItem, search: string): boolean {
		return !search || item.name.toLowerCase().includes(search);
	}
}
