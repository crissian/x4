import { EnumLabels } from '../core/enum-labels';
import type { Equipment } from '../shared/services/model/equipment';
import type { EquipmentMod, ModSlot } from '../shared/services/model/equipment-mod';

/** The equipment the mods of each slot go on, and which mods make sense on a piece of equipment. */
export class ModSlots {
	static readonly ALL: readonly ModSlot[] = ['weapon', 'engine', 'shield', 'ship'];

	/** The English enum value of each slot, translated by `EnumLabels`. */
	private static readonly LABELS: Record<ModSlot, string> = {
		weapon: 'Weapon',
		engine: 'Engine',
		shield: 'Shield',
		ship: 'Ship',
	};

	/** Weapon stats only some weapons have; a mod changing one of them does nothing on the others. */
	private static readonly WEAPON_ONLY: Record<string, (equipment: Equipment) => boolean> = {
		beamlength: (x) => !!x.weapon?.beam,
		chargetime: (x) => !!x.weapon?.chargeTime,
		mining: (x) => x.id.includes('mining'),
	};

	static label(slot: ModSlot): string {
		return EnumLabels.label(ModSlots.LABELS[slot]);
	}

	/** What the mods of a slot are installed on, for the "applies to" line. */
	static appliesTo(slot: ModSlot): string {
		switch (slot) {
			case 'weapon':
				return $localize`:mod applies to:Ship weapons (not turrets)`;
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
				return equipment.weapon && !equipment.weapon.repair ? 'weapon' : undefined;
			case 'Engine':
				// thrusters share the class, but mods go on the engines
				return equipment.type === 'Engines' ? 'engine' : undefined;
			case 'Shield Generator':
				return 'shield';
			default:
				return undefined;
		}
	}

	/** The mods that fit the equipment and change a stat it has. */
	static forEquipment(mods: readonly EquipmentMod[], equipment: Equipment): EquipmentMod[] {
		const slot = ModSlots.ofEquipment(equipment);
		return slot ? mods.filter((x) => x.slot === slot && ModSlots.affects(x, equipment)) : [];
	}

	/** False when the mod's main stat is one the weapon doesn't have, such as beam length on a cannon. */
	static affects(mod: EquipmentMod, equipment: Equipment): boolean {
		const has = ModSlots.WEAPON_ONLY[mod.effect.stat];
		return mod.slot !== 'weapon' || !has || has(equipment);
	}
}
