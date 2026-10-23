import { EnumLabels } from '../../core/enum-labels';
import type { SelectOption } from '../../shared/components/searchable-select/select-option-filter';
import { Size } from '../../shared/services/data/size-data';
import type { OwnShip } from './own-ship-list';

/** The options of the ship pickers: the player's ships grouped by size, then the ship models. */
export class ShipPickerOptions {
	private static readonly SIZES: readonly string[] = [
		Size.extrasmall,
		Size.small,
		Size.medium,
		Size.large,
		Size.extralarge,
	];

	/**
	 * The own ships under a header per size, smallest first, keeping their order within a size;
	 * `detail` gives the searchable text after the name, such as the model and sector.
	 */
	static own<T extends OwnShip>(ships: readonly T[], detail: (own: T) => string): SelectOption[] {
		const rank = (own: OwnShip) => {
			const index = ShipPickerOptions.SIZES.indexOf(own.model.size);
			return index < 0 ? ShipPickerOptions.SIZES.length : index;
		};
		return [...ships]
			.sort((a, b) => rank(a) - rank(b))
			.map((own) => ({
				id: own.key,
				name: own.label,
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
}
