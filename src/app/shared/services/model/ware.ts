import type { Faction } from './faction';

export interface WareGroup {
  id: string;
  name: string;
  factoryName: string;
  icon: string;
  priority: number;
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
