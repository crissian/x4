export interface SaveSector {
	id: string;
	owner: string;
	contested: boolean;
	known: boolean;
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
}

/** sector id -> player ship counts [xs, s, m, l, xl] */
export type ShipCounts = Record<string, [number, number, number, number, number]>;

export interface SaveMap {
	sectors: SaveSector[];
	stations: SaveStation[];
	playerShips: ShipCounts;
}
