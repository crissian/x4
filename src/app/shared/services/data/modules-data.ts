/* tslint:disable:max-line-length */
import { Races } from './race-data';
import { Wares } from './wares-data';
import { Factions } from './factions-data';
import { ModuleTypes } from './module-types-data';
import { CargoTypes } from './cargo-types-data';

export const Modules = {
  module_arg_conn_base_01: {
    id: 'module_arg_conn_base_01',
    name: 'Argon Base Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 237000,
    makerRace: Races.argon,
    price: { min: 92363, max: 124961, avg: 108662 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 103,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 17 },
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 62 },
        ],
      },
    ]
  },
  module_arg_conn_base_02: {
    id: 'module_arg_conn_base_02',
    name: 'Argon Base Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 150000,
    makerRace: Races.argon,
    price: { min: 75585, max: 102263, avg: 88924 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 82,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 14 },
          { ware: 'energycells', amount: 27 },
          { ware: 'hullparts', amount: 50 },
        ],
      },
    ]
  },
  module_arg_conn_base_03: {
    id: 'module_arg_conn_base_03',
    name: 'Argon Base Connection Structure 03',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 280000,
    makerRace: Races.argon,
    price: { min: 98841, max: 133727, avg: 116284 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 112,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 18 },
          { ware: 'energycells', amount: 37 },
          { ware: 'hullparts', amount: 68 },
        ],
      },
    ]
  },
  module_arg_conn_cross_01: {
    id: 'module_arg_conn_cross_01',
    name: 'Argon Cross Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 120000,
    makerRace: Races.argon,
    price: { min: 65300, max: 88348, avg: 76824 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 73,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 12 },
          { ware: 'energycells', amount: 24 },
          { ware: 'hullparts', amount: 44 },
        ],
      },
    ]
  },
  module_arg_conn_vertical_01: {
    id: 'module_arg_conn_vertical_01',
    name: 'Argon Vertical Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 79000,
    makerRace: Races.argon,
    price: { min: 54125, max: 73227, avg: 63676 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 59,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 10 },
          { ware: 'energycells', amount: 20 },
          { ware: 'hullparts', amount: 36 },
        ],
      },
    ]
  },
  module_arg_conn_vertical_02: {
    id: 'module_arg_conn_vertical_02',
    name: 'Argon Vertical Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 143000,
    makerRace: Races.argon,
    price: { min: 70888, max: 95908, avg: 83398 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 80,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 13 },
          { ware: 'energycells', amount: 26 },
          { ware: 'hullparts', amount: 48 },
        ],
      },
    ]
  },
  module_arg_def_claim_01: {
    id: 'module_arg_def_claim_01',
    name: 'Argon Administrative Centre',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    hull: 128000,
    makerRace: Races.argon,
    price: { min: 744928, max: 1007844, avg: 876386 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 826,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 137 },
          { ware: 'energycells', amount: 274 },
          { ware: 'hullparts', amount: 501 },
        ],
      },
    ]
  },
  module_arg_def_disc_01: {
    id: 'module_arg_def_disc_01',
    name: 'Argon Disc Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 65800,
    makerRace: Races.argon,
    price: { min: 533140, max: 721308, avg: 627224 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 592,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 98 },
          { ware: 'energycells', amount: 196 },
          { ware: 'hullparts', amount: 359 },
        ],
      },
    ]
  },
  module_arg_def_tube_01: {
    id: 'module_arg_def_tube_01',
    name: 'Argon Bridge Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 49600,
    makerRace: Races.argon,
    price: { min: 462691, max: 625993, avg: 544342 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 514,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 85 },
          { ware: 'energycells', amount: 170 },
          { ware: 'hullparts', amount: 312 },
        ],
      },
    ]
  },
  module_arg_dock_m_01: {
    id: 'module_arg_dock_m_01',
    name: '1M6S Standard Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 10000,
    hull: 240000,
    price: { min: 293852, max: 397564, avg: 345708 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 653,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 54 },
          { ware: 'energycells', amount: 108 },
          { ware: 'hullparts', amount: 198 },
        ],
      },
    ]
  },
  module_arg_dock_m_01_hightech: {
    id: 'module_arg_dock_m_01_hightech',
    name: '1M6S Luxury Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 10000,
    hull: 275000,
    price: { min: 315326, max: 426618, avg: 370972 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 699,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 58 },
          { ware: 'energycells', amount: 116 },
          { ware: 'hullparts', amount: 212 },
        ],
      },
    ]
  },
  module_arg_dock_m_01_lowtech: {
    id: 'module_arg_dock_m_01_lowtech',
    name: '1M6S Basic Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 10000,
    hull: 210000,
    price: { min: 276636, max: 374272, avg: 325454 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 611,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 51 },
          { ware: 'energycells', amount: 101 },
          { ware: 'hullparts', amount: 185 },
        ],
      },
    ]
  },
  module_arg_dock_m_02: {
    id: 'module_arg_dock_m_02',
    name: '3M6S Standard Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 10000,
    hull: 495000,
    price: { min: 423562, max: 573054, avg: 498308 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 938,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 78 },
          { ware: 'energycells', amount: 155 },
          { ware: 'hullparts', amount: 284 },
        ],
      },
    ]
  },
  module_arg_dock_m_02_hightech: {
    id: 'module_arg_dock_m_02_hightech',
    name: '3M6S Luxury Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 10000,
    hull: 530000,
    price: { min: 435642, max: 589398, avg: 512520 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 971,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 80 },
          { ware: 'energycells', amount: 161 },
          { ware: 'hullparts', amount: 294 },
        ],
      },
    ]
  },
  module_arg_dock_m_02_lowtech: {
    id: 'module_arg_dock_m_02_lowtech',
    name: '3M6S Basic Dock Area',
    description: 'No information available',
    type: ModuleTypes.dockarea,
    explosionDamage: 100000,
    hull: 460000,
    price: { min: 407689, max: 551579, avg: 479634 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 904,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 75 },
          { ware: 'energycells', amount: 150 },
          { ware: 'hullparts', amount: 274 },
        ],
      },
    ]
  },
  module_arg_hab_l_01: {
    id: 'module_arg_hab_l_01',
    name: 'Argon L Habitat',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 178582,
    makerRace: Races.argon,
    workForce: {
      capacity: 1000,
      race: Races.argon
    },
    price: { min: 16627714, max: 22496318, avg: 19562016 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 1155,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 191 },
          { ware: 'energycells', amount: 383 },
          { ware: 'hullparts', amount: 700 },
        ],
      },
    ]
  },
  module_arg_hab_m_01: {
    id: 'module_arg_hab_m_01',
    name: 'Argon M Habitat',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 183126,
    makerRace: Races.argon,
    workForce: {
      capacity: 500,
      race: Races.argon
    },
    price: { min: 11754290, max: 15902862, avg: 13828576 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 816,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 135 },
          { ware: 'energycells', amount: 271 },
          { ware: 'hullparts', amount: 495 },
        ],
      },
    ]
  },
  module_arg_hab_s_01: {
    id: 'module_arg_hab_s_01',
    name: 'Argon S Habitat',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 148471,
    makerRace: Races.argon,
    workForce: {
      capacity: 250,
      race: Races.argon
    },
    price: { min: 8172621, max: 11057075, avg: 9614848 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 566,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 94 },
          { ware: 'energycells', amount: 188 },
          { ware: 'hullparts', amount: 343 },
        ],
      },
    ]
  },
  module_arg_pier_l_01: {
    id: 'module_arg_pier_l_01',
    name: 'Argon 3-Dock T Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 750000,
    makerRace: Races.argon,
    price: { min: 2946171, max: 3985997, avg: 3466084 },
    owners: [
      Factions.argon,
    ],
    production: [
      {
        time: 1155,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 542 },
          { ware: 'energycells', amount: 1083 },
          { ware: 'hullparts', amount: 1980 },
        ],
      },
    ]
  },
  module_arg_pier_l_02: {
    id: 'module_arg_pier_l_02',
    name: 'Argon 1-Dock Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 250000,
    makerRace: Races.argon,
    price: { min: 1701192, max: 2301612, avg: 2001402 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 667,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 313 },
          { ware: 'energycells', amount: 625 },
          { ware: 'hullparts', amount: 1143 },
        ],
      },
    ]
  },
  module_arg_pier_l_03: {
    id: 'module_arg_pier_l_03',
    name: 'Argon 3-Dock E Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 100000,
    hull: 1000000,
    makerRace: Races.argon,
    price: { min: 3399016, max: 4598668, avg: 3998842 },
    owners: [
      Factions.antigone,
    ],
    production: [
      {
        time: 1333,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 625 },
          { ware: 'energycells', amount: 1250 },
          { ware: 'hullparts', amount: 2287 },
        ],
      },
    ]
  },
  module_arg_prod_foodrations_01: {
    id: 'module_arg_prod_foodrations_01',
    name: 'Food Ration Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.foodrations,
    explosionDamage: 10000,
    hull: 133000,
    makerRace: Races.argon,
    workForce: {
      max: 90
    },
    price: { min: 1425885, max: 1929139, avg: 1677512 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 1166,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          { ware: 'claytronics', amount: 262 },
          { ware: 'energycells', amount: 525 },
          { ware: 'hullparts', amount: 961 },
        ],
      },
    ]
  },
  module_arg_prod_meat_01: {
    id: 'module_arg_prod_meat_01',
    name: 'Meat Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.meat,
    explosionDamage: 10000,
    hull: 198000,
    makerRace: Races.argon,
    workForce: {
      max: 75
    },
    price: { min: 1349848, max: 1826264, avg: 1588056 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 1155,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          { ware: 'claytronics', amount: 248 },
          { ware: 'energycells', amount: 497 },
          { ware: 'hullparts', amount: 910 },
        ],
      },
    ]
  },
  module_arg_prod_medicalsupplies_01: {
    id: 'module_arg_prod_medicalsupplies_01',
    name: 'Argon Medical Supply Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.medicalsupplies,
    explosionDamage: 10000,
    hull: 197000,
    makerRace: Races.argon,
    workForce: {
      max: 90
    },
    price: { min: 1223505, max: 1655331, avg: 1439418 },
    owners: [
      Factions.argon,
    ],
    production: [
      {
        time: 1137,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          { ware: 'claytronics', amount: 225 },
          { ware: 'energycells', amount: 450 },
          { ware: 'hullparts', amount: 823 },
        ],
      },
    ]
  },
  module_arg_prod_spacefuel_01: {
    id: 'module_arg_prod_spacefuel_01',
    name: 'Spacefuel Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.spacefuel,
    explosionDamage: 10000,
    hull: 148000,
    makerRace: Races.argon,
    workForce: {
      max: 150
    },
    price: { min: 1735171, max: 2347585, avg: 2041378 },
    owners: [
      Factions.scaleplate,
    ],
    production: [
      {
        time: 1203,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          { ware: 'claytronics', amount: 319 },
          { ware: 'energycells', amount: 638 },
          { ware: 'hullparts', amount: 1168 },
        ],
      },
    ]
  },
  module_arg_prod_wheat_01: {
    id: 'module_arg_prod_wheat_01',
    name: 'Wheat Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.wheat,
    explosionDamage: 10000,
    hull: 262000,
    makerRace: Races.argon,
    workForce: {
      max: 75
    },
    price: { min: 1610158, max: 2178450, avg: 1894304 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 1189,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          { ware: 'claytronics', amount: 296 },
          { ware: 'energycells', amount: 592 },
          { ware: 'hullparts', amount: 1084 },
        ],
      },
    ]
  },
  module_arg_stor_container_l_01: {
    id: 'module_arg_stor_container_l_01',
    name: 'Argon L Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 565000,
    makerRace: Races.argon,
    cargo: { max: 1000000, type: CargoTypes.container },
    price: { min: 625503, max: 846269, avg: 735886 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 896,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 115 },
          { ware: 'energycells', amount: 230 },
          { ware: 'hullparts', amount: 421 },
        ],
      },
    ]
  },
  module_arg_stor_container_m_01: {
    id: 'module_arg_stor_container_m_01',
    name: 'Argon M Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 285000,
    makerRace: Races.argon,
    cargo: { max: 100000, type: CargoTypes.container },
    price: { min: 445475, max: 602701, avg: 524088 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 637,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 82 },
          { ware: 'energycells', amount: 163 },
          { ware: 'hullparts', amount: 299 },
        ],
      },
    ]
  },
  module_arg_stor_container_s_01: {
    id: 'module_arg_stor_container_s_01',
    name: 'Argon S Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 114000,
    makerRace: Races.argon,
    cargo: { max: 25000, type: CargoTypes.container },
    price: { min: 282224, max: 381832, avg: 332028 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 403,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 52 },
          { ware: 'energycells', amount: 103 },
          { ware: 'hullparts', amount: 189 },
        ],
      },
    ]
  },
  module_arg_stor_liquid_l_01: {
    id: 'module_arg_stor_liquid_l_01',
    name: 'Argon L Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 565000,
    makerRace: Races.argon,
    cargo: { max: 1000000, type: CargoTypes.liquid },
    price: { min: 625503, max: 846269, avg: 735886 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 896,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 115 },
          { ware: 'energycells', amount: 230 },
          { ware: 'hullparts', amount: 421 },
        ],
      },
    ]
  },
  module_arg_stor_liquid_m_01: {
    id: 'module_arg_stor_liquid_m_01',
    name: 'Argon M Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 285000,
    makerRace: Races.argon,
    cargo: { max: 500000, type: CargoTypes.liquid },
    price: { min: 445475, max: 602701, avg: 524088 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 637,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 82 },
          { ware: 'energycells', amount: 163 },
          { ware: 'hullparts', amount: 299 },
        ],
      },
    ]
  },
  module_arg_stor_liquid_s_01: {
    id: 'module_arg_stor_liquid_s_01',
    name: 'Argon S Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 114000,
    makerRace: Races.argon,
    cargo: { max: 100000, type: CargoTypes.liquid },
    price: { min: 282224, max: 381832, avg: 332028 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 403,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 52 },
          { ware: 'energycells', amount: 103 },
          { ware: 'hullparts', amount: 189 },
        ],
      },
    ]
  },
  module_arg_stor_solid_l_01: {
    id: 'module_arg_stor_solid_l_01',
    name: 'Argon L Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 565000,
    makerRace: Races.argon,
    cargo: { max: 1000000, type: CargoTypes.solid },
    price: { min: 625503, max: 846269, avg: 735886 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 896,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 115 },
          { ware: 'energycells', amount: 230 },
          { ware: 'hullparts', amount: 421 },
        ],
      },
    ]
  },
  module_arg_stor_solid_m_01: {
    id: 'module_arg_stor_solid_m_01',
    name: 'Argon M Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 285000,
    makerRace: Races.argon,
    cargo: { max: 500000, type: CargoTypes.solid },
    price: { min: 445475, max: 602701, avg: 524088 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 637,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 82 },
          { ware: 'energycells', amount: 163 },
          { ware: 'hullparts', amount: 299 },
        ],
      },
    ]
  },
  module_arg_stor_solid_s_01: {
    id: 'module_arg_stor_solid_s_01',
    name: 'Argon S Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 114000,
    makerRace: Races.argon,
    cargo: { max: 100000, type: CargoTypes.solid },
    price: { min: 282224, max: 381832, avg: 332028 },
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    production: [
      {
        time: 403,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 52 },
          { ware: 'energycells', amount: 103 },
          { ware: 'hullparts', amount: 189 },
        ],
      },
    ]
  },
  module_gen_prod_advancedcomposites_01: {
    id: 'module_gen_prod_advancedcomposites_01',
    name: 'Advanced Composite Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.advancedcomposites,
    explosionDamage: 10000,
    hull: 197000,
    workForce: {
      max: 210
    },
    price: { min: 3524906, max: 4768990, avg: 4146948 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1337,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 648 },
          { ware: 'energycells', amount: 1296 },
          { ware: 'hullparts', amount: 2373 },
        ],
      },
    ]
  },
  module_gen_prod_advancedelectronics_01: {
    id: 'module_gen_prod_advancedelectronics_01',
    name: 'Advanced Electronics Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.advancedelectronics,
    explosionDamage: 10000,
    hull: 160000,
    workForce: {
      max: 360
    },
    price: { min: 2622767, max: 3548449, avg: 3085608 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1281,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 482 },
          { ware: 'energycells', amount: 965 },
          { ware: 'hullparts', amount: 1767 },
        ],
      },
    ]
  },
  module_gen_prod_antimattercells_01: {
    id: 'module_gen_prod_antimattercells_01',
    name: 'Antimatter Cell Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.antimattercells,
    explosionDamage: 10000,
    hull: 251000,
    workForce: {
      max: 120
    },
    price: { min: 375477, max: 507999, avg: 441738 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 913,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 69 },
          { ware: 'energycells', amount: 138 },
          { ware: 'hullparts', amount: 253 },
        ],
      },
    ]
  },
  module_gen_prod_antimatterconverters_01: {
    id: 'module_gen_prod_antimatterconverters_01',
    name: 'Antimatter Converter Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.antimatterconverters,
    explosionDamage: 10000,
    hull: 216000,
    workForce: {
      max: 720
    },
    price: { min: 9681548, max: 13098564, avg: 11390056 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1528,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 1780 },
          { ware: 'energycells', amount: 3560 },
          { ware: 'hullparts', amount: 6516 },
        ],
      },
    ]
  },
  module_gen_prod_claytronics_01: {
    id: 'module_gen_prod_claytronics_01',
    name: 'Claytronics Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.claytronics,
    explosionDamage: 10000,
    hull: 195000,
    workForce: {
      max: 810
    },
    price: { min: 15347532, max: 20764308, avg: 18055920 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.teladi,
    ],
    production: [
      {
        time: 1615,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 2822 },
          { ware: 'energycells', amount: 5642 },
          { ware: 'hullparts', amount: 10327 },
        ],
      },
    ]
  },
  module_gen_prod_dronecomponents_01: {
    id: 'module_gen_prod_dronecomponents_01',
    name: 'Drone Component Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.dronecomponents,
    explosionDamage: 10000,
    hull: 174000,
    workForce: {
      max: 450
    },
    price: { min: 6662268, max: 9013656, avg: 7837962 },
    owners: [
      Factions.argon,
      Factions.holyorder,
      Factions.ministry,
    ],
    production: [
      {
        time: 1457,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 1225 },
          { ware: 'energycells', amount: 2449 },
          { ware: 'hullparts', amount: 4483 },
        ],
      },
    ]
  },
  module_gen_prod_energycells_01: {
    id: 'module_gen_prod_energycells_01',
    name: 'Energy Cell Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.energycells,
    explosionDamage: 10000,
    hull: 217000,
    workForce: {
      max: 60
    },
    price: { min: 1413819, max: 1912813, avg: 1663316 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1164,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 260 },
          { ware: 'energycells', amount: 520 },
          { ware: 'hullparts', amount: 951 },
        ],
      },
    ]
  },
  module_gen_prod_engineparts_01: {
    id: 'module_gen_prod_engineparts_01',
    name: 'Engine Part Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.engineparts,
    explosionDamage: 10000,
    hull: 120000,
    workForce: {
      max: 150
    },
    price: { min: 2116689, max: 2863755, avg: 2490222 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1240,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 389 },
          { ware: 'energycells', amount: 779 },
          { ware: 'hullparts', amount: 1426 },
        ],
      },
    ]
  },
  module_gen_prod_fieldcoils_01: {
    id: 'module_gen_prod_fieldcoils_01',
    name: 'Field Coil Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.fieldcoils,
    explosionDamage: 10000,
    hull: 149000,
    workForce: {
      max: 540
    },
    price: { min: 9436671, max: 12767261, avg: 11101966 },
    owners: [
      Factions.antigone,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1523,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 1735 },
          { ware: 'energycells', amount: 3470 },
          { ware: 'hullparts', amount: 6351 },
        ],
      },
    ]
  },
  module_gen_prod_graphene_01: {
    id: 'module_gen_prod_graphene_01',
    name: 'Graphene Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.graphene,
    explosionDamage: 10000,
    hull: 190000,
    workForce: {
      max: 120
    },
    price: { min: 152966, max: 206954, avg: 179960 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 743,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 28 },
          { ware: 'energycells', amount: 57 },
          { ware: 'hullparts', amount: 104 },
        ],
      },
    ]
  },
  module_gen_prod_hullparts_01: {
    id: 'module_gen_prod_hullparts_01',
    name: 'Hull Part Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.hullparts,
    explosionDamage: 10000,
    hull: 146000,
    workForce: {
      max: 180
    },
    price: { min: 3340194, max: 4519086, avg: 3929640 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1327,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 614 },
          { ware: 'energycells', amount: 1229 },
          { ware: 'hullparts', amount: 2249 },
        ],
      },
    ]
  },
  module_gen_prod_microchips_01: {
    id: 'module_gen_prod_microchips_01',
    name: 'Microchip Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.microchips,
    explosionDamage: 10000,
    hull: 199000,
    workForce: {
      max: 300
    },
    price: { min: 4122469, max: 5577459, avg: 4849964 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1367,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 758 },
          { ware: 'energycells', amount: 1516 },
          { ware: 'hullparts', amount: 2774 },
        ],
      },
    ]
  },
  module_gen_prod_missilecomponents_01: {
    id: 'module_gen_prod_missilecomponents_01',
    name: 'Missile Component Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.missilecomponents,
    explosionDamage: 10000,
    hull: 159000,
    workForce: {
      max: 15
    },
    price: { min: 191643, max: 259281, avg: 225462 },
    owners: [
      Factions.argon,
      Factions.holyorder,
      Factions.ministry,
      Factions.paranid,
    ],
    production: [
      {
        time: 786,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 35 },
          { ware: 'energycells', amount: 71 },
          { ware: 'hullparts', amount: 131 },
        ],
      },
    ]
  },
  module_gen_prod_plasmaconductors_01: {
    id: 'module_gen_prod_plasmaconductors_01',
    name: 'Plasma Conductor Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.plasmaconductors,
    explosionDamage: 10000,
    hull: 181000,
    workForce: {
      max: 150
    },
    price: { min: 2572901, max: 3480983, avg: 3026942 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1277,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 473 },
          { ware: 'energycells', amount: 946 },
          { ware: 'hullparts', amount: 1732 },
        ],
      },
    ]
  },
  module_gen_prod_quantumtubes_01: {
    id: 'module_gen_prod_quantumtubes_01',
    name: 'Quantum Tube Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.quantumtubes,
    explosionDamage: 10000,
    hull: 148000,
    workForce: {
      max: 150
    },
    price: { min: 2068152, max: 2798088, avg: 2433120 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1236,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 380 },
          { ware: 'energycells', amount: 761 },
          { ware: 'hullparts', amount: 1394 },
        ],
      },
    ]
  },
  module_gen_prod_refinedmetals_01: {
    id: 'module_gen_prod_refinedmetals_01',
    name: 'Refined Metal Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.refinedmetals,
    explosionDamage: 10000,
    hull: 210000,
    workForce: {
      max: 150
    },
    price: { min: 197231, max: 266841, avg: 232036 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 791,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 36 },
          { ware: 'energycells', amount: 73 },
          { ware: 'hullparts', amount: 135 },
        ],
      },
    ]
  },
  module_gen_prod_scanningarrays_01: {
    id: 'module_gen_prod_scanningarrays_01',
    name: 'Scanning Array Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.scanningarrays,
    explosionDamage: 10000,
    hull: 169000,
    workForce: {
      max: 210
    },
    price: { min: 3422258, max: 4630114, avg: 4026186 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1331,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 629 },
          { ware: 'energycells', amount: 1259 },
          { ware: 'hullparts', amount: 2305 },
        ],
      },
    ]
  },
  module_gen_prod_shieldcomponents_01: {
    id: 'module_gen_prod_shieldcomponents_01',
    name: 'Shield Component Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.shieldcomponents,
    explosionDamage: 10000,
    hull: 191000,
    workForce: {
      max: 150
    },
    price: { min: 2350389, max: 3179939, avg: 2765164 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1260,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 432 },
          { ware: 'energycells', amount: 865 },
          { ware: 'hullparts', amount: 1583 },
        ],
      },
    ]
  },
  module_gen_prod_siliconwafers_01: {
    id: 'module_gen_prod_siliconwafers_01',
    name: 'Silicon Wafer Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.siliconwafers,
    explosionDamage: 10000,
    hull: 186000,
    workForce: {
      max: 150
    },
    price: { min: 403430, max: 545818, avg: 474624 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 927,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 74 },
          { ware: 'energycells', amount: 149 },
          { ware: 'hullparts', amount: 273 },
        ],
      },
    ]
  },
  module_gen_prod_smartchips_01: {
    id: 'module_gen_prod_smartchips_01',
    name: 'Smart Chip Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.smartchips,
    explosionDamage: 10000,
    hull: 104000,
    workForce: {
      max: 40
    },
    price: { min: 686545, max: 928855, avg: 807700 },
    owners: [
      Factions.antigone,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1027,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 126 },
          { ware: 'energycells', amount: 253 },
          { ware: 'hullparts', amount: 464 },
        ],
      },
    ]
  },
  module_gen_prod_spices_01: {
    id: 'module_gen_prod_spices_01',
    name: 'Spice Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.spices,
    explosionDamage: 10000,
    hull: 151000,
    workForce: {
      max: 60
    },
    price: { min: 756543, max: 1023558, avg: 890050 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 1046,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 139 },
          { ware: 'energycells', amount: 278 },
          { ware: 'hullparts', amount: 510 },
        ],
      },
    ]
  },
  module_gen_prod_superfluidcoolant_01: {
    id: 'module_gen_prod_superfluidcoolant_01',
    name: 'Superfluid Coolant Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.superfluidcoolant,
    explosionDamage: 10000,
    hull: 177000,
    workForce: {
      max: 120
    },
    price: { min: 137080, max: 185461, avg: 161270 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 722,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 25 },
          { ware: 'energycells', amount: 51 },
          { ware: 'hullparts', amount: 94 },
        ],
      },
    ]
  },
  module_gen_prod_turretcomponents_01: {
    id: 'module_gen_prod_turretcomponents_01',
    name: 'Turret Component Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.turretcomponents,
    explosionDamage: 10000,
    hull: 155000,
    workForce: {
      max: 150
    },
    price: { min: 2584529, max: 3496715, avg: 3040622 },
    owners: [
      Factions.argon,
      Factions.ministry,
      Factions.paranid,
    ],
    production: [
      {
        time: 1278,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 475 },
          { ware: 'energycells', amount: 951 },
          { ware: 'hullparts', amount: 1741 },
        ],
      },
    ]
  },
  module_gen_prod_water_01: {
    id: 'module_gen_prod_water_01',
    name: 'Water Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.water,
    explosionDamage: 10000,
    hull: 203000,
    workForce: {
      max: 120
    },
    price: { min: 195901, max: 265043, avg: 230472 },
    owners: [
      Factions.antigone,
      Factions.argon,
      Factions.holyorder,
      Factions.paranid,
      Factions.teladi,
    ],
    production: [
      {
        time: 790,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 36 },
          { ware: 'energycells', amount: 72 },
          { ware: 'hullparts', amount: 132 },
        ],
      },
    ]
  },
  module_gen_prod_weaponcomponents_01: {
    id: 'module_gen_prod_weaponcomponents_01',
    name: 'Weapon Component Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.weaponcomponents,
    explosionDamage: 10000,
    hull: 208000,
    workForce: {
      max: 150
    },
    price: { min: 2154927, max: 2915489, avg: 2535208 },
    owners: [
      Factions.argon,
      Factions.holyorder,
      Factions.ministry,
    ],
    production: [
      {
        time: 1244,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 396 },
          { ware: 'energycells', amount: 793 },
          { ware: 'hullparts', amount: 1452 },
        ],
      },
    ]
  },
  module_par_conn_base_01: {
    id: 'module_par_conn_base_01',
    name: 'Paranid Base Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 110000,
    makerRace: Races.paranid,
    price: { min: 64410, max: 87142, avg: 75776 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 70,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 12 },
          { ware: 'energycells', amount: 23 },
          { ware: 'hullparts', amount: 42 },
        ],
      },
    ]
  },
  module_par_conn_base_02: {
    id: 'module_par_conn_base_02',
    name: 'Paranid Base Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 230000,
    makerRace: Races.paranid,
    price: { min: 91924, max: 124368, avg: 108146 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 101,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 17 },
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 61 },
        ],
      },
    ]
  },
  module_par_conn_base_03: {
    id: 'module_par_conn_base_03',
    name: 'Paranid Base Connection Structure 03',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 370000,
    makerRace: Races.paranid,
    price: { min: 114728, max: 155220, avg: 134974 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 128,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 21 },
          { ware: 'energycells', amount: 43 },
          { ware: 'hullparts', amount: 78 },
        ],
      },
    ]
  },
  module_par_conn_cross_01: {
    id: 'module_par_conn_cross_01',
    name: 'Paranid Cross Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 90000,
    makerRace: Races.paranid,
    price: { min: 55015, max: 74433, avg: 64724 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 63,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 10 },
          { ware: 'energycells', amount: 21 },
          { ware: 'hullparts', amount: 38 },
        ],
      },
    ]
  },
  module_par_conn_cross_02: {
    id: 'module_par_conn_cross_02',
    name: 'Paranid Cross Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 370000,
    makerRace: Races.paranid,
    price: { min: 114728, max: 155220, avg: 134974 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 128,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 21 },
          { ware: 'energycells', amount: 43 },
          { ware: 'hullparts', amount: 78 },
        ],
      },
    ]
  },
  module_par_conn_cross_03: {
    id: 'module_par_conn_cross_03',
    name: 'Paranid Cross Connection Structure 03',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 230000,
    makerRace: Races.paranid,
    price: { min: 91924, max: 124368, avg: 108146 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 101,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 17 },
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 61 },
        ],
      },
    ]
  },
  module_par_conn_vertical_01: {
    id: 'module_par_conn_vertical_01',
    name: 'Paranid Vertical Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 79000,
    makerRace: Races.paranid,
    price: { min: 54125, max: 73227, avg: 63676 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 59,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 10 },
          { ware: 'energycells', amount: 20 },
          { ware: 'hullparts', amount: 36 },
        ],
      },
    ]
  },
  module_par_conn_vertical_02: {
    id: 'module_par_conn_vertical_02',
    name: 'Paranid Vertical Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 143000,
    makerRace: Races.paranid,
    price: { min: 70888, max: 95908, avg: 83398 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 80,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 13 },
          { ware: 'energycells', amount: 26 },
          { ware: 'hullparts', amount: 48 },
        ],
      },
    ]
  },
  module_par_def_claim_01: {
    id: 'module_par_def_claim_01',
    name: 'Paranid Administrative Centre',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    hull: 133000,
    makerRace: Races.paranid,
    price: { min: 760801, max: 1029319, avg: 895060 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 842,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 140 },
          { ware: 'energycells', amount: 279 },
          { ware: 'hullparts', amount: 511 },
        ],
      },
    ]
  },
  module_par_def_disc_01: {
    id: 'module_par_def_disc_01',
    name: 'Paranid Disc Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 65800,
    makerRace: Races.paranid,
    price: { min: 533140, max: 721308, avg: 627224 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 592,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 98 },
          { ware: 'energycells', amount: 196 },
          { ware: 'hullparts', amount: 359 },
        ],
      },
    ]
  },
  module_par_def_tube_01: {
    id: 'module_par_def_tube_01',
    name: 'Paranid Bridge Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 49600,
    makerRace: Races.paranid,
    price: { min: 462691, max: 625993, avg: 544342 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 514,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 85 },
          { ware: 'energycells', amount: 170 },
          { ware: 'hullparts', amount: 312 },
        ],
      },
    ]
  },
  module_par_hab_l_01: {
    id: 'module_par_hab_l_01',
    name: 'Paranid L Dome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 212426,
    makerRace: Races.paranid,
    workForce: {
      capacity: 999,
      race: Races.paranid
    },
    price: { min: 18262842, max: 24708550, avg: 21485696 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 1265,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 210 },
          { ware: 'energycells', amount: 419 },
          { ware: 'hullparts', amount: 767 },
        ],
      },
    ]
  },
  module_par_hab_m_01: {
    id: 'module_par_hab_m_01',
    name: 'Paranid M Dome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 135378,
    makerRace: Races.paranid,
    workForce: {
      capacity: 666,
      race: Races.paranid
    },
    price: { min: 11754290, max: 15902862, avg: 13828576 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 816,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 135 },
          { ware: 'energycells', amount: 271 },
          { ware: 'hullparts', amount: 495 },
        ],
      },
    ]
  },
  module_par_hab_s_01: {
    id: 'module_par_hab_s_01',
    name: 'Paranid S Dome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 106243,
    makerRace: Races.paranid,
    workForce: {
      capacity: 333,
      race: Races.paranid
    },
    price: { min: 8172621, max: 11057075, avg: 9614848 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 566,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 94 },
          { ware: 'energycells', amount: 188 },
          { ware: 'hullparts', amount: 343 },
        ],
      },
    ]
  },
  module_par_pier_l_01: {
    id: 'module_par_pier_l_01',
    name: 'Paranid 3-Dock T Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 810000,
    makerRace: Races.paranid,
    price: { min: 3060886, max: 4141198, avg: 3601042 },
    owners: [
      Factions.paranid,
    ],
    production: [
      {
        time: 1200,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 563 },
          { ware: 'energycells', amount: 1125 },
          { ware: 'hullparts', amount: 2058 },
        ],
      },
    ]
  },
  module_par_pier_l_02: {
    id: 'module_par_pier_l_02',
    name: 'Paranid 1-Dock Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 270000,
    makerRace: Races.paranid,
    price: { min: 1766944, max: 2390572, avg: 2078758 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 693,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 325 },
          { ware: 'energycells', amount: 650 },
          { ware: 'hullparts', amount: 1188 },
        ],
      },
    ]
  },
  module_par_pier_l_03: {
    id: 'module_par_pier_l_03',
    name: 'Paranid 3-Dock E Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 1080000,
    makerRace: Races.paranid,
    price: { min: 3534314, max: 4781718, avg: 4158016 },
    owners: [
      Factions.holyorder,
    ],
    production: [
      {
        time: 1386,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 650 },
          { ware: 'energycells', amount: 1299 },
          { ware: 'hullparts', amount: 2377 },
        ],
      },
    ]
  },
  module_par_prod_majadust_01: {
    id: 'module_par_prod_majadust_01',
    name: 'Maja Dust Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.majadust,
    explosionDamage: 10000,
    hull: 245000,
    makerRace: Races.paranid,
    workForce: {
      max: 123
    },
    price: { min: 2029023, max: 2745149, avg: 2387086 },
    owners: [
      Factions.hatikvah,
      Factions.scaleplate,
    ],
    production: [
      {
        time: 1232,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          { ware: 'claytronics', amount: 373 },
          { ware: 'energycells', amount: 746 },
          { ware: 'hullparts', amount: 1366 },
        ],
      },
    ]
  },
  module_par_prod_majasnails_01: {
    id: 'module_par_prod_majasnails_01',
    name: 'Maja Snail Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.majasnails,
    explosionDamage: 10000,
    hull: 236000,
    makerRace: Races.paranid,
    workForce: {
      max: 78
    },
    price: { min: 1349848, max: 1826264, avg: 1588056 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 1155,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          { ware: 'claytronics', amount: 248 },
          { ware: 'energycells', amount: 497 },
          { ware: 'hullparts', amount: 910 },
        ],
      },
    ]
  },
  module_par_prod_medicalsupplies_01: {
    id: 'module_par_prod_medicalsupplies_01',
    name: 'Paranid Medical Supply Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.medicalsupplies,
    explosionDamage: 10000,
    hull: 197000,
    makerRace: Races.paranid,
    workForce: {
      max: 90
    },
    price: { min: 1229080, max: 1662872, avg: 1445976 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 1138,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          { ware: 'claytronics', amount: 226 },
          { ware: 'energycells', amount: 451 },
          { ware: 'hullparts', amount: 827 },
        ],
      },
    ]
  },
  module_par_prod_sojabeans_01: {
    id: 'module_par_prod_sojabeans_01',
    name: 'Soja Bean Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.sojabeans,
    explosionDamage: 10000,
    hull: 259000,
    makerRace: Races.paranid,
    workForce: {
      max: 78
    },
    price: { min: 1610158, max: 2178450, avg: 1894304 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 1189,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          { ware: 'claytronics', amount: 296 },
          { ware: 'energycells', amount: 592 },
          { ware: 'hullparts', amount: 1084 },
        ],
      },
    ]
  },
  module_par_prod_sojahusk_01: {
    id: 'module_par_prod_sojahusk_01',
    name: 'Soja Husk Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.sojahusk,
    explosionDamage: 10000,
    hull: 218000,
    makerRace: Races.paranid,
    workForce: {
      max: 99
    },
    price: { min: 1719737, max: 2326703, avg: 2023220 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 1201,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          { ware: 'claytronics', amount: 316 },
          { ware: 'energycells', amount: 633 },
          { ware: 'hullparts', amount: 1159 },
        ],
      },
    ]
  },
  module_par_stor_container_l_01: {
    id: 'module_par_stor_container_l_01',
    name: 'Paranid L Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 653000,
    makerRace: Races.paranid,
    cargo: { max: 1000000, type: CargoTypes.container },
    price: { min: 674026, max: 911918, avg: 792972 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 964,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 124 },
          { ware: 'energycells', amount: 247 },
          { ware: 'hullparts', amount: 453 },
        ],
      },
    ]
  },
  module_par_stor_container_m_01: {
    id: 'module_par_stor_container_m_01',
    name: 'Paranid M Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 304000,
    makerRace: Races.paranid,
    cargo: { max: 100000, type: CargoTypes.container },
    price: { min: 457555, max: 619045, avg: 538300 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 658,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 84 },
          { ware: 'energycells', amount: 169 },
          { ware: 'hullparts', amount: 309 },
        ],
      },
    ]
  },
  module_par_stor_container_s_01: {
    id: 'module_par_stor_container_s_01',
    name: 'Paranid S Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    hull: 133000,
    makerRace: Races.paranid,
    cargo: { max: 25000, type: CargoTypes.container },
    price: { min: 304150, max: 411498, avg: 357824 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 435,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 56 },
          { ware: 'energycells', amount: 112 },
          { ware: 'hullparts', amount: 204 },
        ],
      },
    ]
  },
  module_par_stor_liquid_l_01: {
    id: 'module_par_stor_liquid_l_01',
    name: 'Paranid L Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    hull: 653000,
    makerRace: Races.paranid,
    cargo: { max: 1000000, type: CargoTypes.liquid },
    price: { min: 674026, max: 911918, avg: 792972 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 964,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 124 },
          { ware: 'energycells', amount: 247 },
          { ware: 'hullparts', amount: 453 },
        ],
      },
    ]
  },
  module_par_stor_liquid_m_01: {
    id: 'module_par_stor_liquid_m_01',
    name: 'Paranid M Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    hull: 304000,
    makerRace: Races.paranid,
    cargo: { max: 500000, type: CargoTypes.liquid },
    price: { min: 457555, max: 619045, avg: 538300 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 658,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 84 },
          { ware: 'energycells', amount: 169 },
          { ware: 'hullparts', amount: 309 },
        ],
      },
    ]
  },
  module_par_stor_liquid_s_01: {
    id: 'module_par_stor_liquid_s_01',
    name: 'Paranid S Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    hull: 133000,
    makerRace: Races.paranid,
    cargo: { max: 100000, type: CargoTypes.liquid },
    price: { min: 304150, max: 411498, avg: 357824 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 435,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 56 },
          { ware: 'energycells', amount: 112 },
          { ware: 'hullparts', amount: 204 },
        ],
      },
    ]
  },
  module_par_stor_solid_l_01: {
    id: 'module_par_stor_solid_l_01',
    name: 'Paranid L Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 653000,
    makerRace: Races.paranid,
    cargo: { max: 1000000, type: CargoTypes.solid },
    price: { min: 674026, max: 911918, avg: 792972 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 964,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 124 },
          { ware: 'energycells', amount: 247 },
          { ware: 'hullparts', amount: 453 },
        ],
      },
    ]
  },
  module_par_stor_solid_m_01: {
    id: 'module_par_stor_solid_m_01',
    name: 'Paranid M Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 304000,
    makerRace: Races.paranid,
    cargo: { max: 500000, type: CargoTypes.solid },
    price: { min: 457555, max: 619045, avg: 538300 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 658,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 84 },
          { ware: 'energycells', amount: 169 },
          { ware: 'hullparts', amount: 309 },
        ],
      },
    ]
  },
  module_par_stor_solid_s_01: {
    id: 'module_par_stor_solid_s_01',
    name: 'Paranid S Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 133000,
    makerRace: Races.paranid,
    cargo: { max: 100000, type: CargoTypes.solid },
    price: { min: 304150, max: 411498, avg: 357824 },
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    production: [
      {
        time: 435,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 56 },
          { ware: 'energycells', amount: 112 },
          { ware: 'hullparts', amount: 204 },
        ],
      },
    ]
  },
  module_tel_conn_base_01: {
    id: 'module_tel_conn_base_01',
    name: 'Teladi Base Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 238000,
    makerRace: Races.teladi,
    price: { min: 92363, max: 124961, avg: 108662 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 103,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 17 },
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 62 },
        ],
      },
    ]
  },
  module_tel_conn_base_02: {
    id: 'module_tel_conn_base_02',
    name: 'Teladi Base Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 150000,
    makerRace: Races.teladi,
    price: { min: 75585, max: 102263, avg: 88924 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 82,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 14 },
          { ware: 'energycells', amount: 27 },
          { ware: 'hullparts', amount: 50 },
        ],
      },
    ]
  },
  module_tel_conn_base_03: {
    id: 'module_tel_conn_base_03',
    name: 'Teladi Base Connection Structure 03',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 280000,
    makerRace: Races.teladi,
    price: { min: 98841, max: 133727, avg: 116284 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 112,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 18 },
          { ware: 'energycells', amount: 37 },
          { ware: 'hullparts', amount: 68 },
        ],
      },
    ]
  },
  module_tel_conn_cross_01: {
    id: 'module_tel_conn_cross_01',
    name: 'Teladi Cross Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 120000,
    makerRace: Races.teladi,
    price: { min: 65300, max: 88348, avg: 76824 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 73,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 12 },
          { ware: 'energycells', amount: 24 },
          { ware: 'hullparts', amount: 44 },
        ],
      },
    ]
  },
  module_tel_conn_vertical_01: {
    id: 'module_tel_conn_vertical_01',
    name: 'Teladi Vertical Connection Structure 01',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 79000,
    makerRace: Races.teladi,
    price: { min: 54125, max: 73227, avg: 63676 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 59,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 10 },
          { ware: 'energycells', amount: 20 },
          { ware: 'hullparts', amount: 36 },
        ],
      },
    ]
  },
  module_tel_conn_vertical_02: {
    id: 'module_tel_conn_vertical_02',
    name: 'Teladi Vertical Connection Structure 02',
    description: 'No information available',
    type: ModuleTypes.connectionmodule,
    hull: 143000,
    makerRace: Races.teladi,
    price: { min: 70888, max: 95908, avg: 83398 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 80,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 13 },
          { ware: 'energycells', amount: 26 },
          { ware: 'hullparts', amount: 48 },
        ],
      },
    ]
  },
  module_tel_def_claim_01: {
    id: 'module_tel_def_claim_01',
    name: 'Teladi Administrative Centre',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    hull: 129000,
    makerRace: Races.teladi,
    price: { min: 749625, max: 1014199, avg: 881912 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 829,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 138 },
          { ware: 'energycells', amount: 275 },
          { ware: 'hullparts', amount: 503 },
        ],
      },
    ]
  },
  module_tel_def_disc_01: {
    id: 'module_tel_def_disc_01',
    name: 'Teladi Disc Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 65800,
    makerRace: Races.teladi,
    price: { min: 533140, max: 721308, avg: 627224 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 592,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 98 },
          { ware: 'energycells', amount: 196 },
          { ware: 'hullparts', amount: 359 },
        ],
      },
    ]
  },
  module_tel_def_tube_01: {
    id: 'module_tel_def_tube_01',
    name: 'Teladi Bridge Defence Platform',
    description: 'No information available',
    type: ModuleTypes.defencemodule,
    explosionDamage: 12000,
    hull: 49600,
    makerRace: Races.teladi,
    price: { min: 462691, max: 625993, avg: 544342 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 514,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 85 },
          { ware: 'energycells', amount: 170 },
          { ware: 'hullparts', amount: 312 },
        ],
      },
    ]
  },
  module_tel_hab_l_01: {
    id: 'module_tel_hab_l_01',
    name: 'Teladi L Biome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 178582,
    makerRace: Races.teladi,
    workForce: {
      capacity: 1000,
      race: Races.teladi
    },
    price: { min: 15822621, max: 21407075, avg: 18614848 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1095,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 182 },
          { ware: 'energycells', amount: 363 },
          { ware: 'hullparts', amount: 664 },
        ],
      },
    ]
  },
  module_tel_hab_m_01: {
    id: 'module_tel_hab_m_01',
    name: 'Teladi M Biome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 183126,
    makerRace: Races.teladi,
    workForce: {
      capacity: 500,
      race: Races.teladi
    },
    price: { min: 10530453, max: 14247083, avg: 12388768 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 730,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 121 },
          { ware: 'energycells', amount: 242 },
          { ware: 'hullparts', amount: 443 },
        ],
      },
    ]
  },
  module_tel_hab_s_01: {
    id: 'module_tel_hab_s_01',
    name: 'Teladi S Biome',
    description: 'No information available',
    type: ModuleTypes.habitation,
    explosionDamage: 100000,
    hull: 148471,
    makerRace: Races.teladi,
    workForce: {
      capacity: 250,
      race: Races.teladi
    },
    price: { min: 7471187, max: 10108077, avg: 8789632 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 516,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 86 },
          { ware: 'energycells', amount: 171 },
          { ware: 'hullparts', amount: 313 },
        ],
      },
    ]
  },
  module_tel_pier_l_01: {
    id: 'module_tel_pier_l_01',
    name: 'Teladi 3-Dock T Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 750000,
    makerRace: Races.teladi,
    price: { min: 2946171, max: 3985997, avg: 3466084 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 1155,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 542 },
          { ware: 'energycells', amount: 1083 },
          { ware: 'hullparts', amount: 1980 },
        ],
      },
    ]
  },
  module_tel_pier_l_02: {
    id: 'module_tel_pier_l_02',
    name: 'Teladi 1-Dock Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 250000,
    makerRace: Races.teladi,
    price: { min: 1701192, max: 2301612, avg: 2001402 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 667,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 313 },
          { ware: 'energycells', amount: 625 },
          { ware: 'hullparts', amount: 1143 },
        ],
      },
    ]
  },
  module_tel_pier_l_03: {
    id: 'module_tel_pier_l_03',
    name: 'Teladi 3-Dock E Pier',
    description: 'No information available',
    type: ModuleTypes.pier,
    explosionDamage: 10000,
    hull: 1000000,
    makerRace: Races.teladi,
    price: { min: 3399016, max: 4598668, avg: 3998842 },
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    production: [
      {
        time: 1333,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 625 },
          { ware: 'energycells', amount: 1250 },
          { ware: 'hullparts', amount: 2287 },
        ],
      },
    ]
  },
  module_tel_prod_advancedcomposites_01: {
    id: 'module_tel_prod_advancedcomposites_01',
    name: 'Teladi Advanced Composite Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.advancedcomposites,
    explosionDamage: 10000,
    hull: 197000,
    makerRace: Races.teladi,
    workForce: {
      max: 210
    },
    price: { min: 3416014, max: 4621666, avg: 4018840 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1329,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 628 },
          { ware: 'energycells', amount: 1241 },
          { ware: 'hullparts', amount: 2300 },
        ],
      },
    ]
  },
  module_tel_prod_engineparts_01: {
    id: 'module_tel_prod_engineparts_01',
    name: 'Teladi Engine Part Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.engineparts,
    explosionDamage: 10000,
    hull: 120000,
    makerRace: Races.teladi,
    workForce: {
      max: 150
    },
    price: { min: 2143163, max: 2899573, avg: 2521368 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1241,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 394 },
          { ware: 'energycells', amount: 778 },
          { ware: 'hullparts', amount: 1443 },
        ],
      },
    ]
  },
  module_tel_prod_hullparts_01: {
    id: 'module_tel_prod_hullparts_01',
    name: 'Teladi Hull Part Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.hullparts,
    explosionDamage: 10000,
    hull: 146000,
    makerRace: Races.teladi,
    workForce: {
      max: 180
    },
    price: { min: 3339976, max: 4518792, avg: 3929384 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1325,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 614 },
          { ware: 'energycells', amount: 1213 },
          { ware: 'hullparts', amount: 2249 },
        ],
      },
    ]
  },
  module_tel_prod_medicalsupplies_01: {
    id: 'module_tel_prod_medicalsupplies_01',
    name: 'Teladi Medical Supply Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.medicalsupplies,
    explosionDamage: 10000,
    hull: 197000,
    makerRace: Races.teladi,
    workForce: {
      max: 90
    },
    price: { min: 1219233, max: 1649551, avg: 1434392 },
    owners: [
      Factions.ministry,
    ],
    production: [
      {
        time: 1136,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 224 },
          { ware: 'energycells', amount: 448 },
          { ware: 'hullparts', amount: 822 },
        ],
      },
    ]
  },
  module_tel_prod_nostropoil_01: {
    id: 'module_tel_prod_nostropoil_01',
    name: 'Nostrop Oil Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.nostropoil,
    explosionDamage: 10000,
    hull: 276000,
    makerRace: Races.teladi,
    workForce: {
      max: 120
    },
    price: { min: 1574127, max: 2129701, avg: 1851914 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1184,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 289 },
          { ware: 'energycells', amount: 579 },
          { ware: 'hullparts', amount: 1063 },
        ],
      },
    ]
  },
  module_tel_prod_scanningarrays_01: {
    id: 'module_tel_prod_scanningarrays_01',
    name: 'Teladi Scanning Array Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.scanningarrays,
    explosionDamage: 10000,
    hull: 169000,
    makerRace: Races.teladi,
    workForce: {
      max: 210
    },
    price: { min: 3464989, max: 4687927, avg: 4076458 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1332,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 637 },
          { ware: 'energycells', amount: 1259 },
          { ware: 'hullparts', amount: 2333 },
        ],
      },
    ]
  },
  module_tel_prod_spaceweed_01: {
    id: 'module_tel_prod_spaceweed_01',
    name: 'Spaceweed Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.spaceweed,
    explosionDamage: 10000,
    hull: 260000,
    makerRace: Races.teladi,
    workForce: {
      max: 90
    },
    price: { min: 3475040, max: 4701524, avg: 4088282 },
    owners: [
      Factions.hatikvah,
      Factions.scaleplate,
      Factions.teladi,
    ],
    production: [
      {
        time: 1334,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 639 },
          { ware: 'energycells', amount: 1277 },
          { ware: 'hullparts', amount: 2338 },
        ],
      },
    ]
  },
  module_tel_prod_sunriseflowers_01: {
    id: 'module_tel_prod_sunriseflowers_01',
    name: 'Sunrise Flower Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.sunriseflowers,
    explosionDamage: 10000,
    hull: 235000,
    makerRace: Races.teladi,
    workForce: {
      max: 75
    },
    price: { min: 1611474, max: 2180230, avg: 1895852 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1189,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 296 },
          { ware: 'energycells', amount: 592 },
          { ware: 'hullparts', amount: 1087 },
        ],
      },
    ]
  },
  module_tel_prod_swampplant_01: {
    id: 'module_tel_prod_swampplant_01',
    name: 'Swamp Plant Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.swampplant,
    explosionDamage: 10000,
    hull: 287000,
    makerRace: Races.teladi,
    workForce: {
      max: 75
    },
    price: { min: 3475040, max: 4701524, avg: 4088282 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 1334,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 639 },
          { ware: 'energycells', amount: 1277 },
          { ware: 'hullparts', amount: 2338 },
        ],
      },
    ]
  },
  module_tel_prod_teladianium_01: {
    id: 'module_tel_prod_teladianium_01',
    name: 'Teladianium Production',
    description: 'No information available',
    type: ModuleTypes.production,
    product: Wares.teladianium,
    explosionDamage: 10000,
    hull: 226000,
    makerRace: Races.teladi,
    workForce: {
      max: 180
    },
    price: { min: 272830, max: 369122, avg: 320976 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 853,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          { ware: 'claytronics', amount: 50 },
          { ware: 'energycells', amount: 101 },
          { ware: 'hullparts', amount: 185 },
        ],
      },
    ]
  },
  module_tel_stor_container_l_01: {
    id: 'module_tel_stor_container_l_01',
    name: 'Teladi L Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 531000,
    makerRace: Races.teladi,
    cargo: { max: 1000000, type: CargoTypes.container },
    price: { min: 608287, max: 822977, avg: 715632 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 869,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 112 },
          { ware: 'energycells', amount: 223 },
          { ware: 'hullparts', amount: 408 },
        ],
      },
    ]
  },
  module_tel_stor_container_m_01: {
    id: 'module_tel_stor_container_m_01',
    name: 'Teladi M Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 259000,
    makerRace: Races.teladi,
    cargo: { max: 100000, type: CargoTypes.container },
    price: { min: 424014, max: 573666, avg: 498840 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 607,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 78 },
          { ware: 'energycells', amount: 156 },
          { ware: 'hullparts', amount: 285 },
        ],
      },
    ]
  },
  module_tel_stor_container_s_01: {
    id: 'module_tel_stor_container_s_01',
    name: 'Teladi S Container Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 111000,
    makerRace: Races.teladi,
    cargo: { max: 25000, type: CargoTypes.container },
    price: { min: 277527, max: 375477, avg: 326502 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 397,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 51 },
          { ware: 'energycells', amount: 102 },
          { ware: 'hullparts', amount: 187 },
        ],
      },
    ]
  },
  module_tel_stor_liquid_l_01: {
    id: 'module_tel_stor_liquid_l_01',
    name: 'Teladi L Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 531000,
    makerRace: Races.teladi,
    cargo: { max: 1000000, type: CargoTypes.liquid },
    price: { min: 608287, max: 822977, avg: 715632 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 869,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 112 },
          { ware: 'energycells', amount: 223 },
          { ware: 'hullparts', amount: 408 },
        ],
      },
    ]
  },
  module_tel_stor_liquid_m_01: {
    id: 'module_tel_stor_liquid_m_01',
    name: 'Teladi M Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 259000,
    makerRace: Races.teladi,
    cargo: { max: 500000, type: CargoTypes.liquid },
    price: { min: 424014, max: 573666, avg: 498840 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 607,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 78 },
          { ware: 'energycells', amount: 156 },
          { ware: 'hullparts', amount: 285 },
        ],
      },
    ]
  },
  module_tel_stor_liquid_s_01: {
    id: 'module_tel_stor_liquid_s_01',
    name: 'Teladi S Liquid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 111000,
    makerRace: Races.teladi,
    cargo: { max: 100000, type: CargoTypes.liquid },
    price: { min: 277527, max: 375477, avg: 326502 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 397,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 51 },
          { ware: 'energycells', amount: 102 },
          { ware: 'hullparts', amount: 187 },
        ],
      },
    ]
  },
  module_tel_stor_solid_l_01: {
    id: 'module_tel_stor_solid_l_01',
    name: 'Teladi L Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 10000,
    hull: 531000,
    makerRace: Races.teladi,
    cargo: { max: 1000000, type: CargoTypes.solid },
    price: { min: 608287, max: 822977, avg: 715632 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 869,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 112 },
          { ware: 'energycells', amount: 223 },
          { ware: 'hullparts', amount: 408 },
        ],
      },
    ]
  },
  module_tel_stor_solid_m_01: {
    id: 'module_tel_stor_solid_m_01',
    name: 'Teladi M Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 8000,
    hull: 259000,
    makerRace: Races.teladi,
    cargo: { max: 500000, type: CargoTypes.solid },
    price: { min: 424014, max: 573666, avg: 498840 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 607,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 78 },
          { ware: 'energycells', amount: 156 },
          { ware: 'hullparts', amount: 285 },
        ],
      },
    ]
  },
  module_tel_stor_solid_s_01: {
    id: 'module_tel_stor_solid_s_01',
    name: 'Teladi S Solid Storage',
    description: 'No information available',
    type: ModuleTypes.storage,
    explosionDamage: 5000,
    hull: 111000,
    makerRace: Races.teladi,
    cargo: { max: 100000, type: CargoTypes.solid },
    price: { min: 277527, max: 375477, avg: 326502 },
    owners: [
      Factions.teladi,
    ],
    production: [
      {
        time: 397,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'claytronics', amount: 51 },
          { ware: 'energycells', amount: 102 },
          { ware: 'hullparts', amount: 187 },
        ],
      },
    ]
  },
};

