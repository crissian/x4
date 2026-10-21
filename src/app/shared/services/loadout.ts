import { EquipmentType } from './data/equipment-type-data';
import { Equipment, MissileData, Production, Ship, Slot, WeaponData } from './model/model';

/**
 * Ship loadout math: which equipment fits a slot, flight speeds, weapon damage per second and
 * the totals of a full loadout. The game values come from the extracted macros; the formulas are
 * the ones the community uses (speed = thrust / drag), so expect small differences in game
 * (equipment mods, crew skill and ship damage are ignored).
 */

export type SlotKind = 'engines' | 'shields' | 'weapons' | 'turrets';

/** Equipment fits a slot when every one of its connection tags is present on the slot. */
export function fits(equipment: Equipment, slot: Slot): boolean {
	if (!equipment.tags?.length || !slot.tags?.length) {
		return false;
	}
	return equipment.tags.every((tag) => slot.tags.includes(tag));
}

const KIND_TYPES: Record<SlotKind, string[]> = {
	engines: [EquipmentType.engines],
	shields: [EquipmentType.shields],
	weapons: [EquipmentType.weapons],
	turrets: [EquipmentType.turrets],
};

export function compatibleEquipment(slot: Slot, kind: SlotKind, equipment: readonly Equipment[]): Equipment[] {
	return equipment.filter((x) => KIND_TYPES[kind].includes(x.type) && fits(x, slot));
}

export interface FlightSpeeds {
	/** m/s */
	speed: number;
	boost: number;
	travel: number;
	/** Seconds to engage the travel drive. */
	travelCharge: number;
}

/** Speeds of a ship with `count` copies of the given engine (defaults to every engine slot). */
export function flightSpeeds(ship: Ship, engine: Equipment, count = ship.engines?.length ?? 0): FlightSpeeds {
	const drag = ship.drag?.forward;
	const thrust = (engine?.thrust?.forward ?? 0) * count;
	if (!drag || !thrust) {
		return { speed: 0, boost: 0, travel: 0, travelCharge: 0 };
	}
	const speed = thrust / drag;
	return {
		speed,
		boost: speed * (engine.boost?.thrust ?? 0),
		travel: speed * (engine.travel?.thrust ?? 0),
		travelCharge: engine.travel?.charge ?? 0,
	};
}

export interface WeaponStats {
	/** Damage per second while firing continuously, before reloads and overheating. */
	burstDps: number;
	/** Average damage per second including magazine reloads, beam pauses and overheating. */
	sustainedDps: number;
	/** Sustained damage per second against shields and against hull. */
	shieldDps: number;
	hullDps: number;
	/** Shots per second while firing. */
	fireRate: number;
	/** Seconds of continuous fire until the weapon overheats, undefined when it never does. */
	timeToOverheat?: number;
	range: number;
	projectileSpeed?: number;
}

export function weaponStats(weapon: WeaponData): WeaponStats {
	let burstDps: number;
	let fireRate: number;
	let sustainedFactor = 1;

	if (weapon.beam) {
		// beams deal their damage per second while firing for `lifetime` seconds, then wait for the reload
		const period = Math.max(weapon.reload ?? weapon.lifetime, weapon.lifetime) + (weapon.chargeTime ?? 0);
		fireRate = period > 0 ? 1 / period : 0;
		burstDps = weapon.damage * weapon.amount;
		sustainedFactor = period > 0 ? weapon.lifetime / period : 1;
	} else {
		const interval = (weapon.rate ? 1 / weapon.rate : (weapon.reload ?? 0)) + (weapon.chargeTime ?? 0);
		fireRate = interval > 0 ? 1 / interval : 0;
		burstDps = weapon.damage * weapon.amount * fireRate;
		if (weapon.magazine?.size > 0 && fireRate > 0) {
			const firing = weapon.magazine.size / fireRate;
			sustainedFactor = firing / (firing + weapon.magazine.reload);
		}
	}

	let timeToOverheat: number | undefined;
	const heat = weapon.heat;
	if (heat && heat.overheat > 0) {
		// heat per second while firing, beams add theirs per second of firing
		const heating = weapon.beam ? heat.shot : heat.shot * fireRate;
		const net = heating - heat.coolRate;
		if (net > 0) {
			timeToOverheat = heat.overheat / net;
			const firing = Math.max(0, heat.overheat - heat.reenable) / net;
			const cooling = heat.overheatCoolDelay + Math.max(0, heat.overheat - heat.reenable) / (heat.coolRate || 1);
			sustainedFactor *= firing / (firing + cooling);
		}
	}

	const sustainedDps = burstDps * sustainedFactor;
	const perShot = weapon.damage || 1;
	return {
		burstDps,
		sustainedDps,
		shieldDps: (sustainedDps * (weapon.damage + (weapon.shield ?? 0))) / perShot,
		hullDps: (sustainedDps * (weapon.damage + (weapon.hull ?? 0))) / perShot,
		fireRate,
		timeToOverheat,
		range: weapon.range,
		projectileSpeed: weapon.beam ? undefined : weapon.speed,
	};
}

