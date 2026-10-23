import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveTerraforming, TerraformingExtractor } from './terraforming-extractor';

class TerraformingRunner {
	static async read(xml: string): Promise<SaveTerraforming> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new TerraformingExtractor()]);
		return results[TerraformingExtractor.KEY] as SaveTerraforming;
	}

	/** A save with one cluster holding the given content, as a save writes it. */
	static save(macro: string, content: string): string {
		return (
			'<savegame><universe><component class="galaxy"><connections><connection>' +
			`<component class="cluster" macro="${macro}" connection="galaxy">` +
			'<system><planets><planet part="planet001c"/></planets></system>' +
			content +
			'<connections><connection><component class="sector" macro="cluster_49_sector001_macro"/></connection></connections>' +
			'</component></connection></connections></component></universe></savegame>'
		);
	}
}

describe('TerraformingExtractor', () => {
	it('reads the stats, projects with their scaled wares and predecessors, and the events of a planet', async () => {
		// trimmed from a save of Frontier Edge
		const xml = TerraformingRunner.save(
			'cluster_49_macro',
			'<terraforming part="planet001c" seed="1" active="">' +
				'<stats><stat id="seismicactivity" value="1"/><stat id="temperature" value="3"/></stats>' +
				'<projects>' +
				'<project id="trn_pilot_group" starttime="-1" scaledprice="50000" chance="100">' +
				'<conditions><condition stat="trainee_group" min="0"/></conditions>' +
				'<resources price="50000"><ware ware="hullparts" amount="5"/><ware ware="medicalsupplies"/></resources>' +
				'<predecessors any="0"><projects><project id="trn_pilot"/></projects></predecessors>' +
				'<scaledresources><ware ware="hullparts" amount="90"/><ware ware="medicalsupplies" amount="18"/></scaledresources>' +
				'</project>' +
				'<project id="agr_vineyards" scaledprice="0">' +
				'<predecessors any="1"><projects><project id="bio_a"/><project id="bio_b"/></projects></predecessors>' +
				'<removedprojects><project id="bio_c"/></removedprojects>' +
				'</project>' +
				'</projects>' +
				'<events><event id="evt_quake_mild" completed="151" starttime="281524.466" scaledprice="0">' +
				'<sideeffects><sideeffect setback="20"/></sideeffects></event></events>' +
				'</terraforming>'
		);
		expect(await TerraformingRunner.read(xml)).toEqual([
			{
				cluster: 'cluster_49',
				part: 'planet001c',
				stats: { seismicactivity: 1, temperature: 3 },
				projects: [
					{
						id: 'trn_pilot_group',
						predecessors: ['trn_pilot'],
						price: 50000,
						wares: [
							{ ware: 'hullparts', amount: 90 },
							{ ware: 'medicalsupplies', amount: 18 },
						],
					},
					{ id: 'agr_vineyards', predecessors: ['bio_a', 'bio_b'], any: true, price: 0, wares: [] },
				],
				events: [{ id: 'evt_quake_mild', completed: 151, predecessors: [], price: 0, wares: [] }],
			},
		]);
	});

	it('reads a planet with stats only and ignores terraforming elements outside a cluster', async () => {
		const xml =
			'<savegame><terraforming part="x"><stats><stat id="population" value="1"/></stats></terraforming>' +
			TerraformingRunner.save(
				'cluster_113_macro',
				'<terraforming part="part_earthlike"><stats><stat id="population" value="0"/></stats></terraforming>'
			).replace('<savegame>', '');
		expect(await TerraformingRunner.read(xml)).toEqual([
			{ cluster: 'cluster_113', part: 'part_earthlike', stats: { population: 0 }, projects: [], events: [] },
		]);
	});

	it('returns nothing without terraforming', async () => {
		expect(await TerraformingRunner.read(TerraformingRunner.save('cluster_01_macro', ''))).toEqual([]);
	});
});
