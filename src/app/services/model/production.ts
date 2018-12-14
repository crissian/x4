import { ProductionWare } from './production-ware';
import { ProductionEffect } from './production-effect';

export class Production {
  time: number;
  amount: number;
  method: string;
  name: string;

  wares: ProductionWare[];
  effects: ProductionEffect[];
}
