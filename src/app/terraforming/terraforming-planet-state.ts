import type { SaveTerraformingPlanet, SaveTerraformingProject } from '../savegame/extractors/terraforming-extractor';
import type {
	TerraformingPlanetData,
	TerraformingPlanetProjectData,
	TerraformingProjectData,
} from '../shared/services/data/terraforming-data';
import type { TerraformingCatalog } from './terraforming-catalog';

/** A project offered on a planet. */
export interface TerraformingProjectRow {
	id: string;
	project?: TerraformingProjectData;
	name: string;
	predecessors: readonly string[];
	/** any one predecessor is enough */
	any: boolean;
	/** times completed in the save */
	completed: number;
	/** the wares the save asks for (`scaledresources`), else the library's amounts */
	wares: readonly { ware: string; amount: number }[];
	/** whether `wares` are the save's scaled amounts */
	scaled: boolean;
}

/**
 * A terraformable planet as the save has it, or without a save as the scripts set it up: its stats, the projects
 * offered and the events.
 */
export class TerraformingPlanetState {
	readonly stats: Readonly<Record<string, number>>;
	readonly projects: readonly TerraformingProjectRow[];
	/** events with how often they happened, from the save */
	readonly events: readonly { id: string; name: string; completed: number }[];
	readonly fromSave: boolean;

	constructor(
		private readonly catalog: TerraformingCatalog,
		readonly planet: TerraformingPlanetData,
		save: SaveTerraformingPlanet | undefined
	) {
		this.fromSave = !!save;
		this.stats = save ? save.stats : Object.fromEntries(planet.stats.map((x) => [x.stat, x.value]));
		const offered: (SaveTerraformingProject | TerraformingPlanetProjectData)[] = save?.projects ?? planet.projects;
		this.projects = offered.map((x) => this.row(x));
		this.events = (save?.events ?? []).map((x) => ({
			id: x.id,
			name: catalog.projectName(x.id),
			completed: x.completed ?? 0,
		}));
	}

	find(id: string): TerraformingProjectRow | undefined {
		return this.projects.find((x) => x.id === id);
	}

	private row(offered: SaveTerraformingProject | TerraformingPlanetProjectData): TerraformingProjectRow {
		const project = this.catalog.project(offered.id);
		const saved = 'wares' in offered ? offered : undefined;
		const scaled = !!saved?.wares.length;
		return {
			id: offered.id,
			project,
			name: this.catalog.projectName(offered.id),
			predecessors: offered.predecessors,
			any: !!offered.any,
			completed: saved?.completed ?? 0,
			wares: scaled ? saved!.wares : (project?.wares ?? []),
			scaled,
		};
	}
}
