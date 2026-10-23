import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveLicences } from '../map/save-map-model';
import { LicencesExtractor } from './licences-extractor';

class LicencesRunner {
	static async read(xml: string): Promise<SaveLicences> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new LicencesExtractor()]);
		return results['licences'] as SaveLicences;
	}

	static save(factionId: string, inner: string): string {
		return `<savegame><universe><factions><faction id="${factionId}"><licences>${inner}</licences></faction></factions></universe></savegame>`;
	}
}

describe('LicencesExtractor', () => {
	it('reads the player licences and splits the factions', async () => {
		const xml = LicencesRunner.save(
			'player',
			'<licence type="militaryship" factions="argon  teladi"/><licence type="station_gen_basic" factions="kaori"/>'
		);
		expect(await LicencesRunner.read(xml)).toEqual({ militaryship: ['argon', 'teladi'], station_gen_basic: ['kaori'] });
	});

	it('keeps a licence with no factions as empty', async () => {
		expect(await LicencesRunner.read(LicencesRunner.save('player', '<licence type="capitalship"/>'))).toEqual({
			capitalship: [],
		});
	});

	it("ignores other factions' licences", async () => {
		const xml = LicencesRunner.save('argon', '<licence type="militaryship" factions="player"/>');
		expect(await LicencesRunner.read(xml)).toEqual({});
	});

	it('returns an empty object when there is no player faction', async () => {
		expect(await LicencesRunner.read('<savegame><universe><factions/></universe></savegame>')).toEqual({});
	});
});
