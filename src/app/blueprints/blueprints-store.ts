import { DestroyRef, Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import type { SaveBlueprints, SaveLicences, SaveRelations } from '../savegame/map/save-map-model';
import { SavegameFormat } from '../savegame/savegame-format';
import { SavegameStore } from '../savegame/savegame-store';
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

export type BlueprintsStatus = 'no-save' | 'loading' | 'reload-needed' | 'ready';

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
	private readonly savegames = inject(SavegameStore);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly factions = inject(FactionService);

	readonly save = this.savegames.active;
	private readonly blueprints = computed(() => this.save()?.data?.['blueprints'] as SaveBlueprints | undefined);
	private readonly licences = computed(() => (this.save()?.data?.['licences'] as SaveLicences | undefined) ?? {});
	private readonly relations = computed(() => (this.save()?.data?.['relations'] as SaveRelations | undefined) ?? {});
	readonly status = computed<BlueprintsStatus>(() => {
		const save = this.save();
		if (!save) {
			return 'no-save';
		}
		if (this.blueprints()) {
			return 'ready';
		}
		return this.savegames.status(save.id) === 'updating' ? 'loading' : 'reload-needed';
	});
	readonly gameTime = computed(() => SavegameFormat.time(this.save()?.info.gameTime ?? 0));
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
					BlueprintRules.noSaleFactions
				),
			missionOnly: BlueprintRules.missionOnly,
			unlockedBy: BlueprintRules.unlockedBy,
		});
	});
	readonly reputationRows = computed<ReputationRow[]>(() =>
		this.shopping().reputation.flatMap(({ item, sellers }) => sellers.map((seller) => ({ item, seller })))
	);

	/** The URL params last written to, or read from, the URL; used to skip writes that change nothing. */
	private urlKey = '';

	constructor() {
		// the tab and the filters are kept in the URL
		effect(() => {
			const queryParams = BlueprintQuery.write(this.model(), this.tab());
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
			const model = BlueprintQuery.read(params);
			const tab = BlueprintQuery.tab(params);
			const key = JSON.stringify(BlueprintQuery.write(model, tab));
			if (key !== this.urlKey) {
				this.urlKey = key;
				this.model.set(model);
				this.tab.set(tab);
			}
		});
		inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
	}

	private matches(item: BlueprintItem, search: string): boolean {
		return !search || item.name.toLowerCase().includes(search);
	}
}
