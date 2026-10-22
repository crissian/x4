import { GameText } from '../../../core/game-text';
const entities = {
  agricultural: {
      id: 'agricultural',
      name: 'Agricultural Goods',
      factoryName: 'Agricultural Goods Factory',
      icon: 'be_upgrade_agricultural',
      priority: 5,
      tier: 5,
  },
  energy: {
      id: 'energy',
      name: 'Energy',
      factoryName: 'Energy Complex',
      icon: 'be_upgrade_energy',
      priority: 1,
      tier: 1,
  },
  food: {
      id: 'food',
      name: 'Food',
      factoryName: 'Farm',
      icon: 'be_upgrade_food',
      priority: 6,
      tier: 6,
  },
  gases: {
      id: 'gases',
      name: 'Gases',
      factoryName: 'Gas Refinery',
      icon: 'be_upgrade_refined',
      priority: 3,
  },
  hightech: {
      id: 'hightech',
      name: 'High Tech Goods',
      factoryName: 'High Tech Factory',
      icon: 'be_upgrade_hightech',
      priority: 11,
      tier: 3,
  },
  ice: {
      id: 'ice',
      name: 'Ice',
      factoryName: 'Ice Refinery',
      icon: 'be_upgrade_water',
      priority: 2,
  },
  minerals: {
      id: 'minerals',
      name: 'Minerals',
      factoryName: 'Mineral Refinery',
      icon: 'be_upgrade_refined',
      priority: 9,
  },
  pharmaceutical: {
      id: 'pharmaceutical',
      name: 'Pharmaceutical Goods',
      factoryName: 'Pharmaceutical Goods Factory',
      icon: 'be_upgrade_pharmaceutical',
      priority: 7,
      tier: 7,
  },
  refined: {
      id: 'refined',
      name: 'Refined Goods',
      factoryName: 'Refined Goods Complex',
      icon: 'be_upgrade_refined',
      priority: 8,
      tier: 2,
  },
  shiptech: {
      id: 'shiptech',
      name: 'Ship Technology',
      factoryName: 'Ship Technology Factory',
      icon: 'be_upgrade_shiptech',
      priority: 10,
      tier: 4,
  },
  water: {
      id: 'water',
      name: 'Water',
      factoryName: 'Water Refinery',
      icon: 'be_upgrade_water',
      priority: 4,
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

GameText.translate(WareGroups);
