import { Resource } from './resource';

export interface ResourceAmount {
  value: number;
  resource: Resource;
}

export interface IModuleDefinition {
  id: number;
  name: string;

  requirements: ResourceAmount[];
  production?: ResourceAmount;
}

export class Module {
  public static energyCell: IModuleDefinition = {
    id: 1,
    name: 'Energy Cell Production',
    production: { resource: Resource.energyCells, value: 12000 },
    requirements: []
  };

  static water: IModuleDefinition = {
    id: 2,
    name: 'Water Production',
    requirements: [
      { resource: Resource.energyCells, value: 1800 },
      { resource: Resource.ice, value: 9600 }
    ],
    production: { resource: Resource.water, value: 6600 }
  };

  static meat: IModuleDefinition = {
    id: 3,
    name: 'Meat Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.meat, value: 1760 }
  };

  static majaSnail: IModuleDefinition = {
    id: 4,
    name: 'Maja Snails Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.majaSnails, value: 1392 }
  };

  static spices: IModuleDefinition = {
    id: 5,
    name: 'Spices Production',
    requirements: [
      { resource: Resource.energyCells, value: 240 },
      { resource: Resource.water, value: 480 }
    ],
    production: { resource: Resource.spices, value: 2880 }
  };

  static wheat: IModuleDefinition = {
    id: 6,
    name: 'Wheat Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.wheat, value: 3240 }
  };

  static sojaBeans: IModuleDefinition = {
    id: 7,
    name: 'Soja Beans Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.sojaBeans, value: 1440 }
  };

  static sunriseFlowers: IModuleDefinition = {
    id: 8,
    name: 'Sunrise Flowers Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.sunriseFlowers, value: 1200 }
  };

  static swampPlant: IModuleDefinition = {
    id: 9,
    name: 'Swamp Plant Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.swampPlant, value: 960 }
  };

  static medicalSuppliesArgon: IModuleDefinition = {
    id: 10,
    name: 'Medical Supplies Production (Argon)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.wheat, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static medicalSuppliesTeladi: IModuleDefinition = {
    id: 11,
    name: 'Medical Supplies Production (Teladi)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.sunriseFlowers, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static medicalSuppliesParanid: IModuleDefinition = {
    id: 12,
    name: 'Medical Supplies Production (Paranid)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.sojaHusk, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static foodRatios: IModuleDefinition = {
    id: 13,
    name: 'Food Ratios Production',
    requirements: [
      { resource: Resource.energyCells, value: 600 },
      { resource: Resource.meat, value: 600 },
      { resource: Resource.spices, value: 300 },
      { resource: Resource.wheat, value: 600 },
    ],
    production: { resource: Resource.foodRatios, value: 4920 }
  };

  static sojaHusk: IModuleDefinition = {
    id: 14,
    name: 'Soja Husk Production',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.majaSnails, value: 480 },
      { resource: Resource.spices, value: 240 },
      { resource: Resource.sojaBeans, value: 480 },
    ],
    production: { resource: Resource.sojaHusk, value: 3884 }
  };

  static nostropOil: IModuleDefinition = {
    id: 15,
    name: 'Nostrop Oil Production',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 480 },
      { resource: Resource.spices, value: 240 },
      { resource: Resource.sunriseFlowers, value: 480 },
    ],
    production: { resource: Resource.nostropOil, value: 3884 }
  };

  static all = [
    Module.energyCell,
    Module.water,
    Module.meat,
    Module.majaSnail,
    Module.spices,
    Module.wheat,
    Module.sojaBeans,
    Module.sunriseFlowers,
    Module.swampPlant,
    Module.medicalSuppliesArgon,
    Module.medicalSuppliesTeladi,
    Module.medicalSuppliesParanid,
    Module.foodRatios,
    Module.sojaHusk,
    Module.nostropOil
  ];

  public static get(id: number) {
    return Module.all.find(x => x.id == id);
  }
}
