import type { Sector } from '../shared/services/model/model';

/**
 * Sector adjacency by jumps: a gate, accelerator or highway link counts when the sector on the other side links
 * back, the same rule as `RoutePlanner`.
 */
export class SectorGraph {
	private readonly adjacent = new Map<string, string[]>();
	private readonly cache = new Map<number, Map<string, readonly string[]>>();

	constructor(sectors: readonly Sector[]) {
		const links = new Set<string>();
		const ids = new Set(sectors.map((x) => x.id));
		for (const sector of sectors) {
			for (const gate of sector.gates ?? []) {
				links.add(`${sector.id}>${gate.sector}:${gate.type}`);
			}
			for (const link of sector.highwayLinks ?? []) {
				links.add(`${sector.id}>${link.sector}:highway`);
			}
		}
		for (const sector of sectors) {
			const next = new Set<string>();
			const targets = [
				...(sector.gates ?? []).map((x) => [x.sector, x.type]),
				...(sector.highwayLinks ?? []).map((x) => [x.sector, 'highway']),
			];
			for (const [to, type] of targets) {
				if (ids.has(to) && links.has(`${to}>${sector.id}:${type}`)) {
					next.add(to);
				}
			}
			this.adjacent.set(sector.id, [...next]);
		}
	}

	/** Ids of all the sectors of the graph. */
	sectors(): string[] {
		return [...this.adjacent.keys()];
	}

	/** The sectors within `jumps` jumps of `from`, itself included; empty for an unknown sector. Cached per jumps. */
	within(from: string, jumps: number): readonly string[] {
		let perSector = this.cache.get(jumps);
		if (!perSector) {
			perSector = new Map();
			this.cache.set(jumps, perSector);
		}
		let result = perSector.get(from);
		if (!result) {
			result = this.adjacent.has(from) ? this.search(from, jumps) : [];
			perSector.set(from, result);
		}
		return result;
	}

	private search(from: string, jumps: number): string[] {
		const seen = new Set([from]);
		let frontier = [from];
		for (let step = 0; step < jumps && frontier.length; step++) {
			const next: string[] = [];
			for (const id of frontier) {
				for (const to of this.adjacent.get(id) ?? []) {
					if (!seen.has(to)) {
						seen.add(to);
						next.push(to);
					}
				}
			}
			frontier = next;
		}
		return [...seen];
	}
}
