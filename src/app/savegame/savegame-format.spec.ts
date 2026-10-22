import { describe, expect, it } from 'vitest';
import { extensionLabel, formatGameTime, formatGameVersion } from './savegame-format';

describe('savegame format', () => {
	it('formats the game version', () => {
		expect(formatGameVersion(900)).toBe('9.00');
		expect(formatGameVersion(710)).toBe('7.10');
	});

	it('formats the in-game time as hours and minutes', () => {
		expect(formatGameTime(39121.904)).toBe('10h 52m');
		expect(formatGameTime(59)).toBe('0h 0m');
	});

	it('labels extensions and falls back to the id', () => {
		expect(extensionLabel('ego_dlc_mini_02')).not.toBe('');
		expect(extensionLabel('ego_dlc_mini_02')).not.toBe('ego_dlc_mini_02');
		expect(extensionLabel('some_mod')).toBe('some_mod');
	});
});
