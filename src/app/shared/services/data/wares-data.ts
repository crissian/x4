import { GameText } from '../../../core/game-text';
/* tslint:disable:max-line-length */
import { WareGroups } from './ware-groups-data';
import { TransportType } from './transport-data';
import { Effects } from './effects-data';
import { Factions } from './factions-data';

export const Wares = {
 advancedcomposites: {
   id: 'advancedcomposites',
	  version: 0,
   name: 'Advanced Composites',
   factoryName: 'Advanced Composite Factory',
   icon: 'ware_advancedcomposites',
   volume: 32,
   transport: TransportType.container,
   price: { min: 432, max: 648, avg: 540 },
   group: WareGroups.hightech,
   production: [
     {
       time: 300,
       amount: 54,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'graphene', amount: 80 },
         { ware: 'refinedmetals', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.34 },
       ],
     },
     {
       time: 300,
       amount: 54,
       method: 'teladi',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'graphene', amount: 80 },
         { ware: 'teladianium', amount: 58 },
       ],
       effects: [
         { type: Effects.work, product: 0.34 },
       ],
     },
   ]
  },
 advancedelectronics: {
   id: 'advancedelectronics',
	  version: 0,
   name: 'Advanced Electronics',
   factoryName: 'Advanced Electronics Factory',
   icon: 'ware_advancedelectronics',
   volume: 30,
   transport: TransportType.container,
   price: { min: 710, max: 1318, avg: 1014 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 720,
       amount: 54,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'microchips', amount: 44 },
         { ware: 'quantumtubes', amount: 20 },
       ],
       effects: [
         { type: Effects.work, product: 0.36 },
       ],
     },
   ]
  },
 antimattercells: {
   id: 'antimattercells',
	  version: 0,
   name: 'Antimatter Cells',
   factoryName: 'Antimatter Cell Factory',
   icon: 'ware_antimattercells',
   volume: 18,
   transport: TransportType.container,
   price: { min: 121, max: 282, avg: 202 },
   group: WareGroups.refined,
   production: [
     {
       time: 120,
       amount: 99,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'hydrogen', amount: 320 },
       ],
       effects: [
         { type: Effects.work, product: 0.35 },
       ],
     },
   ]
  },
 antimatterconverters: {
   id: 'antimatterconverters',
	  version: 0,
   name: 'Antimatter Converters',
   factoryName: 'Antimatter Converter Factory',
   icon: 'ware_antimatterconverters',
   volume: 10,
   transport: TransportType.container,
   price: { min: 248, max: 461, avg: 354 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 300,
       amount: 133,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'advancedcomposites', amount: 20 },
         { ware: 'energycells', amount: 80 },
         { ware: 'microchips', amount: 30 },
       ],
       effects: [
         { type: Effects.work, product: 0.39 },
       ],
     },
   ]
  },
 claytronics: {
   id: 'claytronics',
	  version: 0,
   name: 'Claytronics',
   factoryName: 'Claytronics Factory',
   icon: 'ware_claytronics',
   volume: 24,
   transport: TransportType.container,
   price: { min: 1734, max: 2346, avg: 2040 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 900,
       amount: 108,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'antimattercells', amount: 100 },
         { ware: 'energycells', amount: 140 },
         { ware: 'microchips', amount: 160 },
         { ware: 'quantumtubes', amount: 100 },
       ],
       effects: [
         { type: Effects.work, product: 0.34 },
       ],
     },
     {
       time: 300,
       amount: 60,
       method: 'recycling',
       name: 'Recycling',
       wares: [
         { ware: 'energycells', amount: 12000 },
         { ware: 'scrapmetal', amount: 300 },
       ],
       effects: [
         { type: Effects.work, product: 0.34 },
       ],
     },
   ]
  },
 dronecomponents: {
   id: 'dronecomponents',
	  version: 0,
   name: 'Drone Components',
   factoryName: 'Drone Component Factory',
   icon: 'ware_dronecomponents',
   volume: 30,
   transport: TransportType.container,
   price: { min: 685, max: 1142, avg: 914 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 1200,
       amount: 105,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'engineparts', amount: 20 },
         { ware: 'hullparts', amount: 20 },
         { ware: 'microchips', amount: 20 },
         { ware: 'scanningarrays', amount: 40 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 energycells: {
   id: 'energycells',
	  version: 0,
   name: 'Energy Cells',
   factoryName: 'Solar Power Plant',
   icon: 'ware_energycells',
   volume: 1,
   transport: TransportType.container,
   price: { min: 10, max: 22, avg: 16 },
   group: WareGroups.energy,
   production: [
     {
       time: 60,
       amount: 175,
       method: 'default',
       name: 'Universal',
       wares: [
       ],
       effects: [
         { type: Effects.sunlight, product: 1 },
         { type: Effects.work, product: 0.43 },
       ],
     },
     {
       time: 60,
       amount: 50,
       method: 'terran',
       name: 'Terran',
       wares: [
       ],
       effects: [
         { type: Effects.sunlight, product: 1 },
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 engineparts: {
   id: 'engineparts',
	  version: 0,
   name: 'Engine Parts',
   factoryName: 'Engine Part Factory',
   icon: 'ware_engineparts',
   volume: 15,
   transport: TransportType.container,
   price: { min: 128, max: 237, avg: 182 },
   group: WareGroups.hightech,
   production: [
     {
       time: 900,
       amount: 208,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'antimattercells', amount: 80 },
         { ware: 'energycells', amount: 60 },
         { ware: 'refinedmetals', amount: 96 },
       ],
       effects: [
         { type: Effects.work, product: 0.47 },
       ],
     },
     {
       time: 900,
       amount: 208,
       method: 'teladi',
       name: 'Teladi',
       wares: [
         { ware: 'antimattercells', amount: 80 },
         { ware: 'energycells', amount: 60 },
         { ware: 'teladianium', amount: 70 },
       ],
       effects: [
         { type: Effects.work, product: 0.47 },
       ],
     },
   ]
  },
 fieldcoils: {
   id: 'fieldcoils',
	  version: 0,
   name: 'Field Coils',
   factoryName: 'Field Coil Factory',
   icon: 'ware_fieldcoils',
   volume: 15,
   transport: TransportType.container,
   price: { min: 247, max: 576, avg: 412 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 600,
       amount: 175,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'plasmaconductors', amount: 40 },
         { ware: 'quantumtubes', amount: 43 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 foodrations: {
   id: 'foodrations',
	  version: 0,
   name: 'Food Rations',
   factoryName: 'Food Ration Factory',
   icon: 'ware_foodrations',
   volume: 1,
   transport: TransportType.container,
   illegal: [ Factions.loanshark ],
   price: { min: 12, max: 29, avg: 21 },
   group: WareGroups.food,
   production: [
     {
       time: 240,
       amount: 460,
       method: 'default',
       name: 'Argon',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'meat', amount: 40 },
         { ware: 'spices', amount: 40 },
         { ware: 'wheat', amount: 40 },
       ],
       effects: [
         { type: Effects.work, product: 0.35 },
       ],
     },
   ]
  },
 graphene: {
   id: 'graphene',
	  version: 0,
   name: 'Graphene',
   factoryName: 'Graphene Refinery',
   icon: 'ware_graphene',
   volume: 20,
   transport: TransportType.container,
   price: { min: 100, max: 233, avg: 166 },
   group: WareGroups.refined,
   production: [
     {
       time: 240,
       amount: 96,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'methane', amount: 320 },
       ],
       effects: [
         { type: Effects.work, product: 0.46 },
       ],
     },
   ]
  },
 helium: {
   id: 'helium',
	  version: 0,
   name: 'Helium',
   factoryName: 'Helium Extractor',
   icon: 'ware_helium',
   volume: 6,
   transport: TransportType.liquid,
   price: { min: 37, max: 51, avg: 44 },
   group: WareGroups.gases,
   production: [
   ]
  },
 hullparts: {
   id: 'hullparts',
	  version: 0,
   name: 'Hull Parts',
   factoryName: 'Hull Part Factory',
   icon: 'ware_hullparts',
   volume: 12,
   transport: TransportType.container,
   price: { min: 146, max: 272, avg: 209 },
   group: WareGroups.hightech,
   production: [
     {
       time: 900,
       amount: 294,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'graphene', amount: 40 },
         { ware: 'refinedmetals', amount: 280 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
     {
       time: 300,
       amount: 200,
       method: 'recycling',
       name: 'Recycling',
       wares: [
         { ware: 'energycells', amount: 3500 },
         { ware: 'scrapmetal', amount: 75 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
     {
       time: 900,
       amount: 294,
       method: 'teladi',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'graphene', amount: 40 },
         { ware: 'teladianium', amount: 204 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
   ]
  },
 hydrogen: {
   id: 'hydrogen',
	  version: 0,
   name: 'Hydrogen',
   factoryName: 'Hydrogen Extractor',
   icon: 'ware_hydrogen',
   volume: 6,
   transport: TransportType.liquid,
   price: { min: 49, max: 67, avg: 58 },
   group: WareGroups.gases,
   production: [
   ]
  },
 ice: {
   id: 'ice',
	  version: 0,
   name: 'Ice',
   factoryName: 'Ice Mine',
   icon: 'ware_ice',
   volume: 8,
   transport: TransportType.solid,
   illegal: [ Factions.loanshark ],
   price: { min: 26, max: 35, avg: 30 },
   group: WareGroups.ice,
   production: [
   ]
  },
 khaakalloy: {
   id: 'khaakalloy',
	  version: 0,
   name: 'Allographyne',
   factoryName: '',
   icon: 'ware_khaakalloy',
   volume: 20,
   transport: TransportType.container,
   price: { min: 1260, max: 1540, avg: 1400 },
   group: WareGroups.hightech,
   production: [
     {
       time: 300,
       amount: 100,
       method: 'recycling',
       name: 'Recycling',
       wares: [
         { ware: 'energycells', amount: 6000 },
         { ware: 'khaakscrapmetal', amount: 300 },
         { ware: 'nividium', amount: 200 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
   ]
  },
 khaakscrapmetal: {
   id: 'khaakscrapmetal',
	  version: 0,
   name: 'Allographyne Fragments',
   factoryName: 'Allographyne Scrap Processing Factory',
   icon: 'ware_khaakscrapmetal',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 187, max: 253, avg: 220 },
   group: WareGroups.refined,
   production: [
     {
       time: 60,
       amount: 1,
       method: 'processing',
       name: 'Processing',
       wares: [
         { ware: 'energycells', amount: 10 },
         { ware: 'rawkhaakscrap', amount: 1 },
       ],
       effects: [
       ],
     },
   ]
  },
 majadust: {
   id: 'majadust',
	  version: 0,
   name: 'Maja Dust',
   factoryName: 'Maja Dust Factory',
   icon: 'ware_majadust',
   volume: 6,
   transport: TransportType.container,
   illegal: [ Factions.holyorder, Factions.paranid ],
   price: { min: 94, max: 323, avg: 208 },
   group: WareGroups.pharmaceutical,
   production: [
     {
       time: 600,
       amount: 64,
       method: 'default',
       name: 'Paranid',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'majasnails', amount: 120 },
         { ware: 'spices', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.75 },
       ],
     },
   ]
  },
 majasnails: {
   id: 'majasnails',
	  version: 0,
   name: 'Maja Snails',
   factoryName: 'Maja Snail Farm',
   icon: 'ware_majasnails',
   volume: 6,
   transport: TransportType.container,
   price: { min: 35, max: 81, avg: 58 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 450,
       amount: 146,
       method: 'default',
       name: 'Paranid',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'water', amount: 100 },
       ],
       effects: [
         { type: Effects.work, product: 0.59 },
       ],
     },
   ]
  },
 meat: {
   id: 'meat',
	  version: 0,
   name: 'Meat',
   factoryName: 'Meat Factory',
   icon: 'ware_meat',
   volume: 6,
   transport: TransportType.container,
   price: { min: 29, max: 68, avg: 48 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 450,
       amount: 290,
       method: 'default',
       name: 'Argon',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'water', amount: 100 },
       ],
       effects: [
         { type: Effects.work, product: 0.33 },
       ],
     },
   ]
  },
 medicalsupplies: {
   id: 'medicalsupplies',
	  version: 0,
   name: 'Medical Supplies',
   factoryName: 'Medical Supply Factory',
   icon: 'ware_medicalsupplies',
   volume: 2,
   transport: TransportType.container,
   price: { min: 43, max: 89, avg: 66 },
   group: WareGroups.pharmaceutical,
   production: [
     {
       time: 300,
       amount: 208,
       method: 'default',
       name: 'Argon',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'spices', amount: 40 },
         { ware: 'water', amount: 60 },
         { ware: 'wheat', amount: 30 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
     {
       time: 300,
       amount: 208,
       method: 'paranid',
       name: 'Paranid',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'sojabeans', amount: 10 },
         { ware: 'spices', amount: 40 },
         { ware: 'water', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
     {
       time: 300,
       amount: 208,
       method: 'teladi',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'spices', amount: 40 },
         { ware: 'sunriseflowers', amount: 12 },
         { ware: 'water', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
     {
       time: 300,
       amount: 208,
       method: 'split',
       name: 'Split',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'scruffinfruits', amount: 30 },
         { ware: 'spices', amount: 60 },
         { ware: 'water', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
     {
       time: 300,
       amount: 140,
       method: 'terran',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'ice', amount: 50 },
         { ware: 'proteinpaste', amount: 24 },
       ],
       effects: [
         { type: Effects.work, product: 0.59 },
       ],
     },
     {
       time: 300,
       amount: 208,
       method: 'boron',
       name: 'Boron',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'plankton', amount: 95 },
         { ware: 'water', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
   ]
  },
 methane: {
   id: 'methane',
	  version: 0,
   name: 'Methane',
   factoryName: 'Methane Extractor',
   icon: 'ware_methane',
   volume: 6,
   transport: TransportType.liquid,
   price: { min: 41, max: 55, avg: 48 },
   group: WareGroups.gases,
   production: [
   ]
  },
 microchips: {
   id: 'microchips',
	  version: 0,
   name: 'Microchips',
   factoryName: 'Microchip Factory',
   icon: 'ware_microchips',
   volume: 22,
   transport: TransportType.container,
   price: { min: 805, max: 1090, avg: 948 },
   group: WareGroups.hightech,
   production: [
     {
       time: 600,
       amount: 72,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'siliconwafers', amount: 200 },
       ],
       effects: [
         { type: Effects.work, product: 0.36 },
       ],
     },
   ]
  },
 missilecomponents: {
   id: 'missilecomponents',
	  version: 0,
   name: 'Missile Components',
   factoryName: 'Missile Component Factory',
   icon: 'ware_missilecomponents',
   volume: 1,
   transport: TransportType.container,
   price: { min: 6, max: 13, avg: 9 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 900,
       amount: 281,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'advancedcomposites', amount: 2 },
         { ware: 'energycells', amount: 20 },
         { ware: 'hullparts', amount: 2 },
       ],
       effects: [
         { type: Effects.work, product: 0.53 },
       ],
     },
   ]
  },
 nividium: {
   id: 'nividium',
	  version: 0,
   name: 'Nividium',
   factoryName: 'Nividium Mine',
   icon: 'ware_nividium',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 434, max: 587, avg: 510 },
   group: WareGroups.minerals,
   production: [
   ]
  },
 nostropoil: {
   id: 'nostropoil',
	  version: 0,
   name: 'Nostrop Oil',
   factoryName: 'Nostrop Oil Factory',
   icon: 'ware_nostropoil',
   volume: 1,
   transport: TransportType.container,
   price: { min: 20, max: 47, avg: 34 },
   group: WareGroups.food,
   production: [
     {
       time: 300,
       amount: 500,
       method: 'default',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 100 },
         { ware: 'spices', amount: 40 },
         { ware: 'sunriseflowers', amount: 40 },
         { ware: 'water', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.2 },
       ],
     },
   ]
  },
 ore: {
   id: 'ore',
	  version: 0,
   name: 'Ore',
   factoryName: 'Ore Mine',
   icon: 'ware_ore',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 43, max: 58, avg: 50 },
   group: WareGroups.minerals,
   production: [
   ]
  },
 plasmaconductors: {
   id: 'plasmaconductors',
	  version: 0,
   name: 'Plasma Conductors',
   factoryName: 'Plasma Conductor Factory',
   icon: 'ware_plasmaconductors',
   volume: 32,
   transport: TransportType.container,
   price: { min: 769, max: 1282, avg: 1026 },
   group: WareGroups.hightech,
   production: [
     {
       time: 900,
       amount: 44,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'graphene', amount: 96 },
         { ware: 'superfluidcoolant', amount: 140 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 quantumtubes: {
   id: 'quantumtubes',
	  version: 0,
   name: 'Quantum Tubes',
   factoryName: 'Quantum Tube Factory',
   icon: 'ware_quantumtubes',
   volume: 22,
   transport: TransportType.container,
   price: { min: 225, max: 375, avg: 300 },
   group: WareGroups.hightech,
   production: [
     {
       time: 720,
       amount: 94,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'graphene', amount: 116 },
         { ware: 'superfluidcoolant', amount: 30 },
       ],
       effects: [
         { type: Effects.work, product: 0.53 },
       ],
     },
   ]
  },
 rawkhaakscrap: {
   id: 'rawkhaakscrap',
	  version: 0,
   name: 'Allographyne Scrap',
   factoryName: '',
   icon: 'ware_khaakscrapmetal',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 30, max: 50, avg: 40 },
   group: WareGroups.refined,
   production: [
   ]
  },
 rawscrap: {
   id: 'rawscrap',
	  version: 0,
   name: 'Raw Scrap',
   factoryName: '',
   icon: 'ware_scrapmetal',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 153, max: 207, avg: 180 },
   group: WareGroups.refined,
   production: [
   ]
  },
 refinedmetals: {
   id: 'refinedmetals',
	  version: 0,
   name: 'Refined Metals',
   factoryName: 'Ore Refinery',
   icon: 'ware_refinedmetals',
   volume: 14,
   transport: TransportType.container,
   price: { min: 89, max: 207, avg: 148 },
   group: WareGroups.refined,
   production: [
     {
       time: 150,
       amount: 88,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 90 },
         { ware: 'ore', amount: 240 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 scanningarrays: {
   id: 'scanningarrays',
	  version: 0,
   name: 'Scanning Arrays',
   factoryName: 'Scanning Array Factory',
   icon: 'ware_scanningarrays',
   volume: 38,
   transport: TransportType.container,
   price: { min: 842, max: 1264, avg: 1053 },
   group: WareGroups.hightech,
   production: [
     {
       time: 600,
       amount: 36,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'refinedmetals', amount: 100 },
         { ware: 'siliconwafers', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.38 },
       ],
     },
     {
       time: 600,
       amount: 36,
       method: 'teladi',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'siliconwafers', amount: 60 },
         { ware: 'teladianium', amount: 73 },
       ],
       effects: [
         { type: Effects.work, product: 0.38 },
       ],
     },
   ]
  },
 scrapmetal: {
   id: 'scrapmetal',
	  version: 0,
   name: 'Scrap Metal',
   factoryName: 'Scrap Processing Factory',
   icon: 'ware_scrapmetal',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 318, max: 431, avg: 375 },
   group: WareGroups.refined,
   production: [
     {
       time: 60,
       amount: 1,
       method: 'processing',
       name: 'Processing',
       wares: [
         { ware: 'energycells', amount: 10 },
         { ware: 'rawscrap', amount: 1 },
       ],
       effects: [
       ],
     },
   ]
  },
 shieldcomponents: {
   id: 'shieldcomponents',
	  version: 0,
   name: 'Shield Components',
   factoryName: 'Shield Component Factory',
   icon: 'ware_shieldcomponents',
   volume: 10,
   transport: TransportType.container,
   price: { min: 113, max: 264, avg: 188 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 1200,
       amount: 193,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 70 },
         { ware: 'plasmaconductors', amount: 20 },
         { ware: 'quantumtubes', amount: 20 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 silicon: {
   id: 'silicon',
	  version: 0,
   name: 'Silicon',
   factoryName: 'Silicon Mine',
   icon: 'ware_silicon',
   volume: 10,
   transport: TransportType.solid,
   price: { min: 111, max: 150, avg: 130 },
   group: WareGroups.minerals,
   production: [
   ]
  },
 siliconwafers: {
   id: 'siliconwafers',
	  version: 0,
   name: 'Silicon Wafers',
   factoryName: 'Silicon Refinery',
   icon: 'ware_siliconwafers',
   volume: 18,
   transport: TransportType.container,
   price: { min: 180, max: 419, avg: 299 },
   group: WareGroups.refined,
   production: [
     {
       time: 180,
       amount: 107,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 90 },
         { ware: 'silicon', amount: 240 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
   ]
  },
 smartchips: {
   id: 'smartchips',
	  version: 0,
   name: 'Smart Chips',
   factoryName: 'Smart Chip Factory',
   icon: 'ware_smartchips',
   volume: 2,
   transport: TransportType.container,
   price: { min: 46, max: 69, avg: 57 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 600,
       amount: 143,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'siliconwafers', amount: 20 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
   ]
  },
 sojabeans: {
   id: 'sojabeans',
	  version: 0,
   name: 'Soja Beans',
   factoryName: 'Soja Bean Farm',
   icon: 'ware_sojabeans',
   volume: 5,
   transport: TransportType.container,
   price: { min: 40, max: 93, avg: 67 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 300,
       amount: 104,
       method: 'default',
       name: 'Paranid',
       wares: [
         { ware: 'energycells', amount: 30 },
         { ware: 'water', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.48 },
       ],
     },
   ]
  },
 sojahusk: {
   id: 'sojahusk',
	  version: 0,
   name: 'Soja Husk',
   factoryName: 'Soja Husk Factory',
   icon: 'ware_sojahusk',
   volume: 1,
   transport: TransportType.container,
   price: { min: 19, max: 45, avg: 32 },
   group: WareGroups.food,
   production: [
     {
       time: 300,
       amount: 350,
       method: 'default',
       name: 'Paranid',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'majasnails', amount: 50 },
         { ware: 'sojabeans', amount: 40 },
         { ware: 'spices', amount: 20 },
       ],
       effects: [
         { type: Effects.work, product: 0.37 },
       ],
     },
   ]
  },
 spacefuel: {
   id: 'spacefuel',
	  version: 0,
   name: 'Spacefuel',
   factoryName: 'Spacefuel Factory',
   icon: 'ware_spacefuel',
   volume: 2,
   transport: TransportType.container,
   illegal: [ Factions.antigone, Factions.argon, Factions.pioneers, Factions.terran, Factions.boron ],
   price: { min: 60, max: 207, avg: 133 },
   group: WareGroups.pharmaceutical,
   production: [
     {
       time: 480,
       amount: 98,
       method: 'default',
       name: 'Argon',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'water', amount: 100 },
         { ware: 'wheat', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.69 },
       ],
     },
   ]
  },
 spaceweed: {
   id: 'spaceweed',
	  version: 0,
   name: 'Spaceweed',
   factoryName: 'Spaceweed Farm',
   icon: 'ware_spaceweed',
   volume: 3,
   transport: TransportType.container,
   illegal: [ Factions.antigone, Factions.argon, Factions.holyorder, Factions.paranid, Factions.terran, Factions.boron ],
   price: { min: 75, max: 257, avg: 166 },
   group: WareGroups.pharmaceutical,
   production: [
     {
       time: 600,
       amount: 183,
       method: 'default',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 140 },
         { ware: 'spices', amount: 40 },
         { ware: 'swampplant', amount: 120 },
       ],
       effects: [
         { type: Effects.work, product: 0.7 },
       ],
     },
   ]
  },
 spices: {
   id: 'spices',
	  version: 0,
   name: 'Spices',
   factoryName: 'Spice Farm',
   icon: 'ware_spices',
   volume: 3,
   transport: TransportType.container,
   price: { min: 12, max: 28, avg: 20 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 600,
       amount: 500,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'water', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.4 },
       ],
     },
   ]
  },
 sunriseflowers: {
   id: 'sunriseflowers',
	  version: 0,
   name: 'Sunrise Flowers',
   factoryName: 'Sunrise Flower Farm',
   icon: 'ware_sunriseflowers',
   volume: 5,
   transport: TransportType.container,
   price: { min: 48, max: 112, avg: 80 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 300,
       amount: 100,
       method: 'default',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 30 },
         { ware: 'water', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
   ]
  },
 superfluidcoolant: {
   id: 'superfluidcoolant',
	  version: 0,
   name: 'Superfluid Coolant',
   factoryName: 'Helium Refinery',
   icon: 'ware_superfluidcoolant',
   volume: 16,
   transport: TransportType.container,
   price: { min: 90, max: 211, avg: 150 },
   group: WareGroups.refined,
   production: [
     {
       time: 240,
       amount: 95,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'helium', amount: 320 },
       ],
       effects: [
         { type: Effects.work, product: 0.49 },
       ],
     },
   ]
  },
 swampplant: {
   id: 'swampplant',
	  version: 0,
   name: 'Swamp Plant',
   factoryName: 'Swamp Plant Farm',
   icon: 'ware_swampplant',
   volume: 6,
   transport: TransportType.container,
   price: { min: 50, max: 117, avg: 84 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 450,
       amount: 120,
       method: 'default',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'water', amount: 100 },
       ],
       effects: [
         { type: Effects.work, product: 0.59 },
       ],
     },
   ]
  },
 teladianium: {
   id: 'teladianium',
	  version: 0,
   name: 'Teladianium',
   factoryName: 'Teladianium Foundry',
   icon: 'ware_teladianium',
   volume: 16,
   transport: TransportType.container,
   price: { min: 121, max: 283, avg: 202 },
   group: WareGroups.refined,
   production: [
     {
       time: 120,
       amount: 70,
       method: 'default',
       name: 'Teladi',
       wares: [
         { ware: 'energycells', amount: 45 },
         { ware: 'ore', amount: 280 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 turretcomponents: {
   id: 'turretcomponents',
	  version: 0,
   name: 'Turret Components',
   factoryName: 'Turret Component Factory',
   icon: 'ware_turretcomponents',
   volume: 20,
   transport: TransportType.container,
   price: { min: 164, max: 383, avg: 273 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 1800,
       amount: 170,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'microchips', amount: 20 },
         { ware: 'quantumtubes', amount: 20 },
         { ware: 'scanningarrays', amount: 10 },
       ],
       effects: [
         { type: Effects.work, product: 0.53 },
       ],
     },
   ]
  },
 water: {
   id: 'water',
	  version: 0,
   name: 'Water',
   factoryName: 'Ice Refinery',
   icon: 'ware_water',
   volume: 6,
   transport: TransportType.container,
   illegal: [ Factions.loanshark ],
   price: { min: 32, max: 74, avg: 53 },
   group: WareGroups.water,
   production: [
     {
       time: 120,
       amount: 193,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'ice', amount: 320 },
       ],
       effects: [
         { type: Effects.work, product: 0.43 },
       ],
     },
   ]
  },
 weaponcomponents: {
   id: 'weaponcomponents',
	  version: 0,
   name: 'Weapon Components',
   factoryName: 'Weapon Component Factory',
   icon: 'ware_weaponcomponents',
   volume: 20,
   transport: TransportType.container,
   price: { min: 171, max: 399, avg: 285 },
   group: WareGroups.shiptech,
   production: [
     {
       time: 1800,
       amount: 170,
       method: 'default',
       name: 'Universal',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'hullparts', amount: 20 },
         { ware: 'plasmaconductors', amount: 30 },
       ],
       effects: [
         { type: Effects.work, product: 0.53 },
       ],
     },
   ]
  },
 wheat: {
   id: 'wheat',
	  version: 0,
   name: 'Wheat',
   factoryName: 'Wheat Farm',
   icon: 'ware_wheat',
   volume: 4,
   transport: TransportType.container,
   price: { min: 19, max: 44, avg: 31 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 300,
       amount: 310,
       method: 'default',
       name: 'Argon',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'water', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.28 },
       ],
     },
   ]
  },
 cheltmeat: {
   id: 'cheltmeat',
	  version: 1,
   name: 'Chelt Meat',
   factoryName: 'Chelt Aquarium',
   icon: 'ware_cheltmeat',
   volume: 7,
   transport: TransportType.container,
   price: { min: 31, max: 72, avg: 51 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 450,
       amount: 209,
       method: 'default',
       name: 'Split',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'water', amount: 120 },
       ],
       effects: [
         { type: Effects.work, product: 0.6 },
       ],
     },
   ]
  },
 scruffinfruits: {
   id: 'scruffinfruits',
	  version: 1,
   name: 'Scruffin Fruit',
   factoryName: 'Scruffin Farm',
   icon: 'ware_scruffinfruit',
   volume: 6,
   transport: TransportType.container,
   price: { min: 17, max: 40, avg: 28 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 300,
       amount: 255,
       method: 'default',
       name: 'Split',
       wares: [
         { ware: 'energycells', amount: 30 },
         { ware: 'water', amount: 80 },
       ],
       effects: [
         { type: Effects.work, product: 0.53 },
       ],
     },
   ]
  },
 computronicsubstrate: {
   id: 'computronicsubstrate',
	  version: 2,
   name: 'Computronic Substrate',
   factoryName: 'Computronic Substrate Fab',
   icon: 'ware_computronicsubstrate',
   volume: 50,
   transport: TransportType.container,
   price: { min: 7452, max: 9108, avg: 8280 },
   group: WareGroups.hightech,
   production: [
     {
       time: 600,
       amount: 98,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 4000 },
         { ware: 'hydrogen', amount: 2000 },
         { ware: 'ore', amount: 3000 },
         { ware: 'silicon', amount: 3000 },
       ],
       effects: [
         { type: Effects.work, product: 0.1 },
       ],
     },
     {
       time: 300,
       amount: 50,
       method: 'recycling',
       name: 'Recycling',
       wares: [
         { ware: 'energycells', amount: 12500 },
         { ware: 'scrapmetal', amount: 1000 },
       ],
       effects: [
         { type: Effects.work, product: 0.1 },
       ],
     },
   ]
  },
 metallicmicrolattice: {
   id: 'metallicmicrolattice',
	  version: 2,
   name: 'Metallic Microlattice',
   factoryName: 'Microlattice Factory',
   icon: 'ware_metallicmicrolattice',
   volume: 1,
   transport: TransportType.container,
   price: { min: 42, max: 57, avg: 50 },
   group: WareGroups.hightech,
   production: [
     {
       time: 180,
       amount: 190,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 50 },
         { ware: 'helium', amount: 130 },
         { ware: 'ore', amount: 50 },
       ],
       effects: [
         { type: Effects.work, product: 0.2 },
       ],
     },
   ]
  },
 proteinpaste: {
   id: 'proteinpaste',
	  version: 2,
   name: 'Protein Paste',
   factoryName: 'Protein Processing Plant',
   icon: 'ware_proteinpaste',
   volume: 4,
   transport: TransportType.container,
   price: { min: 57, max: 134, avg: 96 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 300,
       amount: 219,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'ice', amount: 80 },
         { ware: 'methane', amount: 200 },
       ],
       effects: [
         { type: Effects.work, product: 0.3 },
       ],
     },
   ]
  },
 siliconcarbide: {
   id: 'siliconcarbide',
	  version: 2,
   name: 'Silicon Carbide',
   factoryName: 'Silicon Carbide Mill',
   icon: 'ware_siliconcarbide',
   volume: 20,
   transport: TransportType.container,
   price: { min: 1202, max: 1627, avg: 1414 },
   group: WareGroups.hightech,
   production: [
     {
       time: 300,
       amount: 48,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 200 },
         { ware: 'metallicmicrolattice', amount: 2 },
         { ware: 'methane', amount: 400 },
         { ware: 'silicon', amount: 300 },
       ],
       effects: [
         { type: Effects.work, product: 0.2 },
       ],
     },
     {
       time: 300,
       amount: 60,
       method: 'recycling',
       name: 'Recycling',
       wares: [
         { ware: 'energycells', amount: 4000 },
         { ware: 'scrapmetal', amount: 250 },
       ],
       effects: [
         { type: Effects.work, product: 0.2 },
       ],
     },
   ]
  },
 stimulants: {
   id: 'stimulants',
	  version: 2,
   name: 'Stimulants',
   factoryName: 'Stimulants Lab',
   icon: 'ware_stimulants',
   volume: 12,
   transport: TransportType.container,
   price: { min: 153, max: 527, avg: 340 },
   group: WareGroups.pharmaceutical,
   production: [
     {
       time: 300,
       amount: 98,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 80 },
         { ware: 'helium', amount: 400 },
         { ware: 'silicon', amount: 20 },
       ],
       effects: [
         { type: Effects.work, product: 0.65 },
       ],
     },
   ]
  },
 terranmre: {
   id: 'terranmre',
	  version: 2,
   name: 'Terran MRE',
   factoryName: 'MRE Packing Facility',
   icon: 'ware_terranmre',
   volume: 2,
   transport: TransportType.container,
   price: { min: 32, max: 75, avg: 54 },
   group: WareGroups.food,
   production: [
     {
       time: 240,
       amount: 175,
       method: 'default',
       name: 'Terran',
       wares: [
         { ware: 'energycells', amount: 60 },
         { ware: 'proteinpaste', amount: 60 },
       ],
       effects: [
         { type: Effects.work, product: 0.42 },
       ],
     },
   ]
  },
 bofu: {
   id: 'bofu',
	  version: 4,
   name: 'BoFu',
   factoryName: 'BoFu Chemical Lab',
   icon: 'ware_bofu',
   volume: 4,
   transport: TransportType.container,
   price: { min: 61, max: 142, avg: 101 },
   group: WareGroups.food,
   production: [
     {
       time: 240,
       amount: 82,
       method: 'default',
       name: 'Boron',
       wares: [
         { ware: 'bogas', amount: 40 },
         { ware: 'energycells', amount: 40 },
         { ware: 'plankton', amount: 120 },
       ],
       effects: [
         { type: Effects.work, product: 0.38 },
       ],
     },
   ]
  },
 bogas: {
   id: 'bogas',
	  version: 4,
   name: 'BoGas',
   factoryName: 'Synthetic BoGas Brewery',
   icon: 'ware_bogas',
   volume: 4,
   transport: TransportType.container,
   price: { min: 44, max: 102, avg: 73 },
   group: WareGroups.refined,
   production: [
     {
       time: 150,
       amount: 110,
       method: 'default',
       name: 'Boron',
       wares: [
         { ware: 'energycells', amount: 40 },
         { ware: 'water', amount: 100 },
       ],
       effects: [
         { type: Effects.work, product: 0.46 },
       ],
     },
   ]
  },
 plankton: {
   id: 'plankton',
	  version: 4,
   name: 'Plankton',
   factoryName: 'Plankton Farm',
   icon: 'ware_plankton',
   volume: 1,
   transport: TransportType.container,
   price: { min: 11, max: 25, avg: 18 },
   group: WareGroups.agricultural,
   production: [
     {
       time: 400,
       amount: 275,
       method: 'default',
       name: 'Boron',
       wares: [
         { ware: 'energycells', amount: 20 },
         { ware: 'water', amount: 50 },
       ],
       effects: [
         { type: Effects.work, product: 0.4 },
       ],
     },
   ]
  },
};

