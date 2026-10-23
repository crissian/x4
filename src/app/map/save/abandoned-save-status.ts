import type { SaveOwnerlessShip } from '../../savegame/empire/save-empire-model';
import type { AbandonedShip } from '../../shared/services/model/model';

/** Whether a ship of the game start list is still ownerless in the save. */
export type AbandonedStatus = 'unclaimed' | 'gone';

export interface AbandonedMatches {
	/** the status of each ship of the list, by position */
	statuses: AbandonedStatus[];
	/** the ownerless ships of the save that match no ship of the list */
	extras: SaveOwnerlessShip[];
}

/** Matches the abandoned ships of the game start to the ownerless ships of a save. */
export class AbandonedSaveStatus {
	/**
	 * A ship of the list is unclaimed when the save has an ownerless ship of the same model in its sector, the
	 * nearest one taken first when there are several. `position` gives a save ship's sector position in km.
	 */
	static match(
		list: readonly AbandonedShip[],
		ownerless: readonly SaveOwnerlessShip[],
		position: (ship: SaveOwnerlessShip) => { x: number; z: number }
	): AbandonedMatches {
		const left = new Set(ownerless);
		const statuses = list.map((item): AbandonedStatus => {
			let best: SaveOwnerlessShip | undefined;
			let bestDistance = Infinity;
			for (const ship of left) {
				if (ship.macro !== item.ship || ship.sector !== item.sector) {
					continue;
				}
				const at = position(ship);
				const distance = Math.hypot(at.x - item.x, at.z - item.z);
				if (distance < bestDistance) {
					best = ship;
					bestDistance = distance;
				}
			}
			if (!best) {
				return 'gone';
			}
			left.delete(best);
			return 'unclaimed';
		});
		return { statuses, extras: [...left] };
	}
}
