import { EnumLabels } from '../../core/enum-labels';
import { EquipmentType } from './data/equipment-type-data';
import { Equipment, Production, Ship, Slot } from './model/model';
import { FlightSpeeds, ShipPerformance } from './ship-performance';

/**
 * Ship loadout math: which equipment fits a slot, flight speeds, weapon damage per second and
 * the totals of a full loadout. The game values come from the extracted macros; the formulas are
 * the ones the community uses (speed = thrust / drag), so expect small differences in game
 * (equipment mods, crew skill and ship damage are ignored).
 */

export type SlotKind = 'engines' | 'shields' | 'weapons' | 'turrets';

const KIND_TYPES: Record<SlotKind, string[]> = {
	engines: [EquipmentType.engines],
	shields: [EquipmentType.shields],
	weapons: [EquipmentType.weapons],
	turrets: [EquipmentType.turrets],
};

/** One slot group of a ship: the game equips every slot of a group with the same equipment. */
export interface SlotGroup {
	key: string;
	kind: SlotKind;
	label: string;
	slots: Slot[];
	options: Equipment[];
}

export interface LoadoutStats {
	speeds: FlightSpeeds;
	shield: number;
	shieldRecharge: number;
	hull: number;
	/** Forward weapons. */
	weaponDps: number;
	turretDps: number;
	/** Longest weapon or turret range in meters. */
	maxRange: number;
	/** Equipment count per id. */
	counts: Map<string, number>;
	equipmentPrice: { min: number; avg: number; max: number };
}

/** Selected equipment id per slot group key. */
export type Loadout = Record<string, string>;

export class Loadouts {
	/** Equipment fits a slot when every one of its connection tags is present on the slot. */
	static fits(equipment: Equipment, slot: Slot): boolean {
		if (!equipment.tags?.length || !slot.tags?.length) {
			return false;
		}
		return equipment.tags.every((tag) => slot.tags!.includes(tag));
	}

	static compatibleEquipment(slot: Slot, kind: SlotKind, equipment: readonly Equipment[]): Equipment[] {
		return equipment.filter((x) => x.type != null && KIND_TYPES[kind].includes(x.type) && Loadouts.fits(x, slot));
	}

	/**
	 * Groups the slots the way the game's ship configuration does: all engines together, the main
	 * (ungrouped) shields together, grouped shields and turrets per group, weapons one by one.
	 */
	static slotGroups(ship: Ship, equipment: readonly Equipment[]): SlotGroup[] {
		const groups: SlotGroup[] = [];
		const add = (kind: SlotKind, slots: Slot[] | undefined, perSlot: boolean) => {
			const map = new Map<string, Slot[]>();
			(slots ?? []).forEach((slot, i) => {
				const tags = (slot.tags ?? []).join('.');
				const key = perSlot ? `${kind}:${i}` : `${kind}:${slot.group ?? 'main'}:${slot.size}:${tags}`;
				map.set(key, [...(map.get(key) ?? []), slot]);
			});
			let index = 1;
			for (const [key, list] of map) {
				const slot = list[0];
				const options = Loadouts.compatibleEquipment(slot, kind, equipment);
				if (!options.length) {
					continue;
				}
				const label = Loadouts.groupLabel(kind, slot, list.length, index++);
				groups.push({ key, kind, label, slots: list, options });
			}
		};
		add('engines', ship.engines, false);
		add('shields', ship.shields, false);
		add('weapons', ship.weapons, true);
		add('turrets', ship.turrets, false);
		return groups;
	}

	/** Picks the option with the highest score for every group, `none` to leave a kind empty. */
	static bestLoadout(groups: SlotGroup[], score: (equipment: Equipment, group: SlotGroup) => number | null): Loadout {
		const result: Loadout = {};
		for (const group of groups) {
			let best: Equipment | undefined;
			let bestScore = -Infinity;
			for (const option of group.options) {
				const value = score(option, group);
				if (value != null && value > bestScore) {
					bestScore = value;
					best = option;
				}
			}
			if (best) {
				result[group.key] = best.id;
			}
		}
		return result;
	}

