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
}

export interface Dock {
  capacity: number;
  size: string;
}

export interface Slot {
  group?: string;
  size: string;
  hittable: boolean;
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
}
