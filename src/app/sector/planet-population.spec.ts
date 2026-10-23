import { describe, expect, it } from 'vitest';
import { PlanetPopulation } from './planet-population';

describe('PlanetPopulation', () => {
	it('keeps plain population texts', () => {
		expect(PlanetPopulation.label({ population: 'Uninhabited' })).toBe('Uninhabited');
		expect(PlanetPopulation.label({})).toBe('-');
	});

	it('shows the maximum of a dynamic population, compactly', () => {
		expect(PlanetPopulation.label({ population: '$POPULATION$', maxPopulation: 1818450000 })).toBe('up to 1.8B');
		expect(PlanetPopulation.label({ population: '$POPULATION$', maxPopulation: 420000 })).toBe('up to 420K');
	});

	it('never shows a raw placeholder', () => {
		expect(PlanetPopulation.label({ population: '$POPULATION$' })).toBe('-');
		expect(PlanetPopulation.label({ population: '$OTHER$', maxPopulation: 0 })).toBe('-');
	});
});
