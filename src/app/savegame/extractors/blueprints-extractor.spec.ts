import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveBlueprints } from '../map/save-map-model';
import { BlueprintsExtractor } from './blueprints-extractor';

class BlueprintsRunner {
	static async read(xml: string): Promise<SaveBlueprints> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new BlueprintsExtractor()]);
		return (results['blueprints'] as SaveBlueprints | undefined) ?? [];
	}

	static player(inner: string): string {
		return `<component class="player" owner="player"><blueprints>${inner}</blueprints></component>`;
	}
}

describe('BlueprintsExtractor', () => {
	it('reads the blueprints of the player component at any depth', async () => {
		const xml =
			'<savegame><universe><component class="galaxy"><connections><connection><component class="ship_s">' +
			BlueprintsRunner.player('<blueprint ware="module_arg_stor_solid_m_01"/><blueprint ware="ship_arg_s_fighter_01_a"/>') +
			'</component></connection></connections></component></universe></savegame>';
		expect(await BlueprintsRunner.read(xml)).toEqual(['module_arg_stor_solid_m_01', 'ship_arg_s_fighter_01_a']);
	});

	it('ignores blueprints outside the player component', async () => {
		const xml =
			'<savegame><component class="npc"><blueprints><blueprint ware="engine_x"/></blueprints></component>' +
			BlueprintsRunner.player('<blueprint ware="shield_y"/>') +
			'</savegame>';
		expect(await BlueprintsRunner.read(xml)).toEqual(['shield_y']);
	});

	it('returns nothing when the player has no blueprints', async () => {
		expect(await BlueprintsRunner.read('<savegame><component class="player"/></savegame>')).toEqual([]);
	});
});
