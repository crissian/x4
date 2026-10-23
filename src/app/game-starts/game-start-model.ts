/** How the start menu files a game start; guided and assisted starts have a story. */
export type GameStartType = 'guided' | 'assisted' | 'sandbox' | 'custom' | 'special' | 'tutorial' | 'scenario';

/** The web app list a ware has a page in. */
export type GameStartPage = 'modules' | 'ships' | 'equipment';

/** A ware of a start: a loadout item, blueprint, research, inventory ware or a further ship. */
export interface GameStartItem {
	ware: string;
	name?: string;
	/** 1 when left out */
	count?: number;
	page?: GameStartPage;
}

/** The start menu's summary line keys; other lines have none. */
export type GameStartInfoKey =
	'name' | 'race' | 'gender' | 'location' | 'ship' | 'cash' | 'equipment' | 'property' | 'relations';

/** A line of the start menu's summary, as the game shows it. */
export interface GameStartInfo {
	key?: GameStartInfoKey;
	label: string;
	text: string;
}

export interface GameStartRelation {
	faction: string;
	/** the game's relation value, -1..1 */
	relation: number;
}

/** A game start of libraries/gamestarts.xml with the DLC changes applied (game-starts-data.ts). */
export interface GameStart {
	id: string;
	name: string;
	description?: string;
	/** the content pack it needs, an index of `GAME_VERSIONS` */
	version: number;
	type: GameStartType;
	/** the start menu's order inside the type, higher first */
	recommendation?: number;
	tags?: string[];
	/** what unlocks the start in the menu */
	unlock?: string;
	info: GameStartInfo[];
	/** the player character's name */
	character?: string;
	female?: boolean;
	money: number;
	/** the start sector, none outside the main universe */
	sector?: string;
	docked?: boolean;
	/** the ship ware the player starts in; none when the start script creates it or the player starts on foot */
	ship?: string;
	loadout?: GameStartItem[];
	relations?: GameStartRelation[];
	blueprints?: GameStartItem[];
	research?: GameStartItem[];
	inventory?: GameStartItem[];
}