export function missileDps(missile: MissileData): number {
	return missile.reload ? missile.damage / missile.reload : missile.damage;
}

/** One slot group of a ship: the game equips every slot of a group with the same equipment. */
export interface SlotGroup {
	key: string;
	kind: SlotKind;
	label: string;
	slots: Slot[];
	options: Equipment[];
}

/**
 * Groups the slots the way the game's ship configuration does: all engines together, the main
 * (ungrouped) shields together, grouped shields and turrets per group, weapons one by one.
 */
export function slotGroups(ship: Ship, equipment: readonly Equipment[]): SlotGroup[] {
	const groups: SlotGroup[] = [];
	const add = (kind: SlotKind, slots: Slot[] | undefined, perSlot: boolean) => {
		const map = new Map<string, Slot[]>();
		(slots ?? []).forEach((slot, i) => {
			const key = perSlot ? `${kind}:${i}` : `${kind}:${slot.group ?? 'main'}:${slot.size}:${(slot.tags ?? []).join('.')}`;
			map.set(key, [...(map.get(key) ?? []), slot]);
		});
		let index = 1;
		for (const [key, list] of map) {
			const slot = list[0];
			const options = compatibleEquipment(slot, kind, equipment);
			if (!options.length) {
				continue;
			}
			groups.push({ key, kind, label: groupLabel(kind, slot, list.length, index++), slots: list, options });
		}
	};
	add('engines', ship.engines, false);
	add('shields', ship.shields, false);
	add('weapons', ship.weapons, true);
	add('turrets', ship.turrets, false);
	return groups;
}

function groupLabel(kind: SlotKind, slot: Slot, count: number, index: number): string {
	const size = slot.size ? slot.size.charAt(0).toUpperCase() + slot.size.slice(1) : '';
	const amount = count > 1 ? ` ×${count}` : '';
	switch (kind) {
		case 'engines':
			return `Engines${amount}`;
		case 'shields':
			return `${slot.group ? `Shield group ${index}` : 'Main shields'} (${size})${amount}`;
		case 'weapons':
			return `Weapon ${index} (${size})`;
		case 'turrets':
			return `Turret group ${index} (${size})${amount}`;
	}
}

/** Selected equipment id per slot group key. */
export type Loadout = Record<string, string>;

/** Picks the option with the highest score for every group, `none` to leave a kind empty. */
export function bestLoadout(groups: SlotGroup[], score: (equipment: Equipment, group: SlotGroup) => number | null): Loadout {
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

export function loadoutStats(ship: Ship, groups: SlotGroup[], loadout: Loadout, getEquipment: (id: string) => Equipment): LoadoutStats {
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
					const stats = weaponStats(equipment.weapon);
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
		speeds: engine ? flightSpeeds(ship, engine, engineCount) : flightSpeeds(ship, undefined, 0),
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
export function defaultProduction(productions: Production[] | undefined, method?: string): Production | undefined {
	if (!productions?.length) {
		return undefined;
	}
	return productions.find((x) => x.method === method) ?? productions.find((x) => x.method === 'default') ?? productions[0];
}

/** Total wares needed to build the ship and its equipment. */
export function buildWares(
	ship: Ship,
	counts: Map<string, number>,
	getEquipment: (id: string) => Equipment,
	method?: string
): Map<string, number> {
	const totals = new Map<string, number>();
	const add = (productions: Production[] | undefined, times: number) => {
		const production = defaultProduction(productions, method);
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
export function relationToReputation(relation: number): number {
	if (relation === 0) {
		return 0;
	}
	const value = 10 * Math.log10(Math.abs(relation) * 1000);
	return Math.sign(relation) * Math.max(0, Math.round(value));
}
