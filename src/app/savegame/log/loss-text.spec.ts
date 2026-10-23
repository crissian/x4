import { describe, expect, it } from 'vitest';
import { LogFactionRefs } from './log-faction-refs';
import { LogText } from './log-text';
import { LossText } from './loss-text';

describe('LossText', () => {
	it('reads the name, code, location and killer', () => {
		expect(
			LossText.parse(
				'Eclipse Vanguard (OZW-630) was destroyed.',
				'Location: Barren Shores\nDestroyed by: XEN Raiding Party F (ILD-225)'
			)
		).toEqual({
			name: 'Eclipse Vanguard',
			code: 'OZW-630',
			location: 'Barren Shores',
			killer: 'XEN Raiding Party F',
			killerCode: 'ILD-225',
		});
	});

	it('tells the commander from the killer', () => {
		expect(
			LossText.parse(
				'Merkur Angreifer (KDC-929) wurde zerstört;',
				'Standort: Ketzers Untergang\nKommandant: Pharmazieprodukte-Fabrik II (CTH-784)\nZerstört von: GEF Marodeur (NDS-283)'
			)
		).toEqual({
			name: 'Merkur Angreifer',
			code: 'KDC-929',
			location: 'Ketzers Untergang',
			commander: 'Pharmazieprodukte-Fabrik II',
			killer: 'GEF Marodeur',
			killerCode: 'NDS-283',
		});
	});

	it('takes the third line as the killer when the label is unknown', () => {
		const parts = LossText.parse('A (AAA-111)', 'L: S\nC: B (BBB-222)\nK: X (CCC-333)');
		expect(parts?.commander).toBe('B');
		expect(parts?.killer).toBe('X');
	});

	it('reads the killer label of languages with a full-width colon', () => {
		expect(LossText.parse('A (AAA-111)', '位置：某处\n被此目标摧毁：XEN 舰队 (CCC-333)')?.killer).toBe('XEN 舰队');
	});

	it('gives nothing for a title without id code', () => {
		expect(LossText.parse('Station destroyed', 'Location: X')).toBeUndefined();
	});
});

describe('LogText', () => {
	it('removes colours, keeps key names and line breaks', () => {
		expect(LogText.clean('[\\033]#FFFFFFFF#Hit [\\033][keyboard_INPUT_KEYCODE_RETURN][\\033]X[\\012]Done')).toBe(
			'Hit RETURN\nDone'
		);
	});

	it('cuts long texts', () => {
		const text = LogText.short('x'.repeat(LogText.MAX_TEXT + 10));
		expect(text.length).toBe(LogText.MAX_TEXT);
		expect(text.endsWith('…')).toBe(true);
	});
});

describe('LogFactionRefs', () => {
	it('resolves faction name references', () => {
		expect(LogFactionRefs.resolve('{20203,2001}')).toEqual({ faction: 'split' });
		expect(LogFactionRefs.resolve('{20203,2201}')).toEqual({ factionName: 'Rhak Patriarchy' });
		expect(LogFactionRefs.resolve('{1021,102}')).toEqual({});
		expect(LogFactionRefs.resolve('Hariken Space Dynamics')).toEqual({ factionName: 'Hariken Space Dynamics' });
		expect(LogFactionRefs.resolve(undefined)).toEqual({});
	});
});
