import type { SaveLicences, SaveRelations } from '../savegame/map/save-map-model';
import type { BlueprintUnlock } from '../shared/services/data/blueprint-rules-data';
import { Loadouts } from '../shared/services/loadout';
import type {
	BlueprintItem,
	BlueprintSeller,
	BuyEntry,
	ReputationEntry,
	ReputationSeller,
	ShoppingList,
	UnsoldEntry,
} from './blueprint-model';

export interface ShoppingListInput {
	items: readonly BlueprintItem[];
	owned: ReadonlySet<string>;
	/** the player's licences, as of save time */
	licences: SaveLicences;
	/** the player's relations, as of save time */
	relations: SaveRelations;
	sellers: (item: BlueprintItem) => BlueprintSeller[];
	/** `BlueprintRules.missionOnly` */
	missionOnly: readonly string[];
	/** `BlueprintRules.unlockedBy` */
	unlockedBy: Readonly<Record<string, BlueprintUnlock>>;
}

/**
 * Sorts each missing blueprint into buy now, need more reputation or not sold. A representative sells a blueprint
 * when the item needs no licence or the player holds the faction's licence of its type.
 */
export class BlueprintShoppingList {
	static build(input: ShoppingListInput): ShoppingList {
		const missionOnly = new Set(input.missionOnly);
		const buy: BuyEntry[] = [];
		const reputation: ReputationEntry[] = [];
		const unsold: UnsoldEntry[] = [];
		const missing = input.items.filter((x) => !input.owned.has(x.id)).sort((a, b) => a.name.localeCompare(b.name));
		for (const item of missing) {
			const sellers = missionOnly.has(item.id) ? [] : input.sellers(item);
			if (!sellers.length) {
				const reason = input.unlockedBy[item.id] ?? (missionOnly.has(item.id) ? 'story' : 'unknown');
				unsold.push({ item, reason });
				continue;
			}
			const holders = item.license ? (input.licences[item.license] ?? []) : undefined;
			const qualified = sellers.filter((x) => !holders || holders.includes(x.faction.id));
			if (qualified.length) {
				buy.push({ item, sellers: qualified });
			} else {
				reputation.push({ item, sellers: BlueprintShoppingList.reputationSellers(sellers, input.relations) });
			}
		}
		return {
			buy,
			reputation: reputation.sort(
				(a, b) => BlueprintShoppingList.gap(a.sellers[0]) - BlueprintShoppingList.gap(b.sellers[0])
			),
			unsold,
		};
	}

	private static reputationSellers(sellers: BlueprintSeller[], relations: SaveRelations): ReputationSeller[] {
		return sellers
			.map((seller) => {
				const relation = relations[seller.faction.id] ?? 0;
				const current = Loadouts.relationToReputation(relation);
				const min = seller.license?.minRelation;
				const needed = min == null ? undefined : Loadouts.relationToReputation(min);
				return {
					...seller,
					needed,
					current,
					gap: needed == null ? undefined : Math.max(0, needed - current),
					pending: min != null && relation >= min,
				};
			})
			.sort((a, b) => BlueprintShoppingList.gap(a) - BlueprintShoppingList.gap(b));
	}

	/** unknown gaps last */
	private static gap(seller: ReputationSeller | undefined): number {
		return seller?.gap ?? Number.POSITIVE_INFINITY;
	}
}
