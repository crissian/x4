/** A sector at some jumps from another. */
export interface SettlementRing {
	sector: string;
	jumps: number;
}

/**
 * Settles the market of one ware as it is, before a new factory is placed: each sector that makes more than it
 * uses supplies the sectors short of the ware nearest to it, one jump away first, then two, up to `MAX_JUMPS`.
 * What is left is the shortage a new factory can still sell into. Without this, a wide reach would net far-away
 * surpluses against the shortages near a spot, although those surpluses mostly serve the shortages near themselves.
 *
 * Sectors at the same distance share fairly: a surplus is offered to them in proportion to their shortage, and a
 * sector offered more than it lacks takes the same share from each supplier; what is left over is offered again.
 * So the result does not depend on the order of the sectors.
 */
export class MarketSettlement {
	/**
	 * How far the existing supply travels: the page's default reach. It is fixed, not the reach picked for the new
	 * factory, so a wider reach only adds sectors and weight and never removes demand that a smaller one counted.
	 */
	static readonly MAX_JUMPS = 3;
	/** Rounds per distance to hand out what an oversubscribed sector refused. */
	private static readonly ROUNDS = 8;
	private static readonly EPSILON = 1e-9;

	/**
	 * The shortage per hour left in each sector once the surpluses supplied the nearest short sectors; only the
	 * sectors still short are listed, all values positive.
	 * @param net each sector's own net per hour (produced minus consumed)
	 * @param reach the sectors within some jumps of a sector, with their distance
	 */
	static residual(
		net: ReadonlyMap<string, number>,
		reach: (sector: string, jumps: number) => readonly SettlementRing[],
		maxJumps = MarketSettlement.MAX_JUMPS
	): Map<string, number> {
		const settled = MarketSettlement.settled(net, reach, maxJumps);
		return new Map([...settled].filter(([, x]) => x < 0).map(([id, x]) => [id, -x]));
	}

	/**
	 * Each sector's net per hour after the settlement: the surplus it has left (positive) or the shortage left
	 * (negative); sectors with nothing left are not listed.
	 */
	static settled(
		net: ReadonlyMap<string, number>,
		reach: (sector: string, jumps: number) => readonly SettlementRing[],
		maxJumps = MarketSettlement.MAX_JUMPS
	): Map<string, number> {
		const surplus = new Map<string, number>();
		const short = new Map<string, number>();
		for (const [sector, value] of net) {
			if (value > 0) {
				surplus.set(sector, value);
			} else if (value < 0) {
				short.set(sector, -value);
			}
		}
		// the short sectors around each surplus, per distance
		const near = new Map<string, string[][]>();
		for (const sector of surplus.keys()) {
			const rings: string[][] = Array.from({ length: maxJumps + 1 }, () => []);
			for (const ring of reach(sector, maxJumps)) {
				if (ring.jumps > 0 && short.has(ring.sector)) {
					rings[ring.jumps].push(ring.sector);
				}
			}
			near.set(sector, rings);
		}
		for (let jumps = 1; jumps <= maxJumps; jumps++) {
			for (let round = 0; round < MarketSettlement.ROUNDS; round++) {
				if (!MarketSettlement.round(surplus, short, near, jumps)) {
					break;
				}
			}
		}
		const { EPSILON } = MarketSettlement;
		return new Map([
			...[...surplus].filter(([, x]) => x > EPSILON),
			...[...short].filter(([, x]) => x > EPSILON).map(([id, x]): [string, number] => [id, -x]),
		]);
	}

	/** One round at one distance; false when nothing moved. */
	private static round(
		surplus: Map<string, number>,
		short: Map<string, number>,
		near: ReadonlyMap<string, string[][]>,
		jumps: number
	): boolean {
		const offers: { from: string; to: string; amount: number }[] = [];
		const incoming = new Map<string, number>();
		for (const [from, left] of surplus) {
			if (left <= MarketSettlement.EPSILON) {
				continue;
			}
			const targets = near.get(from)![jumps].filter((x) => short.get(x)! > MarketSettlement.EPSILON);
			const wanted = targets.reduce((sum, x) => sum + short.get(x)!, 0);
			if (wanted <= MarketSettlement.EPSILON) {
				continue;
			}
			const give = Math.min(left, wanted);
			for (const to of targets) {
				const amount = (give * short.get(to)!) / wanted;
				offers.push({ from, to, amount });
				incoming.set(to, (incoming.get(to) ?? 0) + amount);
			}
		}
		let moved = 0;
		const share = new Map([...incoming].map(([to, x]) => [to, Math.min(1, short.get(to)! / x)]));
		for (const offer of offers) {
			const amount = offer.amount * share.get(offer.to)!;
			surplus.set(offer.from, surplus.get(offer.from)! - amount);
			short.set(offer.to, short.get(offer.to)! - amount);
			moved += amount;
		}
		return moved > MarketSettlement.EPSILON;
	}
}
