export interface WareGroup {
  id: string;
  name: string;
  factoryName: string;
  icon: string;
  tier?: number;
}

export interface Ware {
  id: string;
  name: string;
  description: string;
  factoryName: string;
  icon: string;
  volume: number;
  transport: string;
  price: Price;
  group?: WareGroup;
  production?: Production[];
  illegal?: Faction[];
}

export interface Price {
  min: number;
  max: number;
  avg: number;
}

export interface ProductionWare {
  ware: string;
  amount: number;
}

export interface ProductionEffect {
  type: string;
  product: number;
}

export interface Production {
  time: number;
  amount: number;
  method: string;
  name: string;
  wares: ProductionWare[];
  effects?: ProductionEffect[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface License {
  type: string;
  name: string;
  icon?: string;
  price: number;
  /** Relation needed to buy the license, -1 .. 1 (see `relationToReputation`). */
  minRelation?: number;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  race: Race;
  icon: string;
  color?: string;
  licenses?: License[];
}

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
  description: string;
  explosionDamage?: number;
  hull: number;
  makerRace?: Race;
  price: Price;
  owners?: Faction[];
  production: Production[];
  product?: Ware[];
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

export interface Planet {
  name?: string;
  class?: string;
  geology?: string;
  atmosphere?: string;
  population?: string;
  maxPopulation?: number;
  settlements?: string;
  moons?: Planet[];
}

/** A star system (cluster) holding one or more sectors. Coordinates are in km. */
export interface Cluster {
  id: string;
  version: number;
  name: string;
  description?: string;
  x: number;
  z: number;
  environment?: string;
  suns: string[];
  planets: Planet[];
  sectors: string[];
}

export interface SectorResource {
  ware: string;
  size: string;
  yield: string;
  speed: string;
  /** Number of resource areas of this kind. */
  count: number;
  /** Amount held by one area. */
  yieldAmount: number;
  /** Minutes until a depleted area recovers. */
  respawnDelay: number;
  /** Area radius in meters. */
  radius: number;
}

export interface SectorLink {
  sector: string;
  type: 'gate' | 'accelerator';
  /** Position of the gate inside the sector, in km. */
  x: number;
  z: number;
}

/** Superhighway entry point inside a sector, in km. */
export interface HighwayLink {
  sector: string;
  x: number;
  z: number;
}

/** A claimable ship placed in the universe at game start. */
export interface AbandonedShip {
  ship: string;
  sector: string;
  version: number;
  /** Position inside the sector, in km. */
  x: number;
  y: number;
  z: number;
  /** Set when the ship only appears after a condition is met. */
  condition?: string;
}

export interface Sector {
  id: string;
  version: number;
  cluster: string;
  name: string;
  description?: string;
  /** Offset inside the cluster, in km. */
  x: number;
  z: number;
  /** Solar output multiplier, 1 = 100%. */
  sunlight?: number;
  economy?: number;
  security?: number;
  /** Faction owning the sector at game start (estimated from the stations placed there). */
  owner?: string;
  resources: SectorResource[];
  gates: SectorLink[];
  highways: string[];
  highwayLinks?: HighwayLink[];
}

/** Fixed station created at game start (shipyard, wharf, equipment dock, ...). */
export interface GodStation {
  id: string;
  type: 'shipyard' | 'wharf' | 'equipmentdock' | 'tradestation' | 'defence' | 'piratebase';
  owner?: string;
  sector: string;
  version: number;
  /** Position inside the sector in km, missing when the game picks a random spot. */
  x?: number;
  z?: number;
}
