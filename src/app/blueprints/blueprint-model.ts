import type { BlueprintUnlock } from '../shared/services/data/blueprint-rules-data';
import type { Faction, License } from '../shared/services/model/model';

export type BlueprintKind = 'module' | 'ship' | 'equipment';

/** A blueprint the player can own: a station module, ship or equipment of the game data. */
export interface BlueprintItem {
	id: string;
	name: string;
	kind: BlueprintKind;
	/** a `BlueprintCategory` id */
	category: string;
	/** game price of the blueprint, see `BlueprintPrice` */
	price: number;
	owners?: readonly Faction[];
	/** licence type the seller asks for */
	license?: string;
}

export interface BlueprintCategory {
	id: string;
	kind: BlueprintKind;
	label: string;
}

/** A faction whose representative sells the item, and its licence of the type the item asks for. */
export interface BlueprintSeller {
	faction: Faction;
	license?: License;
}

/** A seller the player lacks the licence of, with the reputation it asks for. */
export interface ReputationSeller extends BlueprintSeller {
	/** in-game reputation the licence asks for; undefined when the faction doesn't list it */
	needed?: number;
	/** the player's in-game reputation with the faction, as of save time */
	current: number;
	/** reputation still missing, 0 when high enough */
	gap: number;
	/** reputation is high enough but the licence isn't held yet: it comes with a ceremony or a visit */
	pending: boolean;
}

export type UnsoldReason = BlueprintUnlock | 'unknown';

export interface BuyEntry {
	item: BlueprintItem;
	sellers: BlueprintSeller[];
}

export interface ReputationEntry {
	item: BlueprintItem;
	/** sorted by the smallest gap first */
	sellers: ReputationSeller[];
}

export interface UnsoldEntry {
	item: BlueprintItem;
	reason: UnsoldReason;
}

/** The blueprints one faction would sell the player now. */
export interface FactionPurchase {
	faction: Faction;
	items: BlueprintItem[];
	/** every item bought from this faction */
	total: number;
}

/** What the player can do about each missing blueprint. */
export interface ShoppingList {
	buy: BuyEntry[];
	reputation: ReputationEntry[];
	unsold: UnsoldEntry[];
	/** the buy entries per selling faction, the most items first */
	factions: FactionPurchase[];
	/** every buyable blueprint once */
	total: number;
}

export interface CategoryProgress {
	category: BlueprintCategory;
	owned: number;
	total: number;
	missing: BlueprintItem[];
}

export interface BlueprintProgressResult {
	categories: CategoryProgress[];
	owned: number;
	total: number;
	/** owned blueprints the catalog doesn't track (paint mods, ship mods, deployables) */
	other: number;
}
