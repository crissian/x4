import type { Sector } from '../shared/services/model/model';

/** A gate, accelerator or superhighway entry leading out of a sector. */
export interface SectorExit {
	from: string;
	to: string;
	type: 'gate' | 'accelerator' | 'highway';
	/** Position inside the `from` sector, in km. */
	x: number;
	z: number;
}

/**
 * The links between sectors. A link only counts when the sector on the other side links back with the same type
 * of link, the rule shared by the route planner and the jump graph of the economy.
 */
export class SectorLinks {
	/** The exits of the sector: its gates and accelerators, then its superhighway entries. */
	static exits(sector: Sector): SectorExit[] {
		return [
			...(sector.gates ?? []).map((x) => ({
				from: sector.id,
				to: x.sector,
				type: x.type,
				x: x.x ?? 0,
				z: x.z ?? 0,
			})),
			...(sector.highwayLinks ?? []).map((x) => ({
				from: sector.id,
				to: x.sector,
				type: 'highway' as const,
				x: x.x,
				z: x.z,
			})),
		];
	}

	/** The key of an exit, the same for every exit from one sector to another by the same type of link. */
	static key(from: string, to: string, type: SectorExit['type']): string {
		return `${from}>${to}:${type}`;
	}

	/**
	 * The exits between the given sectors whose other side links back, once per key, in the order of the sectors
	 * and their exits.
	 */
	static twoWay(sectors: readonly Sector[]): SectorExit[] {
		const exits = sectors.flatMap((x) => SectorLinks.exits(x));
		const keys = new Set(exits.map((x) => SectorLinks.key(x.from, x.to, x.type)));
		const seen = new Set<string>();
		return exits.filter((x) => {
			const key = SectorLinks.key(x.from, x.to, x.type);
			if (seen.has(key) || !keys.has(SectorLinks.key(x.to, x.from, x.type))) {
				return false;
			}
			seen.add(key);
			return true;
		});
	}
}
