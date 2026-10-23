import type { Equipment } from '../shared/services/model/equipment';
import type { CraftingItem, EquipmentMod } from '../shared/services/model/equipment-mod';

/** Small mods, items and equipment for the specs. */
export class ModTesting {
	static mod(id: string, values: Partial<EquipmentMod> = {}): EquipmentMod {
		return {
			id,
			name: id,
			shortName: id,
			version: 0,
			slot: 'weapon',
			quality: 1,
			effect: { stat: 'damage', min: 1.05, max: 1.2 },
			...values,
		};
	}

	static item(id: string, values: Partial<CraftingItem> = {}): CraftingItem {
		return { id, name: id, version: 0, tags: [], ...values };
	}

	static equipment(id: string, values: Partial<Equipment> = {}): Equipment {
		return { id, name: id, ...values };
	}
}
