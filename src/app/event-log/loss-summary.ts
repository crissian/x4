import type { Faction } from '../shared/services/model/faction';
import type { Sector } from '../shared/services/model/universe';
import type { LossRow } from './event-log-rows';

/** How many losses share a ship class, sector or killer faction. */
export interface LossCount<T> {
	key: string;
	/** the ship size, sector or faction; undefined for losses without one */
	value?: T;
	count: number;
}

export interface LossSummary {
	total: number;
	/** by ship size (`Small`, `Medium`…), largest first; losses of an unknown type last */
	bySize: LossCount<string>[];
	/** most losses first */
	bySector: LossCount<Sector>[];
	/** by the killer's faction, most losses first; losses without a known killer faction are left out */
	byFaction: LossCount<Faction>[];
}

/** Totals of the lost ships for the summary tiles. */
export class LossSummaries {
	private static readonly SIZES = ['Extra Large', 'Large', 'Medium', 'Small', 'Extra Small'];

	/** The totals; `top` limits the sector and faction lists. */
	static build(rows: readonly LossRow[], top = 5): LossSummary {
		const bySize = LossSummaries.count(rows, (x) => x.ship?.size, (x) => x.ship?.size).sort(
			(a, b) => LossSummaries.sizeOrder(a.key) - LossSummaries.sizeOrder(b.key)
		);
		return {
			total: rows.length,
			bySize,
			bySector: LossSummaries.count(rows, (x) => x.loss.sector, (x) => x.sector).filter((x) => x.key).slice(0, top),
			byFaction: LossSummaries.count(rows, (x) => x.killerFaction?.id, (x) => x.killerFaction)
				.filter((x) => x.key)
				.slice(0, top),
		};
	}

	private static sizeOrder(size: string): number {
		const index = LossSummaries.SIZES.indexOf(size);
		return index < 0 ? LossSummaries.SIZES.length : index;
	}

	/** Counts per key (empty for none), most first, ties by key. */
	private static count<T>(
		rows: readonly LossRow[],
		key: (row: LossRow) => string | undefined,
		value: (row: LossRow) => T | undefined
	): LossCount<T>[] {
		const counts = new Map<string, LossCount<T>>();
		for (const row of rows) {
			const k = key(row) ?? '';
			const entry = counts.get(k) ?? { key: k, value: value(row), count: 0 };
			entry.count++;
			counts.set(k, entry);
		}
		return [...counts.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
	}
}
