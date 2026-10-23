/** Where an achievement is earned, from the md scripts unlocking it; `statistic` for the stats.xml ones. */
export type AchievementCategory =
	'story' | 'mission' | 'terraforming' | 'tutorial' | 'scenario' | 'general' | 'statistic';

/** An unlock_achievement call of the md scripts (achievements-data.ts). The game files hold no names or descriptions. */
export interface AchievementUnlock {
	id: string;
	/** the content pack, an index of `GAME_VERSIONS` */
	version: number;
	category: Exclude<AchievementCategory, 'statistic'>;
	/** unlocked inside a Timelines scenario */
	scenario?: boolean;
	/** the md scripts unlocking it */
	scripts: string[];
	/** the cues unlocking it */
	cues?: string[];
	/** the developers' comment on the unlock, English only */
	comment?: string;
}

/** An account statistic of stats.xml that unlocks an achievement at a value. */
export interface StatAchievement {
	id: string;
	/** the statistic's name in the game's statistics menu */
	name?: string;
	units?: string;
	unlock: number;
	progressStep?: number;
	/** the rank name the unlock value stands for */
	rank?: string;
	scenario?: boolean;
}

/** One achievement of the page, either kind. */
export interface AchievementRow {
	/** unique: the achievement id, or the statistic id and unlock value */
	key: string;
	title: string;
	/** the developers' comment, or what the statistic must reach */
	note?: string;
	/** where the game unlocks it: cue and script names */
	source?: string;
	version: number;
	category: AchievementCategory;
	/** names the story it belongs to: hidden until spoilers are shown */
	spoiler: boolean;
}
