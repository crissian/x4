import { EnumLabels } from '../core/enum-labels';
import type { Equipment } from '../shared/services/model/equipment';
import type { EquipmentMod, ModSlot } from '../shared/services/model/equipment-mod';

/** The equipment the mods of each slot go on. */
export class ModSlots {
	static readonly ALL: readonly ModSlot[] = ['weapon', 'engine', 'shield', 'ship'];

	/** The English enum value of each slot, translated by `EnumLabels`. */
	private static readonly LABELS: Record<ModSlot, string> = {
		weapon: 'Weapon',
		engine: 'Engine',
		shield: 'Shield',
		ship: 'Ship',
	};

	static label(slot: ModSlot): string {
		return EnumLabels.label(ModSlots.LABELS[slot]);
	}

	/** What the mods of a slot are installed on, for the "applies to" line. */
	static appliesTo(slot: ModSlot): string {
		switch (slot) {
			case 'weapon':
				return $localize`:mod applies to:Weapons`;
			case 'engine':
				return $localize`:mod applies to:Engines`;
			case 'shield':
				return $localize`:mod applies to:Shield generators`;
			case 'ship':
				return $localize`:mod applies to:The ship itself (chassis)`;
		}
	}

	/** The slot of the mods a piece of equipment takes; undefined when it takes none. */
	static ofEquipment(equipment: Equipment): ModSlot | undefined {
		switch (equipment.equipmentClass) {
			case 'Weapon':
				return equipment.weapon ? 'weapon' : undefined;
			case 'Engine':
				// thrusters share the class, but mods go on the engines
				return equipment.type === 'Engines' ? 'engine' : undefined;
			case 'Shield Generator':
				return 'shield';
			default:
				return undefined;
		}
	}

	/**
	 * The mods of the slot the equipment takes. The game decides per weapon which weapon mods fit (in code, not in the
	 * game data), so every weapon mod is listed.
	 */
	static forEquipment(mods: readonly EquipmentMod[], equipment: Equipment): EquipmentMod[] {
		const slot = ModSlots.ofEquipment(equipment);
		return slot ? mods.filter((x) => x.slot === slot) : [];
	}
}
