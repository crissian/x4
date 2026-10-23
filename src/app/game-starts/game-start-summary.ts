import type { GameStart, GameStartInfoKey } from './game-start-model';

/** What a summary needs of a ship. */
export interface SummaryShip {
	id: string;
	name: string;
	type?: string;
}

/** What a summary needs of a sector. */
export interface SummarySector {
	id: string;
	name: string;
}

/** The at-a-glance facts of a game start: the ship and location, resolved to linkable entities. */
export interface GameStartSummary {
	start: GameStart;
	/** the ship the player starts in, when the data names it */
	ship?: SummaryShip;
	/** the start menu's ship line, for starts whose ship a script creates */
	shipText?: string;
	sector?: SummarySector;
	/** the start menu's location line, for starts outside the main universe */
	locationText?: string;
	/** the start menu's property line */
	property?: string;
}

export class GameStartSummaries {
	static of(
		start: GameStart,
		ship: (id: string) => SummaryShip | undefined,
		sector: (id: string) => SummarySector | undefined
	): GameStartSummary {
		const own = start.ship ? ship(start.ship) : undefined;
		const place = start.sector ? sector(start.sector) : undefined;
		return {
			start,
			ship: own,
			shipText: own ? undefined : GameStartSummaries.info(start, 'ship'),
			sector: place,
			locationText: place ? undefined : GameStartSummaries.info(start, 'location'),
			property: GameStartSummaries.info(start, 'property'),
		};
	}

	/** The text of a start menu summary line. */
	static info(start: GameStart, key: GameStartInfoKey): string | undefined {
		return start.info.find((x) => x.key === key)?.text;
	}
}
