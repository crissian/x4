import type { TerraformingPlanetData } from '../shared/services/data/terraforming-data';

/**
 * Which planets and moons of a cluster can be terraformed, by their place in the cluster's planets data: the
 * planet's index and, for a moon, its index in the planet's moons. Loads the terraforming data on first use.
 */
export class TerraformingBodies {
	private static loading?: Promise<TerraformingBodies>;

	private readonly keys: ReadonlySet<string>;

	constructor(planets: readonly Pick<TerraformingPlanetData, 'cluster' | 'planet' | 'moon'>[]) {
		this.keys = new Set(planets.map((x) => TerraformingBodies.key(x.cluster, x.planet, x.moon)));
	}

	static load(): Promise<TerraformingBodies> {
		TerraformingBodies.loading ??= import('../shared/services/data/terraforming-data').then(
			(x) => new TerraformingBodies(x.Terraforming.planets)
		);
		return TerraformingBodies.loading;
	}

	/** @param moon the moon's index in the planet's moons, undefined for the planet itself */
	has(cluster: string, planet: number, moon?: number): boolean {
		return this.keys.has(TerraformingBodies.key(cluster, planet, moon));
	}

	private static key(cluster: string, planet: number, moon?: number): string {
		return `${cluster}/${planet}/${moon ?? ''}`;
	}
}
