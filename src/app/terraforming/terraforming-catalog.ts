import {
	Terraforming,
	type TerraformingDataSet,
	type TerraformingGroupData,
	type TerraformingPlanetData,
	type TerraformingProjectData,
	type TerraformingRangeData,
	type TerraformingStatData,
} from '../shared/services/data/terraforming-data';

/** One value of a stat's scale and the range it falls in. */
export interface TerraformingScaleCell {
	value: number;
	range: TerraformingRangeData;
}

/**
 * The terraforming stats, projects, groups and planets of `libraries/terraforming.xml` and the md scripts, by id,
 * with the game's menu texts. A range takes the values above the previous range's end up to its own `end`; the
 * first range starts at 0.
 */
export class TerraformingCatalog {
	readonly stats: readonly TerraformingStatData[];
	readonly projects: readonly TerraformingProjectData[];
	readonly planets: readonly TerraformingPlanetData[];
	private readonly statById: ReadonlyMap<string, TerraformingStatData>;
	private readonly projectById: ReadonlyMap<string, TerraformingProjectData>;
	private readonly groupById: ReadonlyMap<string, TerraformingGroupData>;

	constructor(private readonly data: TerraformingDataSet = Terraforming) {
		this.stats = data.stats;
		this.projects = data.projects;
		this.planets = data.planets;
		this.statById = new Map(data.stats.map((x) => [x.id, x]));
		this.projectById = new Map(data.projects.map((x) => [x.id, x]));
		this.groupById = new Map(data.groups.map((x) => [x.id, x]));
	}

	stat(id: string): TerraformingStatData | undefined {
		return this.statById.get(id);
	}

	project(id: string): TerraformingProjectData | undefined {
		return this.projectById.get(id);
	}

	/** The name of a project, else its id. */
	projectName(id: string): string {
		return this.project(id)?.name ?? id;
	}

	/** The name of a project group, else its id. */
	groupName(id: string): string {
		return this.groupById.get(id)?.name ?? id;
	}

	/** The name of a stat, else its id. */
	statName(id: string): string {
		return this.stat(id)?.name ?? id;
	}

	/** The planet the scripts set up in a cluster. */
	planet(cluster: string): TerraformingPlanetData | undefined {
		return this.planets.find((x) => x.cluster === cluster);
	}

	/** One of the game's terraforming menu texts, e.g. `conditions`. */
	label(key: string): string {
		return this.data.labels[key]?.label ?? key;
	}

	/** The range a value of the stat falls in; above the last end, the last range. */
	range(stat: TerraformingStatData, value: number): TerraformingRangeData | undefined {
		return stat.ranges.find((x) => value <= x.end) ?? stat.ranges.at(-1);
	}

	/** Every whole value from 0 to the last range's end, with its range; empty for a stat without ranges. */
	scale(stat: TerraformingStatData): TerraformingScaleCell[] {
		const last = stat.ranges.at(-1);
		if (!last) {
			return [];
		}
		const cells: TerraformingScaleCell[] = [];
		for (let value = 0; value <= last.end; value++) {
			cells.push({ value, range: this.range(stat, value)! });
		}
		return cells;
	}

	/** The ranges whose state is within min..max, either open. */
	rangesInStates(stat: TerraformingStatData, min?: number, max?: number): TerraformingRangeData[] {
		return stat.ranges.filter(
			(x) => (min === undefined || x.state >= min) && (max === undefined || x.state <= max)
		);
	}
}
