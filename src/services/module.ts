import { Resource } from './resource';

export interface ResourceAmount {
  value: number;
  resource: Resource;
}

export interface ModuleDefinition {
  id: number;
  name: string;

  requirements: ResourceAmount[];
  production?: ResourceAmount;
}

export class Module {
  public static energyCell: ModuleDefinition = {
    id: 1,
    name: 'Energy Cell Production',
    production: { resource: Resource.energyCells, value: 12000 },
    requirements: []
  };

  static water: ModuleDefinition = {
    id: 2,
    name: 'Water Production',
    requirements: [
      { resource: Resource.energyCells, value: 1800 },
      { resource: Resource.ice, value: 9600 }
    ],
    production: { resource: Resource.water, value: 6600 }
  };

  static meat: ModuleDefinition = {
    id: 3,
    name: 'Meat Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.meat, value: 1760 }
  };

  static majaSnail: ModuleDefinition = {
    id: 4,
    name: 'Maja Snails Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.majaSnails, value: 1392 }
  };

  static spices: ModuleDefinition = {
    id: 5,
    name: 'Spices Production',
    requirements: [
      { resource: Resource.energyCells, value: 240 },
      { resource: Resource.water, value: 480 }
    ],
    production: { resource: Resource.spices, value: 2880 }
  };

  static wheat: ModuleDefinition = {
    id: 6,
    name: 'Wheat Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.wheat, value: 3240 }
  };

  static sojaBeans: ModuleDefinition = {
    id: 7,
    name: 'Soja Beans Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.sojaBeans, value: 1440 }
  };