export const AllWares = [
 Wares.advancedcomposites,
 Wares.advancedelectronics,
 Wares.antimattercells,
 Wares.antimatterconverters,
 Wares.claytronics,
 Wares.dronecomponents,
 Wares.energycells,
 Wares.engineparts,
 Wares.fieldcoils,
 Wares.foodrations,
 Wares.graphene,
 Wares.helium,
 Wares.hullparts,
 Wares.hydrogen,
 Wares.ice,
 Wares.khaakalloy,
 Wares.khaakscrapmetal,
 Wares.majadust,
 Wares.majasnails,
 Wares.meat,
 Wares.medicalsupplies,
 Wares.methane,
 Wares.microchips,
 Wares.missilecomponents,
 Wares.nividium,
 Wares.nostropoil,
 Wares.ore,
 Wares.plasmaconductors,
 Wares.quantumtubes,
 Wares.rawkhaakscrap,
 Wares.rawscrap,
 Wares.refinedmetals,
 Wares.scanningarrays,
 Wares.scrapmetal,
 Wares.shieldcomponents,
 Wares.silicon,
 Wares.siliconwafers,
 Wares.smartchips,
 Wares.sojabeans,
 Wares.sojahusk,
 Wares.spacefuel,
 Wares.spaceweed,
 Wares.spices,
 Wares.sunriseflowers,
 Wares.superfluidcoolant,
 Wares.swampplant,
 Wares.teladianium,
 Wares.turretcomponents,
 Wares.water,
 Wares.weaponcomponents,
 Wares.wheat,
 Wares.cheltmeat,
 Wares.scruffinfruits,
 Wares.computronicsubstrate,
 Wares.metallicmicrolattice,
 Wares.proteinpaste,
 Wares.siliconcarbide,
 Wares.stimulants,
 Wares.terranmre,
 Wares.bofu,
 Wares.bogas,
 Wares.plankton,
];

await GameText.translate(Wares, 'wares');
