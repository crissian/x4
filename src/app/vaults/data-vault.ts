/** A blueprint a data vault holds. */
export interface VaultBlueprint {
	/** ware id */
	id: string;
	name?: string;
}

/** A data vault of the game data (data-vaults-data). */
export interface DataVault {
	/** `datavault_N` for a placed vault, the god object id (`erlking_blueprint_N`) for a randomly placed one */
	id: string;
	/** vault macro id, e.g. `landmarks_vault_01` */
	macro: string;
	/** undefined when the game picks the spot at game start */
	sector?: string;
	version: number;
	/** position inside the sector, km */
	x?: number;
	y?: number;
	z?: number;
	/** the encyclopedia timeline entry repairing the vault unlocks, and its name */
	timeline?: string;
	name?: string;
	blueprints?: VaultBlueprint[];
	/** the vault only appears during a story mission */
	condition?: 'story';
}

/** What the active save tells about a vault. */
export interface VaultSaveState {
	/** the save holds the vault (a story vault may not be placed yet) */
	present: boolean;
	/** the player has seen it */
	known: boolean;
	/** its signal leak was repaired, or its blueprint crate picked up */
	opened: boolean;
}

/** A vault as the pages list it: the game data merged with the active save. */
export interface VaultEntry {
	id: string;
	macro: string;
	/** undefined: placed at a random spot, known only from a save */
	sector?: string;
	/** position inside the sector, km; from the save when it has the vault */
	x?: number;
	y?: number;
	z?: number;
	version: number;
	timeline?: string;
	name?: string;
	blueprints: VaultBlueprint[];
	condition?: 'story';
	/** undefined without an active save holding vault data */
	save?: VaultSaveState;
}
