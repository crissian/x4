import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QueryParamSync } from '../../core/router/query-param-sync';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { RowNavigation } from '../../shared/components/row-navigation';
import { CraftingItemService, EquipmentModService } from '../../shared/services/equipment-mod.service';
import type { CraftingItem } from '../../shared/services/model/equipment-mod';
import { CraftingService } from '../crafting-index';
import { type CraftingModel, CraftingQuery } from '../crafting-query';
import { CraftingTags } from '../crafting-tags';
import { ModSlots } from '../mod-slots';
import { IngredientListComponent } from './ingredient-list.component';
import { RecipeUsesComponent } from './recipe-uses.component';

/**
 * Crafting at a glance: what a mod or item takes, what an item crafts into, and every crafting item with where to
 * find it. The picks are kept in the URL.
 */
@Component({
	imports: [DataGridComponent, FormField, IngredientListComponent, RecipeUsesComponent, RouterLink],
	templateUrl: './crafting-page.component.html',
})
export class CraftingPageComponent {
	private readonly crafting = inject(CraftingService);
	private readonly items = inject(CraftingItemService);
	private readonly mods = inject(EquipmentModService);

	private readonly known = {
		recipe: (id: string) => !!this.crafting.recipe(id),
		item: (id: string) => !!this.items.getEntity(id),
	};
	protected readonly model = signal<CraftingModel>(
		CraftingQuery.read(inject(ActivatedRoute).snapshot.queryParamMap, this.known)
	);
	protected readonly form = form(this.model);

	/** The recipes to pick from: the mods by slot, then the items. */
	protected readonly recipeGroups = [
		...ModSlots.ALL.map((slot) => ({
			label: ModSlots.label(slot),
			options: this.crafting.recipes
				.filter((x) => x.kind === 'mod' && this.mods.getEntity(x.ware.id)?.slot === slot)
				.map((x) => x.ware),
		})),
		{
			label: $localize`:crafting kind:Items`,
			options: this.crafting.recipes.filter((x) => x.kind === 'item').map((x) => x.ware),
		},
	];
	/** The items that go into a recipe, by name. */
	protected readonly ingredients = this.items
		.getEntities()
		.filter((x) => this.crafting.usedIn(x.id).length)
		.sort((a, b) => a.name.localeCompare(b.name));

	protected readonly recipe = computed(() => this.crafting.recipe(this.model().craft));
	protected readonly times = computed(() => CraftingQuery.times(this.model()));
	protected readonly have = computed(() => this.items.getEntity(this.model().have));

	protected readonly allItems = this.items.getEntities();
	protected readonly itemColumns: GridColumn<CraftingItem>[] = [
		{ key: 'name', caption: $localize`Item` },
		{ key: 'kind', caption: $localize`Kind`, value: (x) => CraftingTags.label(x) },
		{
			key: 'sources',
			caption: $localize`Found in`,
			value: (x) => (x.sources ?? []).map((s) => this.mods.source(s)).join(', '),
		},
		{ key: 'uses', caption: $localize`Used in`, type: 'number', value: (x) => this.crafting.usedIn(x.id).length },
		{
			key: 'craftable',
			caption: $localize`Craftable`,
			value: (x) => (this.crafting.recipe(x.id) ? $localize`:@@yes:Yes` : $localize`:@@no:No`),
		},
		{ key: 'price.avg', caption: $localize`Price`, type: 'number', hidden: true },
	];
	protected readonly openItem = RowNavigation.to<CraftingItem>('/mods/items', (x) => x.id);

	constructor() {
		QueryParamSync.connect(
			this.model,
			{ read: (params) => CraftingQuery.read(params, this.known), write: (model) => CraftingQuery.write(model) },
			(model) => this.model.set(model)
		);
	}

	protected link(id: string): string[] {
		return this.crafting.link(id);
	}
}
