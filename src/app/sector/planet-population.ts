import type { Planet } from '../shared/services/model/model';

/** The population of a planet as shown in the planets table. */
export class PlanetPopulation {
	/** Game text placeholders such as `$POPULATION$`, filled in by the game at runtime. */
	private static readonly PLACEHOLDER = /^\$\w+\$$/;

	/**
	 * The population text; a dynamic population (a `$POPULATION$` placeholder) shows its maximum, compactly
	 * formatted for `locale`, or '-' without one. Raw placeholders are never shown.
	 */
	static label(planet: Pick<Planet, 'population' | 'maxPopulation'>, locale: string): string {
		const population = planet.population ?? '';
		if (!PlanetPopulation.PLACEHOLDER.test(population)) {
			return population || '-';
		}
		if (!planet.maxPopulation) {
			return '-';
		}
		const count = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
			planet.maxPopulation
		);
		return $localize`up to ${count}:count:`;
	}
}
