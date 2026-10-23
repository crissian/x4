import type { TradeRoute } from './trade-route-model';

/** Narrows ranked trade routes down to fewer, more varied ones. */
export class TradeRouteGrouping {
	/** The key of the sell offer a route buys from: the selling station and the ware. */
	static offerKey(route: TradeRoute): string {
		return `${route.seller.code}~${route.ware}`;
	}

	/**
	 * The first (best ranked) route of every sell offer, in the given order; `otherBuyers` counts the routes of the
	 * same offer that were left out. The routes left in are copies when they get a count.
	 */
	static bestPerOffer(ranked: readonly TradeRoute[]): TradeRoute[] {
		const best = new Map<string, TradeRoute>();
		const others = new Map<string, number>();
		for (const route of ranked) {
			const key = TradeRouteGrouping.offerKey(route);
			if (best.has(key)) {
				others.set(key, (others.get(key) ?? 0) + 1);
			} else {
				best.set(key, route);
			}
		}
		return [...best].map(([key, route]) => {
			const otherBuyers = others.get(key);
			return otherBuyers ? { ...route, otherBuyers } : route;
		});
	}
}
