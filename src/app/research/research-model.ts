import type { ResearchData } from '../shared/services/data/research-data';

export type { ResearchData, ResearchUnlockData, ResearchUnlockKind } from '../shared/services/data/research-data';

/**
 * Where a project stands in the save: `done`, `available` (every prerequisite done), `locked` (a prerequisite
 * missing) or `mission` (granted by a mission, never researched at the headquarters).
 */
export type ResearchState = 'done' | 'available' | 'locked' | 'mission';

/** A ware amount delivered to the headquarters. */
export interface WareAmount {
	ware: string;
	amount: number;
}

/** What it takes to reach a project from the research done so far. */
export interface ResearchPath {
	/** the projects not done yet, prerequisites before the projects needing them, the target last */
	steps: ResearchData[];
	/** the steps researched at the headquarters */
	researched: ResearchData[];
	/** the steps granted by missions */
	missions: ResearchData[];
	/** the wares of the researched steps, largest amount first */
	wares: WareAmount[];
}
