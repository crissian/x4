import type { ResearchData } from './research-model';

/** Research projects for specs. */
export class ResearchTesting {
	static project(id: string, overrides: Partial<ResearchData> = {}): ResearchData {
		return {
			id,
			version: 0,
			name: id,
			time: 600,
			sortOrder: 100,
			wares: [],
			requires: [],
			unlocks: [],
			...overrides,
		};
	}

	/** dock → defence → build; mission pre → mod mk1 → mk2 */
	static tree(): ResearchData[] {
		const p = ResearchTesting.project;
		return [
			p('dock', {
				wares: [
					{ ware: 'energycells', amount: 2500 },
					{ ware: 'smartchips', amount: 150 },
				],
			}),
			p('defence', { requires: ['dock'], wares: [{ ware: 'energycells', amount: 2500 }] }),
			p('build', { requires: ['defence', 'dock'], hidden: true }),
			p('pre', { missionOnly: true, time: 10, sortOrder: 300 }),
			p('mk1', { requires: ['pre'], sortOrder: 300 }),
			p('mk2', { requires: ['mk1'], sortOrder: 300, wares: [{ ware: 'claytronics', amount: 50 }] }),
			p('teleport', { sortOrder: 50, time: 900 }),
		];
	}
}
