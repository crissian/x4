import type { StationFlow } from '../economy/economy-model';

/** One ware of the production balance of the player's stations, per hour. */
export interface EmpireBalanceRow {
	/** ware id */
	id: string;
	name: string;
	produced: number;
	consumed: number;
	/** produced minus consumed: negative for a shortage */
	net: number;
	/** how many of the stations make or use it */
	stations: number;
}

/** Sums the hourly flows of the player's stations into one row per ware. */
export class EmpireBalance {
	/** The wares the stations make or use, the largest shortage first. */
	static rows(stations: readonly (readonly StationFlow[])[], wareName: (id: string) => string): EmpireBalanceRow[] {
		const byWare = new Map<string, EmpireBalanceRow>();
		for (const flows of stations) {
			for (const flow of flows) {
				if (flow.produced <= 0 && flow.consumed <= 0) {
					continue;
				}
				let row = byWare.get(flow.ware);
				if (!row) {
					row = { id: flow.ware, name: wareName(flow.ware), produced: 0, consumed: 0, net: 0, stations: 0 };
					byWare.set(flow.ware, row);
				}
				row.produced += flow.produced;
				row.consumed += flow.consumed;
				row.stations++;
			}
		}
		const rows = [...byWare.values()];
		for (const row of rows) {
			row.net = row.produced - row.consumed;
		}
		return rows.sort((a, b) => a.net - b.net || a.name.localeCompare(b.name));
	}

	/** The net flow against the larger of the two flows, -1..1, for the bar of the net column. */
	static share(row: EmpireBalanceRow): number {
		const larger = Math.max(row.produced, row.consumed);
		return larger > 0 ? row.net / larger : 0;
	}
}
