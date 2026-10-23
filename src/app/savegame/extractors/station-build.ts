import { MacroId } from '../../core/macro-id';
import type { SaveOwnStation } from '../empire/save-empire-model';

/**
 * Collects which modules of a player station are built while the empire extractor streams it. The station's
 * `construction/sequence` lists every module that exists on the station, built or still being built; each module
 * component names its entry with `construction="<entry id>"`, and one still being built has `state="construction"`.
 * Modules only planned are not in the station's sequence (they are in the build storage's build task).
 */
export class StationBuild {
	/** entry id -> macro id, in sequence order */
	private readonly entries = new Map<string, string>();
	/** entry ids of the modules still being built */
	private readonly building = new Set<string>();

	constructor(readonly station: SaveOwnStation) {}

	/** `construction/sequence/entry` */
	addEntry(id: string | undefined, macro: string | undefined): void {
		if (id && macro) {
			this.entries.set(id, MacroId.of(macro));
		}
	}

	/** a module component with `state="construction"`: `entry` is its `construction` attribute */
	markBuilding(entry: string): void {
		this.building.add(entry);
	}

	/** Sets the station's built modules (with counts, in first-seen order) and how many are still being built. */
	apply(): void {
		const counts = new Map<string, number>();
		let building = 0;
		for (const [id, macro] of this.entries) {
			if (this.building.has(id)) {
				building++;
			} else {
				counts.set(macro, (counts.get(macro) ?? 0) + 1);
			}
		}
		this.station.modules = [...counts].map(([macro, count]) => ({ macro, count }));
		if (building) {
			this.station.building = building;
		}
	}
}
