import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveRepresentatives } from '../map/save-map-model';
import { RepresentativesExtractor } from './representatives-extractor';

class RepresentativesRunner {
	static async read(xml: string): Promise<SaveRepresentatives> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new RepresentativesExtractor()]);
		return results['representatives'] as SaveRepresentatives;
	}

	static station(owner: string, inner: string): string {
		return (
			`<component class="station" owner="${owner}"><connections><connection><component class="room">` +
			`${inner}</component></connection></connections></component>`
		);
	}

	static save(stations: string): string {
		return `<savegame><universe><component class="galaxy"><connections>${stations}</connections></component></universe></savegame>`;
	}
}

describe('RepresentativesExtractor', () => {
	it('reads the owners of the stations a faction representative works on', async () => {
		const rep = '<entity type="factionrepresentative"/>';
		const xml = RepresentativesRunner.save(
			RepresentativesRunner.station('argon', rep) +
				RepresentativesRunner.station('teladi', '<entity type="shiptrader"/>') +
				RepresentativesRunner.station('alliance', rep) +
				RepresentativesRunner.station('argon', rep)
		);
		expect(await RepresentativesRunner.read(xml)).toEqual(['argon', 'alliance']);
	});

	it('ignores representatives outside stations', async () => {
		const xml = RepresentativesRunner.save(
			'<component class="ship_l" owner="xenon"><entity type="factionrepresentative"/></component>'
		);
		expect(await RepresentativesRunner.read(xml)).toEqual([]);
	});
});
