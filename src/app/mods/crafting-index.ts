import { Injectable, inject } from '@angular/core';
import { CraftingItemService, EquipmentModService } from '../shared/services/equipment-mod.service';
import type { CraftingItem, CraftingWare, EquipmentMod, Ingredient } from '../shared/services/model/equipment-mod';

/** Something the player can craft: an equipment mod or an inventory item with a recipe. */
export interface Recipe {
	ware: CraftingWare;
	/** a mod (its page is under /mods) or an item (/mods/items) */
	kind: 'mod' | 'item';
	ingredients: Ingredient[];
}

/** A recipe that takes an ingredient, with how many of it. */
export interface RecipeUse {
	recipe: Recipe;
	amount: number;
}

/** What crafts into what: the recipes, and the recipes each ingredient goes into. */
export class CraftingIndex {
	readonly recipes: readonly Recipe[];
	private readonly byId: ReadonlyMap<string, Recipe>;
	private readonly uses = new Map<string, RecipeUse[]>();
	private readonly kinds = new Map<string, Recipe['kind']>();
	private readonly names = new Map<string, string>();

	constructor(mods: readonly EquipmentMod[], items: readonly CraftingItem[]) {
		for (const [list, kind] of [
			[mods, 'mod'],
			[items, 'item'],
		] as const) {
			list.forEach((x) => {
				this.kinds.set(x.id, kind);
				this.names.set(x.id, x.name);
			});
		}
		// scenario mods are left out: the player never gets their recipe
		this.recipes = [
			...mods.filter((x) => !x.notForPlayer).map((ware) => ({ ware, kind: 'mod' as const })),
			...items.map((ware) => ({ ware, kind: 'item' as const })),
		]
			.filter((x) => x.ware.ingredients?.length)
			.map((x) => ({ ...x, ingredients: x.ware.ingredients! }));
		this.byId = new Map(this.recipes.map((x) => [x.ware.id, x]));

		for (const recipe of this.recipes) {
			for (const ingredient of recipe.ingredients) {
				const list = this.uses.get(ingredient.ware) ?? [];
				list.push({ recipe, amount: ingredient.amount });
				this.uses.set(ingredient.ware, list);
			}
		}
	}

	/** The recipe of a ware; undefined when it can't be crafted. */
	recipe(id: string): Recipe | undefined {
		return this.byId.get(id);
	}

	/** The recipes the ingredient goes into. */
	usedIn(id: string): readonly RecipeUse[] {
		return this.uses.get(id) ?? [];
	}

	/** The name of a mod or crafting item; the id when unknown. */
	name(id: string): string {
		return this.names.get(id) ?? id;
	}

	/** The page of a mod or crafting item, as router link commands. */
	link(id: string): string[] {
		return this.kinds.get(id) === 'mod' ? ['/mods', id] : ['/mods/items', id];
	}
}

/** The crafting index of the game data. */
@Injectable({ providedIn: 'root' })
export class CraftingService extends CraftingIndex {
	constructor() {
		super(inject(EquipmentModService).getEntities(), inject(CraftingItemService).getEntities());
	}
}
