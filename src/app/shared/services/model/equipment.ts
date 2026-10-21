import type { Faction, Race } from './faction';
import type { Price, Production } from './ware';

export interface Thrust {
   forward: number;
   reverse: number;
}

export interface Equipment {
   id: string;
   name: string;
   description: string;
   race?: Race;
   type?: string;
   equipmentClass?: string;
   size?: string;
   hull?: number;
   price?: Price;
   thrust?: Thrust;
   owners?: Faction[];
   production?: Production[];
   explosionDamage?: number;
   /** Shield generators. */
   recharge?: ShieldRecharge;
   /** Engines. */
   travel?: TravelDrive;
   boost?: Boost;
   /** Weapons and turrets. */
   weapon?: WeaponData;
   missile?: MissileData;
   /** Connection tags, see `Slot.tags`. */
   tags?: string[];
   license?: string;
}

export interface ShieldRecharge {
   /** Shield capacity. */
   max: number;
   /** Shield points per second. */
   rate: number;
   /** Seconds without damage before recharging starts. */
   delay: number;
}

export interface TravelDrive {
   /** Travel speed as a multiple of the forward thrust. */
   thrust: number;
   attack: number;
   /** Seconds to engage. */
   charge: number;
   release: number;
}

export interface Boost {
   /** Boost speed as a multiple of the forward thrust. */
   thrust: number;
   duration: number;
   recharge: number;
   acceleration: number;
}

export interface WeaponData {
   /** Damage per projectile, or per second while firing for beams. */
   damage: number;
   /** Extra damage against shields only. */
   shield?: number;
   /** Extra damage against hull only. */
   hull?: number;
   repair?: boolean;
   /** Projectiles per shot. */
   amount: number;
   speed: number;
   lifetime: number;
   /** Meters. */
   range: number;
   beam?: boolean;
   chargeTime?: number;
   /** Shots per second. */
   rate?: number;
   /** Seconds between shots (used when there is no rate). */
   reload?: number;
   magazine?: { size: number; reload: number };
   heat?: WeaponHeat;
}

export interface WeaponHeat {
   /** Heat added per shot (per second for beams). */
   shot: number;
   overheat: number;
   coolRate: number;
   coolDelay: number;
   overheatCoolDelay: number;
   /** The weapon fires again once cooled below this value. */
   reenable: number;
}

export interface MissileData {
   damage: number;
   range: number;
   lifetime: number;
   guided: boolean;
   reload?: number;
   speed?: number;
}
