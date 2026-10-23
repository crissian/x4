/** One logbook entry of the save, with the texts in the language the game ran in. */
export interface SaveLogEntry {
	/** in-game seconds */
	time: number;
	/** the logbook category (`missions`, `news`, `upkeep`, `alerts`, `tips`); absent for general entries */
	category?: string;
	title: string;
	/** lines separated by `\n`, without colour codes; cut after `LogText.MAX_TEXT` characters */
	text?: string;
	/** faction id, when the entry names a faction of the game data */
	faction?: string;
	/** the faction or company name, when it is not one of the game data */
	factionName?: string;
	/** sector id, when the entry points at a sector */
	sector?: string;
}

/** A player-owned ship (or station) the logbook reports destroyed. */
export interface SaveLoss {
	/** in-game seconds */
	time: number;
	/** the name the log gave it: the ship's name or the name the player gave it */
	name: string;
	code: string;
	/** sector id */
	sector?: string;
	/** the location text of the log, when the sector is unknown (e.g. a superhighway) */
	location?: string;
	/** name and id code of the killer, when the game recorded one */
	killer?: string;
	killerCode?: string;
	/** name of the ship's commander */
	commander?: string;
}

export interface SaveLog {
	/** how many entries the save's logbook holds */
	total: number;
	/** the newest entries first, at most `LogExtractor.MAX_ENTRIES` */
	entries: SaveLogEntry[];
	/** every loss, newest first */
	losses: SaveLoss[];
}
