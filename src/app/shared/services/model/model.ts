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
  licenses?: License[];
}

export interface ModuleType {
  id: string;
  name: string;
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
  description: string;
  explosionDamage?: number;
  hull: number;
  makerRace?: Race;
  price: Price;
  owners?: Faction[];
  production: Production[];
  product?: Ware;
  type: ModuleType;
  cargo?: Cargo;
  workForce?: {
    max?: number;
    capacity?: number;
    race?: Race;
  };
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

export interface Ship {
  id: string;
  name: string;
  description: string;
  explosionDamage?: number;
  hull: number;
  race?: Race;
  price: Price;
  owners?: Faction[];
  production: Production[];
  storage?: ShipStorage;
  people?: number;
  purpose: string;
  thruster?: string;
  type: string;
}