	static loadoutStats(
		ship: Ship,
		groups: SlotGroup[],
		loadout: Loadout,
		getEquipment: (id: string) => Equipment | undefined
	): LoadoutStats {
		const counts = new Map<string, number>();
		let shield = 0;
		let shieldRecharge = 0;
		let weaponDps = 0;
		let turretDps = 0;
		let maxRange = 0;
		let engine: Equipment | undefined;
		let engineCount = 0;

		for (const group of groups) {
			const equipment = loadout[group.key] ? getEquipment(loadout[group.key]) : undefined;
			if (!equipment) {
				continue;
			}
			const count = group.slots.length;
			counts.set(equipment.id, (counts.get(equipment.id) ?? 0) + count);

			switch (group.kind) {
				case 'engines':
					engine = equipment;
					engineCount += count;
					break;
				case 'shields':
					shield += (equipment.recharge?.max ?? 0) * count;
					shieldRecharge += (equipment.recharge?.rate ?? 0) * count;
					break;
				case 'weapons':
				case 'turrets': {
					if (equipment.weapon && !equipment.weapon.repair) {
						const stats = ShipPerformance.weaponStats(equipment.weapon);
						if (group.kind === 'weapons') {
							weaponDps += stats.sustainedDps * count;
						} else {
							turretDps += stats.sustainedDps * count;
						}
						maxRange = Math.max(maxRange, stats.range);
					}
					break;
				}
			}
		}

		const equipmentPrice = { min: 0, avg: 0, max: 0 };
		for (const [id, count] of counts) {
			const price = getEquipment(id)?.price;
			if (price) {
				equipmentPrice.min += price.min * count;
				equipmentPrice.avg += price.avg * count;
				equipmentPrice.max += price.max * count;
			}
		}

		return {
			speeds: engine
				? ShipPerformance.flightSpeeds(ship, engine, engineCount)
				: ShipPerformance.flightSpeeds(ship, undefined, 0),
			shield,
			shieldRecharge,
			hull: ship.hull,
			weaponDps,
			turretDps,
			maxRange,
			counts,
			equipmentPrice,
		};
	}

	/** The production used for totals: the universal ('default') method when there is one. */
	static defaultProduction(productions: Production[] | undefined, method?: string): Production | undefined {
		if (!productions?.length) {
			return undefined;
		}
		return (
			productions.find((x) => x.method === method) ??
			productions.find((x) => x.method === 'default') ??
			productions[0]
		);
	}

	/** Total wares needed to build the ship and its equipment. */
	static buildWares(
		ship: Ship,
		counts: Map<string, number>,
		getEquipment: (id: string) => Equipment | undefined,
		method?: string
	): Map<string, number> {
		const totals = new Map<string, number>();
		const add = (productions: Production[] | undefined, times: number) => {
			const production = Loadouts.defaultProduction(productions, method);
			for (const ware of production?.wares ?? []) {
				totals.set(ware.ware, (totals.get(ware.ware) ?? 0) + ware.amount * times);
			}
		};
		add(ship.production, 1);
		for (const [id, count] of counts) {
			add(getEquipment(id)?.production, count);
		}
		return totals;
	}

	/** In-game reputation (-30 .. 30) for a relation value (-1 .. 1). */
	static relationToReputation(relation: number): number {
		if (relation === 0) {
			return 0;
		}
		const value = 10 * Math.log10(Math.abs(relation) * 1000);
		return Math.sign(relation) * Math.max(0, Math.round(value));
	}

	private static groupLabel(kind: SlotKind, slot: Slot, count: number, index: number): string {
		const size = slot.size ? EnumLabels.label(slot.size.charAt(0).toUpperCase() + slot.size.slice(1)) : '';
		const amount = count > 1 ? ` ×${count}` : '';
		switch (kind) {
			case 'engines':
				return $localize`Engines${amount}:amount:`;
			case 'shields':
				return slot.group
					? $localize`Shield group ${index}:index: (${size}:size:)${amount}:amount:`
					: $localize`Main shields (${size}:size:)${amount}:amount:`;
			case 'weapons':
				return $localize`Weapon ${index}:index: (${size}:size:)`;
			case 'turrets':
				return $localize`Turret group ${index}:index: (${size}:size:)${amount}:amount:`;
		}
	}
}
