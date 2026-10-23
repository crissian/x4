export interface SaveSector {
	id: string;
	owner: string;
	contested: boolean;
	known: boolean;
}

/** A buy or sell offer from the station's own `trade/offers`. */
export interface SaveOffer {
	ware: string;
	/** true: the station sells the ware; false: it buys it */
	sell: boolean;
	/** Cr, 2 decimals */
	price: number;
	amount: number;
	/** a shady offer restricted to the player */
	playerOnly?: boolean;
}

export interface SaveStation {
	code: string;
	macro: string;
	owner: string;
	sector: string;
	/** predefined zone id; x/z are then relative to that zone, else relative to the sector */
	zone?: string;
	/** km, rounded to 0.1 */
	x: number;
	z: number;
	known: boolean;
	state?: 'construction' | 'wreck';
	name?: string;
	basename?: string;
	nameIndex?: number;
	/** <production originalproduct> directly under the station */
	product?: string;
	/** distinct module ids from construction/sequence/entry@macro, lowercased without _macro */
	modules: string[];
	/** how many of each module in `modules`, by position; absent when there is one of each */
	moduleCounts?: number[];
	/** the offers with an amount, in save order */
	offers?: SaveOffer[];
	/** workers by race id */
	workforce?: Record<string, number>;
}

/** sector id -> player ship counts [xs, s, m, l, xl] */
export type ShipCounts = Record<string, [number, number, number, number, number]>;

export interface SaveMap {
	sectors: SaveSector[];
	stations: SaveStation[];
	playerShips: ShipCounts;
}

/** Player relation per faction id, -1..1 (relation plus booster, clamped); a missing faction means 0. */
export type SaveRelations = Record<string, number>;

/** Licences the player holds: licence type -> faction ids that granted it. */
export type SaveLicences = Record<string, string[]>;

/** Ware ids of the blueprints the player owns. */
export type SaveBlueprints = string[];

/** Ids of the factions with a faction representative, who sells their licences and blueprints. */
export type SaveRepresentatives = string[];
