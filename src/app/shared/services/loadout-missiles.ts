import type { Loadout, SlotGroup } from './loadout';
import { Equipment, LauncherData, MissileData, Ship } from './model/model';

export interface MissileStats {
	/** Launches per second while firing. */
	fireRate: number;
	/** Damage per second while firing, before magazine reloads. */
	burstDps: number;
	/** Average damage per second including magazine reloads. */
	sustainedDps: number;
	/** Average launches per second including magazine reloads. */
	sustainedRate: number;
	/** Damage of one launch (every missile of a swarm). */
	volley: number;
}

export interface MissileTotals {
	/** Launchers and missile turrets that hold a missile. */
	launchers: number;
	dps: number;
	/** Damage of one launch from every launcher. */
	volley: number;
	/** Missiles the ship carries. */
	storage: number;
	/** Seconds of continuous fire until the storage is empty, 0 when nothing fires. */
	secondsToEmpty: number;
}

/**
 * Missiles of a loadout. The missile a launcher group fires is not a slot group of its own: it is
 * kept in the loadout under `key(group)`, '' (or no value) meaning the launcher's default missile.
 */
export class LoadoutMissiles {
	static key(group: SlotGroup): string {
		return `${group.key}#missile`;
	}

	/** Weapon or turret groups that can hold a missile launcher. */
	static isLauncherGroup(group: SlotGroup): boolean {
		return group.options.some((x) => x.launcher);
	}

	/** Missiles whose ammo tag the launcher accepts. */
	static compatible(launcher: LauncherData, all: readonly Equipment[]): Equipment[] {
		return all.filter((x) => x.missile?.tags?.some((tag) => launcher.ammo.includes(tag)));
	}

	/** The chosen missile when the launcher accepts it, otherwise the launcher's default. */
	static effective(
		launcher: LauncherData,
		chosenId: string | undefined,
		get: (id: string) => Equipment | undefined
	): Equipment | undefined {
		const chosen = chosenId ? get(chosenId) : undefined;
		if (chosen?.missile?.tags?.some((tag) => launcher.ammo.includes(tag))) {
			return chosen;
		}
		return get(launcher.missile);
	}

	static stats(missile: MissileData): MissileStats {
		const amount = missile.amount ?? 1;
		const fireRate = missile.reload ? 1 / missile.reload : 0;
		const volley = missile.damage * amount;
		// without a reload time a launcher fires once per second at most, as before
		const burstDps = fireRate ? volley * fireRate : volley;
		let factor = 1;
		if (missile.magazine && missile.magazine.size > 0 && fireRate > 0) {
			const firing = missile.magazine.size / fireRate;
			factor = firing / (firing + missile.magazine.reload);
		}
		return { fireRate, burstDps, sustainedDps: burstDps * factor, sustainedRate: fireRate * factor, volley };
	}

	static totals(
		ship: Ship,
		groups: SlotGroup[],
		loadout: Loadout,
		get: (id: string) => Equipment | undefined
	): MissileTotals {
		const totals: MissileTotals = { launchers: 0, dps: 0, volley: 0, storage: ship.storage?.missile ?? 0, secondsToEmpty: 0 };
		let launchRate = 0;
		for (const group of groups) {
			const launcher = loadout[group.key] ? get(loadout[group.key])?.launcher : undefined;
			const missile = launcher ? LoadoutMissiles.effective(launcher, loadout[LoadoutMissiles.key(group)], get)?.missile : undefined;
			if (!missile) {
				continue;
			}
			const count = group.slots.length;
			const stats = LoadoutMissiles.stats(missile);
			totals.launchers += count;
			totals.dps += stats.sustainedDps * count;
			totals.volley += stats.volley * count;
			// one storage missile per launch
			launchRate += stats.sustainedRate * count;
		}
		totals.secondsToEmpty = launchRate > 0 ? totals.storage / launchRate : 0;
		return totals;
	}
}
