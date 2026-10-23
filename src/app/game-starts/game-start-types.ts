import type { GameStart, GameStartType } from './game-start-model';

/** A choice of the type filter: a start type, a set of them or every start. */
export type GameStartTypeFilter = '' | 'story' | 'all' | GameStartType;

/** The start types: their labels, the game's advice on who they suit, and the type filter. */
export class GameStartTypes {
	/** The start menu order: story starts first, from the most guided. */
	static readonly ORDER: readonly GameStartType[] = [
		'guided',
		'assisted',
		'sandbox',
		'custom',
		'special',
		'tutorial',
		'scenario',
	];

	/** The types of the New Game menu, the default filter. */
	static readonly NEW_GAME: readonly GameStartType[] = ['guided', 'assisted', 'sandbox', 'custom', 'special'];

	static readonly FILTERS: readonly GameStartTypeFilter[] = ['', 'story', ...GameStartTypes.ORDER, 'all'];

	static label(type: GameStartType): string {
		switch (type) {
			case 'guided':
				return $localize`:game start type:Guided`;
			case 'assisted':
				return $localize`:game start type:Assisted`;
			case 'sandbox':
				return $localize`:game start type:Sandbox`;
			case 'custom':
				return $localize`:game start type:Custom game`;
			case 'special':
				return $localize`:game start type:Special`;
			case 'tutorial':
				return $localize`:game start type:Tutorial`;
			case 'scenario':
				return $localize`:game start type:Timelines scenario`;
		}
	}

	/** Who the type suits, after the start menu's own descriptions. */
	static hint(type: GameStartType): string {
		switch (type) {
			case 'guided':
				return $localize`For new players: an active story introduces the game's features step by step.`;
			case 'assisted':
				return $localize`For players with some experience: a short introductory story, then the sandbox.`;
			case 'sandbox':
				return $localize`For experienced players: no story to follow, find your own way and stories.`;
			case 'custom':
				return $localize`Set up the universe and your start yourself; a modified game.`;
			case 'special':
				return $localize`A special mode outside the regular game.`;
			case 'tutorial':
				return $localize`Learn one feature of the game in a simulation; cannot be saved.`;
			case 'scenario':
				return $localize`A Timelines scenario, played from the Timelines hub; cannot be saved.`;
		}
	}

	/** Guided and assisted starts follow a story. */
	static isStory(type: GameStartType): boolean {
		return type === 'guided' || type === 'assisted';
	}

	static filterLabel(filter: GameStartTypeFilter): string {
		switch (filter) {
			case '':
				return $localize`:game start filter:New game starts`;
			case 'story':
				return $localize`:game start filter:Story starts (guided and assisted)`;
			case 'all':
				return $localize`:game start filter:Everything, tutorials and scenarios too`;
			default:
				return GameStartTypes.label(filter);
		}
	}

	static isFilter(value: string): value is GameStartTypeFilter {
		return (GameStartTypes.FILTERS as readonly string[]).includes(value);
	}

	static matches(filter: GameStartTypeFilter, start: GameStart): boolean {
		switch (filter) {
			case '':
				return GameStartTypes.NEW_GAME.includes(start.type);
			case 'story':
				return GameStartTypes.isStory(start.type);
			case 'all':
				return true;
			default:
				return start.type === filter;
		}
	}
}
