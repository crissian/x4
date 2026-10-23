import { Component, computed, inject, input } from '@angular/core';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { CraftingItemService, EquipmentModService } from '../../shared/services/equipment-mod.service';
import type { Ingredient } from '../../shared/services/model/equipment-mod';
import { CraftingService } from '../crafting-index';

interface IngredientRow {
	id: string;
	name: string;
	amount: number;
	/** where to find it */
	sources: string;
	/** it has a recipe of its own */
	craftable: boolean;
}

/** The ingredients of a recipe, `times` over, with where to find each; the names link to the item pages. */
@Component({
	selector: 'app-ingredient-list',
	imports: [DataGridComponent],
	templateUrl: './ingredient-list.component.html',
})
export class IngredientListComponent {
	readonly ingredients = input.required<readonly Ingredient[]>();
	readonly times = input(1);

	private readonly items = inject(CraftingItemService);
	private readonly mods = inject(EquipmentModService);
	private readonly crafting = inject(CraftingService);

	protected readonly rows = computed<IngredientRow[]>(() =>
		this.ingredients().map((x) => {
			const item = this.items.getEntity(x.ware);
			return {
				id: x.ware,
				name: item?.name ?? x.ware,
				amount: x.amount * this.times(),
				sources: (item?.sources ?? []).map((s) => this.mods.source(s)).join(', '),
				craftable: !!this.crafting.recipe(x.ware),
			};
		})
	);

	protected readonly columns: GridColumn<IngredientRow>[] = [
		{ key: 'name', caption: $localize`Ingredient`, link: (x) => this.crafting.link(x.id) },
		{ key: 'amount', caption: $localize`Amount`, type: 'number' },
		{
			key: 'sources',
			caption: $localize`Found in`,
			display: (x) =>
				x.craftable
					? [x.sources, $localize`:ingredient source:craftable`].filter(Boolean).join(', ')
					: x.sources,
		},
	];
}
