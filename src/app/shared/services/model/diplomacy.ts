/**
 * The diplomacy data of the game's libraries/diplomacy.xml (DLC diffs included), meanings as documented in its
 * scriptproperties.xml (keyword "diplomacy"). Times are seconds, money is credits.
 */

/** A value of the game with its game text: an action category or an agent type. */
export interface DiplomacyName {
	id: string;
	name: string;
	description?: string;
}

/** An agent experience level or rank, reached at `value`. */
export interface DiplomacyLevel {
	value: number;
	name: string;
	/** ranks: the game's eventbonus */
	eventBonus?: number;
}

export interface DiplomacyWareAmount {
	ware: string;
	amount: number;
}

/** What an action or event option takes: money, influence and inventory wares. */
export interface DiplomacyCost {
	money: number;
	influence: number;
	wares: DiplomacyWareAmount[];
	/** the ware tags of an optional gift (or bribe); missing when the action takes none */
	giftTags?: string[];
}

/** Something the player picks when starting an action. */
export interface DiplomacyTarget {
	/** the action param name, e.g. "station" */
	id: string;
	type: 'object' | 'ware' | 'faction';
	text: string;
	/** ware targets: the wares of the basket picked from */
	wares?: string[];
	/** the faction tags whose factions can't be targeted */
	excludedFactionTags?: string[];
}

/** An agent action of the diplomacy menu. */
export interface DiplomacyAction {
	id: string;
	version: number;
	/** a `categories` id */
	category: string;
	name: string;
	description: string;
	shortDescription: string;
	/** an `agentTypes` id: the agent experience that may affect the success */
	agentType: string;
	/** the base recommended minimum agent experience */
	experience?: number;
	cost: DiplomacyCost;
	reward: { influence?: number; text?: string; unlocks?: string[] };
	duration: number;
	cooldown: number;
	/** the base chance of success, percent */
	success: { chance: number; text: string };
	failure?: { text: string };
	/** only one instance can be running at a time */
	unique?: true;
	/** hidden in the menu until the game unlocks it */
	hidden?: true;
	targets: DiplomacyTarget[];
}

/** An option of a diplomatic event the player can focus an agent on. */
export interface DiplomacyEventOption {
	id: string;
	name: string;
	description: string;
	/** paid at the conclusion of the event when the option is selected */
	cost: DiplomacyCost;
	/** the relation between the two factions when the option is the outcome, -1..1 */
	relation: number;
	/** the base weight of the option to be the outcome */
	weight: number;
	result: { text: string };
	conclusion: { text: string };
}

export interface DiplomacyEvent {
	id: string;
	name: string;
	description: string;
	shortDescription: string;
	duration: number;
	options: DiplomacyEventOption[];
}

/** A gift ware and the factions it is listed for. */
export interface DiplomacyGift {
	ware: string;
	factions: string[];
}

export interface DiplomacyCatalog {
	categories: DiplomacyName[];
	agentTypes: DiplomacyName[];
	experience: DiplomacyLevel[];
	ranks: DiplomacyLevel[];
	actions: DiplomacyAction[];
	events: DiplomacyEvent[];
	gifts: DiplomacyGift[];
	/** gifts/defaults of diplomacy.xml: percentage modifiers of an action's success chance */
	giftEffect: { positive: number; negative: number };
	/** the faction ids by faction tag, for the tags actions exclude */
	factionTags: Record<string, string[]>;
	/** the ware ids by ware tag, for the gift tags of the actions */
	wareTags: Record<string, string[]>;
	/** the names of the wares referenced */
	wares: { id: string; name: string }[];
}
