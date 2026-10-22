import type { PlacementContext } from './placement-context';
import type { PlacementOptions, PlacementResult, PlacementSpot } from './placement-model';
import { PlacementScorer } from './placement-scorer';

/** A candidate of the greedy pick, with its Cr per hour as last worked out. */
interface Candidate {
	sector: string;
	spot: PlacementSpot;
}

/**
 * Ranks the suggested factories: galaxy-wide (where to build), or the wares of one sector (what to build here).
 * Galaxy-wide, the spots of one ware share the demand around them: the best spot is picked first, what it sells is
 * taken out of the nearby shortages, and the others are scored again (greedy).
 */
export class PlacementRanking {
	/** Rows listed at most. */
	static readonly MAX_ROWS = 100;

	/** The best spots for the wares, spots of the same ware sharing demand, the most Cr per hour first. */
	static where(context: PlacementContext, wares: readonly string[], options: PlacementOptions): PlacementResult {
		const all = wares.flatMap((ware) => PlacementRanking.greedy(context, ware, options));
		return PlacementRanking.result(all);
	}

	/** The wares worth making in a sector, the most Cr per hour first. */
	static here(
		context: PlacementContext,
		sector: string,
		wares: readonly string[],
		options: PlacementOptions
	): PlacementResult {
		const all = wares.flatMap((ware) => PlacementScorer.spot(context, ware, sector, options) ?? []);
		return PlacementRanking.result(all);
	}

	/** The spot of each sector for one ware on its own (no sharing), where one fits; for the heat map. */
	static spots(context: PlacementContext, ware: string, options: PlacementOptions): Map<string, PlacementSpot> {
		const result = new Map<string, PlacementSpot>();
		for (const id of context.sectors()) {
			const spot = PlacementScorer.spot(context, ware, id, options);
			if (spot) {
				result.set(id, spot);
			}
		}
		return result;
	}

	/**
	 * The spots of one ware, picked greedily. Cr per hour only falls as shortages are taken, so a candidate whose
	 * fresh value still beats the stale value of the next one is the best (lazy greedy).
	 */
	static greedy(context: PlacementContext, ware: string, options: PlacementOptions): PlacementSpot[] {
		const net = new Map(context.localNet(ware, options.includePlayer));
		const queue: Candidate[] = [];
		for (const sector of context.sectors()) {
			const spot = PlacementScorer.spot(context, ware, sector, options, net);
			if (spot) {
				queue.push({ sector, spot });
			}
		}
		queue.sort((a, b) => PlacementRanking.compare(a.spot, b.spot));
		const picked: PlacementSpot[] = [];
		while (queue.length && picked.length < PlacementRanking.MAX_ROWS) {
			const best = queue.shift()!;
			const fresh = PlacementScorer.spot(context, ware, best.sector, options, net, best.spot);
			if (!fresh) {
				continue;
			}
			if (!queue.length || PlacementRanking.compare(fresh, queue[0].spot) <= 0) {
				picked.push(fresh);
				PlacementScorer.allocate(fresh, net);
			} else {
				PlacementRanking.insert(queue, { sector: best.sector, spot: fresh });
			}
		}
		return picked;
	}

	/** Best first: Cr per hour, then ware and sector for a stable order. */
	static compare(a: PlacementSpot, b: PlacementSpot): number {
		return b.crPerHour - a.crPerHour || a.ware.localeCompare(b.ware) || a.sector.localeCompare(b.sector);
	}

	private static insert(queue: Candidate[], item: Candidate): void {
		let low = 0;
		let high = queue.length;
		while (low < high) {
			const middle = (low + high) >> 1;
			if (PlacementRanking.compare(queue[middle].spot, item.spot) <= 0) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}
		queue.splice(low, 0, item);
	}

	private static result(all: PlacementSpot[]): PlacementResult {
		all.sort(PlacementRanking.compare);
		return { spots: all.slice(0, PlacementRanking.MAX_ROWS), total: all.length };
	}
}
