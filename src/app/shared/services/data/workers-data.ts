import { Races } from './race-data';
import { Wares } from './wares-data';

export const Workers = {
  argon: {
    race: Races.argon,
    amount: 400,
    consumption: [
      { ware: Wares.foodrations, amount: 450 },
      { ware: Wares.medicalsupplies, amount: 270 }
    ]
  },
  teladi: {
    race: Races.teladi,
    amount: 400,
    consumption: [
      { ware: Wares.nostropoil, amount: 228 },
      { ware: Wares.medicalsupplies, amount: 270 }
    ]
  },
  paranid: {
    race: Races.paranid,
    amount: 400,
    consumption: [
      { ware: Wares.sojahusk, amount: 286 },
      { ware: Wares.medicalsupplies, amount: 270 }
    ]
  },
   split: {
      race: Races.split,
      amount: 400,
      consumption: [
         { ware: Wares.cheltmeat, amount: 100 },
         { ware: Wares.scruffinfruits, amount: 140 },
         { ware: Wares.medicalsupplies, amount: 270 }
      ]
   },

  get(method: string) {
    return Workers[method] || Workers.argon;
  }
};
