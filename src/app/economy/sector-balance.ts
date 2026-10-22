/** What the stations within some jumps of a sector make and use of a ware per hour. */
export interface SectorBalance {
	produced: number;
	consumed: number;
	/** produced minus consumed */
	net: number;
}

/** How balanced the supply is near a sector. */
export class SectorBalances {
	/** Nothing is made or used nearby. */
	static idle(balance: SectorBalance): boolean {
		return balance.produced <= 0 && balance.consumed <= 0;
	}

	/**
	 * Net divided by the larger of produced and consumed: -1 when nothing is made nearby and all demand is unmet,
	 * 0 when balanced (or when nothing happens nearby), +1 when nothing is used nearby.
	 */
	static ratio(balance: SectorBalance): number {
		const big = Math.max(balance.produced, balance.consumed);
		return big > 0 ? Math.max(-1, Math.min(1, balance.net / big)) : 0;
	}
}