  static sunriseFlowers: ModuleDefinition = {
    id: 8,
    name: 'Sunrise Flowers Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.water, value: 960 }
    ],
    production: { resource: Resource.sunriseFlowers, value: 1200 }
  };

  static swampPlant: ModuleDefinition = {
    id: 9,
    name: 'Swamp Plant Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.water, value: 800 }
    ],
    production: { resource: Resource.swampPlant, value: 960 }
  };

  static medicalSuppliesArgon: ModuleDefinition = {
    id: 10,
    name: 'Medical Supplies Production (Argon)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.wheat, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static medicalSuppliesTeladi: ModuleDefinition = {
    id: 11,
    name: 'Medical Supplies Production (Teladi)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.sunriseFlowers, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static medicalSuppliesParanid: ModuleDefinition = {
    id: 12,
    name: 'Medical Supplies Production (Paranid)',
    requirements: [
      { resource: Resource.energyCells, value: 480 },
      { resource: Resource.water, value: 720 },
      { resource: Resource.sojaHusk, value: 264 },
    ],
    production: { resource: Resource.medicalSupplies, value: 1440 }
  };

  static foodRatios: ModuleDefinition = {
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

  static sojaHusk: ModuleDefinition = {
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

  static nostropOil: ModuleDefinition = {
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

  static spaceFuel: ModuleDefinition = {
    id: 16,
    name: 'Space Fuel Production',
    requirements: [
      { resource: Resource.energyCells, value: 300 },
      { resource: Resource.wheat, value: 600 }
    ],
    production: { resource: Resource.spaceFuel, value: 900 }
  };

  static spaceWeed: ModuleDefinition = {
    id: 16,
    name: 'Space Weed Production',
    requirements: [
      { resource: Resource.energyCells, value: 840 },
      { resource: Resource.swampPlant, value: 720 },
      { resource: Resource.spices, value: 240 }
    ],
    production: { resource: Resource.spaceWeed, value: 1350 }
  };

  static majaDust: ModuleDefinition = {
    id: 17,
    name: 'Maja Dust Production',
    requirements: [
      { resource: Resource.energyCells, value: 240 },
      { resource: Resource.majaSnails, value: 720 },
      { resource: Resource.spices, value: 360 },
    ],
    production: { resource: Resource.majaDust, value: 480 }
  };

  static refinedMetal: ModuleDefinition = {
    id: 18,
    name: 'Refined Metal Production',
    requirements: [
      { resource: Resource.energyCells, value: 2160 },
      { resource: Resource.ore, value: 5760 }
    ],
    production: { resource: Resource.refinedMetal, value: 2400 }
  };

  static siliconWaferMetal: ModuleDefinition = {
    id: 19,
    name: 'Silicon Wafer Production',
    requirements: [
      { resource: Resource.energyCells, value: 1350 },
      { resource: Resource.silicon, value: 4800 }
    ],
    production: { resource: Resource.siliconWafer, value: 2400 }
  };

  static antimatterCell: ModuleDefinition = {
    id: 20,
    name: 'Antimatter Cell Production',
    requirements: [
      { resource: Resource.energyCells, value: 1800 },
      { resource: Resource.hydrogen, value: 9600 }
    ],
    production: { resource: Resource.antimatterCell, value: 3300 }
  };

  static graphene: ModuleDefinition = {
    id: 21,
    name: 'Graphene Production',
    requirements: [
      { resource: Resource.energyCells, value: 3000 },
      { resource: Resource.methane, value: 4800 }
    ],
    production: { resource: Resource.graphene, value: 1650 }
  };

  static superfluidCoolant: ModuleDefinition = {
    id: 22,
    name: 'Superfluid Coolant Production',
    requirements: [
      { resource: Resource.energyCells, value: 1200 },
      { resource: Resource.helium, value: 4800 }
    ],
    production: { resource: Resource.superfluidCoolant, value: 1650 }
  };

  static microchip: ModuleDefinition = {
    id: 23,
    name: 'Microchip Production',
    requirements: [
      { resource: Resource.energyCells, value: 300 },
      { resource: Resource.siliconWafer, value: 1200 }
    ],
    production: { resource: Resource.microchip, value: 475 }
  };

  static scanningArray: ModuleDefinition = {
    id: 24,
    name: 'Scanning Array Production',
    requirements: [
      { resource: Resource.energyCells, value: 360 },
      { resource: Resource.refinedMetal, value: 600 },
      { resource: Resource.siliconWafer, value: 360 }
    ],
    production: { resource: Resource.scanningArray, value: 240 }
  };

  static hullPart: ModuleDefinition = {
    id: 25,
    name: 'Hull Part Production',
    requirements: [
      { resource: Resource.energyCells, value: 320 },
      { resource: Resource.refinedMetal, value: 1120 },
      { resource: Resource.graphene, value: 160 }
    ],
    production: { resource: Resource.hullPart, value: 880 }
  };

  static advancedComposite: ModuleDefinition = {
    id: 26,
    name: 'Advanced Composite Production',
    requirements: [
      { resource: Resource.energyCells, value: 600 },
      { resource: Resource.refinedMetal, value: 960 },
      { resource: Resource.graphene, value: 960 }
    ],
    production: { resource: Resource.advancedComposite, value: 720 }
  };

  static enginePart: ModuleDefinition = {
    id: 27,
    name: 'Engine Part Production',
    requirements: [
      { resource: Resource.energyCells, value: 240 },
      { resource: Resource.refinedMetal, value: 384 },
      { resource: Resource.antimatterCell, value: 320 }
    ],
    production: { resource: Resource.enginePart, value: 480 }
  };

  static plasmaConductor: ModuleDefinition = {
    id: 28,
    name: 'Plasma Conductor Production',
    requirements: [
      { resource: Resource.energyCells, value: 240 },
      { resource: Resource.graphene, value: 384 },
      { resource: Resource.superfluidCoolant, value: 560 }
    ],
    production: { resource: Resource.plasmaConductor, value: 200 }
  };

  static quantumTube: ModuleDefinition = {
    id: 29,
    name: 'Quantum Tube Production',
    requirements: [
      { resource: Resource.energyCells, value: 200 },
      { resource: Resource.graphene, value: 580 },
      { resource: Resource.superfluidCoolant, value: 150 }
    ],
    production: { resource: Resource.quantumTube, value: 550 }
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
    Module.nostropOil,
    Module.spaceFuel,
    Module.spaceWeed,
    Module.majaDust,
    Module.refinedMetal,
    Module.siliconWaferMetal,
    Module.antimatterCell,
    Module.graphene,
    Module.superfluidCoolant,
    Module.microchip,
    Module.scanningArray,
    Module.hullPart,
    Module.advancedComposite,
    Module.enginePart,
    Module.plasmaConductor,
    Module.quantumTube
  ];

  static basicResources = [
    Module.energyCell
  ];

  static basicFood = [
    Module.water,
    Module.meat,
    Module.majaSnail,
    Module.spices,
    Module.wheat,
    Module.sojaBeans,
    Module.sunriseFlowers,
    Module.swampPlant
  ];

  static finalFood = [
    Module.medicalSuppliesArgon,
    Module.medicalSuppliesTeladi,
    Module.medicalSuppliesParanid,
    Module.foodRatios,
    Module.sojaHusk,
    Module.nostropOil
  ];

  static illegal = [
    Module.spaceFuel,
    Module.spaceWeed,
    Module.majaDust
  ];

  static basicIntermediate = [
    Module.refinedMetal,
    Module.siliconWaferMetal,
    Module.antimatterCell,
    Module.graphene,
    Module.superfluidCoolant
  ];

  static intermediateGoods = [
    Module.microchip,
    Module.scanningArray,
    Module.hullPart,
    Module.advancedComposite,
    Module.enginePart,
    Module.plasmaConductor,
    Module.quantumTube
  ];

  public static get(id: number) {
    return Module.all.find(x => x.id == id);
  }
}
