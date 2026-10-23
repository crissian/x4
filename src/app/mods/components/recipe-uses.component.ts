import { Component, computed, inject, input } from '@angular/core';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { CraftingService, type RecipeUse } from '../crafting-index';

/** The recipes an ingredient goes into, with how many of it each takes. */
@Component({
	selector: 'app-recipe-uses',
	imports: [DataGridComponent],
	templateUrl: './recipe-uses.component.html',
})
export class RecipeUsesComponent {
	/** the ingredient's ware id */
	readonly ware = input.required<string>();
	private readonly crafting = inject(CraftingService);

	protected readonly uses = computed(() => this.crafting.usedIn(this.ware()));

	protected readonly columns: GridColumn<RecipeUse>[] = [
		{
			key: 'recipe.ware.name',
			caption: $localize`Crafts`,
			link: (x) => this.crafting.link(x.recipe.ware.id),
		},
		{
			key: 'recipe.kind',
			caption: $localize`Kind`,
			lookup: [
				{ value: 'mod', label: $localize`:crafting kind:Equipment mod` },
				{ value: 'item', label: $localize`:crafting kind:Item` },
			],
		},
		{ key: 'amount', caption: $localize`Needs`, type: 'number' },
		{
			key: 'others',
			caption: $localize`Other ingredients`,
			value: (x) =>
				x.recipe.ingredients
					.filter((i) => i.ware !== this.ware())
					.map((i) => `${i.amount}× ${this.crafting.name(i.ware)}`)
					.join(', '),
		},
	];
	protected readonly track = (x: RecipeUse) => x.recipe.ware.id;
}
