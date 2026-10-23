/** A ship the player owns, with its place in a fleet and its orders. */
export interface SaveFleetShip {
	/** component id, e.g. `[0x48a13]` */
	id: string;
	code: string;
	/** ship id: the macro lowercased without _macro */
	macro: string;
	sector: string;
	/** the name the player gave it, maybe a `{page,id}` game text reference */
	name?: string;
	/** the fleet name the player gave a commander */
	fleet?: string;
	/** component id of the commanding ship or station */
	commander?: string;
	/** the commander's assignment for this ship's group, e.g. `defence`, `trade`, `mining` */
	assignment?: string;
	/** the order id it runs when nothing else is queued, e.g. `TradeRoutine` */
	defaultOrder?: string;
	/** the first queued order id, e.g. `DockAndWait`; absent when it runs its default order */
	order?: string;
}

/** What the save says about a player station beyond the map data (which has its modules and offers). */
export interface SaveOwnStation {
	/** component id, which subordinate ships name as their commander */
	id: string;
	code: string;
	sector: string;
	/** Cr in the station account */
	money: number;
	/** wares in storage by ware id */
	storage?: Record<string, number>;
	/**
	 * the built modules of its construction sequence by macro id (lowercased without _macro), with counts, in
	 * sequence order; modules still being built are left out
	 */
	modules?: SaveStationModule[];
	/** how many modules of its construction sequence are still being built; absent when none */
	building?: number;
}

/** A module of a player station and how many of it are built. */
export interface SaveStationModule {
	macro: string;
	count: number;
}

/** A ship nobody owns, which the player can claim. */
export interface SaveOwnerlessShip {
	id: string;
	code: string;
	macro: string;
	sector: string;
	name?: string;
	/** predefined zone id; x/z are then relative to that zone, else relative to the sector */
	zone?: string;
	/** km, rounded to 0.1 */
	x: number;
	z: number;
}

/** sector id -> ship counts [s, m, l, xl] */
export type SectorShipCounts = Record<string, [number, number, number, number]>;

/** The player's ships and stations, the ships to claim and where the Xenon and Kha'ak fly. */
export interface SaveEmpire {
	ships: SaveFleetShip[];
	stations: SaveOwnStation[];
	ownerless: SaveOwnerlessShip[];
	/** ship counts per sector of the factions in `EmpireExtractor.HOSTILES`, by faction id */
	hostileShips: Record<string, SectorShipCounts>;
}
