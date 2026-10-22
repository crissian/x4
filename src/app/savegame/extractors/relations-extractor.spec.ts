import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveRelations } from '../map/save-map-model';
import { RelationsExtractor } from './relations-extractor';

class RelationsRunner {
	static async read(xml: string): Promise<SaveRelations> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new RelationsExtractor()]);
		return results['relations'] as SaveRelations;
	}

	static save(factionId: string, inner: string): string {
		return `<savegame><universe><factions><faction id="${factionId}"><relations>${inner}</relations></faction></factions></universe></savegame>`;
	}
}

describe('RelationsExtractor', () => {
	it('reads the player relations', async () => {
		const xml = RelationsRunner.save(
			'player',
			'<relation faction="split" relation="-0.032"/><relation faction="xenon" relation="-1"/>'
		);
		expect(await RelationsRunner.read(xml)).toEqual({ split: -0.032, xenon: -1 });
	});

	it('adds boosters and clamps', async () => {
		const xml = RelationsRunner.save(
			'player',
			'<relation faction="argon" relation="0.99"/><booster faction="argon" relation="0.02454" time="1"/>' +
				'<booster faction="teladi" relation="0.02292" time="1"/>'
		);
		expect(await RelationsRunner.read(xml)).toEqual({ argon: 1, teladi: 0.02292 });
	});

	it("ignores other factions' relations", async () => {
		const xml = RelationsRunner.save('argon', '<relation faction="xenon" relation="-1"/>');
		expect(await RelationsRunner.read(xml)).toEqual({});
	});

	it('returns an empty object when there is no player faction', async () => {
		expect(await RelationsRunner.read('<savegame><universe><factions/></universe></savegame>')).toEqual({});
	});
});
