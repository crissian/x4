import { describe, expect, it } from 'vitest';
import { SavegameFormat } from './savegame-format';

describe('savegame format', () => {
	it('formats the game version', () => {
		expect(SavegameFormat.version(900)).toBe('9.00');
		expect(SavegameFormat.version(710)).toBe('7.10');
	});

	it('labels extensions and falls back to the id', () => {
		expect(SavegameFormat.extension('ego_dlc_mini_02')).not.toBe('');
		expect(SavegameFormat.extension('ego_dlc_mini_02')).not.toBe('ego_dlc_mini_02');
		expect(SavegameFormat.extension('some_mod')).toBe('some_mod');
	});
});