export const AllModules = [
  Modules.module_arg_conn_base_01,
  Modules.module_arg_conn_base_02,
  Modules.module_arg_conn_base_03,
  Modules.module_arg_conn_cross_01,
  Modules.module_arg_conn_vertical_01,
  Modules.module_arg_conn_vertical_02,
  Modules.module_arg_def_claim_01,
  Modules.module_arg_def_disc_01,
  Modules.module_arg_def_tube_01,
  Modules.module_arg_dock_m_01,
  Modules.module_arg_dock_m_01_hightech,
  Modules.module_arg_dock_m_01_lowtech,
  Modules.module_arg_dock_m_02,
  Modules.module_arg_dock_m_02_hightech,
  Modules.module_arg_dock_m_02_lowtech,
  Modules.module_arg_hab_l_01,
  Modules.module_arg_hab_m_01,
  Modules.module_arg_hab_s_01,
  Modules.module_arg_pier_l_01,
  Modules.module_arg_pier_l_02,
  Modules.module_arg_pier_l_03,
  Modules.module_arg_prod_foodrations_01,
  Modules.module_arg_prod_meat_01,
  Modules.module_arg_prod_medicalsupplies_01,
  Modules.module_arg_prod_spacefuel_01,
  Modules.module_arg_prod_wheat_01,
  Modules.module_arg_stor_container_l_01,
  Modules.module_arg_stor_container_m_01,
  Modules.module_arg_stor_container_s_01,
  Modules.module_arg_stor_liquid_l_01,
  Modules.module_arg_stor_liquid_m_01,
  Modules.module_arg_stor_liquid_s_01,
  Modules.module_arg_stor_solid_l_01,
  Modules.module_arg_stor_solid_m_01,
  Modules.module_arg_stor_solid_s_01,
  Modules.module_gen_prod_advancedcomposites_01,
  Modules.module_gen_prod_advancedelectronics_01,
  Modules.module_gen_prod_antimattercells_01,
  Modules.module_gen_prod_antimatterconverters_01,
  Modules.module_gen_prod_claytronics_01,
  Modules.module_gen_prod_dronecomponents_01,
  Modules.module_gen_prod_energycells_01,
  Modules.module_gen_prod_engineparts_01,
  Modules.module_gen_prod_fieldcoils_01,
  Modules.module_gen_prod_graphene_01,
  Modules.module_gen_prod_hullparts_01,
  Modules.module_gen_prod_microchips_01,
  Modules.module_gen_prod_missilecomponents_01,
  Modules.module_gen_prod_plasmaconductors_01,
  Modules.module_gen_prod_quantumtubes_01,
  Modules.module_gen_prod_refinedmetals_01,
  Modules.module_gen_prod_scanningarrays_01,
  Modules.module_gen_prod_shieldcomponents_01,
  Modules.module_gen_prod_siliconwafers_01,
  Modules.module_gen_prod_smartchips_01,
  Modules.module_gen_prod_spices_01,
  Modules.module_gen_prod_superfluidcoolant_01,
  Modules.module_gen_prod_turretcomponents_01,
  Modules.module_gen_prod_water_01,
  Modules.module_gen_prod_weaponcomponents_01,
  Modules.module_par_conn_base_01,
  Modules.module_par_conn_base_02,
  Modules.module_par_conn_base_03,
  Modules.module_par_conn_cross_01,
  Modules.module_par_conn_cross_02,
  Modules.module_par_conn_cross_03,
  Modules.module_par_conn_vertical_01,
  Modules.module_par_conn_vertical_02,
  Modules.module_par_def_claim_01,
  Modules.module_par_def_disc_01,
  Modules.module_par_def_tube_01,
  Modules.module_par_hab_l_01,
  Modules.module_par_hab_m_01,
  Modules.module_par_hab_s_01,
  Modules.module_par_pier_l_01,
  Modules.module_par_pier_l_02,
  Modules.module_par_pier_l_03,
  Modules.module_par_prod_majadust_01,
  Modules.module_par_prod_majasnails_01,
  Modules.module_par_prod_medicalsupplies_01,
  Modules.module_par_prod_sojabeans_01,
  Modules.module_par_prod_sojahusk_01,
  Modules.module_par_stor_container_l_01,
  Modules.module_par_stor_container_m_01,
  Modules.module_par_stor_container_s_01,
  Modules.module_par_stor_liquid_l_01,
  Modules.module_par_stor_liquid_m_01,
  Modules.module_par_stor_liquid_s_01,
  Modules.module_par_stor_solid_l_01,
  Modules.module_par_stor_solid_m_01,
  Modules.module_par_stor_solid_s_01,
  Modules.module_tel_conn_base_01,
  Modules.module_tel_conn_base_02,
  Modules.module_tel_conn_base_03,
  Modules.module_tel_conn_cross_01,
  Modules.module_tel_conn_vertical_01,
  Modules.module_tel_conn_vertical_02,
  Modules.module_tel_def_claim_01,
  Modules.module_tel_def_disc_01,
  Modules.module_tel_def_tube_01,
  Modules.module_tel_hab_l_01,
  Modules.module_tel_hab_m_01,
  Modules.module_tel_hab_s_01,
  Modules.module_tel_pier_l_01,
  Modules.module_tel_pier_l_02,
  Modules.module_tel_pier_l_03,
  Modules.module_tel_prod_advancedcomposites_01,
  Modules.module_tel_prod_engineparts_01,
  Modules.module_tel_prod_hullparts_01,
  Modules.module_tel_prod_medicalsupplies_01,
  Modules.module_tel_prod_nostropoil_01,
  Modules.module_tel_prod_scanningarrays_01,
  Modules.module_tel_prod_spaceweed_01,
  Modules.module_tel_prod_sunriseflowers_01,
  Modules.module_tel_prod_swampplant_01,
  Modules.module_tel_prod_teladianium_01,
  Modules.module_tel_stor_container_l_01,
  Modules.module_tel_stor_container_m_01,
  Modules.module_tel_stor_container_s_01,
  Modules.module_tel_stor_liquid_l_01,
  Modules.module_tel_stor_liquid_m_01,
  Modules.module_tel_stor_liquid_s_01,
  Modules.module_tel_stor_solid_l_01,
  Modules.module_tel_stor_solid_m_01,
  Modules.module_tel_stor_solid_s_01,
];
