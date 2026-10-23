import type { TerraformingDataSet, TerraformingProjectData } from '../shared/services/data/terraforming-data';
import { TerraformingCatalog } from './terraforming-catalog';

/** A small terraforming data set for specs. */
export class TerraformingTesting {
	static project(id: string, overrides: Partial<TerraformingProjectData> = {}): TerraformingProjectData {
		return {
			id,
			version: 0,
			group: 'biosphere',
			name: id,
			conditions: [],
			effects: [],
			sideEffects: [],
			rebates: [],
			wares: [],
			deliveries: [],
			removes: [],
			blocks: [],
			blocksGroups: [],
			...overrides,
		};
	}

	/** temperature 0–3 freezing (state 0), 4 cold (1), 5 temperate (2), 6–9 hot (3); housing without ranges */
	static data(): TerraformingDataSet {
		const p = TerraformingTesting.project;
		return {
			stats: [
				{
					id: 'temperature',
					version: 0,
					name: 'Temperature',
					default: 5,
					ranges: [
						{ end: 3, state: 0, notHabitable: true, color: '#ffffff', description: 'Freezing' },
						{ end: 4, state: 1, color: '#66cccc' },
						{ end: 5, state: 2, color: '#00ff00' },
						{ end: 9, state: 3, color: '#ff0000' },
					],
				},
				{ id: 'population', version: 0, name: 'Housing', default: 0, dynamic: true, ranges: [] },
			],
			groups: [{ id: 'biosphere', name: 'Biosphere' }],
			projects: [
				p('warm', {
					effects: [{ stat: 'temperature', change: 1 }],
					wares: [{ ware: 'energycells', amount: 2 }],
				}),
				p('microbes', { conditions: [{ stat: 'temperature', min: 1, max: 2 }] }),
				p('bank', { conditions: [{ stat: 'population', minValue: 10000 }], research: 'research_tf_tech' }),
			],
			planets: [
				{
					cluster: 'cluster_49',
					part: 'planet001c',
					planet: 0,
					name: 'Messner',
					version: 0,
					stats: [
						{ stat: 'temperature', value: 3 },
						{ stat: 'population', value: 0 },
					],
					projects: [
						{ id: 'warm', predecessors: [] },
						{ id: 'microbes', predecessors: ['warm'] },
					],
					events: [],
					source: 'md/terraforming.xml:1',
				},
				{
					cluster: 'cluster_03',
					part: 'planet',
					planet: 0,
					moon: 0,
					version: 0,
					stats: [],
					projects: [],
					events: [],
					source: 'md/terraforming.xml:2',
				},
			],
			labels: { conditions: { label: 'Conditions' } },
		};
	}

	static catalog(): TerraformingCatalog {
		return new TerraformingCatalog(TerraformingTesting.data());
	}
}
