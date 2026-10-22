import { describe, expect, it } from 'vitest';
import { runExtractors } from '../../core/xml/xml-extractor';
import { INFO_9_00 } from '../testdata/info-9.00';
import { createInfoExtractor } from './info-extractor';

function textStream(...chunks: string[]): ReadableStream<string> {
	return new ReadableStream<string>({
		start(controller) {
			chunks.forEach((chunk) => controller.enqueue(chunk));
			controller.close();
		},
	});
}

describe('createInfoExtractor', () => {
	it('reads the save header', async () => {
		const results = await runExtractors(textStream(INFO_9_00), [createInfoExtractor()]);
		const info = results['info'] as ReturnType<ReturnType<typeof createInfoExtractor>['result']>;
		expect(info).toMatchObject({
			saveName: "Hatikvah's Choice I",
			savedAt: 1792661326000,
			gameVersion: 900,
			gameBuild: 611726,
			originalVersion: 600,
			start: 'x4ep1_gamestart_pirate1',
			gameTime: 39121.904,
			guid: '8A33B22E-2892-403F-B88C-DD0B320D825B',
			playerName: 'Müller',
			money: 68714,
			modified: false,
		});
		expect(info!.extensions).toHaveLength(7);
		expect(info!.extensions).toContainEqual({ id: 'ego_dlc_mini_02', version: 900 });
	});

	it('is done after </info>', () => {
		const extractor = createInfoExtractor();
		expect(extractor.done()).toBe(false);
		extractor.open('savegame', ['savegame'], () => ({}));
		extractor.open('info', ['savegame', 'info'], () => ({}));
		expect(extractor.done()).toBe(false);
		extractor.close?.('info', ['savegame', 'info']);
		expect(extractor.done()).toBe(true);
	});
});
