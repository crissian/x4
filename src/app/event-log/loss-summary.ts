import type { Sector } from '../shared/services/model/universe';
import type { LossRow } from './event-log-rows';

/** How many losses share a sector or a killer. */
export interface LossCount<T> {
	key: string;
	/** the sector, or the killer's name as the log wrote it */
	value?: T;
	count: number;
}

export interface LossSummary {
	total: number;
	/** most losses first */
	bySector: LossCount<Sector>[];
	/** by the killer's name as the log wrote it (without id code), most losses first; losses without one left out */
	byKiller: LossCount<string>[];
}

/** Totals of the losses for the summary tiles, from what the log states only. */
export class LossSummaries {
	/** The totals; `top` limits the sector and killer lists. */
	static build(rows: readonly LossRow[], top = 5): LossSummary {
		return {
			total: rows.length,
			bySector: LossSummaries.count(rows, (x) => x.loss.sector, (x) => x.sector).slice(0, top),
			byKiller: LossSummaries.count(rows, (x) => x.loss.killer, (x) => x.loss.killer).slice(0, top),
		};
	}

	/** Counts per key, rows without one left out, most first, ties by key. */
	private static count<T>(
		rows: readonly LossRow[],
		key: (row: LossRow) => string | undefined,
		value: (row: LossRow) => T | undefined
	): LossCount<T>[] {
		const counts = new Map<string, LossCount<T>>();
		for (const row of rows) {
			const k = key(row);
			if (!k) {
				continue;
			}
			const entry = counts.get(k) ?? { key: k, value: value(row), count: 0 };
			entry.count++;
			counts.set(k, entry);
		}
		return [...counts.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
	}
}
