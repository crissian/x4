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
  description: string;
  size: string;
  explosionDamage?: number;
  hull: number;
  race?: Race;
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
