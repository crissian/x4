import { describe, expect, it } from 'vitest';
import { TerraformingBodies } from './terraforming-bodies';
import { TerraformingTesting } from './terraforming-testing';
import { TerraformingText } from './terraforming-text';

describe('TerraformingCatalog', () => {
	const catalog = TerraformingTesting.catalog();
	const temperature = catalog.stat('temperature')!;

	it('finds the first range whose end is at least the value', () => {
		expect(catalog.range(temperature, 0)?.state).toBe(0);
		expect(catalog.range(temperature, 3)?.state).toBe(0);
		expect(catalog.range(temperature, 4)?.state).toBe(1);
		expect(catalog.range(temperature, 12)).toBeUndefined();
		expect(catalog.range(catalog.stat('population')!, 5)).toBeUndefined();
	});

	it('draws a block per value from 1 to the last end', () => {
		const scale = catalog.scale(temperature);
		expect(scale.map((x) => x.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(scale.map((x) => x.range.state)).toEqual([0, 0, 0, 1, 2, 3, 3, 3, 3]);
		expect(catalog.scale(catalog.stat('population')!)).toEqual([]);
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

describe('TerraformingText', () => {
	const text = new TerraformingText(TerraformingTesting.catalog());

	it('writes a condition as the values of the blocks that meet it', () => {
		expect(text.condition({ stat: 'temperature', min: 1, max: 2 })).toBe('Temperature 4–5');
		expect(text.condition({ stat: 'temperature', max: 0 })).toBe('Temperature 1–3');
		expect(text.condition({ stat: 'temperature', min: 3, maxValue: 7 })).toBe('Temperature 6–7');
		expect(text.conditionBlocks({ stat: 'temperature', minValue: 9 })?.map((x) => x.value)).toEqual([9]);
	});

	it('writes the minimum value of a stat without ranges, and leaves out a condition the menu hides', () => {
		expect(text.condition({ stat: 'population', minValue: 10000 })).toBe('Housing ≥ 10,000');
		expect(text.conditionBlocks({ stat: 'population', minValue: 10000 })).toBeUndefined();
		expect(text.condition({ stat: 'population', maxValue: 5 })).toBeUndefined();
	});

	it('writes the change of an effect, else the value it sets', () => {
		expect(text.effect({ stat: 'temperature', change: 1 })).toBe('Temperature +1');
		expect(text.effect({ stat: 'temperature', change: -2, min: 1 })).toBe('Temperature -2');
		expect(text.effect({ stat: 'population', value: 0 })).toBe('Housing = 0');
	});

	it('joins runs of values', () => {
		expect(TerraformingText.spans([1, 2, 3, 9])).toBe('1–3, 9');
		expect(TerraformingText.spans([])).toBe('-');
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
