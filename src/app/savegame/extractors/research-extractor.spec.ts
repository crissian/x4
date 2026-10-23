import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveResearch } from '../map/save-map-model';
import { ResearchExtractor } from './research-extractor';

class ResearchRunner {
	static async read(xml: string): Promise<SaveResearch> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new ResearchExtractor()]);
		return (results['research'] as SaveResearch | undefined) ?? [];
	}

	static player(inner: string): string {
		return `<component class="player" owner="player"><blueprints><blueprint ware="x"/></blueprints><research>${inner}</research></component>`;
	}
}

describe('ResearchExtractor', () => {
	it('reads the completed research of the player component at any depth', async () => {
		const xml =
			'<savegame><universe><component class="galaxy"><connections><connection><component class="ship_s">' +
			ResearchRunner.player(
				'<research ware="research_module_dock" method="research"/><research ware="research_teleportation" method="research"/>'
			) +
			'</component></connection></connections></component></universe></savegame>';
		expect(await ResearchRunner.read(xml)).toEqual(['research_module_dock', 'research_teleportation']);
	});

	it('ignores research elements elsewhere', async () => {
		const xml =
			'<savegame><component class="npc"><research><research ware="research_seta"/></research></component>' +
			'<project research="research_tf_tech"/>' +
			ResearchRunner.player('<research ware="research_mod_ship_mk1"/>') +
			'</savegame>';
		expect(await ResearchRunner.read(xml)).toEqual(['research_mod_ship_mk1']);
	});

	it('returns nothing when the player has no research', async () => {
		expect(await ResearchRunner.read('<savegame><component class="player"/></savegame>')).toEqual([]);
	});
});
