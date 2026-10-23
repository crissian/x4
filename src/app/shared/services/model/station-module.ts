import type { Faction, Race } from './faction';
import type { Dock, Slot, TurretSlot } from './ship';
import type { Price, Production, Ware } from './ware';

export interface Cargo {
  max: number;
  type: CargoType;
}

export interface CargoType {
  id: string;
  name: string;
}

export interface StationModule {
  id: string;
  name: string;
  macro: string;
  explosionDamage?: number;
  hull: number;
  makerRace?: Race;
  price: Price;
  owners?: Faction[];
  production: Production[];
  product?: Ware[];
  /** Wares a production module makes in turn, each with the production method it uses. */
  queue?: { ware: Ware; method: string }[];
  /** Wares a processing module makes from recyclables, and how many per production cycle. */
  processing?: { ware: Ware; amount: number }[];
  type: string;
  cargo?: Cargo;
  workForce?: {
    max?: number;
    capacity?: number;
    race?: Race;
  };
  docks?: Dock[];
  shields?: Slot[];
  turrets?: TurretSlot[];
  /** License the buyer needs, matches `License.type` of the selling faction. */
  license?: string;
  /** Bounding box of the module in meters. */
  dimensions?: { x: number; y: number; z: number };
}

export interface ModuleWorker {
  race: Race;
  amount: number;
  consumption: { ware: Ware, amount: number}[];
}
