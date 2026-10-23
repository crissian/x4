import type { WareAmount } from './research-model';

/** Sums of the ware amounts of research projects. */
export class ResearchCost {
	/** The amounts per ware over every list, largest first, then by ware id. */
	static sum(lists: readonly (readonly WareAmount[])[]): WareAmount[] {
		const totals = new Map<string, number>();
		for (const list of lists) {
			for (const { ware, amount } of list) {
				totals.set(ware, (totals.get(ware) ?? 0) + amount);
			}
		}
		return [...totals]
			.map(([ware, amount]) => ({ ware, amount }))
			.sort((a, b) => b.amount - a.amount || a.ware.localeCompare(b.ware));
	}
}
