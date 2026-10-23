import { ResearchCost } from './research-cost';
import type { ResearchData, ResearchPath, ResearchState } from './research-model';

/**
 * The research projects as a graph, with their states for the research done in a save: which can be started
 * now, and what a project still takes.
 */
export class ResearchProgress {
	private static readonly STATE_ORDER: Record<ResearchState, number> = {
		available: 0,
		locked: 1,
		mission: 2,
		done: 3,
	};

	private readonly byId: ReadonlyMap<string, ResearchData>;
	private readonly dependents = new Map<string, ResearchData[]>();

	/** @param done the ids of the research done; empty without a save */
	constructor(
		readonly projects: readonly ResearchData[],
		private readonly done: ReadonlySet<string>
	) {
		this.byId = new Map(projects.map((x) => [x.id, x]));
		for (const project of projects) {
			for (const id of project.requires) {
				const list = this.dependents.get(id) ?? [];
				list.push(project);
				this.dependents.set(id, list);
			}
		}
	}

	/** The order of the states, `available` first, for sorting. */
	static rank(state: ResearchState): number {
		return ResearchProgress.STATE_ORDER[state];
	}

	get(id: string): ResearchData | undefined {
		return this.byId.get(id);
	}

	isDone(id: string): boolean {
		return this.done.has(id);
	}

	state(project: ResearchData): ResearchState {
		if (this.done.has(project.id)) {
			return 'done';
		}
		if (project.missionOnly) {
			return 'mission';
		}
		return project.requires.every((x) => this.done.has(x)) ? 'available' : 'locked';
	}

	/** The known projects the project needs directly. */
	requires(project: ResearchData): ResearchData[] {
		return project.requires.map((x) => this.byId.get(x)).filter((x): x is ResearchData => !!x);
	}

	/** The projects needing the project directly. */
	requiredBy(project: ResearchData): ResearchData[] {
		return this.dependents.get(project.id) ?? [];
	}

	/**
	 * The projects that can be started now and are listed at the headquarters, by sort order. Story projects are
	 * left out: the headquarters offers them only once their story adds them, which the save doesn't tell.
	 */
	next(): ResearchData[] {
		return this.projects
			.filter((x) => !x.hidden && !x.story && this.state(x) === 'available')
			.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
	}

	/** What the project still takes: itself and every prerequisite not done, prerequisites first. */
	path(project: ResearchData): ResearchPath {
		const steps: ResearchData[] = [];
		const seen = new Set<string>();
		const visit = (item: ResearchData) => {
			if (seen.has(item.id) || this.done.has(item.id)) {
				return;
			}
			seen.add(item.id);
			this.requires(item).forEach(visit);
			steps.push(item);
		};
		visit(project);
		const researched = steps.filter((x) => !x.missionOnly);
		return {
			steps,
			researched,
			missions: steps.filter((x) => x.missionOnly),
			time: researched.reduce((sum, x) => sum + x.time, 0),
			wares: ResearchCost.sum(researched.map((x) => x.wares)),
		};
	}
}
