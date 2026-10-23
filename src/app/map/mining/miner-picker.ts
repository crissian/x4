import { EnumLabels } from '../../core/enum-labels';
import { NumberFormats } from '../../core/format/number-formats';
import type { OwnShip } from '../../savegame/own-ships/own-ship-list';
import { ShipPickerOptions } from '../../savegame/own-ships/ship-picker-options';
import type { SelectOption } from '../../shared/components/searchable-select/select-option-filter';
import type { ShipListItem, Ware } from '../../shared/services/model/model';
import { Mining } from '../mining';

/** A miner of the mining panel: a ship model, or an own ship as its model with its name and engines. */
export type Miner = ShipListItem & { own?: OwnShip };

/**
 * The miners offered for a resource: the player's ships able to mine it, by size, then the miner models.
 * Only ships with a hold of the ware's kind are offered, so gas miners for gases and solid miners for ore.
 */
export class MinerPicker {
	/** The own ships whose model mines the ware, largest hold first, else in their order. */
	static own<T extends OwnShip>(ships: readonly T[], ware: Ware): T[] {
		return ships
			.filter((x) => Mining.canMine(x.model, ware))
			.sort((a, b) => Mining.minerCapacity(b.model, ware) - Mining.minerCapacity(a.model, ware));
	}

	/** The picker options: own miners searchable by model, hold and sector, then the models by size and hold. */
	static options(own: readonly OwnShip[], models: readonly ShipListItem[], ware: Ware): SelectOption[] {
		const hold = (ship: ShipListItem) => `${NumberFormats.whole(Mining.minerCapacity(ship, ware))} m³`;
		return [
			...ShipPickerOptions.own(
				own,
				(x) => `${x.named ? `${x.model.name}, ` : ''}${hold(x.model)} · ${x.sectorName}`
			),
			...ShipPickerOptions.models(models, (ship) => `${EnumLabels.label(ship.size)}, ${hold(ship)}`),
		];
	}

	/** The picked miner: an own ship (as its model, named and with its own travel speed) or a model; undefined if gone. */
	static find(key: string, own: readonly OwnShip[], models: readonly ShipListItem[]): Miner | undefined {
		const ship = own.find((x) => x.key === key);
		if (ship) {
			return { ...ship.model, name: ship.label, travel: ship.travel, own: ship };
		}
		return models.find((x) => x.id === key);
	}
}
