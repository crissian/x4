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
 * with the game's menu texts. A value is in the first range whose `end` is at least the value, as the game's
 * terraforming menu colours a stat's blocks (ui/addons/ego_detailmonitor/menu_terraforming.lua:380-385).
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

	/** The range a value of the stat falls in: the first whose end is at least the value. */
	range(stat: TerraformingStatData, value: number): TerraformingRangeData | undefined {
		return stat.ranges.find((x) => value <= x.end);
	}

	/**
	 * The blocks the game draws for a stat: one per whole value from 1 to the last range's end, in its range's colour
	 * (menu_terraforming.lua:378-392); empty for a stat without ranges, which the menu shows as a number.
	 */
	scale(stat: TerraformingStatData): TerraformingScaleCell[] {
		const last = stat.ranges.at(-1);
		if (!last) {
			return [];
		}
		const cells: TerraformingScaleCell[] = [];
		for (let value = 1; value <= last.end; value++) {
			cells.push({ value, range: this.range(stat, value)! });
		}
		return cells;
	}
}
