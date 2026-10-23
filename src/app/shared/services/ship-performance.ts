import { LoadoutMissiles } from './loadout-missiles';
import { Equipment, MissileData, Ship, WeaponData } from './model/model';

export interface FlightSpeeds {
	/** m/s */
	speed: number;
	boost: number;
	travel: number;
	/** Seconds to engage the travel drive. */
	travelCharge: number;
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

export class ShipPerformance {
	/** Speeds of a ship with `count` copies of the given engine (defaults to every engine slot). */
	static flightSpeeds(ship: Ship, engine: Equipment | undefined, count = ship.engines?.length ?? 0): FlightSpeeds {
		const drag = ship.drag?.forward;
		const thrust = (engine?.thrust?.forward ?? 0) * count;
		if (!engine || !drag || !thrust) {
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

	static weaponStats(weapon: WeaponData): WeaponStats {
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
			if (weapon.magazine && weapon.magazine.size > 0 && fireRate > 0) {
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

	/** Sustained damage per second of one launcher, including swarms and magazine reloads. */
	static missileDps(missile: MissileData): number {
		return LoadoutMissiles.stats(missile).sustainedDps;
	}
}
