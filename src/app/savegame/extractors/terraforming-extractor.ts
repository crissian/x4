import { MacroId } from '../../core/macro-id';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SavePosition } from './save-position';

/** A ware amount the game scaled for a project of the save. */
export interface SaveTerraformingWare {
	ware: string;
	amount: number;
}

/** A project or event of a terraformed planet in the save. */
export interface SaveTerraformingProject {
	id: string;
	/** `completed`: how often it was completed, when it was */
	completed?: number;
	/** `predecessors/projects/project`: the projects it requires */
	predecessors: string[];
	/** `predecessors any="1"`: any one of them */
	any?: true;
	/** `scaledprice` */
	price?: number;
	/** `scaledresources`: the wares the game asks for */
	wares: SaveTerraformingWare[];
}

/** The terraforming state of a planet: `<component class="cluster"><terraforming part=…>`. */
export interface SaveTerraformingPlanet {
	/** cluster macro id, e.g. `cluster_49` */
	cluster: string;
	/** the planet part, e.g. `planet001c` */
	part: string;
	/** stat id -> value; a stat the planet doesn't have is missing */
	stats: Record<string, number>;
	projects: SaveTerraformingProject[];
	events: SaveTerraformingProject[];
}

export type SaveTerraforming = SaveTerraformingPlanet[];

/**
 * Reads the terraforming state of each planet the game set up for it: stats, the projects offered with the ware
 * amounts the game scaled for them and their predecessors, the events, and how often each was completed.
 */
export class TerraformingExtractor implements XmlExtractor<SaveTerraforming> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'terraforming';
	readonly key = TerraformingExtractor.KEY;
	private readonly planets: SaveTerraformingPlanet[] = [];
	/** the open cluster component: its macro id and path length */
	private cluster?: { id: string; depth: number };
	/** path length of the open terraforming element, 0 outside it */
	private depth = 0;
	private planet?: SaveTerraformingPlanet;
	private project?: SaveTerraformingProject;
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (!this.depth) {
			if (name === 'component' && attrs()['class'] === 'cluster') {
				this.cluster = { id: MacroId.of(attrs()['macro'] ?? ''), depth: path.length };
			} else if (name === 'terraforming' && this.cluster && path.length === this.cluster.depth + 1) {
				this.depth = path.length;
				this.planet = { cluster: this.cluster.id, part: attrs()['part'] ?? '', stats: {}, projects: [], events: [] };
				this.planets.push(this.planet);
			}
			return;
		}
		const level = path.length - this.depth;
		const list = path[this.depth];
		const a = attrs();
		if (level === 2 && list === 'stats' && name === 'stat' && a['id']) {
			this.planet!.stats[a['id']] = SavePosition.num(a['value']);
		} else if (level === 2 && (list === 'projects' || list === 'events') && a['id']) {
			this.project = TerraformingExtractor.project(a);
			(list === 'projects' ? this.planet!.projects : this.planet!.events).push(this.project);
		} else if (this.project && level === 3 && name === 'predecessors' && TerraformingExtractor.yes(a['any'])) {
			this.project.any = true;
		} else if (this.project && level === 5 && name === 'project' && path[this.depth + 2] === 'predecessors' && a['id']) {
			this.project.predecessors.push(a['id']);
		} else if (this.project && level === 4 && name === 'ware' && path[this.depth + 2] === 'scaledresources' && a['ware']) {
			this.project.wares.push({ ware: a['ware'], amount: SavePosition.num(a['amount'] ?? '1') });
		}
	}

	close(name: string, path: readonly string[]): void {
		if (this.depth) {
			if (path.length === this.depth + 2) {
				this.project = undefined;
			} else if (path.length === this.depth) {
				this.depth = 0;
				this.planet = undefined;
			}
		} else if (name === 'component' && path.length === this.cluster?.depth) {
			this.cluster = undefined;
		} else if (path.length === 1) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveTerraforming {
		return this.planets;
	}

	private static project(a: XmlAttributes): SaveTerraformingProject {
		const project: SaveTerraformingProject = { id: a['id']!, predecessors: [], wares: [] };
		const completed = SavePosition.num(a['completed']);
		if (completed > 0) {
			project.completed = completed;
		}
		if (a['scaledprice'] !== undefined) {
			project.price = SavePosition.num(a['scaledprice']);
		}
		return project;
	}

	/** `1` or `true` */
	private static yes(value: string | undefined): boolean {
		return value === '1' || value === 'true';
	}
}
