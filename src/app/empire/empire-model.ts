import type { ShipListItem } from '../shared/services/model/model';

/** One of the player's ships on the empire page, in fleet order. */
export interface EmpireShipRow {
	/** component id */
	id: string;
	/** the name the player gave it, else its code */
	label: string;
	code: string;
	/** ship id; `model` is undefined for an unknown (modded) ship */
	modelId: string;
	model?: ShipListItem;
	modelName: string;
	/** the size enum value of the model, e.g. `Medium`; empty when unknown */
	size: string;
	/** the purpose enum value of the model, e.g. `Trade`; empty when unknown */
	purpose: string;
	sector: string;
	sectorName: string;
	/** the order it runs now: the first queued one, else its default order */
	order: string;
	/** its default order when another one runs now */
	defaultOrder?: string;
	/** the commander's assignment for it, as a label */
	assignment?: string;
	/** the commanding ship's or station's name */
	commander?: string;
	/** component id of the commanding ship or station */
	commanderId?: string;
	/** how many levels below the top of its fleet; 0 for the commander or a ship on its own */
	depth: number;
	/** the name of its fleet (the top commander's fleet name, else its name); empty for a ship on its own */
	fleet: string;
	/** how many ships it commands, directly or not */
	subordinates: number;
}

/** One of the player's stations on the empire page. */
export interface EmpireStationRow {
	id: string;
	code: string;
	name: string;
	sector: string;
	sectorName: string;
	/** `construction` while it is built */
	state?: string;
	/** how many modules it has */
	modules: number;
	/** names of the wares its production modules make */
	products: string[];
	/** wares in storage, the largest first */
	storage: { ware: string; name: string; amount: number }[];
	/** Cr in its account */
	money: number;
	/** how many ships it commands, directly or not */
	ships: number;
}

/** The tiles on top of the empire page. */
export interface EmpireSummary {
	/** the player's money */
	money: number;
	ships: number;
	/** ship counts by size enum value, largest first: Extra Large, Large, Medium, Small */
	bySize: { size: string; count: number }[];
	stations: number;
	/** Cr in all station accounts */
	stationMoney: number;
}
