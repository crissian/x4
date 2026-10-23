import { describe, expect, it } from 'vitest';
import { SelectOption, SelectOptionFilter } from './select-option-filter';

const options: SelectOption[] = [
	{ id: 'custom', name: 'Custom ship' },
	{ id: 'own-1', name: 'Hauler One', group: 'Your ships: Medium', detail: 'Mercury, 6,000 m³ · Argon Prime' },
	{ id: 'own-2', name: 'Big Bertha', group: 'Your ships: Large', detail: 'Sonra, 30,000 m³ · Black Hole Sun' },
	{ id: 'own-3', name: 'Courier', group: 'Your ships: Medium', detail: 'Demeter, 5,500 m³ · Argon Prime' },
	{ id: 'ship_mercury', name: 'Mercury', group: 'Ship models', detail: 'Medium, 6,000 m³' },
];

function names(matches: ReturnType<typeof SelectOptionFilter.matches>) {
	return matches.groups.map((g) => [g.name, ...g.entries.map((x) => x.option.id)]);
}

describe('SelectOptionFilter', () => {
	it('lists every option by group, in the order the groups first appear', () => {
		const matches = SelectOptionFilter.matches(options, '');
		expect(names(matches)).toEqual([
			['', 'custom'],
			['Your ships: Medium', 'own-1', 'own-3'],
			['Your ships: Large', 'own-2'],
			['Ship models', 'ship_mercury'],
		]);
		expect(matches.options.map((x) => x.id)).toEqual(['custom', 'own-1', 'own-3', 'own-2', 'ship_mercury']);
		expect(matches.groups[1].entries.map((x) => x.index)).toEqual([1, 2]);
		expect(matches.more).toBe(0);
	});

	it('matches every typed word in the name or the detail, ignoring case', () => {
		expect(SelectOptionFilter.matches(options, 'MERCURY').options.map((x) => x.id)).toEqual([
			'own-1',
			'ship_mercury',
		]);
		expect(SelectOptionFilter.matches(options, 'argon cour').options.map((x) => x.id)).toEqual(['own-3']);
		expect(SelectOptionFilter.matches(options, '  black  ').options.map((x) => x.id)).toEqual(['own-2']);
		expect(SelectOptionFilter.matches(options, 'nothing').groups).toEqual([]);
	});

	it('matches the keywords too', () => {
		const tagged = [...options, { id: 'shield', name: 'Shield Mk1', group: 'Shields', keywords: 'Shields' }];
		expect(SelectOptionFilter.matches(tagged, 'shields mk1').options.map((x) => x.id)).toEqual(['shield']);
	});

	it('lists at most the limit and counts the rest', () => {
		const many = Array.from({ length: 120 }, (_, i) => ({
			id: `${i}`,
			name: `Ship ${i}`,
			group: i < 60 ? 'A' : 'B',
		}));
		const matches = SelectOptionFilter.matches(many, 'ship');
		expect(matches.options.length).toBe(SelectOptionFilter.LIMIT);
		expect(matches.more).toBe(70);
		expect(matches.groups.map((g) => g.name)).toEqual(['A']);
		expect(SelectOptionFilter.matches(many, '', { limit: 70 }).groups.map((g) => g.entries.length)).toEqual([
			60, 10,
		]);
	});

	it('lists pinned options first under their own header, not again in their group', () => {
		const matches = SelectOptionFilter.matches(options, '', {
			pinned: ['ship_mercury', 'gone', 'own-3'],
			pinnedGroup: 'Recent',
		});
		expect(names(matches)).toEqual([
			['Recent', 'ship_mercury', 'own-3'],
			['', 'custom'],
			['Your ships: Medium', 'own-1'],
			['Your ships: Large', 'own-2'],
		]);
		expect(
			names(
				SelectOptionFilter.matches(options, 'courier', {
					pinned: ['ship_mercury', 'own-3'],
					pinnedGroup: 'Recent',
				})
			)
		).toEqual([['Recent', 'own-3']]);
	});

	it('puts the first option on top while nothing is typed', () => {
		const first = { id: '', name: 'Any ship' };
		const settings = { first, pinned: ['own-2'], pinnedGroup: 'Recent' };
		expect(names(SelectOptionFilter.matches(options, '', settings)).slice(0, 2)).toEqual([
			['', '', 'custom'],
			['Recent', 'own-2'],
		]);
		expect(SelectOptionFilter.matches(options, 'any', settings).options).toEqual([]);
	});

	it('finds the option named exactly like the typed text', () => {
		expect(SelectOptionFilter.exactMatch(options, ' mercury ')?.id).toBe('ship_mercury');
		expect(SelectOptionFilter.exactMatch(options, 'merc')).toBeUndefined();
		expect(SelectOptionFilter.exactMatch(options, '')).toBeUndefined();
	});
});
