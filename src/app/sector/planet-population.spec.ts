import { describe, expect, it } from 'vitest';
import { PlanetPopulation } from './planet-population';

describe('PlanetPopulation', () => {
	it('keeps plain population texts', () => {
		expect(PlanetPopulation.label({ population: 'Uninhabited' }, 'en')).toBe('Uninhabited');
		expect(PlanetPopulation.label({}, 'en')).toBe('-');
	});

	it('shows the maximum of a dynamic population, formatted for the locale', () => {
		expect(PlanetPopulation.label({ population: '$POPULATION$', maxPopulation: 1818450000 }, 'en')).toBe(
			'up to 1.8B'
		);
		expect(PlanetPopulation.label({ population: '$POPULATION$', maxPopulation: 420000 }, 'en')).toBe('up to 420K');
		expect(PlanetPopulation.label({ population: '$POPULATION$', maxPopulation: 1818450000 }, 'de')).toContain(
			'1,8'
		);
	});

	it('never shows a raw placeholder', () => {
		expect(PlanetPopulation.label({ population: '$POPULATION$' }, 'en')).toBe('-');
		expect(PlanetPopulation.label({ population: '$OTHER$', maxPopulation: 0 }, 'en')).toBe('-');
	});
});
