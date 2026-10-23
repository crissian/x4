import type { SaveTerraformingPlanet, SaveTerraformingProject } from '../savegame/extractors/terraforming-extractor';
import type {
	TerraformingPlanetData,
	TerraformingProjectData,
	TerraformingPlanetProjectData,
} from '../shared/services/data/terraforming-data';
import type { TerraformingCatalog } from './terraforming-catalog';
import { TerraformingConditions } from './terraforming-conditions';

/**
 * completed: done at least once in the save; ready: its conditions, predecessors and research are met; waiting: one
 * of them isn't; unknown: none fails but one can't be told (a stat the planet lacks, or research without a save).
 */
export type TerraformingProjectState = 'completed' | 'ready' | 'waiting' | 'unknown';

/** A project offered on a planet, with what it takes there. */
export interface TerraformingProjectRow {
	id: string;
	project?: TerraformingProjectData;
	name: string;
	predecessors: readonly string[];
	/** any one predecessor is enough */
	any: boolean;
	/** times completed in the save */
	completed: number;
	/** the wares the save asks for, else the library's proportions */
	wares: readonly { ware: string; amount: number }[];
	/** whether `wares` are the save's scaled amounts */
	scaled: boolean;
	conditionsMet?: boolean;
	predecessorsMet: boolean;
	/** undefined without research or without a save's research */
	researchMet?: boolean;
	state: TerraformingProjectState;
}

/**
 * A terraformable planet as the save has it, or without a save as the scripts set it up: its stats, the projects
 * offered with their state, and the events.
 */
export class TerraformingPlanetState {
	readonly stats: Readonly<Record<string, number>>;
	readonly projects: readonly TerraformingProjectRow[];
	/** events with how often they happened, from the save */
	readonly events: readonly { id: string; name: string; completed: number }[];
	readonly fromSave: boolean;

	/**
	 * @param research the research done in the save, undefined without one
	 */
	constructor(
		private readonly catalog: TerraformingCatalog,
		readonly planet: TerraformingPlanetData,
		save: SaveTerraformingPlanet | undefined,
		research: ReadonlySet<string> | undefined
	) {
		this.fromSave = !!save;
		this.stats = save ? save.stats : Object.fromEntries(planet.stats.map((x) => [x.stat, x.value]));
		const offered: (SaveTerraformingProject | TerraformingPlanetProjectData)[] = save?.projects ?? planet.projects;
		const done = new Set(save?.projects.filter((x) => x.completed).map((x) => x.id));
		const conditions = new TerraformingConditions(catalog);
		this.projects = offered.map((x) => this.row(x, done, conditions, research));
		this.events = (save?.events ?? []).map((x) => ({
			id: x.id,
			name: catalog.projectName(x.id),
			completed: x.completed ?? 0,
		}));
	}

	/** The rows by id. */
	find(id: string): TerraformingProjectRow | undefined {
		return this.projects.find((x) => x.id === id);
	}

	private row(
		offered: SaveTerraformingProject | TerraformingPlanetProjectData,
		done: ReadonlySet<string>,
		conditions: TerraformingConditions,
		research: ReadonlySet<string> | undefined
	): TerraformingProjectRow {
		const project = this.catalog.project(offered.id);
		const saved = 'wares' in offered ? offered : undefined;
		const completed = saved?.completed ?? 0;
		const any = !!offered.any;
		const predecessorsMet =
			!offered.predecessors.length ||
			(any ? offered.predecessors.some((x) => done.has(x)) : offered.predecessors.every((x) => done.has(x)));
		const conditionsMet = project ? conditions.all(project.conditions, this.stats) : undefined;
		const researchMet = project?.research ? research?.has(project.research) : true;
		const scaled = !!saved?.wares.length;
		return {
			id: offered.id,
			project,
			name: this.catalog.projectName(offered.id),
			predecessors: offered.predecessors,
			any,
			completed,
			wares: scaled ? saved!.wares : (project?.wares ?? []),
			scaled,
			conditionsMet,
			predecessorsMet,
			researchMet,
			state: TerraformingPlanetState.state(completed, [conditionsMet, predecessorsMet, researchMet]),
		};
	}

	private static state(completed: number, checks: (boolean | undefined)[]): TerraformingProjectState {
		if (completed > 0) {
			return 'completed';
		}
		if (checks.includes(false)) {
			return 'waiting';
		}
		return checks.includes(undefined) ? 'unknown' : 'ready';
	}
}
