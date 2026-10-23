import type { Sector } from '../shared/services/model/model';
import { SectorLinks } from '../map/sector-links';

/** A sector and its distance in jumps from another. */
export interface SectorRing {
	sector: string;
	jumps: number;
}

/**
 * Sector adjacency by jumps: a gate, accelerator or highway link counts when the sector on the other side links
 * back (`SectorLinks.twoWay`), the same rule as `RoutePlanner`.
 */
export class SectorGraph {
	private readonly adjacent = new Map<string, string[]>();
	private readonly ringCache = new Map<string, readonly SectorRing[]>();
	private readonly withinCache = new Map<string, readonly string[]>();
	private readonly areaCache = new Map<string, ReadonlySet<string>>();

	constructor(sectors: readonly Sector[]) {
		const next = new Map(sectors.map((x) => [x.id, new Set<string>()]));
		for (const link of SectorLinks.twoWay(sectors)) {
			next.get(link.from)?.add(link.to);
		}
		for (const [id, to] of next) {
			this.adjacent.set(id, [...to]);
		}
	}

	/** Ids of all the sectors of the graph. */
	sectors(): string[] {
		return [...this.adjacent.keys()];
	}

	/** The sectors within `jumps` jumps of `from`, itself included, nearest first; empty for an unknown sector. */
	within(from: string, jumps: number): readonly string[] {
		return SectorGraph.cached(this.withinCache, from, jumps, () => this.rings(from, jumps).map((x) => x.sector));
	}

	/** The sectors within `jumps` jumps of `centre`, itself included, as a set; empty for an unknown sector. */
	area(centre: string, jumps: number): ReadonlySet<string> {
		return SectorGraph.cached(this.areaCache, centre, jumps, () => new Set(this.within(centre, jumps)));
	}

	/**
	 * The sectors within `jumps` jumps of `from` with their distance, nearest first (`from` itself at 0); empty for
	 * an unknown sector. Cached per sector and jumps.
	 */
	rings(from: string, jumps: number): readonly SectorRing[] {
		return SectorGraph.cached(this.ringCache, from, jumps, () =>
			this.adjacent.has(from) ? this.searchRings(from, jumps) : []
		);
	}

	private static cached<T>(cache: Map<string, T>, from: string, jumps: number, compute: () => T): T {
		const key = `${from}|${jumps}`;
		let result = cache.get(key);
		if (result === undefined) {
			result = compute();
			cache.set(key, result);
		}
		return result;
	}

	private searchRings(from: string, jumps: number): SectorRing[] {
		const result: SectorRing[] = [{ sector: from, jumps: 0 }];
		const seen = new Set([from]);
		let frontier = [from];
		for (let step = 1; step <= jumps && frontier.length; step++) {
			const next: string[] = [];
			for (const id of frontier) {
				for (const to of this.adjacent.get(id) ?? []) {
					if (!seen.has(to)) {
						seen.add(to);
						next.push(to);
						result.push({ sector: to, jumps: step });
					}
				}
			}
			frontier = next;
		}
		return result;
	}
}
