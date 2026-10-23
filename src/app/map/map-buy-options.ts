import { EnumLabels } from '../core/enum-labels';
import type { SelectOption } from '../shared/components/searchable-select/select-option-filter';
import { SizeOrder } from '../shared/services/size-order';

/**
 * The options of the map's "where to buy" picker, valued `ship:<id>` or `equipment:<id>`: the ships by size,
 * smallest first, then the equipment by type, each by name. The kind and size or type is the searchable detail.
 */
export class MapBuyOptions {
	static build(
		ships: readonly { id: string; name: string; size: string }[],
		equipment: readonly { id: string; name: string; type?: string }[]
	): SelectOption[] {
		const byName = [...ships].sort((a, b) => a.name.localeCompare(b.name));
		const shipOptions = SizeOrder.sort(byName, (x) => x.size).map((x) => {
			const size = EnumLabels.label(x.size);
			return {
				id: `ship:${x.id}`,
				name: x.name,
				group: $localize`:where to buy header, ships of one size:Ships, ${size}:size:`,
				detail: $localize`:where to buy detail of a ship:ship, ${size}:size:`,
			};
		});
		const equipmentOptions = equipment
			.map((x) => {
				const type = x.type ? EnumLabels.label(x.type) : $localize`equipment`;
				return { id: `equipment:${x.id}`, name: x.name, group: type, detail: type };
			})
			.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
		return [...shipOptions, ...equipmentOptions];
	}
}
