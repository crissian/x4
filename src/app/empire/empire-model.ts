import type { ShipListItem } from '../shared/services/model/model';
import type { OwnStationLayout } from './own-station-layout';

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
	/** the game's name of the order it runs now (the first queued one, else its default order); the id without one */
	order: string;
	/** the order's id in the save, e.g. `TradeRoutine` */
	orderId?: string;
	/** the name of its default order when another one runs now */
	defaultOrder?: string;
	/** the game's name of the commander's assignment for it; the id without one */
	assignment?: string;
	/** the assignment's id in the save, e.g. `defence` */
	assignmentId?: string;
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
	/** its built modules for the station calculator; absent without empire data for it */
	layout?: OwnStationLayout;
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
