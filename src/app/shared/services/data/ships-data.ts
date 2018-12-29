/* tslint:disable:max-line-length */
import { ShipPurpose } from './ship-purpose-data';
import { Size } from './size-data';
import { ShipType } from './ship-type-data';
import { Races } from './race-data';
import { Factions } from './factions-data';

export const Ships = [
  {
    id: 'ship_arg_l_destroyer_01_a',
    name: 'Behemoth Vanguard',
    description: 'The original design of the Behemoth-class destroyer was put into development mid-way through the Kha\'ak conflict, during which the Titan-class was beginning to show its age and inefficiencies. At first too expensive for a crippled Argon economy, then too complex to produce quickly during the Terran Conflict, the first Behemoth did not ship out until long after that war had ended, and the Jump Gates had begun to catastrophically fail. It was only when Argon Prime and Black Hole Sun came back into contact that the Behemoth could be rolled out more frequently.',
    race: Races.argon,
    explosionDamage: 10000,
    hull: 93000,
    storage: { missile: 160, unit: 10 },
    people: 44,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.argon,
    ],
    price: { min: 4895057, max: 6622724, avg: 5758890 },
    production: [
      {
        time: 182,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1008 },
          { ware: 'hullparts', amount: 4433 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_destroyer_01_b',
    name: 'Behemoth Sentinel',
    description: 'The original design of the Behemoth-class destroyer was put into development mid-way through the Kha\'ak conflict, during which the Titan-class was beginning to show its age and inefficiencies. At first too expensive for a crippled Argon economy, then too complex to produce quickly during the Terran Conflict, the first Behemoth did not ship out until long after that war had ended, and the Jump Gates had begun to catastrophically fail. It was only when Argon Prime and Black Hole Sun came back into contact that the Behemoth could be rolled out more frequently.',
    race: Races.argon,
    explosionDamage: 10000,
    hull: 111000,
    storage: { missile: 160, unit: 10 },
    people: 36,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.antigone,
    ],
    price: { min: 5859033, max: 7926927, avg: 6892980 },
    production: [
      {
        time: 218,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1206 },
          { ware: 'hullparts', amount: 5306 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_miner_liquid_01_a',
    name: 'Magnetar (Gas) Vanguard',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 26000,
    storage: { missile: 30, unit: 10 },
    people: 46,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.argon,
    ],
    price: { min: 1349018, max: 1825142, avg: 1587080 },
    production: [
      {
        time: 83,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 461 },
          { ware: 'hullparts', amount: 1216 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_miner_liquid_01_b',
    name: 'Magnetar (Gas) Sentinel',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 32000,
    storage: { missile: 30, unit: 10 },
    people: 38,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.antigone,
    ],
    price: { min: 1639667, max: 2218373, avg: 1929020 },
    production: [
      {
        time: 101,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 560 },
          { ware: 'hullparts', amount: 1478 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_miner_solid_01_a',
    name: 'Magnetar (Mineral) Vanguard',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 26000,
    storage: { missile: 30, unit: 10 },
    people: 46,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.argon,
    ],
    price: { min: 1345695, max: 1820646, avg: 1583170 },
    production: [
      {
        time: 83,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 460 },
          { ware: 'hullparts', amount: 1213 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_miner_solid_01_b',
    name: 'Magnetar (Mineral) Sentinel',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 32000,
    storage: { missile: 30, unit: 10 },
    people: 38,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.antigone,
    ],
    price: { min: 1636344, max: 2213877, avg: 1925110 },
    production: [
      {
        time: 101,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 559 },
          { ware: 'hullparts', amount: 1475 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_01_a',
    name: 'Veles Vanguard',
    description: 'Designed and produced by the Antigone Republic after the Jump Gates began to realign, the Veles-class freighter is more compact and self-sufficient than any freighter-class ship before it; the reason why it became part of the on-going technology exchange between the Republic and their Argon Federation allies.nnBuilt using a highly modular design, many ship designers have taken the base Veles model and reorganised it, as well as making their own changes to the internal systems, to sell an ever-growing number of variations on the ship. However, the Veles remains a popular choice among traders and station builders.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 57000,
    storage: { missile: 30, unit: 10 },
    people: 110,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 3162842, max: 4279139, avg: 3720990 },
    production: [
      {
        time: 195,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1080 },
          { ware: 'hullparts', amount: 2851 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_01_b',
    name: 'Veles Sentinel',
    description: 'Designed and produced by the Antigone Republic after the Jump Gates began to realign, the Veles-class freighter is more compact and self-sufficient than any freighter-class ship before it; the reason why it became part of the on-going technology exchange between the Republic and their Argon Federation allies.nnBuilt using a highly modular design, many ship designers have taken the base Veles model and reorganised it, as well as making their own changes to the internal systems, to sell an ever-growing number of variations on the ship. However, the Veles remains a popular choice among traders and station builders.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 69000,
    storage: { missile: 30, unit: 10 },
    people: 91,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 3811842, max: 5157198, avg: 4484520 },
    production: [
      {
        time: 235,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1302 },
          { ware: 'hullparts', amount: 3436 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_02_a',
    name: 'Mokosi Vanguard',
    description: 'When Argon Federation ship designers received the blue-prints for the Veles, it was immediately recognisable as a highly modular ship, and so they began work straight away on different variations that could provide more variety and competition in a ship class that was both needed and popular throughout Argon space.nnOne of the first ships to come from this process was the Mokosi, designed in Black Hole Sun. Though it uses the same base chassis as the Veles, a different container configuration and tweaks to several internal systems to adapt have created a fine addition to the Argon merchant fleet.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 53000,
    storage: { missile: 30, unit: 10 },
    people: 113,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 3283754, max: 4442726, avg: 3863240 },
    production: [
      {
        time: 203,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1121 },
          { ware: 'hullparts', amount: 2960 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_02_b',
    name: 'Mokosi Sentinel',
    description: 'When Argon Federation ship designers received the blue-prints for the Veles, it was immediately recognisable as a highly modular ship, and so they began work straight away on different variations that could provide more variety and competition in a ship class that was both needed and popular throughout Argon space.nnOne of the first ships to come from this process was the Mokosi, designed in Black Hole Sun. Though it uses the same base chassis as the Veles, a different container configuration and tweaks to several internal systems to adapt have created a fine addition to the Argon merchant fleet.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 64000,
    storage: { missile: 30, unit: 10 },
    people: 94,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 3946049, max: 5338772, avg: 4642410 },
    production: [
      {
        time: 244,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1347 },
          { ware: 'hullparts', amount: 3557 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_03_a',
    name: 'Incarcatura Vanguard',
    description: 'Designed and produced as part of the push to revitalise the Argon economy after the Jump Gate realignment, the relatively new Incarcatura has become a popular alternative to the Veles and Mokosi design. Though there have been some concerns as to its length, that it might caught flight problems, most experts are willing to overlook these problems due to its cargo efficiency.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 78000,
    storage: { missile: 30, unit: 10 },
    people: 207,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 3195014, max: 4322666, avg: 3758840 },
    production: [
      {
        time: 197,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1091 },
          { ware: 'hullparts', amount: 2880 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_03_b',
    name: 'Incarcatura Sentinel',
    description: 'Designed and produced as part of the push to revitalise the Argon economy after the Jump Gate realignment, the relatively new Incarcatura has become a popular alternative to the Veles and Mokosi design. Though there have been some concerns as to its length, that it might caught flight problems, most experts are willing to overlook these problems due to its cargo efficiency.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 93000,
    storage: { missile: 30, unit: 10 },
    people: 172,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 5157503, max: 6977798, avg: 6067650 },
    production: [
      {
        time: 319,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1761 },
          { ware: 'hullparts', amount: 4649 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_04_a',
    name: 'Shuyaku Vanguard',
    description: 'Designed in parallel to the Incarcatura, as part of the push to rejuvenate the Argon economy, the Shuyaku-class freighter is a Sonra variant, extending the Terracorp-designed freighter\'s cargo bay at the cost of some manoeuvrability. The Shuyaku also marks the Hatikvah Free League\'s first contribution to the Argon merchant fleet, meant as an offering of good will to both the Federation and the Republic, to show that the Free League was also taking the rebuilding effort seriously.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 84000,
    storage: { missile: 30, unit: 10 },
    people: 225,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 4663814, max: 6309866, avg: 5486840 },
    production: [
      {
        time: 288,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1592 },
          { ware: 'hullparts', amount: 4204 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_04_b',
    name: 'Shuyaku Sentinel',
    description: 'Designed in parallel to the Incarcatura, as part of the push to rejuvenate the Argon economy, the Shuyaku-class freighter is a Sonra variant, extending the Terracorp-designed freighter\'s cargo bay at the cost of some manoeuvrability. The Shuyaku also marks the Hatikvah Free League\'s first contribution to the Argon merchant fleet, meant as an offering of good will to both the Federation and the Republic, to show that the Free League was also taking the rebuilding effort seriously.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 101000,
    storage: { missile: 30, unit: 10 },
    people: 187,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 5601271, max: 7578190, avg: 6589730 },
    production: [
      {
        time: 346,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1913 },
          { ware: 'hullparts', amount: 5049 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_05_a',
    name: 'Sonra Vanguard',
    description: 'Though the Sonra-class freighter was initially designed by Terracorp after the Terran Conflict, the status of development was lost with contact to Home of Light. Quite by chance, project designers were trapped in Black Hole Sun during the Jump Gate shutdown, and were able to get the blueprints of the finished ship to the Argon Federation and Antigone Republic when contact with Argon Prime and Antigone Memorial was re-established.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 67000,
    storage: { missile: 20, unit: 6 },
    people: 178,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 3700900, max: 5007100, avg: 4354000 },
    production: [
      {
        time: 229,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1264 },
          { ware: 'hullparts', amount: 3336 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_l_trans_container_05_b',
    name: 'Sonra Sentinel',
    description: 'Though the Sonra-class freighter was initially designed by Terracorp after the Terran Conflict, the status of development was lost with contact to Home of Light. Quite by chance, project designers were trapped in Black Hole Sun during the Jump Gate shutdown, and were able to get the blueprints of the finished ship to the Argon Federation and Antigone Republic when contact with Argon Prime and Antigone Memorial was re-established.',
    race: Races.argon,
    explosionDamage: 8000,
    hull: 80000,
    storage: { missile: 20, unit: 6 },
    people: 148,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 4430863, max: 5994697, avg: 5212780 },
    production: [
      {
        time: 274,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1513 },
          { ware: 'hullparts', amount: 3994 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_bomber_01_a',
    name: 'Minotaur Vanguard',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    race: Races.argon,
    explosionDamage: 5000,
    hull: 12000,
    storage: { missile: 40, unit: 0 },
    people: 9,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.bomber,
    owners: [
      Factions.argon,
    ],
    price: { min: 780878, max: 1056482, avg: 918680 },
    production: [
      {
        time: 24,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 134 },
          { ware: 'hullparts', amount: 708 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_bomber_01_b',
    name: 'Minotaur Sentinel',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    race: Races.argon,
    explosionDamage: 5000,
    hull: 14000,
    storage: { missile: 40, unit: 0 },
    people: 7,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.bomber,
    owners: [
      Factions.antigone,
    ],
    price: { min: 924273, max: 1250487, avg: 1087380 },
    production: [
      {
        time: 29,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 159 },
          { ware: 'hullparts', amount: 838 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_bomber_02_a',
    name: 'Minotaur Raider',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    explosionDamage: 5000,
    hull: 13000,
    storage: { missile: 20, unit: 0 },
    people: 15,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.scavenger,
    owners: [
      Factions.hatikvah,
      Factions.scaleplate,
    ],
    price: { min: 770942, max: 1043039, avg: 906990 },
    production: [
      {
        time: 24,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 132 },
          { ware: 'hullparts', amount: 699 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_frigate_01_a',
    name: 'Cerberus Vanguard',
    description: 'The first of the newly-designed M-sized support ships to reach the Federal and Republic navies, the Cerberus-class frigate is primarily designed to target and support smaller and similarly-sized vessels in a defensive capacity. Notably, the Cerberus was also the first ship of its size to support a fully-functional dock for smaller ships; a massive technical challenge for its designers. This has only made it a more popular choice of ship, and saw a new design race explode throughout the Jump Gate network as other ship designers scrambled to copy the Argons\' innovative design.',
    race: Races.argon,
    explosionDamage: 2000,
    hull: 17000,
    storage: { missile: 100, unit: 12 },
    people: 14,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.argon,
    ],
    price: { min: 1002567, max: 1356414, avg: 1179490 },
    production: [
      {
        time: 31,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 172 },
          { ware: 'hullparts', amount: 909 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_frigate_01_b',
    name: 'Cerberus Sentinel',
    description: 'The first of the newly-designed M-sized support ships to reach the Federal and Republic navies, the Cerberus-class frigate is primarily designed to target and support smaller and similarly-sized vessels in a defensive capacity. Notably, the Cerberus was also the first ship of its size to support a fully-functional dock for smaller ships; a massive technical challenge for its designers. This has only made it a more popular choice of ship, and saw a new design race explode throughout the Jump Gate network as other ship designers scrambled to copy the Argons\' innovative design.',
    race: Races.argon,
    explosionDamage: 2000,
    hull: 20000,
    storage: { missile: 100, unit: 12 },
    people: 11,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.antigone,
    ],
    price: { min: 1191190, max: 1611610, avg: 1401400 },
    production: [
      {
        time: 37,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 205 },
          { ware: 'hullparts', amount: 1080 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_miner_liquid_01_a',
    name: 'Sunder Vanguard',
    description: 'Jonferco\'s response to the PMC\'s Drill design, the Sunder fulfils a similar role to its sister ship but handles gas collection instead of asteroid mining. It is fitted with a non-modular scoop that allows natural gases to be safely placed inside the ship\'s cargo hold. For all the gratitude received by PMC for their work in advancing asteroid mining, Jonferco\'s reply sent the mining community into a complete frenzy, with the possibilities for collecting, refining and utilising natural gases spurring the economy, not just in Argon space but across the entire Jump Gate network, to a brand new high.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 4000,
    storage: { missile: 20, unit: 0 },
    people: 9,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.argon,
    ],
    price: { min: 130535, max: 176606, avg: 153570 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 66 },
          { ware: 'hullparts', amount: 117 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_miner_liquid_01_b',
    name: 'Sunder Sentinel',
    description: 'Jonferco\'s response to the PMC\'s Drill design, the Sunder fulfils a similar role to its sister ship but handles gas collection instead of asteroid mining. It is fitted with a non-modular scoop that allows natural gases to be safely placed inside the ship\'s cargo hold. For all the gratitude received by PMC for their work in advancing asteroid mining, Jonferco\'s reply sent the mining community into a complete frenzy, with the possibilities for collecting, refining and utilising natural gases spurring the economy, not just in Argon space but across the entire Jump Gate network, to a brand new high.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 7,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.antigone,
    ],
    price: { min: 165138, max: 223422, avg: 194280 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 84 },
          { ware: 'hullparts', amount: 148 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_miner_solid_01_a',
    name: 'Drill Vanguard',
    description: 'Towards the end of the last era, the Plutarch Mining Corporation called for a shift away from static station-based asteroid mining towards the far more efficient method of using ships to identify and break down asteroids and bring them to refineries in far less time than it took for a refinery to be attached to a much bigger asteroid. Though it is now different from the PMC\'s original design, the Drill has been in service ever since, inspiring a train of different mining ships to be released all across the old and new Jump Gate network.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 4000,
    storage: { missile: 20, unit: 0 },
    people: 9,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.argon,
    ],
    price: { min: 135021, max: 182678, avg: 158850 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 69 },
          { ware: 'hullparts', amount: 121 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_miner_solid_01_b',
    name: 'Drill Sentinel',
    description: 'Towards the end of the last era, the Plutarch Mining Corporation called for a shift away from static station-based asteroid mining towards the far more efficient method of using ships to identify and break down asteroids and bring them to refineries in far less time than it took for a refinery to be attached to a much bigger asteroid. Though it is now different from the PMC\'s original design, the Drill has been in service ever since, inspiring a train of different mining ships to be released all across the old and new Jump Gate network.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 7,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.antigone,
    ],
    price: { min: 159554, max: 215867, avg: 187710 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 81 },
          { ware: 'hullparts', amount: 143 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_trans_container_01_a',
    name: 'Mercury Vanguard',
    description: 'The latest redesign of the Mercury-class transporter was almost purely aesthetic, with only small changes made to allow the user more modularity and modification options. Other than the aesthetic changes made to keep the model in line with latest style trends, the Mercury remains the same reliable M-sized transporter that has seen popular use across Argon space for so many years.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 17,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 177404, max: 240017, avg: 208710 },
    production: [
      {
        time: 16,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 90 },
          { ware: 'hullparts', amount: 159 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_trans_container_01_b',
    name: 'Mercury Sentinel',
    description: 'The latest redesign of the Mercury-class transporter was almost purely aesthetic, with only small changes made to allow the user more modularity and modification options. Other than the aesthetic changes made to keep the model in line with latest style trends, the Mercury remains the same reliable M-sized transporter that has seen popular use across Argon space for so many years.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 6000,
    storage: { missile: 20, unit: 0 },
    people: 14,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 213104, max: 288317, avg: 250710 },
    production: [
      {
        time: 20,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 108 },
          { ware: 'hullparts', amount: 191 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_trans_container_02_a',
    name: 'Ides Vanguard',
    description: 'With the Argon Federation desperate to rebuild its economy after the Jump Gates realigned, the sheer number of Mercury-class transporters across Argon space became so high that the value of the popular transporter began to sink rapidly. In an attempt to correct course, the Federation released the Ides. Though they are only slightly aesthetically and technically different, and in fact the Ides is based on the Mercury model, the ship has been pushed as competition to the popular transporter; a marketing strategy that has been well met by the public, and recently allowed for the ship market to find stability.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 19,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 177404, max: 240017, avg: 208710 },
    production: [
      {
        time: 16,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 90 },
          { ware: 'hullparts', amount: 159 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_m_trans_container_02_b',
    name: 'Ides Sentinel',
    description: 'With the Argon Federation desperate to rebuild its economy after the Jump Gates realigned, the sheer number of Mercury-class transporters across Argon space became so high that the value of the popular transporter began to sink rapidly. In an attempt to correct course, the Federation released the Ides. Though they are only slightly aesthetically and technically different, and in fact the Ides is based on the Mercury model, the ship has been pushed as competition to the popular transporter; a marketing strategy that has been well met by the public, and recently allowed for the ship market to find stability.',
    race: Races.argon,
    explosionDamage: 1000,
    hull: 6000,
    storage: { missile: 20, unit: 0 },
    people: 15,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 213104, max: 288317, avg: 250710 },
    production: [
      {
        time: 20,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 108 },
          { ware: 'hullparts', amount: 191 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_01_a',
    name: 'Nova Vanguard',
    description: 'Though the prototype for the new-model Nova-class dogfighter was in development as far back as the Terran Conflict, it never reached mass-production before the Jump Gate shutdown. As such, its first major role was as an escort to Argon Federation exploratory groups that were sent out into newly discovered or rediscovered areas of space as the Jump Gates began to realign.nnIn terms of its class, the new-look Nova is a major step up in ship design, with rotatable engines that make it formidable in keeping up with and tracking targets of a similar size.',
    race: Races.argon,
    hull: 3100,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 135677, max: 183563, avg: 159620 },
    production: [
      {
        time: 10,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 56 },
          { ware: 'hullparts', amount: 122 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_01_b',
    name: 'Nova Sentinel',
    description: 'Though the prototype for the new-model Nova-class dogfighter was in development as far back as the Terran Conflict, it never reached mass-production before the Jump Gate shutdown. As such, its first major role was as an escort to Argon Federation exploratory groups that were sent out into newly discovered or rediscovered areas of space as the Jump Gates began to realign.nnIn terms of its class, the new-look Nova is a major step up in ship design, with rotatable engines that make it formidable in keeping up with and tracking targets of a similar size.',
    race: Races.argon,
    hull: 3800,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 164594, max: 222686, avg: 193640 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 68 },
          { ware: 'hullparts', amount: 148 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_02_a',
    name: 'Elite Vanguard',
    description: 'Though retired from service for a long time before the Jump Gate shutdown, the push to give any advantage to the Federal and Republic fleets in their fights against the Xenon and the Holy Order of the Pontifex has seen the long-serving Elite redesigned as an interceptor.nnQuick in a straight line and able to fire off short bursts of fire-power before disengaging, the Elite often targets small ships and slower missiles, as well as using its speed and size, in support of the dog-fighters that are able to hold out longer under fire.',
    race: Races.argon,
    hull: 1800,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.interceptor,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 78940, max: 106801, avg: 92870 },
    production: [
      {
        time: 6,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 32 },
          { ware: 'hullparts', amount: 71 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_02_b',
    name: 'Elite Sentinel',
    description: 'Though retired from service for a long time before the Jump Gate shutdown, the push to give any advantage to the Federal and Republic fleets in their fights against the Xenon and the Holy Order of the Pontifex has seen the long-serving Elite redesigned as an interceptor.nnQuick in a straight line and able to fire off short bursts of fire-power before disengaging, the Elite often targets small ships and slower missiles, as well as using its speed and size, in support of the dog-fighters that are able to hold out longer under fire.',
    race: Races.argon,
    hull: 2200,
    storage: { missile: 20, unit: 0 },
    people: 1,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.interceptor,
    owners: [
      Factions.antigone,
    ],
    price: { min: 95625, max: 129375, avg: 112500 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 39 },
          { ware: 'hullparts', amount: 86 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_03_a',
    name: 'Pulsar Vanguard',
    description: 'No information available',
    race: Races.argon,
    hull: 1900,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.heavyfighter,
    owners: [
      Factions.antigone,
    ],
    price: { min: 116765, max: 157976, avg: 137370 },
    production: [
      {
        time: 9,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 48 },
          { ware: 'hullparts', amount: 105 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_fighter_04_a',
    name: 'Quasar Vanguard',
    description: 'No information available',
    race: Races.argon,
    hull: 1700,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.heavyfighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 103403, max: 139898, avg: 121650 },
    production: [
      {
        time: 8,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 42 },
          { ware: 'hullparts', amount: 93 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_heavyfighter_02_a',
    name: 'Eclipse Vanguard',
    description: 'Redesigned using the same combat-ready cockpit used by the new-look Nova, the Eclipse replaces the rotatable engines with a support structure that allows it to carry more weapons - effectively sacrificing the manoeuvrability of the dog-fighter for enough fire-power to be devastating against both small- and medium-sized ships.nnThis sacrifice does make the ship vulnerable to more specialised dog-fighters and interceptors, but nonetheless both the Federal and Republic navy has found the new Eclipse to be a worthy addition to their fleets, with Argon ship designers once again leading the race to design ships effective for both personal and military use.',
    race: Races.argon,
    hull: 4000,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.heavyfighter,
    owners: [
      Factions.argon,
    ],
    price: { min: 174565, max: 236176, avg: 205370 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 71 },
          { ware: 'hullparts', amount: 157 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_miner_solid_01_a',
    name: 'Courier (Mineral)',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    race: Races.argon,
    hull: 1200,
    storage: { missile: 10, unit: 0 },
    people: 3,
    purpose: ShipPurpose.mine,
    thruster: Size.small,
    type: ShipType.miner,
    owners: [
      Factions.antigone,
      Factions.argon,
    ],
    price: { min: 85621, max: 115840, avg: 100730 },
    production: [
      {
        time: 6,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 35 },
          { ware: 'hullparts', amount: 77 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_scout_01_a',
    name: 'Discoverer Vanguard',
    description: 'Long serving as the scout and exploration ship for the Argon fleet, the Discoverer saw little re-design or overhaul until the Jump Gate shutdown. The current model, an overall improvement on the model used before the shutdown, was designed in the Antigone Republic and made available to the Argon Federation as part of an ongoing technology exchange between the two allied factions.',
    race: Races.argon,
    hull: 1400,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 90075, max: 121866, avg: 105970 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 37 },
          { ware: 'hullparts', amount: 81 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_scout_01_b',
    name: 'Discoverer Sentinel',
    description: 'Long serving as the scout and exploration ship for the Argon fleet, the Discoverer saw little re-design or overhaul until the Jump Gate shutdown. The current model, an overall improvement on the model used before the shutdown, was designed in the Antigone Republic and made available to the Argon Federation as part of an ongoing technology exchange between the two allied factions.',
    race: Races.argon,
    hull: 1700,
    storage: { missile: 20, unit: 0 },
    people: 1,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.antigone,
    ],
    price: { min: 108953, max: 147407, avg: 128180 },
    production: [
      {
        time: 8,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 44 },
          { ware: 'hullparts', amount: 98 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_trans_container_01_a',
    name: 'Courier Vanguard',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    race: Races.argon,
    hull: 2200,
    storage: { missile: 10, unit: 0 },
    people: 5,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 160140, max: 216660, avg: 188400 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 66 },
          { ware: 'hullparts', amount: 144 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_trans_container_01_b',
    name: 'Courier Sentinel',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    race: Races.argon,
    hull: 2600,
    storage: { missile: 10, unit: 0 },
    people: 4,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.antigone,
    ],
    price: { min: 191250, max: 258750, avg: 225000 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 78 },
          { ware: 'hullparts', amount: 172 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_trans_container_02_a',
    name: 'Callisto Vanguard',
    description: 'No information available',
    race: Races.argon,
    hull: 2100,
    storage: { missile: 4, unit: 0 },
    people: 3,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.alliance,
      Factions.argon,
    ],
    price: { min: 82297, max: 111343, avg: 96820 },
    production: [
      {
        time: 6,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 74 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_s_trans_container_02_b',
    name: 'Callisto Sentinel',
    description: 'No information available',
    race: Races.argon,
    hull: 2500,
    storage: { missile: 4, unit: 0 },
    people: 2,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.antigone,
    ],
    price: { min: 101210, max: 136931, avg: 119070 },
    production: [
      {
        time: 8,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 42 },
          { ware: 'hullparts', amount: 91 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_xl_builder_01_a',
    name: 'Mammoth Vanguard',
    description: 'With the method of building stations having changed numerous times since the beginning of the Jump Gate shutdown, many have questioned the necessity for a dedicated building vessel, but the Mammoth has continued to find purpose.nnUndergoing changes with every iteration of the station building method, the last iteration of the Mammoth saw it transformed into more of a mobile platform than a ship; becoming immobile when deployed to a station construction site so that construction drones can easily be ferried from the ship to the site and back again.',
    race: Races.argon,
    explosionDamage: 12000,
    hull: 115000,
    storage: { missile: 40, unit: 100 },
    people: 219,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.argon,
    ],
    price: { min: 9452145, max: 12788196, avg: 11120170 },
    production: [
      {
        time: 439,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2428 },
          { ware: 'hullparts', amount: 8545 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_xl_builder_01_b',
    name: 'Mammoth Sentinel',
    description: 'With the method of building stations having changed numerous times since the beginning of the Jump Gate shutdown, many have questioned the necessity for a dedicated building vessel, but the Mammoth has continued to find purpose.nnUndergoing changes with every iteration of the station building method, the last iteration of the Mammoth saw it transformed into more of a mobile platform than a ship; becoming immobile when deployed to a station construction site so that construction drones can easily be ferried from the ship to the site and back again.',
    race: Races.argon,
    explosionDamage: 12000,
    hull: 138000,
    storage: { missile: 40, unit: 100 },
    people: 182,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.antigone,
    ],
    price: { min: 11342553, max: 15345807, avg: 13344180 },
    production: [
      {
        time: 527,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2913 },
          { ware: 'hullparts', amount: 10254 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_xl_carrier_01_a',
    name: 'Colossus Vanguard',
    description: 'The final ship shared with the Argon Federation by the Antigone Republic as part of their ongoing technology exchange, the new-look Colossus-class carrier was initially designed as such so that it didn\'t use much-needed resources that were sorely lacking in Antigone Memorial during the Jump Gate shutdown.nnWith an array of medium and small docks and launch tubes, the Antigone Colossus is a significant improvement on other Colossus models, able to deploy ships to the battlefield at a much higher rate and collect and store them far more efficiently, at the cost of some of its previous firepower.',
    race: Races.argon,
    explosionDamage: 15000,
    hull: 216000,
    storage: { missile: 320, unit: 20 },
    people: 123,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.argon,
    ],
    price: { min: 10453215, max: 14142585, avg: 12297900 },
    production: [
      {
        time: 486,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2685 },
          { ware: 'hullparts', amount: 9450 },
        ],
      },
    ]
  },
  {
    id: 'ship_arg_xl_carrier_01_b',
    name: 'Colossus Sentinel',
    description: 'The final ship shared with the Argon Federation by the Antigone Republic as part of their ongoing technology exchange, the new-look Colossus-class carrier was initially designed as such so that it didn\'t use much-needed resources that were sorely lacking in Antigone Memorial during the Jump Gate shutdown.nnWith an array of medium and small docks and launch tubes, the Antigone Colossus is a significant improvement on other Colossus models, able to deploy ships to the battlefield at a much higher rate and collect and store them far more efficiently, at the cost of some of its previous firepower.',
    race: Races.argon,
    explosionDamage: 15000,
    hull: 259000,
    storage: { missile: 320, unit: 20 },
    people: 102,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.antigone,
    ],
    price: { min: 12538308, max: 16963593, avg: 14750950 },
    production: [
      {
        time: 583,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 3220 },
          { ware: 'hullparts', amount: 11335 },
        ],
      },
    ]
  },
  {
    id: 'ship_gen_s_fighter_01_a',
    name: 'Nodan Vanguard',
    description: 'No information available',
    hull: 3900,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.alliance,
    ],
    price: { min: 78659, max: 106421, avg: 92540 },
    production: [
      {
        time: 10,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 56 },
          { ware: 'hullparts', amount: 70 },
        ],
      },
    ]
  },
  {
    id: 'ship_gen_s_fighter_01_b',
    name: 'Nodan Sentinel',
    description: 'No information available',
    hull: 4600,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.alliance,
    ],
    price: { min: 96645, max: 130755, avg: 113700 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 69 },
          { ware: 'hullparts', amount: 86 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_destroyer_01_a',
    name: 'Odysseus Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 10000,
    hull: 99000,
    storage: { missile: 160, unit: 10 },
    people: 47,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.paranid,
    ],
    price: { min: 5225188, max: 7069372, avg: 6147280 },
    production: [
      {
        time: 195,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1075 },
          { ware: 'hullparts', amount: 4732 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_destroyer_01_b',
    name: 'Odysseus Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 10000,
    hull: 119000,
    storage: { missile: 160, unit: 10 },
    people: 39,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 6275338, max: 8490163, avg: 7382750 },
    production: [
      {
        time: 234,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1292 },
          { ware: 'hullparts', amount: 5683 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_miner_liquid_01_a',
    name: 'Chthonios (Gas) Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 23000,
    storage: { missile: 30, unit: 10 },
    people: 40,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.paranid,
    ],
    price: { min: 1191479, max: 1612001, avg: 1401740 },
    production: [
      {
        time: 74,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 407 },
          { ware: 'hullparts', amount: 1074 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_miner_liquid_01_b',
    name: 'Chthonios (Gas) Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 28000,
    storage: { missile: 30, unit: 10 },
    people: 33,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 1439985, max: 1948215, avg: 1694100 },
    production: [
      {
        time: 89,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 492 },
          { ware: 'hullparts', amount: 1298 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_miner_solid_01_a',
    name: 'Chthonios (Mineral) Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 23000,
    storage: { missile: 30, unit: 10 },
    people: 40,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.paranid,
    ],
    price: { min: 1191479, max: 1612001, avg: 1401740 },
    production: [
      {
        time: 74,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 407 },
          { ware: 'hullparts', amount: 1074 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_miner_solid_01_b',
    name: 'Chthonios (Mineral) Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 28000,
    storage: { missile: 30, unit: 10 },
    people: 33,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 1439985, max: 1948215, avg: 1694100 },
    production: [
      {
        time: 89,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 492 },
          { ware: 'hullparts', amount: 1298 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_trans_container_01_a',
    name: 'Helios Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 37000,
    storage: { missile: 30, unit: 10 },
    people: 71,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.paranid,
    ],
    price: { min: 2059006, max: 2785714, avg: 2422360 },
    production: [
      {
        time: 127,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 703 },
          { ware: 'hullparts', amount: 1856 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_trans_container_01_b',
    name: 'Helios Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 45000,
    storage: { missile: 30, unit: 10 },
    people: 59,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 2487219, max: 3365061, avg: 2926140 },
    production: [
      {
        time: 154,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 849 },
          { ware: 'hullparts', amount: 2242 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_trans_container_02_a',
    name: 'Selene Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 33000,
    storage: { missile: 30, unit: 10 },
    people: 71,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.paranid,
    ],
    price: { min: 2059006, max: 2785714, avg: 2422360 },
    production: [
      {
        time: 127,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 703 },
          { ware: 'hullparts', amount: 1856 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_l_trans_container_02_b',
    name: 'Selene Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 8000,
    hull: 40000,
    storage: { missile: 30, unit: 10 },
    people: 59,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 2487219, max: 3365061, avg: 2926140 },
    production: [
      {
        time: 154,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 849 },
          { ware: 'hullparts', amount: 2242 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_corvette_01_a',
    name: 'Nemesis Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 5000,
    hull: 10000,
    storage: { missile: 40, unit: 0 },
    people: 8,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.corvette,
    owners: [
      Factions.paranid,
    ],
    price: { min: 647420, max: 875921, avg: 761670 },
    production: [
      {
        time: 20,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 111 },
          { ware: 'hullparts', amount: 587 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_corvette_01_b',
    name: 'Nemesis Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 5000,
    hull: 12000,
    storage: { missile: 40, unit: 0 },
    people: 6,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.corvette,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 776458, max: 1050502, avg: 913480 },
    production: [
      {
        time: 24,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 133 },
          { ware: 'hullparts', amount: 704 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_frigate_01_a',
    name: 'Gorgon Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 2000,
    hull: 19000,
    storage: { missile: 100, unit: 8 },
    people: 16,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.paranid,
    ],
    price: { min: 1142638, max: 1545922, avg: 1344280 },
    production: [
      {
        time: 35,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 196 },
          { ware: 'hullparts', amount: 1036 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_frigate_01_b',
    name: 'Gorgon Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 2000,
    hull: 23000,
    storage: { missile: 100, unit: 8 },
    people: 13,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 1376456, max: 1862264, avg: 1619360 },
    production: [
      {
        time: 43,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 236 },
          { ware: 'hullparts', amount: 1248 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_miner_liquid_01_a',
    name: 'Plutus (Gas) Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 4000,
    storage: { missile: 20, unit: 0 },
    people: 10,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.paranid,
    ],
    price: { min: 136119, max: 184161, avg: 160140 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 69 },
          { ware: 'hullparts', amount: 122 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_miner_liquid_01_b',
    name: 'Plutus (Gas) Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 8,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 166269, max: 224952, avg: 195610 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 85 },
          { ware: 'hullparts', amount: 149 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_miner_solid_01_a',
    name: 'Plutus (Mineral) Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 4000,
    storage: { missile: 20, unit: 0 },
    people: 10,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.paranid,
    ],
    price: { min: 136119, max: 184161, avg: 160140 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 69 },
          { ware: 'hullparts', amount: 122 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_miner_solid_01_b',
    name: 'Plutus (Mineral) Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 8,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 166269, max: 224952, avg: 195610 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 85 },
          { ware: 'hullparts', amount: 149 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_trans_container_01_a',
    name: 'Demeter Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 19,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.paranid,
    ],
    price: { min: 180761, max: 244559, avg: 212660 },
    production: [
      {
        time: 17,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 92 },
          { ware: 'hullparts', amount: 162 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_trans_container_01_b',
    name: 'Demeter Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 7000,
    storage: { missile: 20, unit: 0 },
    people: 15,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 234345, max: 317055, avg: 275700 },
    production: [
      {
        time: 22,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 120 },
          { ware: 'hullparts', amount: 210 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_trans_container_02_a',
    name: 'Hermes Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 20,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.paranid,
    ],
    price: { min: 180761, max: 244559, avg: 212660 },
    production: [
      {
        time: 17,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 92 },
          { ware: 'hullparts', amount: 162 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_m_trans_container_02_b',
    name: 'Hermes Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 1000,
    hull: 6000,
    storage: { missile: 20, unit: 0 },
    people: 16,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 234345, max: 317055, avg: 275700 },
    production: [
      {
        time: 22,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 120 },
          { ware: 'hullparts', amount: 210 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_fighter_01_a',
    name: 'Perseus Vanguard',
    description: 'No information available',
    race: Races.paranid,
    hull: 3700,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.paranid,
    ],
    price: { min: 161237, max: 218144, avg: 189690 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 66 },
          { ware: 'hullparts', amount: 145 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_fighter_01_b',
    name: 'Perseus Sentinel',
    description: 'No information available',
    race: Races.paranid,
    hull: 4400,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 193477, max: 261763, avg: 227620 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 79 },
          { ware: 'hullparts', amount: 174 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_fighter_02_a',
    name: 'Theseus Vanguard',
    description: 'No information available',
    race: Races.paranid,
    hull: 4200,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.paranid,
    ],
    price: { min: 182376, max: 246744, avg: 214560 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 75 },
          { ware: 'hullparts', amount: 164 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_fighter_02_b',
    name: 'Theseus Sentinel',
    description: 'No information available',
    race: Races.paranid,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 217940, max: 294860, avg: 256400 },
    production: [
      {
        time: 16,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 89 },
          { ware: 'hullparts', amount: 196 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_miner_solid_01_a',
    name: 'Tethys (Mineral)',
    description: 'No information available',
    race: Races.paranid,
    hull: 1200,
    storage: { missile: 10, unit: 0 },
    people: 3,
    purpose: ShipPurpose.mine,
    thruster: Size.small,
    type: ShipType.miner,
    owners: [
      Factions.holyorder,
      Factions.paranid,
    ],
    price: { min: 85621, max: 115840, avg: 100730 },
    production: [
      {
        time: 6,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 35 },
          { ware: 'hullparts', amount: 77 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_scout_01_a',
    name: 'Pegasus Vanguard',
    description: 'No information available',
    race: Races.paranid,
    hull: 1300,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.alliance,
      Factions.paranid,
    ],
    price: { min: 82297, max: 111343, avg: 96820 },
    production: [
      {
        time: 6,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 34 },
          { ware: 'hullparts', amount: 74 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_scout_01_b',
    name: 'Pegasus Sentinel',
    description: 'No information available',
    race: Races.paranid,
    hull: 1600,
    storage: { missile: 20, unit: 0 },
    people: 1,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 100079, max: 135401, avg: 117740 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 41 },
          { ware: 'hullparts', amount: 90 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_trans_container_01_a',
    name: 'Tethys Vanguard',
    description: 'No information available',
    race: Races.paranid,
    hull: 2100,
    storage: { missile: 10, unit: 0 },
    people: 5,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.alliance,
      Factions.paranid,
    ],
    price: { min: 154556, max: 209105, avg: 181830 },
    production: [
      {
        time: 11,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 63 },
          { ware: 'hullparts', amount: 139 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_s_trans_container_01_b',
    name: 'Tethys Sentinel',
    description: 'No information available',
    race: Races.paranid,
    hull: 2600,
    storage: { missile: 10, unit: 0 },
    people: 4,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 189023, max: 255737, avg: 222380 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 77 },
          { ware: 'hullparts', amount: 170 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_xl_builder_01_a',
    name: 'Heracles Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 12000,
    hull: 115000,
    storage: { missile: 40, unit: 100 },
    people: 219,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.alliance,
      Factions.paranid,
    ],
    price: { min: 9452145, max: 12788196, avg: 11120170 },
    production: [
      {
        time: 439,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2428 },
          { ware: 'hullparts', amount: 8545 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_xl_builder_01_b',
    name: 'Heracles Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 12000,
    hull: 138000,
    storage: { missile: 40, unit: 100 },
    people: 182,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 11342553, max: 15345807, avg: 13344180 },
    production: [
      {
        time: 527,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2913 },
          { ware: 'hullparts', amount: 10254 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_xl_carrier_01_a',
    name: 'Zeus Vanguard',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 15000,
    hull: 281000,
    storage: { missile: 300, unit: 20 },
    people: 159,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.paranid,
    ],
    price: { min: 13600230, max: 18400311, avg: 16000270 },
    production: [
      {
        time: 632,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 3493 },
          { ware: 'hullparts', amount: 12295 },
        ],
      },
    ]
  },
  {
    id: 'ship_par_xl_carrier_01_b',
    name: 'Zeus Sentinel',
    description: 'No information available',
    race: Races.paranid,
    explosionDamage: 15000,
    hull: 337000,
    storage: { missile: 300, unit: 20 },
    people: 132,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.holyorder,
    ],
    price: { min: 16314739, max: 22072882, avg: 19193810 },
    production: [
      {
        time: 758,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 4190 },
          { ware: 'hullparts', amount: 14749 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_destroyer_01_a',
    name: 'Phoenix Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 10000,
    hull: 104000,
    storage: { missile: 160, unit: 10 },
    people: 50,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.teladi,
    ],
    price: { min: 5476958, max: 7410002, avg: 6443480 },
    production: [
      {
        time: 204,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1127 },
          { ware: 'hullparts', amount: 4960 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_destroyer_01_b',
    name: 'Phoenix Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 10000,
    hull: 124000,
    storage: { missile: 160, unit: 10 },
    people: 41,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.ministry,
    ],
    price: { min: 6551401, max: 8863660, avg: 7707530 },
    production: [
      {
        time: 244,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1349 },
          { ware: 'hullparts', amount: 5933 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_miner_liquid_01_a',
    name: 'Crane (Gas) Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 8000,
    hull: 30000,
    storage: { missile: 30, unit: 10 },
    people: 52,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.teladi,
    ],
    price: { min: 1550927, max: 2098313, avg: 1824620 },
    production: [
      {
        time: 96,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 530 },
          { ware: 'hullparts', amount: 1398 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_miner_liquid_01_b',
    name: 'Crane (Gas) Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 8000,
    hull: 36000,
    storage: { missile: 30, unit: 10 },
    people: 43,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.ministry,
    ],
    price: { min: 1861551, max: 2518569, avg: 2190060 },
    production: [
      {
        time: 115,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 636 },
          { ware: 'hullparts', amount: 1678 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_miner_solid_01_a',
    name: 'Crane (Mineral) Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 8000,
    hull: 30000,
    storage: { missile: 30, unit: 10 },
    people: 52,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.teladi,
    ],
    price: { min: 1550927, max: 2098313, avg: 1824620 },
    production: [
      {
        time: 96,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 530 },
          { ware: 'hullparts', amount: 1398 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_miner_solid_01_b',
    name: 'Crane (Mineral) Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 8000,
    hull: 36000,
    storage: { missile: 30, unit: 10 },
    people: 43,
    purpose: ShipPurpose.mine,
    thruster: Size.large,
    type: ShipType.largeminer,
    owners: [
      Factions.ministry,
    ],
    price: { min: 1861551, max: 2518569, avg: 2190060 },
    production: [
      {
        time: 115,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 636 },
          { ware: 'hullparts', amount: 1678 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_trans_container_01_a',
    name: 'Pelican Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 52000,
    storage: { missile: 30, unit: 10 },
    people: 100,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.teladi,
    ],
    price: { min: 2912143, max: 3939958, avg: 3426050 },
    production: [
      {
        time: 169,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 935 },
          { ware: 'hullparts', amount: 2467 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_trans_container_01_b',
    name: 'Pelican Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 63000,
    storage: { missile: 30, unit: 10 },
    people: 83,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 3477920, max: 4705421, avg: 4091670 },
    production: [
      {
        time: 204,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1127 },
          { ware: 'hullparts', amount: 2975 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_trans_container_02_a',
    name: 'Heron Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 48000,
    storage: { missile: 30, unit: 10 },
    people: 101,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.teladi,
    ],
    price: { min: 2935407, max: 3971433, avg: 3453420 },
    production: [
      {
        time: 155,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 858 },
          { ware: 'hullparts', amount: 2266 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_l_trans_container_02_b',
    name: 'Heron Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 57000,
    storage: { missile: 30, unit: 10 },
    people: 84,
    purpose: ShipPurpose.trade,
    thruster: Size.large,
    type: ShipType.freighter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 3533357, max: 4780424, avg: 4156890 },
    production: [
      {
        time: 185,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 1025 },
          { ware: 'hullparts', amount: 2705 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_bomber_01_a',
    name: 'Peregrine Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 5000,
    hull: 12000,
    storage: { missile: 40, unit: 0 },
    people: 9,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.bomber,
    owners: [
      Factions.teladi,
    ],
    price: { min: 765425, max: 1035575, avg: 900500 },
    production: [
      {
        time: 24,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 131 },
          { ware: 'hullparts', amount: 694 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_bomber_01_b',
    name: 'Peregrine Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 5000,
    hull: 14000,
    storage: { missile: 40, unit: 0 },
    people: 7,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.bomber,
    owners: [
      Factions.ministry,
    ],
    price: { min: 905531, max: 1225130, avg: 1065330 },
    production: [
      {
        time: 28,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 156 },
          { ware: 'hullparts', amount: 821 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_frigate_01_a',
    name: 'Osprey Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 2000,
    hull: 33000,
    storage: { missile: 100, unit: 17 },
    people: 15,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.teladi,
    ],
    price: { min: 1086377, max: 1469804, avg: 1278090 },
    production: [
      {
        time: 34,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 186 },
          { ware: 'hullparts', amount: 985 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_frigate_01_b',
    name: 'Osprey Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 2000,
    hull: 39000,
    storage: { missile: 100, unit: 17 },
    people: 12,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.frigate,
    owners: [
      Factions.ministry,
    ],
    price: { min: 1314712, max: 1778728, avg: 1546720 },
    production: [
      {
        time: 41,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 226 },
          { ware: 'hullparts', amount: 1192 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_miner_liquid_01_a',
    name: 'Manorina (Gas) Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 3700,
    storage: { missile: 20, unit: 0 },
    people: 9,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.teladi,
    ],
    price: { min: 169592, max: 229448, avg: 199520 },
    production: [
      {
        time: 11,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 62 },
          { ware: 'hullparts', amount: 109 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_miner_liquid_01_b',
    name: 'Manorina (Gas) Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 4500,
    storage: { missile: 20, unit: 0 },
    people: 7,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.ministry,
    ],
    price: { min: 204196, max: 276265, avg: 240230 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 75 },
          { ware: 'hullparts', amount: 132 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_miner_solid_01_a',
    name: 'Manorina (Mineral) Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 3700,
    storage: { missile: 20, unit: 0 },
    people: 10,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.teladi,
    ],
    price: { min: 169592, max: 229448, avg: 199520 },
    production: [
      {
        time: 11,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 62 },
          { ware: 'hullparts', amount: 109 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_miner_solid_01_b',
    name: 'Manorina (Mineral) Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 4500,
    storage: { missile: 20, unit: 0 },
    people: 8,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.ministry,
    ],
    price: { min: 204196, max: 276265, avg: 240230 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 75 },
          { ware: 'hullparts', amount: 132 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_trans_container_01_a',
    name: 'Vulture Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 8000,
    storage: { missile: 20, unit: 0 },
    people: 16,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.teladi,
    ],
    price: { min: 272238, max: 368322, avg: 320280 },
    production: [
      {
        time: 25,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 138 },
          { ware: 'hullparts', amount: 244 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_trans_container_01_b',
    name: 'Vulture Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 9000,
    storage: { missile: 20, unit: 0 },
    people: 13,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 315784, max: 427237, avg: 371510 },
    production: [
      {
        time: 29,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 161 },
          { ware: 'hullparts', amount: 283 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_trans_container_02_a',
    name: 'Tern Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 7000,
    storage: { missile: 20, unit: 0 },
    people: 20,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.alliance,
      Factions.teladi,
    ],
    price: { min: 272238, max: 368322, avg: 320280 },
    production: [
      {
        time: 25,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 138 },
          { ware: 'hullparts', amount: 244 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_m_trans_container_02_b',
    name: 'Tern Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 1000,
    hull: 8000,
    storage: { missile: 20, unit: 0 },
    people: 16,
    purpose: ShipPurpose.trade,
    thruster: Size.medium,
    type: ShipType.transporter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 315784, max: 427237, avg: 371510 },
    production: [
      {
        time: 29,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 161 },
          { ware: 'hullparts', amount: 283 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_fighter_01_a',
    name: 'Falcon Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 3900,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.teladi,
    ],
    price: { min: 169014, max: 228666, avg: 198840 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 69 },
          { ware: 'hullparts', amount: 152 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_fighter_01_b',
    name: 'Falcon Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 4600,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 201255, max: 272286, avg: 236770 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 82 },
          { ware: 'hullparts', amount: 181 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_fighter_02_a',
    name: 'Buzzard Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 4100,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.teladi,
    ],
    price: { min: 162333, max: 219627, avg: 190980 },
    production: [
      {
        time: 12,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 66 },
          { ware: 'hullparts', amount: 146 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_fighter_02_b',
    name: 'Buzzard Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 5000,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.ministry,
    ],
    price: { min: 195704, max: 264776, avg: 230240 },
    production: [
      {
        time: 14,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 80 },
          { ware: 'hullparts', amount: 176 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_miner_solid_01_a',
    name: 'Magpie (Mineral)',
    description: 'No information available',
    race: Races.teladi,
    hull: 1300,
    storage: { missile: 10, unit: 0 },
    people: 3,
    purpose: ShipPurpose.mine,
    thruster: Size.small,
    type: ShipType.miner,
    owners: [
      Factions.ministry,
      Factions.teladi,
    ],
    price: { min: 93398, max: 126362, avg: 109880 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 38 },
          { ware: 'hullparts', amount: 84 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_scout_01_a',
    name: 'Kestrel Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 2500,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.alliance,
      Factions.teladi,
    ],
    price: { min: 94529, max: 127892, avg: 111210 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 39 },
          { ware: 'hullparts', amount: 85 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_scout_01_b',
    name: 'Kestrel Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 3100,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.ministry,
    ],
    price: { min: 113441, max: 153479, avg: 133460 },
    production: [
      {
        time: 8,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 47 },
          { ware: 'hullparts', amount: 102 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_scout_02_a',
    name: 'Guillemot Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 2300,
    storage: { missile: 20, unit: 0 },
    people: 3,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.alliance,
      Factions.teladi,
    ],
    price: { min: 143455, max: 194086, avg: 168770 },
    production: [
      {
        time: 11,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 59 },
          { ware: 'hullparts', amount: 129 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_scout_02_b',
    name: 'Guillemot Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 2700,
    storage: { missile: 20, unit: 0 },
    people: 2,
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.scout,
    owners: [
      Factions.ministry,
    ],
    price: { min: 171241, max: 231679, avg: 201460 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 70 },
          { ware: 'hullparts', amount: 154 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_trans_container_01_a',
    name: 'Magpie Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 2400,
    storage: { missile: 10, unit: 0 },
    people: 7,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.alliance,
      Factions.teladi,
    ],
    price: { min: 173468, max: 234692, avg: 204080 },
    production: [
      {
        time: 13,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 71 },
          { ware: 'hullparts', amount: 156 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_s_trans_container_01_b',
    name: 'Magpie Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 2800,
    storage: { missile: 10, unit: 0 },
    people: 5,
    purpose: ShipPurpose.trade,
    thruster: Size.small,
    type: ShipType.courier,
    owners: [
      Factions.ministry,
    ],
    price: { min: 205709, max: 278312, avg: 242010 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 84 },
          { ware: 'hullparts', amount: 185 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_xl_builder_01_a',
    name: 'Albatross Vanguard',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 0,
    hull: 115000,
    storage: { missile: 40, unit: 100 },
    people: 219,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.teladi,
    ],
    price: { min: 9452145, max: 12788196, avg: 11120170 },
    production: [
      {
        time: 439,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2428 },
          { ware: 'hullparts', amount: 8545 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_xl_builder_01_b',
    name: 'Albatross Sentinel',
    description: 'No information available',
    race: Races.teladi,
    explosionDamage: 0,
    hull: 138000,
    storage: { missile: 40, unit: 100 },
    people: 182,
    purpose: ShipPurpose.build,
    thruster: Size.extralarge,
    type: ShipType.builder,
    owners: [
      Factions.ministry,
    ],
    price: { min: 11342553, max: 15345807, avg: 13344180 },
    production: [
      {
        time: 527,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2913 },
          { ware: 'hullparts', amount: 10254 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_xl_carrier_01_a',
    name: 'Condor Vanguard',
    description: 'No information available',
    race: Races.teladi,
    hull: 239000,
    storage: { missile: 400, unit: 20 },
    people: 135,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.teladi,
    ],
    price: { min: 11572631, max: 15657089, avg: 13614860 },
    production: [
      {
        time: 538,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 2972 },
          { ware: 'hullparts', amount: 10462 },
        ],
      },
    ]
  },
  {
    id: 'ship_tel_xl_carrier_01_b',
    name: 'Condor Sentinel',
    description: 'No information available',
    race: Races.teladi,
    hull: 287000,
    storage: { missile: 400, unit: 20 },
    people: 112,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.carrier,
    owners: [
      Factions.ministry,
    ],
    price: { min: 13892256, max: 18795405, avg: 16343830 },
    production: [
      {
        time: 645,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          { ware: 'energycells', amount: 3568 },
          { ware: 'hullparts', amount: 12559 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_m_fighter_01_a',
    name: 'P',
    description: 'No information available',
    race: Races.xenon,
    hull: 10000,
    purpose: ShipPurpose.fight,
    thruster: Size.medium,
    type: ShipType.corvette,
    owners: [
      Factions.xenon,
    ],
    price: { min: 33414, max: 45207, avg: 39310 },
    production: [
      {
        time: 17,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 94 },
          { ware: 'ore', amount: 79 },
          { ware: 'silicon', amount: 79 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_m_miner_01_a',
    name: 'S',
    description: 'No information available',
    race: Races.xenon,
    hull: 6000,
    purpose: ShipPurpose.mine,
    thruster: Size.medium,
    type: ShipType.miner,
    owners: [
      Factions.xenon,
    ],
    price: { min: 30324, max: 41026, avg: 35675 },
    production: [
      {
        time: 15,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 85 },
          { ware: 'ore', amount: 71 },
          { ware: 'silicon', amount: 72 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_s_fighter_01_a',
    name: 'N',
    description: 'No information available',
    race: Races.xenon,
    hull: 2500,
    storage: { missile: 20, unit: 0 },
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.fighter,
    owners: [
      Factions.xenon,
    ],
    price: { min: 14675, max: 19855, avg: 17265 },
    production: [
      {
        time: 7,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 41 },
          { ware: 'ore', amount: 34 },
          { ware: 'silicon', amount: 35 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_s_fighter_02_a',
    name: 'M',
    description: 'No information available',
    race: Races.xenon,
    hull: 2900,
    storage: { missile: 20, unit: 0 },
    purpose: ShipPurpose.fight,
    thruster: Size.small,
    type: ShipType.heavyfighter,
    owners: [
      Factions.xenon,
    ],
    price: { min: 16932, max: 22908, avg: 19920 },
    production: [
      {
        time: 9,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 48 },
          { ware: 'ore', amount: 40 },
          { ware: 'silicon', amount: 40 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_xl_carrier_01_a',
    name: 'I',
    description: 'No information available',
    race: Races.xenon,
    hull: 340000,
    purpose: ShipPurpose.fight,
    thruster: Size.extralarge,
    type: ShipType.battleship,
    owners: [
      Factions.xenon,
    ],
    price: { min: 2150466, max: 2909454, avg: 2529960 },
    production: [
      {
        time: 1094,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 6049 },
          { ware: 'ore', amount: 5070 },
          { ware: 'silicon', amount: 5090 },
        ],
      },
    ]
  },
  {
    id: 'ship_xen_xl_destroyer_01_a',
    name: 'K',
    description: 'No information available',
    race: Races.xenon,
    hull: 165000,
    purpose: ShipPurpose.fight,
    thruster: Size.large,
    type: ShipType.destroyer,
    owners: [
      Factions.xenon,
    ],
    price: { min: 1033787, max: 1398653, avg: 1216220 },
    production: [
      {
        time: 526,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          { ware: 'energycells', amount: 2908 },
          { ware: 'ore', amount: 2437 },
          { ware: 'silicon', amount: 2447 },
        ],
      },
    ]
  },
];
