export interface Ware {
  name: string;
  minimalPrice: number;
  maximumPrice: number;
  averagePrice: number;
  volume: number;
  storageType: string;
}

export const WARES: Ware[] = [
  {
    'name': 'Advanced Composites',
    'minimalPrice': 735,
    'averagePrice': 865,
    'maximumPrice': 994,
    'volume': 32,
    'storageType': 'Container'
  },
  {
    'name': 'Advanced Electronics',
    'minimalPrice': 1986,
    'averagePrice': 2207,
    'maximumPrice': 2428,
    'volume': 30,
    'storageType': 'Container'
  },
  {
    'name': 'Antimatter Cells',
    'minimalPrice': 181,
    'averagePrice': 202,
    'maximumPrice': 222,
    'volume': 18,
    'storageType': 'Container'
  },
  {
    'name': 'Antimatter Converters',
    'minimalPrice': 626,
    'averagePrice': 737,
    'maximumPrice': 847,
    'volume': 10,
    'storageType': 'Container'
  },
  {
    'name': 'Claytronics',
    'minimalPrice': 4254,
    'averagePrice': 4478,
    'maximumPrice': 4702,
    'volume': 24,
    'storageType': 'Container'
  },
  {
    'name': 'Drone Components',
    'minimalPrice': 2261,
    'averagePrice': 2512,
    'maximumPrice': 2764,
    'volume': 30,
    'storageType': 'Container'
  },
  {
    'name': 'Energy Cells',
    'minimalPrice': 10,
    'averagePrice': 16,
    'maximumPrice': 21,
    'volume': 1,
    'storageType': 'Container'
  },
  {
    'name': 'Engine Parts',
    'minimalPrice': 480,
    'averagePrice': 600,
    'maximumPrice': 719,
    'volume': 30,
    'storageType': 'Container'
  },
  {
    'name': 'Field Coils',
    'minimalPrice': 854,
    'averagePrice': 1068,
    'maximumPrice': 1281,
    'volume': 15,
    'storageType': 'Container'
  },
  {
    'name': 'Food Rations',
    'minimalPrice': 34,
    'averagePrice': 43,
    'maximumPrice': 51,
    'volume': 1,
    'storageType': 'Container'
  },
  {
    'name': 'Graphene',
    'minimalPrice': 150,
    'averagePrice': 166,
    'maximumPrice': 183,
    'volume': 20,
    'storageType': 'Container'
  },
  {
    'name': 'Helium',
    'minimalPrice': 37,
    'averagePrice': 44,
    'maximumPrice': 51,
    'volume': 6,
    'storageType': 'Liquid'
  },
  {
    'name': 'Hull Parts',
    'minimalPrice': 413,
    'averagePrice': 516,
    'maximumPrice': 619,
    'volume': 25,
    'storageType': 'Container'
  },
  {
    'name': 'Hydrogen',
    'minimalPrice': 49,
    'averagePrice': 58,
    'maximumPrice': 67,
    'volume': 6,
    'storageType': 'Liquid'
  },
  {
    'name': 'Ice',
    'minimalPrice': 26,
    'averagePrice': 30,
    'maximumPrice': 35,
    'volume': 8,
    'storageType': 'Solid'
  },
  {
    'name': 'Maja Dust',
    'minimalPrice': 233,
    'averagePrice': 466,
    'maximumPrice': 700,
    'volume': 6,
    'storageType': 'Container'
  },
  {
    'name': 'Maja Snails',
    'minimalPrice': 76,
    'averagePrice': 95,
    'maximumPrice': 114,
    'volume': 6,
    'storageType': 'Container'
  },
  {
    'name': 'Meat',
    'minimalPrice': 57,
    'averagePrice': 75,
    'maximumPrice': 94,
    'volume': 6,
    'storageType': 'Container'
  },
  {
    'name': 'Medical Supplies',
    'minimalPrice': 92,
    'averagePrice': 115,
    'maximumPrice': 138,
    'volume': 2,
    'storageType': 'Container'
  },
  {
    'name': 'Methane',
    'minimalPrice': 41,
    'averagePrice': 48,
    'maximumPrice': 55,
    'volume': 6,
    'storageType': 'Liquid'
  },
  {
    'name': 'Microchips',
    'minimalPrice': 1364,
    'averagePrice': 1516,
    'maximumPrice': 1668,
    'volume': 22,
    'storageType': 'Container'
  },
  {
    'name': 'Missile Components',
    'minimalPrice': 16,
    'averagePrice': 20,
    'maximumPrice': 24,
    'volume': 8,
    'storageType': 'Container'
  },
  {
    'name': 'Nividium',
    'minimalPrice': 434,
    'averagePrice': 510,
    'maximumPrice': 587,
    'volume': 10,
    'storageType': 'Solid'
  },
  {
    'name': 'Nostrop Oil',
    'minimalPrice': 48,
    'averagePrice': 60,
    'maximumPrice': 72,
    'volume': 1,
    'storageType': 'Container'
  },
  {
    'name': 'Ore',
    'minimalPrice': 43,
    'averagePrice': 50,
    'maximumPrice': 58,
    'volume': 10,
    'storageType': 'Solid'
  },
  {
    'name': 'Plasma Conductors',
    'minimalPrice': 1485,
    'averagePrice': 1748,
    'maximumPrice': 2010,
    'volume': 32,
    'storageType': 'Container'
  },
  {
    'name': 'Quantum Tubes',
    'minimalPrice': 435,
    'averagePrice': 511,
    'maximumPrice': 588,
    'volume': 22,
    'storageType': 'Container'
  },
  {
    'name': 'Refined Metals',
    'minimalPrice': 133,
    'averagePrice': 148,
    'maximumPrice': 163,
    'volume': 14,
    'storageType': 'Container'
  },
  {
    'name': 'Scanning Arrays',
    'minimalPrice': 1744,
    'averagePrice': 1938,
    'maximumPrice': 2131,
    'volume': 38,
    'storageType': 'Container'
  },
  {
    'name': 'Shield Components',
    'minimalPrice': 387,
    'averagePrice': 484,
    'maximumPrice': 581,
    'volume': 10,
    'storageType': 'Container'
  },
  {
    'name': 'Silicon',
    'minimalPrice': 111,
    'averagePrice': 130,
    'maximumPrice': 150,
    'volume': 10,
    'storageType': 'Solid'
  },
  {
    'name': 'Silicon Wafers',
    'minimalPrice': 269,
    'averagePrice': 299,
    'maximumPrice': 329,
    'volume': 18,
    'storageType': 'Container'
  },
  {
    'name': 'Smart Chips',
    'minimalPrice': 176,
    'averagePrice': 195,
    'maximumPrice': 215,
    'volume': 30,
    'storageType': 'Container'
  },
  {
    'name': 'Soja Beans',
    'minimalPrice': 88,
    'averagePrice': 110,
    'maximumPrice': 132,
    'volume': 5,
    'storageType': 'Container'
  },
  {
    'name': 'Soja Husk',
    'minimalPrice': 50,
    'averagePrice': 66,
    'maximumPrice': 83,
    'volume': 1,
    'storageType': 'Container'
  },
  {
    'name': 'Space Fuel',
    'minimalPrice': 106,
    'averagePrice': 213,
    'maximumPrice': 319,
    'volume': 2,
    'storageType': 'Container'
  },
  {
    'name': 'Space Weed',
    'minimalPrice': 176,
    'averagePrice': 352,
    'maximumPrice': 529,
    'volume': 3,
    'storageType': 'Container'
  },
  {
    'name': 'Spices',
    'minimalPrice': 30,
    'averagePrice': 38,
    'maximumPrice': 46,
    'volume': 3,
    'storageType': 'Container'
  },
  {
    'name': 'Sunrise Flowers',
    'minimalPrice': 105,
    'averagePrice': 132,
    'maximumPrice': 158,
    'volume': 5,
    'storageType': 'Container'
  },
  {
    'name': 'Superfluid Coolant',
    'minimalPrice': 135,
    'averagePrice': 150,
    'maximumPrice': 165,
    'volume': 16,
    'storageType': 'Container'
  },
  {
    'name': 'Swamp Plant',
    'minimalPrice': 104,
    'averagePrice': 138,
    'maximumPrice': 173,
    'volume': 6,
    'storageType': 'Container'
  },
  {
    'name': 'Teladianium',
    'minimalPrice': 182,
    'averagePrice': 202,
    'maximumPrice': 223,
    'volume': 16,
    'storageType': 'Container'
  },
  {
    'name': 'Turret Components',
    'minimalPrice': 609,
    'averagePrice': 761,
    'maximumPrice': 913,
    'volume': 20,
    'storageType': 'Container'
  },
  {
    'name': 'Water',
    'minimalPrice': 48,
    'averagePrice': 53,
    'maximumPrice': 58,
    'volume': 6,
    'storageType': 'Container'
  },
  {
    'name': 'Weapon Components',
    'minimalPrice': 586,
    'averagePrice': 733,
    'maximumPrice': 879,
    'volume': 20,
    'storageType': 'Container'
  },
  {
    'name': 'Wheat',
    'minimalPrice': 37,
    'averagePrice': 49,
    'maximumPrice': 61,
    'volume': 4,
    'storageType': 'Container'
  }
];
