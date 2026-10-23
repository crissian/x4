import type { Planet } from '../shared/services/model/model';
import { NumberFormats } from '../core/format/number-formats';

/** The population of a planet as shown in the planets table. */
export class PlanetPopulation {
	/** Game text placeholders such as `$POPULATION$`, filled in by the game at runtime. */
	private static readonly PLACEHOLDER = /^\$\w+\$$/;

	/**
	 * The population text; a dynamic population (a `$POPULATION$` placeholder) shows its maximum, compactly
	 * formatted, or '-' without one. Raw placeholders are never shown.
	 */
	static label(planet: Pick<Planet, 'population' | 'maxPopulation'>): string {
		const population = planet.population ?? '';
		if (!PlanetPopulation.PLACEHOLDER.test(population)) {
			return population || '-';
		}
		if (!planet.maxPopulation) {
			return '-';
		}
		const count = NumberFormats.compact(planet.maxPopulation);
		return $localize`up to ${count}:count:`;
	}
}
