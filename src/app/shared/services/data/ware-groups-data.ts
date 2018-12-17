const entities = {
  agricultural: {
    id: 'agricultural',
    name: 'Agricultural Goods',
    factoryName: 'Agricultural Goods Factory',
    icon: 'be_upgrade_bio',
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    factoryName: 'Energy Complex',
    icon: 'be_upgrade_resource',
  },
  food: {
    id: 'food',
    name: 'Food',
    factoryName: 'Farm',
    icon: 'be_upgrade_food',
  },
  gases: {
    id: 'gases',
    name: 'Gases',
    factoryName: 'Gas Refinery',
    icon: 'be_upgrade_resource',
  },
  hightech: {
    id: 'hightech',
    name: 'High Tech Goods',
    factoryName: 'High Tech Factory',
    icon: 'be_upgrade_tech',
  },
  ice: {
    id: 'ice',
    name: 'Ice',
    factoryName: 'Ice Refinery',
    icon: 'be_upgrade_resource',
  },
  minerals: {
    id: 'minerals',
    name: 'Minerals',
    factoryName: 'Mineral Refinery',
    icon: 'be_upgrade_resource',
  },
  pharmaceutical: {
    id: 'pharmaceutical',
    name: 'Pharmaceutical Goods',
    factoryName: 'Pharmaceutical Goods Factory',
    icon: 'be_upgrade_pharma',
  },
  refined: {
    id: 'refined',
    name: 'Refined Goods',
    factoryName: 'Refined Goods Complex',
    icon: 'be_upgrade_refined',
  },
  water: {
    id: 'water',
    name: 'Water',
    factoryName: 'Water Refinery',
    icon: 'be_upgrade_refined',
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
    entities.water,
  ]
};
