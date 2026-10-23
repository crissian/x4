import { describe, expect, it } from 'vitest';
import { TerraformingBodies } from './terraforming-bodies';
import { TerraformingConditions } from './terraforming-conditions';
import { TerraformingTesting } from './terraforming-testing';
import { TerraformingText } from './terraforming-text';

describe('TerraformingCatalog', () => {
	const catalog = TerraformingTesting.catalog();
	const temperature = catalog.stat('temperature')!;

	it('finds the range a value falls in, ends included, the last one above it', () => {
		expect(catalog.range(temperature, 0)?.state).toBe(0);
		expect(catalog.range(temperature, 3)?.state).toBe(0);
		expect(catalog.range(temperature, 4)?.state).toBe(1);
		expect(catalog.range(temperature, 12)?.state).toBe(3);
		expect(catalog.range(catalog.stat('population')!, 5)).toBeUndefined();
	});

	it('lays the scale out from 0 to the last end', () => {
		const scale = catalog.scale(temperature);
		expect(scale.map((x) => x.value)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(scale.map((x) => x.range.state)).toEqual([0, 0, 0, 0, 1, 2, 3, 3, 3, 3]);
	});

	it('names projects, groups and stats, else gives the id, and reads the game labels', () => {
		expect(catalog.groupName('biosphere')).toBe('Biosphere');
		expect(catalog.projectName('nothing')).toBe('nothing');
		expect(catalog.statName('temperature')).toBe('Temperature');
		expect(catalog.label('conditions')).toBe('Conditions');
		expect(catalog.label('missing')).toBe('missing');
		expect(catalog.planet('cluster_49')?.name).toBe('Messner');
	});
});

describe('TerraformingConditions', () => {
	const conditions = new TerraformingConditions(TerraformingTesting.catalog());

	it('checks range states and values', () => {
		const state = { stat: 'temperature', min: 1, max: 2 };
		expect(conditions.met(state, { temperature: 3 })).toBe(false);
		expect(conditions.met(state, { temperature: 4 })).toBe(true);
		expect(conditions.met(state, { temperature: 6 })).toBe(false);
		const value = { stat: 'population', minValue: 10000 };
		expect(conditions.met(value, { population: 9999 })).toBe(false);
		expect(conditions.met(value, { population: 10000 })).toBe(true);
	});

	it("can't tell for a stat the planet lacks or a state of a stat without ranges", () => {
		expect(conditions.met({ stat: 'temperature', min: 1 }, {})).toBeUndefined();
		expect(conditions.met({ stat: 'population', min: 1 }, { population: 3 })).toBeUndefined();
		expect(
			conditions.all(
				[
					{ stat: 'temperature', min: 1 },
					{ stat: 'oxygen', min: 1 },
				],
				{ temperature: 0 }
			)
		).toBe(false);
		expect(conditions.all([{ stat: 'oxygen', min: 1 }], {})).toBeUndefined();
		expect(conditions.all([], {})).toBe(true);
	});
});

describe('TerraformingText', () => {
	const text = new TerraformingText(TerraformingTesting.catalog());

	it('writes conditions as the values the allowed states take', () => {
		expect(text.condition({ stat: 'temperature', min: 1, max: 2 })).toBe('Temperature 4–5');
		expect(text.condition({ stat: 'temperature', max: 0 })).toBe('Temperature 0–3');
		expect(text.condition({ stat: 'population', minValue: 10000 })).toBe('Housing ≥ 10,000');
	});

	it('writes effects', () => {
		expect(text.effect({ stat: 'temperature', change: 1 })).toBe('Temperature +1');
		expect(text.effect({ stat: 'population', value: 0 })).toBe('Housing = 0');
		expect(text.effect({ stat: 'temperature', change: -2, min: 1 })).toBe('Temperature -2 (min 1)');
	});
});

describe('TerraformingBodies', () => {
	it('tells planets from moons', () => {
		const bodies = new TerraformingBodies(TerraformingTesting.data().planets);
		expect(bodies.has('cluster_49', 0)).toBe(true);
		expect(bodies.has('cluster_49', 0, 0)).toBe(false);
		expect(bodies.has('cluster_03', 0)).toBe(false);
		expect(bodies.has('cluster_03', 0, 0)).toBe(true);
	});
});
