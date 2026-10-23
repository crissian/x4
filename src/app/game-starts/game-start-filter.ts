import type { GameStart } from './game-start-model';
import { GameStartTypes, type GameStartTypeFilter } from './game-start-types';

/** What the game starts page shows. */
export interface GameStartCriteria {
	type: GameStartTypeFilter;
	/** part of the name, character or location; lower case */
	search: string;
	/** owned content packs, indexed by version; the base game is always owned */
	owned: readonly boolean[];
}

/** Filters and orders the game starts. */
export class GameStartFilter {
	static apply(starts: readonly GameStart[], criteria: GameStartCriteria): GameStart[] {
		return starts
			.filter((x) => GameStartTypes.matches(criteria.type, x))
			.filter((x) => GameStartFilter.owned(x, criteria.owned))
			.filter((x) => !criteria.search || GameStartFilter.text(x).includes(criteria.search))
			.sort(GameStartFilter.compare);
	}

	/** True when the start's content pack is owned. */
	static owned(start: GameStart, owned: readonly boolean[]): boolean {
		return start.version === 0 || owned[start.version] !== false;
	}

	/** By content pack, then type in start menu order, then recommendation (higher first) and name. */
	static compare(a: GameStart, b: GameStart): number {
		return (
			a.version - b.version ||
			GameStartTypes.ORDER.indexOf(a.type) - GameStartTypes.ORDER.indexOf(b.type) ||
			(b.recommendation ?? 0) - (a.recommendation ?? 0) ||
			a.name.localeCompare(b.name)
		);
	}

	/** The searched text: name, character and the summary lines. */
	private static text(start: GameStart): string {
		return [start.name, start.character ?? '', ...start.info.map((x) => x.text)].join('\n').toLowerCase();
	}
}
