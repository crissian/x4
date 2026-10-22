import type { RouteStep } from '../map/route-planner';

/** Which sectors of a loaded leg make a ware illegal. */
export class TradeTransit {
	/** The ids of the path sectors whose owner is among `illegalIn`, in travel order. */
	static illegalSectors(
		steps: readonly RouteStep[],
		owners: ReadonlyMap<string, string>,
		illegalIn: readonly string[]
	): string[] {
		const result: string[] = [];
		if (illegalIn.length) {
			for (const { sector } of steps) {
				const owner = owners.get(sector.id);
				if (owner != null && illegalIn.includes(owner) && !result.includes(sector.id)) {
					result.push(sector.id);
				}
			}
		}
		return result;
	}
}
