import type { ShipListItem, ShipTravel } from '../../shared/services/model/model';
import { GameTextRef } from '../../core/game-text-ref';
import type { SaveShip } from '../map/save-map-model';

/** A ship of the active save, for the ship pickers. */
export interface OwnShip {
	/** the picker value: `own-` and the component id without brackets */
	key: string;
	/** the name the player gave it, else its model's name */
	label: string;
	/** whether the label is the ship's own name rather than its model's */
	named: boolean;
	/** how many ships this entry stands for: unnamed ships of one model in one sector with the same engines are one */
	count: number;
	/** the keys of all those ships, `key` first */
	keys: readonly string[];
	model: ShipListItem;
	sector: string;
	sectorName: string;
	/** with its installed engines; the model's best when the engine is unknown */
	travel?: ShipTravel;
}

/** What `OwnShipList.build` looks things up in. */
export interface OwnShipLookups {
	model(id: string): ShipListItem | undefined;
	travel(ship: SaveShip): ShipTravel | undefined;
	sectorName(id: string): string;
	/** resolves a `{page,id}` game text reference, the form the save gives story and preset ship names */
	text(ref: string): string | undefined;
}

/**
 * Turns the save's ships into picker entries: named ships by name, then the others by model and sector, with the
 * unnamed ships that only their code tells apart (same model, sector and travel speed) merged into one entry.
 */
export class OwnShipList {
	static readonly PREFIX = 'own-';

	static key(ship: SaveShip): string {
		return OwnShipList.PREFIX + ship.id.replace(/[[\]]/g, '');
	}

	/** The value looks like an own ship key (whether or not the ship is in the active save). */
	static isKey(value: string): boolean {
		return value.startsWith(OwnShipList.PREFIX) && value.length > OwnShipList.PREFIX.length;
	}

	/** The ship's name, with game text references resolved; undefined when it has none or the reference is unknown. */
	private static name(ship: SaveShip, lookups: OwnShipLookups): string | undefined {
		return ship.name && GameTextRef.isRef(ship.name) ? lookups.text(ship.name) : ship.name;
	}

	/** The ships of a known model, sorted and merged; ships of unknown (e.g. modded) models are left out. */
	static build(ships: readonly SaveShip[], lookups: OwnShipLookups): OwnShip[] {
		const result: OwnShip[] = [];
		const merged = new Map<string, OwnShip>();
		for (const ship of ships) {
			const model = lookups.model(ship.macro);
			if (!model) {
				continue;
			}
			const name = OwnShipList.name(ship, lookups);
			const key = OwnShipList.key(ship);
			const travel = lookups.travel(ship) ?? model.travel;
			const same = name ? undefined : `${model.id}|${ship.sector}|${travel?.speed}|${travel?.charge}`;
			const twin = same ? merged.get(same) : undefined;
			if (twin) {
				twin.count++;
				twin.keys = [...twin.keys, key];
				continue;
			}
			const own: OwnShip = {
				key,
				label: name || model.name,
				named: !!name,
				count: 1,
				keys: [key],
				model,
				sector: ship.sector,
				sectorName: lookups.sectorName(ship.sector),
				travel,
			};
			if (same) {
				merged.set(same, own);
			}
			result.push(own);
		}
		return result.sort(
			(a, b) =>
				Number(b.named) - Number(a.named) ||
				a.label.localeCompare(b.label) ||
				a.sectorName.localeCompare(b.sectorName)
		);
	}
}
