import { BlueprintCategories } from './blueprint-categories';
import type { BlueprintItem, BlueprintProgressResult, CategoryProgress } from './blueprint-model';

/** How many blueprints of each category the player owns. */
export class BlueprintProgress {
	/** @returns the categories with items, in `BlueprintCategories.ALL` order, each with its missing items by name */
	static build(items: readonly BlueprintItem[], owned: ReadonlySet<string>): BlueprintProgressResult {
		const byCategory = new Map<string, BlueprintItem[]>();
		for (const item of items) {
			byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
		}
		const categories: CategoryProgress[] = BlueprintCategories.ALL.filter((x) => byCategory.has(x.id)).map(
			(category) => {
				const list = byCategory.get(category.id)!;
				return {
					category,
					owned: list.filter((x) => owned.has(x.id)).length,
					total: list.length,
					missing: list.filter((x) => !owned.has(x.id)).sort((a, b) => a.name.localeCompare(b.name)),
				};
			}
		);
		const ids = new Set(items.map((x) => x.id));
		return {
			categories,
			owned: categories.reduce((sum, x) => sum + x.owned, 0),
			total: items.length,
			other: [...owned].filter((x) => !ids.has(x)).length,
		};
	}
}
