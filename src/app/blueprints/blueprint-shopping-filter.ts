import type { BlueprintItem, BlueprintSeller, FactionTotal, ShoppingList } from './blueprint-model';

/** The shopping list filters beyond category and search. */
export interface ShoppingFilter {
	/** a faction id: only what this faction sells; empty for all */
	faction: string;
	/** only items whose price is at most `money` */
	affordable: boolean;
	/** the player's money, as of save time */
	money: number;
}

/** An entry of a shopping list section with sellers: buy now or need more reputation. */
interface SoldEntry<S extends BlueprintSeller> {
	item: BlueprintItem;
	sellers: S[];
}

/**
 * Narrows a shopping list to what one faction sells and what the player can afford, and sums up its sections. The
 * not-sold section has no sellers or price to act on, so it is left as is.
 */
export class BlueprintShoppingFilter {
	static apply(list: ShoppingList, filter: ShoppingFilter): ShoppingList {
		return {
			buy: BlueprintShoppingFilter.ofFaction(
				BlueprintShoppingFilter.affordable(list.buy, filter),
				filter.faction
			),
			reputation: BlueprintShoppingFilter.ofFaction(
				BlueprintShoppingFilter.affordable(list.reputation, filter),
				filter.faction
			),
			unsold: list.unsold,
		};
	}

	/** The entries the player can pay for, when the filter asks for that. */
	static affordable<E extends { item: BlueprintItem }>(entries: E[], filter: ShoppingFilter): E[] {
		return filter.affordable ? entries.filter((x) => x.item.price <= filter.money) : entries;
	}

	/** The entries a faction sells, its seller moved first; all entries for no faction. */
	static ofFaction<S extends BlueprintSeller, E extends SoldEntry<S>>(entries: E[], faction: string): E[] {
		if (!faction) {
			return entries;
		}
		return entries
			.filter((x) => x.sellers.some((s) => s.faction.id === faction))
			.map((x) => ({
				...x,
				sellers: [
					...x.sellers.filter((s) => s.faction.id === faction),
					...x.sellers.filter((s) => s.faction.id !== faction),
				],
			}));
	}

	/** How many entries, and for how much, each selling faction has; by faction name. */
	static factions(entries: readonly SoldEntry<BlueprintSeller>[]): FactionTotal[] {
		const totals = new Map<string, FactionTotal>();
		for (const { item, sellers } of entries) {
			for (const { faction } of sellers) {
				const total = totals.get(faction.id) ?? { faction, count: 0, total: 0 };
				total.count++;
				total.total += item.price;
				totals.set(faction.id, total);
			}
		}
		return [...totals.values()].sort((a, b) => a.faction.name.localeCompare(b.faction.name));
	}

	/** Every entry once: how many and their total price. */
	static summary(entries: readonly { item: BlueprintItem }[]): { count: number; total: number } {
		return { count: entries.length, total: entries.reduce((sum, x) => sum + x.item.price, 0) };
	}
}
