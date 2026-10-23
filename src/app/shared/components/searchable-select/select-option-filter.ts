/** An option of the searchable select. */
export interface SelectOption {
	id: string;
	name: string;
	/** header of the group the option is listed under; options without one come unheaded */
	group?: string;
	/** secondary text shown after the name, searched too (such as "Argon, 4,300 m³ · Sector") */
	detail?: string;
}

/** A listed option with its place in the list, for keyboard navigation and element ids. */
export interface SelectEntry {
	option: SelectOption;
	index: number;
}

export interface SelectEntryGroup {
	/** empty for options without a group */
	name: string;
	entries: SelectEntry[];
}

/** What the open list shows: the first matches by group, and how many more there are. */
export interface SelectMatches {
	groups: SelectEntryGroup[];
	/** the listed options in display order */
	options: SelectOption[];
	/** matches left out above the limit */
	more: number;
}

export interface SelectFilterSettings {
	/** ids listed first, in this order, under `pinnedGroup` (and left out of their own group) */
	pinned?: readonly string[];
	pinnedGroup?: string;
	/** listed on top when nothing is typed, such as "All wares" */
	first?: SelectOption;
	/** most options listed; big lists stay fast this way */
	limit?: number;
}

/**
 * Filters the options of a searchable select: every typed word must be in the name or the detail, ignoring case.
 * Matches keep their order and are grouped by their group, in the order the groups first appear.
 */
export class SelectOptionFilter {
	static readonly LIMIT = 50;

	static matches(
		options: readonly SelectOption[],
		query: string,
		settings: SelectFilterSettings = {}
	): SelectMatches {
		const terms = query
			.trim()
			.toLowerCase()
			.split(/\s+/)
			.filter((x) => x);
		const found = terms.length ? options.filter((x) => SelectOptionFilter.isMatch(x, terms)) : options;

		const pinnedIds = new Set(settings.pinned ?? []);
		const pinned = (settings.pinned ?? []).flatMap((id) => {
			const option = found.find((x) => x.id === id);
			return option ? [option] : [];
		});

		const byGroup = new Map<string, SelectOption[]>();
		if (settings.first && !terms.length) {
			byGroup.set('', [settings.first]);
		}
		if (pinned.length) {
			byGroup.set(settings.pinnedGroup ?? '', [...(byGroup.get(settings.pinnedGroup ?? '') ?? []), ...pinned]);
		}
		for (const option of found) {
			if (pinnedIds.has(option.id)) {
				continue;
			}
			const group = option.group ?? '';
			const list = byGroup.get(group);
			if (list) {
				list.push(option);
			} else {
				byGroup.set(group, [option]);
			}
		}

		const limit = settings.limit ?? SelectOptionFilter.LIMIT;
		const groups: SelectEntryGroup[] = [];
		const listed: SelectOption[] = [];
		let total = 0;
		for (const [name, list] of byGroup) {
			total += list.length;
			const room = Math.max(0, limit - listed.length);
			if (room > 0) {
				const shown = list.slice(0, room);
				groups.push({ name, entries: shown.map((option, i) => ({ option, index: listed.length + i })) });
				listed.push(...shown);
			}
		}
		return { groups, options: listed, more: total - listed.length };
	}

	/** The option whose name is the typed text, ignoring case and outer spaces. */
	static exactMatch(options: readonly SelectOption[], query: string): SelectOption | undefined {
		const name = query.trim().toLowerCase();
		return name ? options.find((x) => x.name.trim().toLowerCase() === name) : undefined;
	}

	private static isMatch(option: SelectOption, terms: readonly string[]): boolean {
		const text = option.detail ? `${option.name} ${option.detail}`.toLowerCase() : option.name.toLowerCase();
		return terms.every((term) => text.includes(term));
	}
}
