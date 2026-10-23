import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { DiplomacyExtractor, SaveDiplomacy } from './diplomacy-extractor';

class DiplomacyRunner {
	static async read(xml: string): Promise<SaveDiplomacy> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new DiplomacyExtractor()]);
		return results[DiplomacyExtractor.KEY] as SaveDiplomacy;
	}
}

describe('DiplomacyExtractor', () => {
	it('reads which actions the universe diplomacy shows', async () => {
		const xml =
			'<savegame><universe><factions><faction id="argon"><diplomacy active="1">' +
			'<exclude faction="split" reason="dlc1_1"/></diplomacy></faction></factions>' +
			'<god/><diplomacy><actions><action id="spy_ship" hidden="1"/><action id="cultivate_influence" hidden="0"/>' +
			'</actions></diplomacy></universe></savegame>';
		expect(await DiplomacyRunner.read(xml)).toEqual({
			found: true,
			actions: { spy_ship: false, cultivate_influence: true },
		});
	});

	it('ignores the diplomacy of the factions', async () => {
		const xml =
			'<savegame><universe><factions><faction id="argon"><diplomacy><actions><action id="spy_ship" hidden="0"/>' +
			'</actions></diplomacy></faction></factions></universe></savegame>';
		expect(await DiplomacyRunner.read(xml)).toEqual({ found: false, actions: {} });
	});
});
