import type { SaveStation } from '../savegame/map/save-map-model';
import type { Diagnosis } from './diagnosis';

/** What one station makes and uses of a ware per hour, at full input supply. */
export interface StationFlow {
	ware: string;
	produced: number;
	consumed: number;
}

/** The hourly flows of one station of the save. */
export interface StationFlows {
	station: SaveStation;
	flows: StationFlow[];
}

/** Which stations count: all of them, or the ones of a faction and/or within some jumps of a sector. */
export interface EconomyScope {
	/** station owner (faction id) */
	faction?: string;
	/** sector id the stations must be near */
	centre?: string;
	/** jumps from the centre, 0 meaning the centre sector only */
	jumps?: number;
	/** player-owned stations count unless false */
	includePlayer?: boolean;
}

/** Offers of the stations in scope for one ware, as of the save time. */
export interface WareMarket {
	/** sum of the amounts on sale */
	stock: number;
	/** sum of the amounts wanted */
	wanted: number;
	lowestSell?: number;
	highestBuy?: number;
	/** amount-weighted average sell price as % of the ware's average price; undefined without sell offers */
	priceIndex?: number;
}

/** One ware's row: flows, market and the diagnosis for a scope. */
export interface WareEconomy extends WareMarket {
	ware: string;
	produced: number;
	consumed: number;
	/** produced - consumed per hour */
	net: number;
	/** net / max(produced, consumed), -1..1: how much of the demand is unmet, or of the output unused */
	balance: number;
	/** net * average ware price, Cr per hour */
	value: number;
	producers: number;
	consumers: number;
	/** mined or collected: Produced and Net don't count mining; Value is not computed */
	mined: boolean;
	/** needed to build ships or station modules, which the capacity doesn't count */
	building: boolean;
	/** also needed to build ships or station modules, besides the factories' use: the capacity undercounts the demand */
	partlyBuilding: boolean;
	/** the diagnosis comes from the market only (mined and building wares) */
	marketBased: boolean;
	diagnosis: Diagnosis;
}

/** A station's contribution to one ware, for the detail panel. */
export interface WareStationFlow {
	station: SaveStation;
	produced: number;
	consumed: number;
}
