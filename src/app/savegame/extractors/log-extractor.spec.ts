import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import type { SaveLog } from '../log/save-log-model';
import { LogExtractor } from './log-extractor';

class LogRunner {
	static async read(xml: string): Promise<SaveLog> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new LogExtractor()]);
		return results['log'] as SaveLog;
	}

	static save(entries: string): string {
		return (
			'<savegame><universe><component class="galaxy" macro="xu_ep2_universe_macro" id="[0x1]">' +
			'<component class="sector" macro="Cluster_08_Sector001_macro" id="[0x10bdd]"/></component></universe>' +
			`<log>${entries}</log><log><entry time="1" title="not the logbook"/></log></savegame>`
		);
	}
}

describe('LogExtractor', () => {
	it('reads the entries newest first, with category, cleaned text and the faction', async () => {
		const xml = LogRunner.save(
			'<entry time="14.5" category="tips" title="Tip" text="[\\033]#FFFFFFFF#Press [\\033][keyboard_INPUT_KEYCODE_LSHIFT]![\\033]X"/>' +
				'<entry time="575.75" title="Reputation gained" text="Reason: Trade Completed[\\012]Current reputation: 5" faction="{20203,201}"/>' +
				'<entry time="600" category="missions" title="Smuggle Trouble" faction="Ash Zannt"/>'
		);
		const log = await LogRunner.read(xml);
		expect(log.total).toBe(3);
		expect(log.entries).toEqual([
			{ time: 600, category: 'missions', title: 'Smuggle Trouble', factionName: 'Ash Zannt' },
			{
				time: 575.75,
				title: 'Reputation gained',
				text: 'Reason: Trade Completed\nCurrent reputation: 5',
				faction: 'argon',
			},
			{ time: 14.5, category: 'tips', title: 'Tip', text: 'Press LSHIFT!' },
		]);
		expect(log.losses).toEqual([]);
	});

	it('turns a sector component into the sector id', async () => {
		const log = await LogRunner.read(
			LogRunner.save('<entry time="5" title="Station attacked" interact="showonmap" component="[0x10bdd]"/>')
		);
		expect(log.entries[0].sector).toBe('cluster_08_sector001');
	});

	it('reads the destroyed player-owned objects as losses', async () => {
		const xml = LogRunner.save(
			'<entry time="900" category="upkeep" title="Minotaurus Angreifer (HKI-952) wurde zerstört;" ' +
				'text="Standort: Stiller Zeuge I[\\012]Zerstört von: PGS Freibeuter Minotaurus Plünderer (PAO-756)" ' +
				'interact="showlocationonmap" component="[0x10bdd]" x="-39461.8" y="0" z="-66734.9" highlighted="1"/>' +
				'<entry time="950" category="upkeep" title="Gladius (MXX-802) was destroyed." ' +
				'text="Location: Superhighway to Argon Prime[\\012]Commander: INS Archangel (OEU-716)" ' +
				'interact="showlocationonmap" component="[0x999]"/>'
		);
		const log = await LogRunner.read(xml);
		expect(log.losses).toEqual([
			{
				time: 950,
				name: 'Gladius',
				code: 'MXX-802',
				location: 'Superhighway to Argon Prime',
				commander: 'INS Archangel',
			},
			{
				time: 900,
				name: 'Minotaurus Angreifer',
				code: 'HKI-952',
				sector: 'cluster_08_sector001',
				killer: 'PGS Freibeuter Minotaurus Plünderer',
				killerCode: 'PAO-756',
			},
		]);
		expect(log.entries.length).toBe(2);
	});

	it('keeps only the newest entries', async () => {
		const entries = Array.from(
			{ length: LogExtractor.MAX_ENTRIES + 3 },
			(_, i) => `<entry time="${i}" title="e${i}"/>`
		).join('');
		const log = await LogRunner.read(LogRunner.save(entries));
		expect(log.total).toBe(LogExtractor.MAX_ENTRIES + 3);
		expect(log.entries.length).toBe(LogExtractor.MAX_ENTRIES);
		expect(log.entries[0].time).toBe(LogExtractor.MAX_ENTRIES + 2);
	});

	it('returns an empty log for a save without one', async () => {
		expect(await LogRunner.read('<savegame><universe/></savegame>')).toEqual({ total: 0, entries: [], losses: [] });
	});
});
