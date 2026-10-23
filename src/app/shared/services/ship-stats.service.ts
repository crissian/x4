import { Injectable, inject } from '@angular/core';
import { EnumLabels } from '../../core/enum-labels';
import { EquipmentService } from './equipment.service';
import { FactionService } from './faction.service';
import { SlotGroup, Loadouts, Loadout } from './loadout';
import { LoadoutMissiles } from './loadout-missiles';
import { ShipPerformance } from './ship-performance';
import { Equipment, Faction, License, Ship } from './model/model';

export type LoadoutPreset = 'combat' | 'travel' | 'cheapest' | 'empty';

export const LOADOUT_PRESETS: { id: LoadoutPreset; name: string; label: string }[] = [
	{ id: 'combat', name: $localize`Combat`, label: $localize`Best combat (fastest engines, strongest shields and weapons)` },
	{ id: 'travel', name: $localize`Travel`, label: $localize`Best travel (fastest travel drive, strongest shields)` },
	{ id: 'cheapest', name: $localize`Cheapest`, label: $localize`Cheapest` },
	{ id: 'empty', name: $localize`Empty`, label: $localize`Empty` },
];

/** Best values a ship can reach with any compatible equipment, used by the ship list. */
export interface ShipMaxStats {
	speed: number;
	boost: number;
	travel: number;
	shield: number;
	cargo: number;
	cargoTypes: string;
}

export interface LicenseRequirement {
	faction: Faction;
	license?: License;
}

@Injectable({ providedIn: 'root' })
export class ShipStatsService {
	private readonly equipmentService = inject(EquipmentService);
	private readonly factionService = inject(FactionService);
	private readonly groupsCache = new Map<string, SlotGroup[]>();
	private readonly maxCache = new Map<string, ShipMaxStats>();

	readonly getEquipment = (id: string) => this.equipmentService.getEntity(id);

	groups(ship: Ship): SlotGroup[] {
		let groups = this.groupsCache.get(ship.id);
		if (!groups) {
			groups = Loadouts.slotGroups(ship, this.equipmentService.getEntities());
			this.groupsCache.set(ship.id, groups);
		}
		return groups;
	}

	engines(ship: Ship): Equipment[] {
		return this.groups(ship).find((x) => x.kind === 'engines')?.options ?? [];
	}

	maxStats(ship: Ship): ShipMaxStats {
		let stats = this.maxCache.get(ship.id);
		if (!stats) {
			const engines = this.engines(ship).map((x) => ShipPerformance.flightSpeeds(ship, x));
			const shield = this.groups(ship)
				.filter((x) => x.kind === 'shields')
				.reduce((total, group) => total + Math.max(0, ...group.options.map((x) => x.recharge?.max ?? 0)) * group.slots.length, 0);
			stats = {
				speed: Math.max(0, ...engines.map((x) => x.speed)),
				boost: Math.max(0, ...engines.map((x) => x.boost)),
				travel: Math.max(0, ...engines.map((x) => x.travel)),
				shield,
				cargo: (ship.cargo ?? []).reduce((total, x) => total + x.max, 0),
				cargoTypes: [...new Set((ship.cargo ?? []).flatMap((x) => x.types.map((t) => EnumLabels.label(t.name))))].join(', '),
			};
			this.maxCache.set(ship.id, stats);
		}
		return stats;
	}

	preset(ship: Ship, preset: LoadoutPreset): Loadout {
		const groups = this.groups(ship);
		switch (preset) {
			case 'empty':
				return {};
			case 'cheapest':
				return Loadouts.bestLoadout(groups, (x) => -(x.price?.avg ?? 0));
			case 'travel':
			case 'combat':
				return Loadouts.bestLoadout(groups, (x, group) => {
					switch (group.kind) {
						case 'engines':
							return preset === 'travel'
								? (x.thrust?.forward ?? 0) * (x.travel?.thrust ?? 0)
								: (x.thrust?.forward ?? 0);
						case 'shields':
							return x.recharge?.max ?? 0;
						case 'thrusters':
							return (x.thruster?.pitch ?? 0) + (x.thruster?.yaw ?? 0);
						default:
							return x.weapon && !x.weapon.repair ? ShipPerformance.weaponStats(x.weapon).sustainedDps : null;
					}
				});
		}
	}

	/**
	 * Loadout as text for URLs: the equipment id of every slot group in order ('-' for none), then the
	 * missile of every launcher-capable group ('-' for the launcher's default).
	 */
	encode(ship: Ship, loadout: Loadout): string {
		const groups = this.groups(ship);
		const missiles = groups.filter((x) => LoadoutMissiles.isLauncherGroup(x)).map((x) => loadout[LoadoutMissiles.key(x)] || '-');
		return [...groups.map((x) => loadout[x.key] ?? '-'), ...missiles].join('.');
	}

	/**
	 * Codes made before a slot group was added (the thrusters) are shorter: the groups they do not
	 * cover get the combat preset's pick, missing or unusable missiles the launcher's default.
	 */
	decode(ship: Ship, code: string | null | undefined): Loadout | undefined {
		if (!code) {
			return undefined;
		}
		const ids = code.split('.');
		const groups = this.groups(ship);
		const result: Loadout = {};
		let combat: Loadout | undefined;
		groups.forEach((group, i) => {
			if (i >= ids.length) {
				combat ??= this.preset(ship, 'combat');
				if (combat[group.key]) {
					result[group.key] = combat[group.key];
				}
				return;
			}
			const id = ids[i];
			if (id && id !== '-' && group.options.some((x) => x.id === id)) {
				result[group.key] = id;
			}
		});
		groups
			.filter((x) => LoadoutMissiles.isLauncherGroup(x))
			.forEach((group, i) => {
				const id = ids[groups.length + i];
				const launcher = result[group.key] ? this.getEquipment(result[group.key])?.launcher : undefined;
				if (id && launcher && LoadoutMissiles.effective(launcher, id, this.getEquipment)?.id === id) {
					result[LoadoutMissiles.key(group)] = id;
				}
			});
		return result;
	}

	/**
	 * The preset a share code stands for, if any. Both sides are compared decoded and encoded again, so codes made
	 * before the thruster and missile slots still match their preset.
	 */
	matchingPreset(ship: Ship, code: string | null | undefined): LoadoutPreset | undefined {
		const loadout = this.decode(ship, code);
		if (!loadout) {
			return undefined;
		}
		const normalized = (x: Loadout) => this.encode(ship, this.decode(ship, this.encode(ship, x)) ?? {});
		const target = normalized(loadout);
		return LOADOUT_PRESETS.find((p) => normalized(this.preset(ship, p.id)) === target)?.id;
	}

	/** Factions selling the item and the license each one asks for. */
	sellers(owners: Faction[] | undefined, license: string | undefined): LicenseRequirement[] {
		return (owners ?? [])
			.map((owner) => this.factionService.getEntity(owner.id) ?? owner)
			.map((faction) => ({ faction, license: license ? faction.licenses?.find((x) => x.type === license) : undefined }));
	}
}
