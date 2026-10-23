import type { GameStart, GameStartItem, GameStartRelation } from './game-start-model';

/** A faction's starting reputation, on the game's -30..30 scale. */
export interface StartReputation {
	faction: string;
	relation: number;
	reputation: number;
}

/** The blueprints of a start by the page they link to, cosmetics (paints, clothing) apart. */
export interface StartBlueprints {
	modules: GameStartItem[];
	ships: GameStartItem[];
	equipment: GameStartItem[];
	other: GameStartItem[];
}

/** Derived lists of a game start's detail page. */
export class GameStartDetails {
	/** The relations, friendliest first. */
	static reputations(
		relations: readonly GameStartRelation[] | undefined,
		toReputation: (relation: number) => number
	): StartReputation[] {
		return (relations ?? [])
			.map((x) => ({ ...x, reputation: toReputation(x.relation) }))
			.sort((a, b) => b.relation - a.relation);
	}

	static blueprints(start: GameStart): StartBlueprints {
		const result: StartBlueprints = { modules: [], ships: [], equipment: [], other: [] };
		for (const item of start.blueprints ?? []) {
			result[item.page ?? 'other'].push(item);
		}
		return result;
	}
}
