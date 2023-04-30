const entities = {
  agricultural: {
    id: 'agricultural',
    name: 'Agricultural Goods',
    factoryName: 'Agricultural Goods Factory',
    icon: 'be_upgrade_agricultural',
    tier: 5,
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    factoryName: 'Energy Complex',
    icon: 'be_upgrade_energy',
    tier: 1,
  },
  food: {
    id: 'food',
    name: 'Food',
    factoryName: 'Farm',
    icon: 'be_upgrade_food',
    tier: 6,
  },
  gases: {
    id: 'gases',
    name: 'Gases',
    factoryName: 'Gas Refinery',
    icon: 'be_upgrade_refined',
  },
  hightech: {
    id: 'hightech',
    name: 'High Tech Goods',
    factoryName: 'High Tech Factory',
    icon: 'be_upgrade_hightech',
    tier: 3,
  },
  ice: {
    id: 'ice',
    name: 'Ice',
    factoryName: 'Ice Refinery',
    icon: 'be_upgrade_water',
  },
  minerals: {
    id: 'minerals',
    name: 'Minerals',
    factoryName: 'Mineral Refinery',
    icon: 'be_upgrade_refined',
  },
  pharmaceutical: {
    id: 'pharmaceutical',
    name: 'Pharmaceutical Goods',
    factoryName: 'Pharmaceutical Goods Factory',
    icon: 'be_upgrade_pharmaceutical',
    tier: 7,
  },
  refined: {
    id: 'refined',
    name: 'Refined Goods',
    factoryName: 'Refined Goods Complex',
    icon: 'be_upgrade_refined',
    tier: 2,
  },
  shiptech: {
    id: 'shiptech',
    name: 'Ship Technology',
    factoryName: 'Ship Technology Factory',
    icon: 'be_upgrade_shiptech',
    tier: 4,
  },
  water: {
    id: 'water',
    name: 'Water',
    factoryName: 'Water Refinery',
    icon: 'be_upgrade_water',
    tier: 2,
  },
};

export const WareGroups = {
  ...entities,
  all: [
    entities.agricultural,
    entities.energy,
    entities.food,
    entities.gases,
    entities.hightech,
    entities.ice,
    entities.minerals,
    entities.pharmaceutical,
    entities.refined,
    entities.shiptech,
    entities.water,
  ]
};
