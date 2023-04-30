import { Races } from './race-data';
import { Wares } from './wares-data';

export const Workers = {
    argon: {
        race: Races.argon,
        amount: 200,
        consumption: [
            { ware: Wares.foodrations, amount: 450 },
            { ware: Wares.medicalsupplies, amount: 270 }
        ]
    },
    teladi: {
        race: Races.teladi,
        amount: 200,
        consumption: [
            { ware: Wares.nostropoil, amount: 228 },
            { ware: Wares.medicalsupplies, amount: 270 }
        ]
    },
    paranid: {
        race: Races.paranid,
        amount: 200,
        consumption: [
            { ware: Wares.sojahusk, amount: 288 },
            { ware: Wares.medicalsupplies, amount: 270 }
        ]
    },
    split: {
        race: Races.split,
        amount: 200,
        consumption: [
            { ware: Wares.cheltmeat, amount: 102 },
            { ware: Wares.scruffinfruits, amount: 138 },
            { ware: Wares.medicalsupplies, amount: 270 }
        ]
    },
    terran: {
        race: Races.terran,
        amount: 200,
        consumption: [
            { ware: Wares.terranmre, amount: 258 },
            { ware: Wares.medicalsupplies, amount: 270 }
        ]
    },
    boron: {
        race: Races.boron,
        amount: 200,
        consumption: [
            { ware: Wares.bofu, amount: 90 },
            { ware: Wares.medicalsupplies, amount: 198 },
            { ware: Wares.water, amount: 162 }
        ]
    },
    get(method: string) {
        return Workers[method] || Workers.argon;
    }
};
