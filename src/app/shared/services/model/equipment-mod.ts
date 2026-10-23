import type { Price } from './ware';

/** The equipment an equipment mod is installed on: the sections of the game's equipmentmods.xml. */
export type ModSlot = 'weapon' | 'engine' | 'ship' | 'shield';

/**
 * How a mod value changes its stat: `factor` multiplies it (1.15 is +15%), `add` adds whole units (+2 missiles),
 * `fraction` is a share on its own (a damage reduction of 0.6 is 60%).
 */
export type ModStatKind = 'factor' | 'add' | 'fraction';

/** A stat an equipment mod can change. */
export interface ModStat {
	/** the stat's element name in equipmentmods.xml, e.g. "damage" */
	id: string;
	slot: ModSlot;
	kind: ModStatKind;
	/** the stat improves as it gets lower: mass, recharge delay, charge time... */
	lowerIsBetter?: boolean;
	name: string;
	description: string;
}

/** A stat change rolled between `min` and `max` when the mod is crafted. */
export interface ModEffect {
	stat: string;
	min: number;
	max: number;
	/** bonus effects: the `weight` of equipmentmods.xml, as given; missing there when missing here */
	weight?: number;
}

/** The extra effects of a mod: with `chance`, up to `max` of the effects, picked by weight. */
export interface ModBonus {
	chance: number;
	max: number;
	effects: ModEffect[];
}

export interface Ingredient {
	ware: string;
	amount: number;
}

/** What equipment mods and crafting items share: price, sources, the recipe. */
export interface CraftingWare {
	id: string;
	name: string;
	version: number;
	price?: Price;
	/** faction ids the ware is illegal with */
	illegal?: string[];
	/** where the ware comes from, `ModSource` ids */
	sources?: number[];
	/** the crafting recipe; none when it can't be crafted */
	ingredients?: Ingredient[];
	/** the research wares the recipe needs, `ModResearch` ids */
	research?: string[];
}

export interface EquipmentMod extends CraftingWare {
	/** the mod's own name, e.g. "Piercer" */
	shortName: string;
	slot: ModSlot;
	/** 1 basic, 2 enhanced, 3 exceptional */
	quality: number;
	/** scenario mods: the player can't craft them */
	notForPlayer?: boolean;
	effect: ModEffect;
	bonus?: ModBonus;
}

/** The game's tags of crafting items the pages tell apart. */
export type CraftingTag = 'equipmentmodpart' | 'primarymodpart' | 'personalupgrade' | 'bribe' | 'gift' | 'missiononly';

/** An inventory item crafting takes or makes: mod parts, spacesuit items, bribes... */
export interface CraftingItem extends CraftingWare {
	tags: CraftingTag[];
}

/** A text of the game by id: a quality, a ware source, a research. */
export interface NamedId<T> {
	id: T;
	name: string;
}

/** The generated equipment mod data. */
export interface EquipmentModCatalog {
	qualities: NamedId<number>[];
	sources: NamedId<number>[];
	research: NamedId<string>[];
	stats: ModStat[];
	mods: EquipmentMod[];
	items: CraftingItem[];
}
