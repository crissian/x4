import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { TerraformingPlanetState } from './terraforming-planet-state';
import { TerraformingQuery } from './terraforming-query';
import { TerraformingTesting } from './terraforming-testing';

describe('TerraformingPlanetState', () => {
	const catalog = TerraformingTesting.catalog();
	const planet = catalog.planet('cluster_49')!;

	it('without a save, takes the stats and projects the scripts set', () => {
		const state = new TerraformingPlanetState(catalog, planet, undefined, undefined);
		expect(state.fromSave).toBe(false);
		expect(state.stats).toEqual({ temperature: 3, population: 0 });
		expect(state.projects.map((x) => [x.id, x.state])).toEqual([
			['warm', 'ready'],
			['microbes', 'waiting'],
		]);
		expect(state.find('warm')).toMatchObject({ scaled: false, wares: [{ ware: 'energycells', amount: 2 }] });
	});

	it('from a save, takes its stats, projects with scaled wares and times completed, and the research done', () => {
		const state = new TerraformingPlanetState(
			catalog,
			planet,
			{
				cluster: 'cluster_49',
				part: 'planet001c',
				stats: { temperature: 4, population: 20000 },
				projects: [
					{ id: 'warm', completed: 1, predecessors: [], wares: [{ ware: 'energycells', amount: 500 }] },
					{ id: 'microbes', predecessors: ['warm'], wares: [] },
					{ id: 'bank', predecessors: ['warm', 'other'], any: true, wares: [] },
				],
				events: [{ id: 'warm', completed: 3, predecessors: [], wares: [] }],
			},
			new Set<string>()
		);
		expect(state.fromSave).toBe(true);
		expect(state.projects.map((x) => [x.id, x.state])).toEqual([
			['warm', 'completed'],
			['microbes', 'ready'],
			['bank', 'waiting'],
		]);
		expect(state.find('warm')).toMatchObject({
			scaled: true,
			completed: 1,
			wares: [{ ware: 'energycells', amount: 500 }],
		});
		expect(state.find('bank')).toMatchObject({ predecessorsMet: true, conditionsMet: true, researchMet: false });
		expect(state.events).toEqual([{ id: 'warm', name: 'warm', completed: 3 }]);
	});

	it("can't tell a project's research without a save", () => {
		const state = new TerraformingPlanetState(
			catalog,
			{ ...planet, stats: [{ stat: 'population', value: 10000 }], projects: [{ id: 'bank', predecessors: [] }] },
			undefined,
			undefined
		);
		expect(state.find('bank')?.state).toBe('unknown');
	});
});

describe('TerraformingQuery', () => {
	const planets = ['cluster_49', 'cluster_03'];

	it('reads a known planet and the view, else the defaults', () => {
		expect(TerraformingQuery.read(convertToParamMap({ planet: 'cluster_03', view: 'graph' }), planets)).toEqual({
			model: { planet: 'cluster_03' },
			view: 'graph',
		});
		expect(TerraformingQuery.read(convertToParamMap({ planet: 'x', view: 'y' }), planets)).toEqual({
			model: { planet: 'cluster_49' },
			view: 'list',
		});
	});

	it('leaves the defaults out', () => {
		expect(TerraformingQuery.write({ model: { planet: 'cluster_49' }, view: 'list' }, planets)).toEqual({
			planet: null,
			view: null,
		});
		expect(TerraformingQuery.write({ model: { planet: 'cluster_03' }, view: 'graph' }, planets)).toEqual({
			planet: 'cluster_03',
			view: 'graph',
		});
	});
});
