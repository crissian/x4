import type { Faction, Race } from './faction';
import type { CargoType } from './station-module';
import type { Price, Production } from './ware';

export interface ShipStorage {
  missile: number;
  unit: number;
}

export interface Inertia {
  pitch: number;
  yaw: number;
  roll: number;
}

export interface Drag extends Inertia {
  forward: number;
  reverse: number;
  horizontal: number;
  vertical: number;
}

export interface Ship {
  id: string;
  name: string;
  size: string;
  explosionDamage?: number;
  hull: number;
  race?: Race;
  travel?: ShipTravel;
  price: Price;
  owners?: Faction[];
  production: Production[];
  storage?: ShipStorage;
  people?: number;
  purpose: string;
  thruster: string;
  type: string;
  mass: number;
  inertia: Inertia;
  drag: Drag;
  docks?: Dock[];
  engines: Slot[];
  shields?: Slot[];
  weapons?: TurretSlot[];
  turrets?: TurretSlot[];
  cargo?: ShipCargo[];
  /** License the buyer needs, matches `License.type` of the selling faction. */
  license?: string;
}

/**
 * Top travel speed (m/s) over the engines that fit the ship and the charge (s) of its fastest travel drive,
 * precomputed by the extractor; no charge without a travel drive.
 */
export interface ShipTravel {
  speed: number;
  charge?: number;
}

/** What ship pickers and planners need of a ship, from the slim ship list. */
export type ShipListItem = Pick<Ship, 'id' | 'name' | 'size' | 'race' | 'travel' | 'cargo' | 'owners' | 'license'> &
  Partial<Pick<Ship, 'purpose' | 'type'>>;

export interface ShipCargo {
  max: number;
  types: CargoType[];
}

export interface Dock {
  capacity: number;
  size: string;
}

export interface Slot {
  group?: string;
  size: string;
  hittable: boolean;
  /** Connection tags; equipment fits when all of its own tags are present. */
  tags?: string[];
}

export interface TurretSlot extends Slot {
  types: string[];
}

export interface SlotSummary {
  size: string;
  capacity: number;
}
