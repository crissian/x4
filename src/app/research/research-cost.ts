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

	/** The worth of the wares at the given unit prices; a ware without a price counts nothing. */
	static value(wares: readonly WareAmount[], price: (ware: string) => number | undefined): number {
		return wares.reduce((sum, x) => sum + x.amount * (price(x.ware) ?? 0), 0);
	}
}
