import type { Sector } from '../shared/services/model/model';
import { VaultEntry } from './data-vault';

/** Vaults of one sector; without a sector, the vaults placed at a random spot. */
export interface VaultGroup {
	key: string;
	sector?: Sector;
	entries: VaultEntry[];
}

export class VaultGroups {
	/** Groups by sector, sorted by sector name; the randomly placed vaults come last. */
	static bySector(entries: readonly VaultEntry[], sector: (id: string) => Sector | undefined): VaultGroup[] {
		const groups = new Map<string, VaultGroup>();
		for (const entry of entries) {
			const key = entry.sector ?? '';
			let group = groups.get(key);
			if (!group) {
				group = { key, sector: entry.sector ? sector(entry.sector) : undefined, entries: [] };
				groups.set(key, group);
			}
			group.entries.push(entry);
		}
		return [...groups.values()].sort((a, b) => {
			if (!a.key || !b.key) {
				return a.key ? -1 : b.key ? 1 : 0;
			}
			return (a.sector?.name ?? a.key).localeCompare(b.sector?.name ?? b.key);
		});
	}

	/** How many of the vaults the player has, and how many there are. */
	static progress(
		entries: readonly VaultEntry[],
		done: (entry: VaultEntry) => boolean
	): { done: number; total: number } {
		return { done: entries.filter(done).length, total: entries.length };
	}
}
