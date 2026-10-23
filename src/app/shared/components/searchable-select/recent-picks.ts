import { LocalStorage } from '../../../core/services/local-storage';

/** The last options picked in a select, newest first, kept in local storage (for this page only without it). */
export class RecentPicks {
	static readonly MAX = 5;

	static read(key: string): string[] {
		return LocalStorage.read<string[]>(key, [], (x) =>
			Array.isArray(x)
				? x.filter((id): id is string => typeof id === 'string').slice(0, RecentPicks.MAX)
				: undefined
		);
	}

	/** The list with `id` moved to the front, dropping the oldest above the maximum. */
	static add(list: readonly string[], id: string): string[] {
		return [id, ...list.filter((x) => x !== id)].slice(0, RecentPicks.MAX);
	}

	static write(key: string, list: readonly string[]) {
		LocalStorage.write(key, list);
	}
}
