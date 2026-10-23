import type { ShipListItem, ShipTravel } from '../../shared/services/model/model';
import type { SaveShip } from '../map/save-map-model';

/** A ship of the active save, for the ship pickers. */
export interface OwnShip {
	/** the picker value: `own-` and the component id without brackets */
	key: string;
	/** the name the player gave it, else its code */
	label: string;
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
}

/** Turns the save's ships into picker entries: named ships by name, then the others by model and code. */
export class OwnShipList {
	static readonly PREFIX = 'own-';

	static key(ship: SaveShip): string {
		return OwnShipList.PREFIX + ship.id.replace(/[[\]]/g, '');
	}

	/** The value looks like an own ship key (whether or not the ship is in the active save). */
	static isKey(value: string): boolean {
		return value.startsWith(OwnShipList.PREFIX) && value.length > OwnShipList.PREFIX.length;
	}

	/** The ships of a known model, sorted; ships of unknown (e.g. modded) models are left out. */
	static build(ships: readonly SaveShip[], lookups: OwnShipLookups): OwnShip[] {
		const result: { own: OwnShip; named: boolean }[] = [];
		for (const ship of ships) {
			const model = lookups.model(ship.macro);
			if (!model) {
				continue;
			}
			result.push({
				named: !!ship.name,
				own: {
					key: OwnShipList.key(ship),
					label: ship.name || ship.code,
					model,
					sector: ship.sector,
					sectorName: lookups.sectorName(ship.sector),
					travel: lookups.travel(ship) ?? model.travel,
				},
			});
		}
		return result
			.sort(
				(a, b) =>
					Number(b.named) - Number(a.named) ||
					(a.named ? 0 : a.own.model.name.localeCompare(b.own.model.name)) ||
					a.own.label.localeCompare(b.own.label)
			)
			.map((x) => x.own);
	}
}
