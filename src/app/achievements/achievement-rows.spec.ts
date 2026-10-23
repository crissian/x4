import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { AchievementUnlock } from './achievement-model';
import { AchievementQuery } from './achievement-query';
import { AchievementRows, type AchievementCriteria } from './achievement-rows';

const unlock = (id: string, values: Partial<AchievementUnlock> = {}): AchievementUnlock => ({
	id,
	version: 0,
	category: 'general',
	scripts: ['setup'],
	...values,
});

describe('AchievementRows', () => {
	const rows = AchievementRows.build(
		[
			unlock('START', { cues: ['GameStarted'] }),
			unlock('PLOT_1', { category: 'story', comment: 'The mentor' }),
			unlock('TOA_YACHT', { version: 3, category: 'story' }),
		],
		[
			{ id: 's_money_player_max', name: 'Account', units: 'credits', unlock: 1000, progressStep: 250 },
			{ id: 's_trade_rank', name: 'Trade rank', unlock: 30, rank: 'X-TREME' },
			{ id: 's_tl', unlock: 2, scenario: true },
		]
	);
	const criteria = (values: Partial<AchievementCriteria> = {}): AchievementCriteria => ({
		search: '',
		category: '',
		version: -1,
		hideDone: false,
		done: {},
		...values,
	});

	it('builds a row per unlock and statistic value, story ones as spoilers', () => {
		expect(rows.map((x) => x.key)).toEqual([
			'START',
			'PLOT_1',
			'TOA_YACHT',
			's_money_player_max:1000',
			's_trade_rank:30',
			's_tl:2',
		]);
		expect(rows[0]).toMatchObject({ source: 'GameStarted - setup', spoiler: false });
		expect(rows[1]).toMatchObject({ note: 'The mentor', spoiler: true });
		expect(rows[3].title).toContain('1,000 Cr');
		expect(rows[4].title).toContain('X-TREME');
		// scenario statistics count for Timelines
		expect(rows[5]).toMatchObject({ version: AchievementRows.TIMELINES, title: 's_tl reaches 2' });
	});

	it('filters by category, version, search and done', () => {
		const keys = (values: Partial<AchievementCriteria>) =>
			AchievementRows.filter(rows, criteria(values)).map((x) => x.key);
		expect(keys({ category: 'story' })).toEqual(['PLOT_1', 'TOA_YACHT']);
		expect(keys({ version: 3 })).toEqual(['TOA_YACHT']);
		expect(keys({ search: 'mentor' })).toEqual(['PLOT_1']);
		expect(keys({ hideDone: true, done: { START: true }, version: 0 })).not.toContain('START');
	});

	it('groups by version with the done count, categories in order', () => {
		const groups = AchievementRows.group(rows, { START: true });
		expect(groups.map((x) => [x.version, x.rows.length, x.done])).toEqual([
			[0, 4, 1],
			[3, 1, 0],
			[5, 1, 0],
		]);
		expect(groups[0].rows.map((x) => x.category)).toEqual(['story', 'general', 'statistic', 'statistic']);
	});
});

describe('AchievementQuery', () => {
	it('reads the defaults from no params and writes none for them', () => {
		const model = AchievementQuery.read(convertToParamMap({}), 8);
		expect(model).toEqual(AchievementQuery.DEFAULTS);
		expect(Object.values(AchievementQuery.write(model)).every((x) => x === null)).toBe(true);
	});

	it('reads and writes the filters, ignoring unknown values', () => {
		const params = { q: 'plot', category: 'story', dlc: '3', done: 'hide', spoilers: '1' };
		expect(AchievementQuery.write(AchievementQuery.read(convertToParamMap(params), 8))).toEqual(params);
		const bad = AchievementQuery.read(convertToParamMap({ category: 'x', dlc: '99' }), 8);
		expect(bad).toMatchObject({ category: '', version: '' });
	});
});
