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
import type { BlueprintItem, CategoryProgress, FactionTotal, ShoppingList } from './blueprint-model';
import { BlueprintProgress } from './blueprint-progress';
import { BlueprintQuery, type BlueprintTab, type BlueprintsModel, type ShoppingSection } from './blueprint-query';
import { BlueprintSellers, type SellerRules } from './blueprint-sellers';
import { BlueprintShoppingFilter } from './blueprint-shopping-filter';
import { BlueprintShoppingList } from './blueprint-shopping-list';

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
	private readonly sellerRules: SellerRules = {
		faction: (id) => this.factions.getEntity(id),
		noSale: BlueprintRules.noSaleFactions,
		soldByAll: new Set(BlueprintRules.soldByAll),
		sellingFactions: BlueprintRules.sellingFactions,
	};

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

	private readonly initial = BlueprintQuery.read(this.activatedRoute.snapshot.queryParamMap);
	readonly tab = signal<BlueprintTab>(this.initial.tab);
	/** The shopping list sub-tab. */
	readonly section = signal<ShoppingSection>(this.initial.section);
	readonly model = signal<BlueprintsModel>(this.initial.model);
	readonly form = form(this.model);
	private readonly search = computed(() => this.model().search.trim().toLowerCase());

	readonly progress = computed(() => BlueprintProgress.build(this.catalog, this.owned()));
	/** The progress categories the filters leave, each with the missing items matching the search. */
	readonly categories = computed<CategoryProgress[]>(() => {
		const { category, hideComplete } = this.model();
		const search = this.search();
		return this.progress()
			.categories.filter((x) => BlueprintCategories.includes(category, x.category.id))
			.filter((x) => !hideComplete || x.owned < x.total)
			.map((x) => (search ? { ...x, missing: x.missing.filter((i) => this.matches(i, search)) } : x))
			.filter((x) => !search || x.missing.length > 0);
	});

	/** The shopping list of the items the category and search filters leave. */
	readonly shopping = computed<ShoppingList>(() => {
		const { category } = this.model();
		const search = this.search();
		const representatives = this.representatives();
		return BlueprintShoppingList.build({
			items: this.catalog.filter(
				(x) => BlueprintCategories.includes(category, x.category) && this.matches(x, search)
			),
			owned: this.owned(),
			licences: this.licences(),
			relations: this.relations(),
			sellers: (x) => BlueprintSellers.of(x, { ...this.sellerRules, representatives }),
			missionOnly: BlueprintRules.missionOnly,
			unlockedBy: BlueprintRules.unlockedBy,
			gift: (x) => BlueprintSellers.gift(BlueprintRules.giftedBy[x.id], (id) => this.factions.getEntity(id)),
		});
	});
	/** The shopping list the faction and affordability filters leave too. */
	readonly filtered = computed<ShoppingList>(() => {
		const { faction, affordable } = this.model();
		return BlueprintShoppingFilter.apply(this.shopping(), { faction, affordable, money: this.money() });
	});
	/** The count and total price of the shown section. */
	readonly summary = computed(() => BlueprintShoppingFilter.summary(this.filtered()[this.section()]));
	/**
	 * The faction filter's choices: the factions selling in the shown section what the other filters leave, with
	 * their count and total. The chosen faction stays listed when it sells nothing there.
	 */
	readonly factionTotals = computed<FactionTotal[]>(() => {
		const section = this.section();
		if (section === 'unsold') {
			return [];
		}
		const { faction, affordable } = this.model();
		const entries = BlueprintShoppingFilter.affordable(this.shopping()[section], {
			faction,
			affordable,
			money: this.money(),
		});
		const totals = BlueprintShoppingFilter.factions(entries);
		const chosen = faction && !totals.some((x) => x.faction.id === faction) && this.factions.getEntity(faction);
		return chosen ? [...totals, { faction: chosen, count: 0, total: 0 }] : totals;
	});

	constructor() {
		// the tabs and the filters are kept in the URL
		QueryParamSync.connect(
			computed(() => ({ model: this.model(), tab: this.tab(), section: this.section() })),
			{ read: (params) => BlueprintQuery.read(params), write: (state) => BlueprintQuery.write(state) },
			({ model, tab, section }) => {
				this.model.set(model);
				this.tab.set(tab);
				this.section.set(section);
			}
		);
	}

	private matches(item: BlueprintItem, search: string): boolean {
		return !search || item.name.toLowerCase().includes(search);
	}
}
