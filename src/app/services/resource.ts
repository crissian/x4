import { StorageType } from './storage-type';

export class Resource {
  static readonly ice = new Resource(1, 'Ice', 26, 35, 6, StorageType.solid);
  static readonly ore = new Resource(2, 'Ore', 43, 68);
  static readonly silicon = new Resource(3, 'Silicon', 111, 150);
  static readonly hydrogen = new Resource(4, 'Hydrogen', 49, 67);
  static readonly methane = new Resource(5, 'Methane');
  static readonly helium = new Resource(6, 'Helium');

  static readonly energyCells = new Resource(7, 'Energy Cells');

  static readonly water = new Resource(8, 'Water');

  static readonly meat = new Resource(9, 'Meat');
  static readonly majaSnails = new Resource(10, 'Maja Snails');
  static readonly spices = new Resource(11, 'Spices');
  static readonly wheat = new Resource(12, 'Wheat');
  static readonly sojaBeans = new Resource(13, 'Soja Beans');
  static readonly sunriseFlowers = new Resource(14, 'Sunrise Flowers');
  static readonly swampPlant = new Resource(15, 'Swamp Plant');

  static readonly medicalSupplies = new Resource(16, 'Medical Supplies');
  static readonly foodRatios = new Resource(17, 'Food Ratios');
  static readonly sojaHusk = new Resource(18, 'Soja Husk');
  static readonly nostropOil = new Resource(19, 'Nostrop Oil');
  static readonly spaceFuel = new Resource(20, 'Space Fuel');
  static readonly spaceWeed = new Resource(21, 'Space Weed');
  static readonly majaDust = new Resource(22, 'Maja Dust');

  static readonly refinedMetal = new Resource(23, 'Refined Metals');
  static readonly siliconWafer = new Resource(24, 'Silicon Wafers');
  static readonly antimatterCell = new Resource(25, 'Antimatter Cells');
  static readonly graphene = new Resource(26, 'Graphene');
  static readonly superfluidCoolant = new Resource(27, 'Superfluid Coolant');

  static readonly microchip = new Resource(28, 'Microchips');
  static readonly scanningArray = new Resource(29, 'Scanning Array');
  static readonly hullPart = new Resource(30, 'Hull Parts');
  static readonly advancedComposite = new Resource(31, 'Advanced Composite');
  static readonly enginePart = new Resource(32, 'Engine Parts');
  static readonly plasmaConductor = new Resource(33, 'Plasma Conductors');
  static readonly quantumTube = new Resource(34, 'Quantum Tubes');

  static readonly advancedElectronics = new Resource(35, 'Advanced Electronics');
  static readonly antimatterConverter = new Resource(36, 'Antimatter Converters');
  static readonly claytronic = new Resource(37, 'Claytronic');
  static readonly droneComponent = new Resource(38, 'Drone Components');
  static readonly missileComponent = new Resource(39, 'Missile Components');
  static readonly shieldComponent = new Resource(40, 'Shield Components');
  static readonly turretComponent = new Resource(41, 'Turret Components');
  static readonly weaponComponent = new Resource(42, 'Weapon Components');
  static readonly smartChips = new Resource(43, 'Smart Chips');
  static readonly fieldCoils = new Resource(44, 'Field Coils');

  static readonly all = [
    Resource.ice,
    Resource.ore,
    Resource.silicon,
    Resource.hydrogen,
    Resource.methane,
    Resource.helium,
    Resource.energyCells,
    Resource.water,
    Resource.meat,
    Resource.majaSnails,
    Resource.spices,
    Resource.wheat,
    Resource.sojaBeans,
    Resource.sunriseFlowers,
    Resource.swampPlant,
    Resource.medicalSupplies,
    Resource.foodRatios,
    Resource.sojaHusk,
    Resource.nostropOil,
    Resource.spaceFuel,
    Resource.spaceWeed,
    Resource.majaDust,
    Resource.refinedMetal,
    Resource.siliconWafer,
    Resource.antimatterCell,
    Resource.graphene,
    Resource.superfluidCoolant,
    Resource.microchip,
    Resource.scanningArray,
    Resource.hullPart,
    Resource.advancedComposite,
    Resource.enginePart,
    Resource.plasmaConductor,
    Resource.quantumTube,
    Resource.advancedElectronics,
    Resource.antimatterConverter,
    Resource.claytronic,
    Resource.droneComponent,
    Resource.missileComponent,
    Resource.shieldComponent,
    Resource.turretComponent,
    Resource.weaponComponent,
    Resource.smartChips,
    Resource.fieldCoils
  ];

  constructor(public id: number, public name: string, public minPrice: number = null,
              public maxPrice: number = null, volume: number = null, storageType: StorageType = null) {
  }

  static get(id: number) {
    return Resource.all.find(x => x.id === id);
  }

  get averagePrice() {
    return Math.trunc(this.maxPrice - this.minPrice);
  }
}
