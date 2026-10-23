import { EnumLabels } from '../../core/enum-labels';
import { NumberFormats } from '../../core/format/number-formats';
import type { SelectOption } from '../../shared/components/searchable-select/select-option-filter';
import { SizeOrder } from '../../shared/services/size-order';
import type { OwnShip } from './own-ship-list';

/** The options of the ship pickers: the player's ships grouped by size, then the ship models. */
export class ShipPickerOptions {
	/**
	 * The own ships under a header per size, smallest first, keeping their order within a size, with the number of
	 * merged ships after the name; `detail` gives the searchable text after the name, such as the model and sector.
	 */
	static own<T extends OwnShip>(ships: readonly T[], detail: (own: T) => string): SelectOption[] {
		return SizeOrder.sort(ships, (own) => own.model.size).map((own) => ({
			id: own.key,
			name: own.count > 1 ? `${own.label} ×${own.count}` : own.label,
			group: $localize`:ship picker header, own ships of one size:Your ships, ${EnumLabels.label(own.model.size)}:size:`,
			detail: detail(own),
		}));
	}

	/** The ship models under one header, in their order. */
	static models<T extends { id: string; name: string }>(
		ships: readonly T[],
		detail: (ship: T) => string
	): SelectOption[] {
		const group = $localize`Ship models`;
		return ships.map((ship) => ({ id: ship.id, name: ship.name, group, detail: detail(ship) }));
	}

	/** The usual detail of an own ship: its model when it has its own name, the hold when given, and its sector. */
	static ownDetail(own: OwnShip, hold?: number): string {
		const parts = [own.named ? own.model.name : '', hold !== undefined ? ShipPickerOptions.hold(hold) : ''];
		const ship = parts.filter((x) => x).join(', ');
		return ship ? `${ship} · ${own.sectorName}` : own.sectorName;
	}

	/** The usual detail of a ship model: its size, and the hold when given. */
	static modelDetail(ship: { size: string }, hold?: number): string {
		const size = EnumLabels.label(ship.size);
		return hold !== undefined ? `${size}, ${ShipPickerOptions.hold(hold)}` : size;
	}

	private static hold(volume: number): string {
		return `${NumberFormats.whole(volume)} m³`;
	}
}
