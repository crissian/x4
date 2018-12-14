export const Wares = [
  {
    id: 'advancedcomposites',
    tags: 'container economy',
    name: 'Advanced Composites',
    description: 'Formed from some of the refined resources collected from mining ships, advanced composites is a general term for many compounds created to serve several purposes; most commonly used in the production of a variety of equipment parts.',
    group: 'hightech',
    factoryName: 'Advanced Composite Factory',
    transport: 'container',
    volume: 32,
    price: {
      min: 735,
      max: 994,
      average: 865
    },
    production: [
      {
        time: 300.0,
        amount: 60,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'graphene',
            amount: 80
          },
          {
            ware: 'refinedmetals',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.2
          }
        ]
      },
      {
        time: 300.0,
        amount: 60,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'graphene',
            amount: 80
          },
          {
            ware: 'teladianium',
            amount: 58
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.2
          }
        ]
      }
    ],
    icon: {
      active: 'ware_advancedcomposites'
    }
  },
  {
    id: 'advancedelectronics',
    tags: 'container economy stationbuilding',
    name: 'Advanced Electronics',
    description: 'Designed specifically to work alongside weapon and turret components, it is a variety of advanced electronics that allow different weapons and turrets to have a range of turning speeds, fire rates and cooldowns. Whereas field coils for shields and antimatter converters for engines are more modular and can be used \'across the board\', different weapons and turrets expect different electronic systems to be used in order to ensure the correct properties. However, as all equipment is built and repaired on demand, all advanced electronics are shipped to shipyards and equipment docks together.',
    group: 'shiptech',
    factoryName: 'Advanced Electronics Factory',
    transport: 'container',
    volume: 30,
    price: {
      min: 1986,
      max: 2428,
      average: 2207
    },
    production: [
      {
        time: 720.0,
        amount: 60,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'microchips',
            amount: 44
          },
          {
            ware: 'quantumtubes',
            amount: 20
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_advancedelectronics'
    }
  },
  {
    id: 'antimattercells',
    tags: 'container economy',
    name: 'Antimatter Cells',
    description: 'Highly advanced magnetic storage devices that carry antimatter. Due to the effect of Hawking radiation and their being self-powered, antimatter cells cannot store antimatter indefinitely. They are produced and filled using refined hydrogen and primarily used in the production of engine parts, and also can be miniaturised to be used in claytronics.',
    group: 'refined',
    factoryName: 'Antimatter Cell Factory',
    transport: 'container',
    volume: 18,
    price: {
      min: 181,
      max: 222,
      average: 202
    },
    production: [
      {
        time: 120.0,
        amount: 110,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 100
          },
          {
            ware: 'hydrogen',
            amount: 320
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.21
          }
        ]
      }
    ],
    icon: {
      active: 'ware_antimattercells'
    }
  },
  {
    id: 'antimatterconverters',
    tags: 'container economy',
    name: 'Antimatter Converters',
    description: 'Attached to the antimatter cells used in engine parts for both main engines and thrusters, antimatter converters fine-tune the amount of energy used to a more specific configuration. It is the use of this component that allows so many variations of engine, as their number and set up greatly impact the power and efficiency of the final product.',
    group: 'shiptech',
    factoryName: 'Antimatter Converter Factory',
    transport: 'container',
    volume: 10,
    price: {
      min: 626,
      max: 847,
      average: 737
    },
    production: [
      {
        time: 300.0,
        amount: 150,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedcomposites',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 80
          },
          {
            ware: 'microchips',
            amount: 30
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.23
          }
        ]
      }
    ],
    icon: {
      active: 'ware_antimatterconverters'
    }
  },
  {
    id: 'bomb_player_limpet_emp_01_mk1',
    tags: 'bomb crafting inventory personalupgrade',
    name: 'Spacesuit EMP',
    description: 'A device that when triggered will cause a small electro-magnetic explosion without doing noticeable structural damage, this EMP is small enough to be fired from a hand-held weapon. It requires a precise aim to be most affective, as the pulse will only cripple very nearby computer and electronic systems. ',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 110000,
      max: 130000,
      average: 120000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_magneticmaterial',
            amount: 1
          },
          {
            ware: 'inv_remotedetonator',
            amount: 1
          },
          {
            ware: 'inv_securecontainer',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'bomb_player_limpet_mine_01_mk1',
    tags: 'bomb crafting inventory personalupgrade',
    name: 'Spacesuit Bomb',
    description: 'Small enough to be launched from a hand-held weapon or similar, these explosives will stick to any magnetic surface and await to be triggered by the user. If positioned correctly, they can be used to destroy small parts of station and ship hull plating, but the user must be quite close for this to work, otherwise the bomb is likely to float away from its target before its magnet takes hold. Warning: Explosives can kill.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85000,
      max: 100000,
      average: 90000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_remotedetonator',
            amount: 1
          },
          {
            ware: 'inv_securecontainer',
            amount: 1
          },
          {
            ware: 'inv_unstablecrystal',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'claytronics',
    tags: 'container economy stationbuilding',
    name: 'Claytronics',
    description: 'More commonly known as programmable matter, claytronics are made up of millions of individual nanometre-scale computers known as catoms. This technology lives at the heart of any non-Xenon station, used to build anything from internal wiring to computer systems and control mechanisms - effectively everything but the hull of the station itself. Claytronics are always in high-demand, as the universe rebuilds itself after the Jump Gate shutdown.',
    group: 'shiptech',
    factoryName: 'Claytronics Factory',
    transport: 'container',
    volume: 24,
    price: {
      min: 4254,
      max: 4702,
      average: 4478
    },
    production: [
      {
        time: 900.0,
        amount: 120,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimattercells',
            amount: 100
          },
          {
            ware: 'energycells',
            amount: 140
          },
          {
            ware: 'microchips',
            amount: 160
          },
          {
            ware: 'quantumtubes',
            amount: 100
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.2
          }
        ]
      }
    ],
    icon: {
      active: 'ware_claytronics'
    }
  },
  {
    id: 'clothingmod_0001',
    tags: 'clothingmod inventory',
    name: 'Clothing Mod 0001',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'clothingmod_0002',
    tags: 'clothingmod inventory',
    name: 'Clothing Mod 0002',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'countermeasure_flares_01',
    tags: 'countermeasure equipment',
    name: 'Flares',
    description: 'A piece of equipment tried and tested over hundreds of years, the modern flare has continued to be a boon for many a combat pilot in recent years. Forcibly ejected from a compartment of a ship, flares then explode so that the sudden heat signature may distract a guided missile from its original target, and before exploding additionally send out a small electro-magnetic signature that can disrupt a target lock before a missile is even fired.',
    group: 'countermeasures',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 2179,
      max: 2663,
      average: 2421
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedcomposites',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 9
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 4
          },
          {
            ware: 'silicon',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'crew',
    name: 'Crewman',
    description: 'No information available',
    transport: 'passenger',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: []
  },
  {
    id: 'dronecomponents',
    tags: 'container economy',
    name: 'Drone Components',
    description: 'Much like weapon and turret components, drone components have been generalised and standardised across much of the Jump Gate network to be modularly used in all kinds of drone, making them a highly sought-after resource. Drone components are directly shipped to shipyards, equipment docks and stations to source drone-building, which is done on-demand as and when it is necessary.',
    group: 'shiptech',
    factoryName: 'Drone Component Factory',
    transport: 'container',
    volume: 30,
    price: {
      min: 2261,
      max: 2764,
      average: 2512
    },
    production: [
      {
        time: 1200.0,
        amount: 120,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 20
          },
          {
            ware: 'microchips',
            amount: 20
          },
          {
            ware: 'scanningarrays',
            amount: 40
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_dronecomponents'
    }
  },
  {
    id: 'energycells',
    tags: 'container economy stationbuilding',
    name: 'Energy Cells',
    description: 'Contrary to common belief, Energy Cells are not simply glorified batteries; actually, they are sophisticated bio-chemical (or bio-mechanical, depending on technology) devices capable of storing energy near or at 100% efficiency.',
    group: 'energy',
    factoryName: 'Solar Power Plant',
    transport: 'container',
    volume: 1,
    price: {
      min: 11,
      max: 21,
      average: 16
    },
    production: [
      {
        time: 60.0,
        amount: 200,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_energycells'
    }
  },
  {
    id: 'engineparts',
    tags: 'container economy',
    name: 'Engine Parts',
    description: 'Comprised of a number of different components that make up ship engines, engine parts are delivered straight to the end customer, most commonly shipyards and equipment docks, who then use them themselves to produce or repair engines. While naturally engine parts are a very necessary resource across the entire Jump Gate network, the ability to produce and repair engines on demand, instead of requiring an entirely separate production step for each, has greatly streamlined the universal economy.',
    group: 'hightech',
    factoryName: 'Engine Part Factory',
    transport: 'container',
    volume: 30,
    price: {
      min: 480,
      max: 719,
      average: 600
    },
    production: [
      {
        time: 900.0,
        amount: 120,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimattercells',
            amount: 80
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'refinedmetals',
            amount: 96
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.27
          }
        ]
      },
      {
        time: 900.0,
        amount: 120,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'antimattercells',
            amount: 80
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'teladianium',
            amount: 70
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.27
          }
        ]
      }
    ],
    icon: {
      active: 'ware_engineparts'
    }
  },
  {
    id: 'engine_arg_l_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG L All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 321518,
      max: 392966,
      average: 357242
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 147
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 67
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_l_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG L Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 589519,
      max: 720523,
      average: 655021
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 278
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 113
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11767,
      max: 14382,
      average: 13074
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 58166,
      max: 71092,
      average: 64629
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 22
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 287722,
      max: 351660,
      average: 319691
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 90
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 110
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 14357,
      max: 17547,
      average: 15952
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 69711,
      max: 85202,
      average: 77457
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 22
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 26
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 345444,
      max: 422209,
      average: 383827
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 110
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 130
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13062,
      max: 15964,
      average: 14513
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 65234,
      max: 79730,
      average: 72482
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_m_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG M Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 331013,
      max: 404572,
      average: 367793
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 105
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 125
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 5526,
      max: 6754,
      average: 6140
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26370,
      max: 32230,
      average: 29300
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 8
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 123301,
      max: 150701,
      average: 137001
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 40
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 45
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 8116,
      max: 9919,
      average: 9017
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 40504,
      max: 49505,
      average: 45005
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 181023,
      max: 221250,
      average: 201137
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 60
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 65
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6821,
      max: 8336,
      average: 7579
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 34732,
      max: 42450,
      average: 38591
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 14
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_s_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG S Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 166592,
      max: 203613,
      average: 185103
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 55
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 60
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_xl_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG XL All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 424061,
      max: 518297,
      average: 471179
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 193
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 89
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_arg_xl_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'ARG XL Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 748675,
      max: 915047,
      average: 831861
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 349
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 148
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_gen_spacesuit_01_mk1',
    tags: 'disallowdrop engine equipment inventory noblueprint noplayerblueprint personalupgrade',
    name: 'Spacesuit Thrusters Mk1',
    group: 'engines',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 800,
      max: 1200,
      average: 1000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ]
  },
  {
    id: 'engine_gen_spacesuit_01_mk2',
    tags: 'disallowdrop engine equipment inventory noblueprint noplayerblueprint personalupgrade',
    name: 'Spacesuit Thrusters Mk2',
    group: 'engines',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8000,
      max: 12000,
      average: 10000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_l_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR L All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 321518,
      max: 392966,
      average: 357242
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 147
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 67
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_l_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR L Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 589519,
      max: 720523,
      average: 655021
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 278
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 113
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11767,
      max: 14382,
      average: 13074
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 58166,
      max: 71092,
      average: 64629
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 22
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 287722,
      max: 351660,
      average: 319691
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 90
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 110
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 14357,
      max: 17547,
      average: 15952
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 69711,
      max: 85202,
      average: 77457
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 22
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 26
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 345444,
      max: 422209,
      average: 383827
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 110
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 130
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13062,
      max: 15964,
      average: 14513
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 65234,
      max: 79730,
      average: 72482
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_m_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR M Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 331013,
      max: 404572,
      average: 367793
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 105
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 125
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 5526,
      max: 6754,
      average: 6140
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26370,
      max: 32230,
      average: 29300
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 8
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 123301,
      max: 150701,
      average: 137001
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 40
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 45
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 8116,
      max: 9919,
      average: 9017
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 40504,
      max: 49505,
      average: 45005
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 181023,
      max: 221250,
      average: 201137
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 60
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 65
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6821,
      max: 8336,
      average: 7579
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 34732,
      max: 42450,
      average: 38591
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 14
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_s_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR S Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 166592,
      max: 203613,
      average: 185103
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 55
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 60
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_xl_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR XL All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 424061,
      max: 518297,
      average: 471179
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 193
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 89
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_par_xl_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'PAR XL Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 748675,
      max: 915047,
      average: 831861
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 349
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 148
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_l_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL L All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 321235,
      max: 392621,
      average: 356928
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 147
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 67
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_l_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL L Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 588999,
      max: 719887,
      average: 654443
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 278
          },
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'engineparts',
            amount: 113
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11757,
      max: 14370,
      average: 13064
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 58118,
      max: 71033,
      average: 64575
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 22
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 287479,
      max: 351363,
      average: 319421
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 90
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 110
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 14345,
      max: 17533,
      average: 15939
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 69652,
      max: 85131,
      average: 77391
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 22
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 26
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 345151,
      max: 421851,
      average: 383501
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 110
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 130
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13051,
      max: 15952,
      average: 14501
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 65179,
      max: 79663,
      average: 72421
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'engineparts',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_m_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL M Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 330733,
      max: 404229,
      average: 367481
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 105
          },
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'engineparts',
            amount: 125
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 5522,
      max: 6749,
      average: 6135
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_allround_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S All-round Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26348,
      max: 32203,
      average: 29276
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 8
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_allround_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S All-round Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 123197,
      max: 150574,
      average: 136885
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 40
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 45
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 8110,
      max: 9912,
      average: 9011
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_combat_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Combat Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 40471,
      max: 49464,
      average: 44967
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_combat_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Combat Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 180869,
      max: 221062,
      average: 200966
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 60
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 65
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6816,
      max: 8330,
      average: 7573
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_travel_01_mk2',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Travel Engine Mk2',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 34703,
      max: 42415,
      average: 38559
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 14
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_s_travel_01_mk3',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL S Travel Engine Mk3',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 166451,
      max: 203440,
      average: 184946
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 55
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 60
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_xl_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL XL All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 423689,
      max: 517843,
      average: 470766
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 193
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 89
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_tel_xl_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'TEL XL Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 748015,
      max: 914241,
      average: 831128
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 349
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'engineparts',
            amount: 148
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_xen_l_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'XEN L All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 321322,
      max: 392726,
      average: 357024
    },
    production: [
      {
        time: 8.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'ore',
            amount: 411
          },
          {
            ware: 'silicon',
            amount: 411
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_xen_m_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'XEN M Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 15811,
      max: 19325,
      average: 17568
    },
    production: [
      {
        time: 4.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 19
          },
          {
            ware: 'silicon',
            amount: 19
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_xen_m_travel_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'XEN M Travel Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 14256,
      max: 17424,
      average: 15840
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 17
          },
          {
            ware: 'silicon',
            amount: 17
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_xen_s_combat_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'XEN S Combat Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6134,
      max: 7498,
      average: 6816
    },
    production: [
      {
        time: 2.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 7
          },
          {
            ware: 'silicon',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'engine_xen_xl_allround_01_mk1',
    tags: 'engine equipment noplayerblueprint',
    name: 'XEN XL All-round Engine Mk1',
    description: 'No information available',
    group: 'engines',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 424138,
      max: 518390,
      average: 471264
    },
    production: [
      {
        time: 16.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'ore',
            amount: 541
          },
          {
            ware: 'silicon',
            amount: 541
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'fieldcoils',
    tags: 'container economy stationbuilding',
    name: 'Field Coils',
    description: 'Used to fine-tune the arrays used on ship and station shielding, field coils allow for much more modulation than using shield components alone. As such shipyards have begun using them to build a much wider variety of shields than was previously available. Like many of the components used on ships - that aren\'t the hull itself - shield components are shipped straight to shipyards and equipment docks so that shields can be produced on-demand.',
    group: 'shiptech',
    factoryName: 'Field Coil Factory',
    transport: 'container',
    volume: 15,
    price: {
      min: 854,
      max: 1281,
      average: 1068
    },
    production: [
      {
        time: 600.0,
        amount: 200,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'plasmaconductors',
            amount: 40
          },
          {
            ware: 'quantumtubes',
            amount: 43
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_fieldcoils'
    }
  },
  {
    id: 'foodrations',
    tags: 'container economy',
    name: 'Food Rations',
    description: 'Food Rations come in a large variety; as far as rations for the species Homo sapiens are concerned, they mainly contain wheat, freeze-dried meat and different spices as well as vitamins and essential minerals.',
    group: 'food',
    factoryName: 'Food Ration Factory',
    transport: 'container',
    volume: 1,
    price: {
      min: 34,
      max: 51,
      average: 43
    },
    production: [
      {
        time: 240.0,
        amount: 328,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'meat',
            amount: 40
          },
          {
            ware: 'spices',
            amount: 20
          },
          {
            ware: 'wheat',
            amount: 40
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_foodrations'
    }
  },
  {
    id: 'graphene',
    tags: 'container economy',
    name: 'Graphene',
    description: 'Produced from refined and heavily modified methane gas in the modern era, graphene is a semi-metal that has many uncommon properties. Due to its strength and resistance to heat and electricity, it is used to produce a variety of tech-level resources, and is also used to help in the reinforcement of hull parts.',
    group: 'refined',
    factoryName: 'Graphene Refinery',
    transport: 'container',
    volume: 20,
    price: {
      min: 150,
      max: 183,
      average: 166
    },
    production: [
      {
        time: 240.0,
        amount: 110,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 80
          },
          {
            ware: 'methane',
            amount: 320
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.27
          }
        ]
      }
    ],
    icon: {
      active: 'ware_graphene'
    }
  },
  {
    id: 'helium',
    tags: 'economy gas liquid minable',
    name: 'Helium',
    description: 'A colourless, odourless and non-toxic noble gas, helium is found in great abundance in gas nebulas across the entire Jump Gate network and is usually collected by mining ships to be refined into superfluid coolant.',
    group: 'gases',
    factoryName: 'Helium Extractor',
    transport: 'liquid',
    volume: 6,
    price: {
      min: 37,
      max: 51,
      average: 44
    },
    production: [],
    icon: {
      active: 'ware_helium'
    }
  },
  {
    id: 'hullparts',
    tags: 'container economy stationbuilding',
    name: 'Hull Parts',
    description: 'Made from refined metals or teladianium, Hull Parts are most commonly used to build the hulls of ships and stations, though they do have some other uses such as in drones and weapons. Usually layered for additional protection, and using other compounds to further reinforce, Hull Parts are still cheap to produce - a bonus, considering their position as the most frequently used resource in the Jump Gate network.',
    group: 'hightech',
    factoryName: 'Hull Part Factory',
    transport: 'container',
    volume: 25,
    price: {
      min: 413,
      max: 619,
      average: 516
    },
    production: [
      {
        time: 900.0,
        amount: 220,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 80
          },
          {
            ware: 'graphene',
            amount: 40
          },
          {
            ware: 'refinedmetals',
            amount: 280
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      },
      {
        time: 900.0,
        amount: 220,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 80
          },
          {
            ware: 'graphene',
            amount: 40
          },
          {
            ware: 'teladianium',
            amount: 204
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_hullparts'
    }
  },
  {
    id: 'hydrogen',
    tags: 'economy gas liquid minable',
    name: 'Hydrogen',
    description: 'Historically, Hydrogen has been used mainly in H-fusion generators. These days however, with the rise of sustainable M/AM mass conversion, Hydrogen is routinely converted into anti-Hydrogen for use in Antimatter Cells.',
    group: 'gases',
    factoryName: 'Hydrogen Extractor',
    transport: 'liquid',
    volume: 6,
    price: {
      min: 49,
      max: 67,
      average: 58
    },
    production: [],
    icon: {
      active: 'ware_hydrogen'
    }
  },
  {
    id: 'ice',
    tags: 'economy minable mineral solid',
    name: 'Ice',
    description: 'H2O in its solid state of aggregation, used for industrial water supplies and general consumption after treatment.',
    group: 'ice',
    factoryName: 'Ice Mine',
    transport: 'solid',
    volume: 8,
    price: {
      min: 26,
      max: 35,
      average: 30
    },
    production: [],
    icon: {
      active: 'ware_ice'
    }
  },
  {
    id: 'inv_advancedtargetingmodule',
    tags: 'inventory tradeonly',
    name: 'Advanced Targeting Module',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8548,
      max: 11565,
      average: 10056
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_agidevice_01',
    tags: 'crafting inventory',
    name: 'AGI Processor',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 7939,
      max: 13232,
      average: 10585
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_agidevice_02',
    tags: 'crafting inventory',
    name: 'AGI Heuristic Core',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 3879,
      max: 5248,
      average: 4563
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_agidevice_03',
    tags: 'crafting inventory',
    name: 'AGI Neural Network',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 7488,
      max: 12479,
      average: 9983
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_algaescrubber',
    tags: 'inventory tradeonly',
    name: 'Algae Scrubber',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 742,
      max: 1003,
      average: 872
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_argnusteak',
    tags: 'crafting inventory',
    name: 'Argnu Steak',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 644,
      max: 871,
      average: 757
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_bandages',
    tags: 'crafting inventory',
    name: 'Bandages',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 96,
      max: 129,
      average: 112
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_carbonfilter',
    tags: 'inventory tradeonly',
    name: 'Carbon Filter',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 691,
      max: 934,
      average: 812
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystalbit',
    tags: 'inventory tradeonly',
    name: 'Crystal Bit',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 827,
      max: 1118,
      average: 972
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystal_01',
    tags: 'inventory tradeonly',
    name: 'Bandannite Crystal',
    description: 'First collected by an explorer from an asteroid in Ore Belt, Bandannite was named after the legendary Ban Danna, an Argon military commander and war hero before the Jump Gate shutdown. Rediscovered across the entire Jump Gate network after the realignment, this crystal is not the rarest, but will still fetch a good sum at the right dealer.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 850,
      max: 1150,
      average: 1000
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystal_02',
    tags: 'inventory tradeonly',
    name: 'Menelaene Crystal',
    description: 'A crystal discovered at the heart of an asteroid in Kingdom End, Menelaene is named after the then princess of the Queendom of Boron, Menelaus. Many a miner have since found this rare crystal in asteroids scattered throughout space, and though many simply sell the crystals for a profit, some choose to hold onto the precious stone, in the hope that the Boron may one day re-emerge from the darkness.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8500,
      max: 11500,
      average: 10000
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystal_03',
    tags: 'inventory tradeonly',
    name: 'Aguilite Crystal',
    description: 'Discovered by Ichirou Aguilar, a Terran mercenary trapped in the Jump Gate network after the Sol Gate was destroyed, this crystal is not found so commonly, but is also not so rare that its price on the free market is deemed ludicrous.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 17000,
      max: 23000,
      average: 20000
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystal_04',
    tags: 'inventory tradeonly',
    name: 'Mitonene Crystal',
    description: 'Named after the famed Boron scientist, Mi Ton, mitonene is rarely found among asteroids, at least in the current configuration of the Jump Gate network, therefore fetching a good price at most free market traders.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 25555,
      max: 34500,
      average: 30000
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_crystal_05',
    tags: 'inventory tradeonly',
    name: 'Burnite Crystal',
    description: 'Though the pilot who first discovered this crystal wished to remain anonymous, and the reasons for its mysterious name are not known, it is confirmed to be one of the rarest precious stones currently to be found in the Jump Gate network. Traders and collectors will pay almost any price for it, giving a strong incentive for explorers to search asteroid fields closely for such a prize.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 200000,
      max: 300000,
      average: 250000
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_damagedsingularityengine',
    tags: 'crafting inventory',
    name: 'Damaged Singularity Engine',
    description: 'The damaged remains of this particular Singularity Engine are in a better condition than most. Unlike most examples found to date, the core has not melted and it might be possible to get it working again with the right components. It\'s definitely going to need a new flux capacitor, however.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 88886,
      max: 148143,
      average: 118514
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_decryptionmodule',
    tags: 'crafting inventory',
    name: 'Decryption Module',
    description: 'A decryption module is a chip containing a series of decryption algorithms that can be used to bypass most computer firewalls. Though not much use on its own, it is the most important part of both the Defence and Security Decryption Systems, which makes it a vital and highly sought-after tool.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 7668,
      max: 10375,
      average: 9021
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_digitalseminar_boarding',
    tags: 'gift inventory',
    name: 'Digital Seminar (Boarding)',
    description: 'Available in many topics, digital seminars are perhaps the most comfortable way to learn on the go, making them very popular with learned experts and budding students alike. Sourced from many databases and universities across the Jump Gate network, a digital seminar allows you to learn a great deal about a given topic while not interrupting your daily routine. This has made them particularly popular in corporations where training is necessary but time is short.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85,
      max: 115,
      average: 100
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_digitalseminar_engineering',
    tags: 'gift inventory',
    name: 'Digital Seminar (Engineering)',
    description: 'Available in many topics, digital seminars are perhaps the most comfortable way to learn on the go, making them very popular with learned experts and budding students alike. Sourced from many databases and universities across the Jump Gate network, a digital seminar allows you to learn a great deal about a given topic while not interrupting your daily routine. This has made them particularly popular in corporations where training is necessary but time is short.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85,
      max: 115,
      average: 100
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_digitalseminar_management',
    tags: 'gift inventory',
    name: 'Digital Seminar (Management)',
    description: 'Available in many topics, digital seminars are perhaps the most comfortable way to learn on the go, making them very popular with learned experts and budding students alike. Sourced from many databases and universities across the Jump Gate network, a digital seminar allows you to learn a great deal about a given topic while not interrupting your daily routine. This has made them particularly popular in corporations where training is necessary but time is short.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85,
      max: 115,
      average: 100
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_digitalseminar_morale',
    tags: 'gift inventory',
    name: 'Digital Seminar (Morale)',
    description: 'Available in many topics, digital seminars are perhaps the most comfortable way to learn on the go, making them very popular with learned experts and budding students alike. Sourced from many databases and universities across the Jump Gate network, a digital seminar allows you to learn a great deal about a given topic while not interrupting your daily routine. This has made them particularly popular in corporations where training is necessary but time is short.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85,
      max: 115,
      average: 100
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_digitalseminar_piloting',
    tags: 'gift inventory',
    name: 'Digital Seminar (Piloting)',
    description: 'Available in many topics, digital seminars are perhaps the most comfortable way to learn on the go, making them very popular with learned experts and budding students alike. Sourced from many databases and universities across the Jump Gate network, a digital seminar allows you to learn a great deal about a given topic while not interrupting your daily routine. This has made them particularly popular in corporations where training is necessary but time is short.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 85,
      max: 115,
      average: 100
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_electronics',
    tags: 'crafting inventory',
    name: 'Electronics',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 15407,
      max: 20844,
      average: 18125
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_salvagedelectronics',
            amount: 25
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_familyheirloom',
    tags: 'inventory tradeonly',
    name: 'Family Heirloom',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_finemeal',
    tags: 'crafting inventory',
    name: 'Fine Meal',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 12786,
      max: 17299,
      average: 15042
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_argnusteak',
            amount: 5
          },
          {
            ware: 'inv_mixedfruit',
            amount: 3
          },
          {
            ware: 'inv_rarespices',
            amount: 3
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_firstaidkit',
    tags: 'crafting inventory',
    name: 'First Aid Kit',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8944,
      max: 12101,
      average: 10523
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_bandages',
            amount: 1
          },
          {
            ware: 'inv_needle',
            amount: 1
          },
          {
            ware: 'inv_sedative',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_fluxcapacitor',
    tags: 'crafting inventory',
    name: 'Flux Capacitor',
    description: 'The flux capacitor itself is a very old piece of technology, but for a long time it was little more than a curiosity with no viable practical application outside the laboratory. This changed with the development of the Singularity Engine, but since the other technologies used in this engine were a closely-guarded secret, now lost, flux capacitors are no longer in production.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 97365,
      max: 162274,
      average: 129819
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_hallucinogenics',
    tags: 'crafting inventory',
    name: 'Hallucinogenics',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 6264,
      max: 10440,
      average: 8352
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_harddrug_01',
    tags: 'crafting inventory',
    name: 'Delirium',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 45671,
      max: 76118,
      average: 60895
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_hallucinogenics',
            amount: 3
          },
          {
            ware: 'inv_needle',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_herbicide',
    tags: 'inventory tradeonly',
    name: 'Herbicide',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 201,
      max: 272,
      average: 236
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_hydraulicpump',
    tags: 'inventory tradeonly',
    name: 'Hydraulic Pump',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 408,
      max: 551,
      average: 479
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_interfaceunit',
    tags: 'crafting inventory',
    name: 'Interface Unit',
    description: 'This interface unit is essentially an intelligent signal converter designed to allow different pieces of equipment, developed by different species and using a variety of technologies, to communicate. It has numerous input and output ports, and has a learning mode to allow it to determine the correct signals to use.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 811,
      max: 1098,
      average: 954
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_kyondevice_01',
    tags: 'crafting inventory',
    name: 'Kyon Crystallite',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 15018,
      max: 25029,
      average: 20023
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_kyondevice_02',
    tags: 'crafting inventory',
    name: 'Kyon Crystal Shard',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 34544,
      max: 46735,
      average: 40639
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_kyondevice_03',
    tags: 'crafting inventory',
    name: 'Kyon Crystal',
    description: 'Used in the manufacture of Kha\'ak beam weapons before the Jump Gate shutdown, many of these crystals were salvaged from wrecked Kha\'ak ships during the Kha\'ak War and Operation Final Fury, and so have been carried across the Jump Gate network or handed down over the generations. There are reports of it being found naturally occurring in some asteroids across the current Jump Gate network configuration, but so rarely is it found that these reports are yet to be confirmed.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 60409,
      max: 100682,
      average: 80545
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_magneticmaterial',
    tags: 'crafting inventory',
    name: 'Lodestone',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 46,
      max: 63,
      average: 54
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_majaglit',
    tags: 'inventory tradeonly',
    name: 'Majaglit',
    description: 'Majaglit is a type of jewelry seen as the mark of high-society by many Paranid. It is forged, usually, from the superheated shell of a maja snail, that is then crushed and heated again until it forms a glass-like liquid that when cooled will harden into whichever shape the artist has formed.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1020,
      max: 1380,
      average: 1200
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_microgimble',
    tags: 'inventory tradeonly',
    name: 'Micro-Gimbal',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 553,
      max: 748,
      average: 650
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_micromotor',
    tags: 'inventory tradeonly',
    name: 'Micro-Motor',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 482,
      max: 653,
      average: 567
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_mixedfruit',
    tags: 'crafting inventory',
    name: 'Mixed Fruit',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 342,
      max: 463,
      average: 402
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_modulartrigger',
    tags: 'inventory tradeonly',
    name: 'Modular Trigger',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 482,
      max: 653,
      average: 567
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_needle',
    tags: 'crafting inventory',
    name: 'Needle',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 544,
      max: 736,
      average: 640
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_preciousring',
    tags: 'inventory tradeonly',
    name: 'Precious Ring',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_pricelessart',
    tags: 'inventory tradeonly',
    name: 'Priceless Art',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_programmablefieldarray',
    tags: 'crafting inventory',
    name: 'Programmable Field Array',
    description: 'Engineers developing new forms of spatial fields normally start out using a programmable field array. This allows them to modify the size, shape and composition of the field, but at a much lower power output than would normally be available in a final production model.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 105882,
      max: 176470,
      average: 141176
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_rapidsandfilter',
    tags: 'inventory tradeonly',
    name: 'Rapid Sand Filter',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 673,
      max: 910,
      average: 791
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_rarespices',
    tags: 'crafting inventory',
    name: 'Rare Spices',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 819,
      max: 1108,
      average: 963
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_remotedetonator',
    tags: 'crafting inventory',
    name: 'Remote Detonator',
    description: 'A remote detonator can be attached to most explosives in order to ensure that they only go off when the user wishes, minimising the risk of accidental or pre-emptive detonations.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 13513,
      max: 18282,
      average: 15897
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_salvagedelectronics',
    tags: 'crafting inventory',
    name: 'Salvaged Electronics',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 124,
      max: 167,
      average: 145
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_securecontainer',
    tags: 'crafting inventory',
    name: 'Secure Container',
    description: 'A vacuum-sealed container that required a six-digit code both to open and shut. These containers do not have the same integrity as a ship container, but as long as they are not tampered with, will securely hold whatever is placed inside for a considerable time.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 3877,
      max: 5246,
      average: 4561
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_securitybypasssystem',
    tags: 'crafting inventory',
    name: 'Security Bypass System',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 141704,
      max: 169507,
      average: 155605
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_agidevice_03',
            amount: 1
          },
          {
            ware: 'inv_decryptionmodule',
            amount: 1
          },
          {
            ware: 'inv_interfaceunit',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_securitydecryptionsystem',
    tags: 'crafting inventory',
    name: 'Security Decryption System',
    description: 'Security decryption systems are beloved on the black market as the catch-all approach to circumventing or controlling computer and electronic systems. With heuristic algorithms and enough storage to save very few successful and failed hacking attempts, the security decryption system is capable of learning from its past mistakes and changing its approach until it is able to break the system. Experts have confirmed that these systems are not AGI, but that they do come worryingly close.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 151704,
      max: 179507,
      average: 165606
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_agidevice_02',
            amount: 5
          },
          {
            ware: 'inv_decryptionmodule',
            amount: 1
          },
          {
            ware: 'inv_interfaceunit',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_securityslicer',
    tags: 'crafting inventory',
    name: 'Security Slicer',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 146704,
      max: 185507,
      average: 159605
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_agidevice_01',
            amount: 1
          },
          {
            ware: 'inv_decryptionmodule',
            amount: 1
          },
          {
            ware: 'inv_interfaceunit',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_sedative',
    tags: 'crafting inventory',
    name: 'Sedative',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 223,
      max: 302,
      average: 262
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_sensitivedatapacket',
    tags: 'inventory tradeonly',
    name: 'Sensitive Data Packet',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_spaceflycaviar',
    tags: 'crafting gift inventory',
    name: 'Spacefly Caviar',
    description: 'A delicacy among the Split and enjoyed by other races also, spacefly caviar is made from collected spacefly eggs and preservatives, stored in airtight containers and often enjoyed with alcoholic beverages. Due to the modern rarity of the spacefly, this caviar is harder to produce and more difficult to come by, and recently its price has begun to rise.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 898450,
      max: 1215550,
      average: 1057000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_spaceflyeggs',
            amount: 25
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_spaceflyeggs',
    tags: 'crafting inventory',
    name: 'Spacefly Eggs',
    description: 'Laid by spaceflies in the latter stages of their development, spacefly eggs have long been collected, particularly by the Split, for many uses, among them to be turned into spacefly caviar or to be frozen and turned into jewelry. With spaceflies becoming rarer in recent years, the price of their eggs has recently skyrocketed.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8995,
      max: 12156,
      average: 10570
    },
    production: [],
    icon: {}
  },
  {
    id: 'inv_timewarp',
    tags: 'crafting disallowdrop inventory',
    name: 'SETA',
    description: 'The Singularity Engine Time Accelerator, or SETA, has fallen out of common use in recent times, as the necessary components required to build the device were lost or destroyed during the Jump Gate shutdown. If a pilot is able to find one of these lost singularity engines, however, it may be possible to build a personal device that functions similarly to the old-style ship attachment, compressing time around the attached spacesuit and deactivating with any major interference to the spacesuit\'s stability. No known side effects of using SETA exist, but they cannot be ruled out.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 2,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'inv_damagedsingularityengine',
            amount: 1
          },
          {
            ware: 'inv_fluxcapacitor',
            amount: 1
          },
          {
            ware: 'inv_programmablefieldarray',
            amount: 1
          }
        ],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'inv_unstablecrystal',
    tags: 'crafting inventory',
    name: 'Unstable Crystal',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 4080,
      max: 6800,
      average: 5440
    },
    production: [],
    icon: {}
  },
  {
    id: 'majadust',
    tags: 'container economy',
    name: 'Maja Dust',
    description: 'Chemically processed from crushed maja snail shells, maja dust is a relaxant and hallucinogenic sold as a powder-substance that is inhaled. Though any official Paranid government would have the populous believe that maja dust is not commonly consumed, it is thought to be highly likely, particularly in light of the ongoing Paranid civil war, that many Paranid and non-Paranid alike are partaking in the outlawed substance.',
    group: 'pharmaceutical',
    factoryName: 'Maja Dust Factory',
    transport: 'container',
    volume: 6,
    price: {
      min: 233,
      max: 700,
      average: 466
    },
    production: [
      {
        time: 600.0,
        amount: 80,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'majasnails',
            amount: 120
          },
          {
            ware: 'spices',
            amount: 60
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.4
          }
        ]
      }
    ],
    icon: {
      active: 'ware_majadust'
    }
  },
  {
    id: 'majasnails',
    tags: 'container economy',
    name: 'Maja Snails',
    description: 'Grown across many Paranid colonies, as well as in tanks across Paranid space, maja snails provide Paranid with a good number of the nutrients they need to survive. Commonly treated very well, once a snail dies its shell and flesh are both processed as part of soja husk, along with soja beans. The shell of the maja snail is also commonly used as the main ingredient of the drug known as maja dust.',
    group: 'agricultural',
    factoryName: 'Maja Snail Farm',
    transport: 'container',
    volume: 6,
    price: {
      min: 76,
      max: 114,
      average: 95
    },
    production: [
      {
        time: 450.0,
        amount: 174,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'water',
            amount: 100
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.33
          }
        ]
      }
    ],
    icon: {
      active: 'ware_majasnails'
    }
  },
  {
    id: 'marine_argon_mk1',
    tags: 'passenger',
    name: 'Marine',
    description: 'Marines',
    transport: 'passenger',
    volume: 1,
    price: {
      min: 18472,
      max: 24992,
      average: 21732
    },
    production: []
  },
  {
    id: 'marine_argon_mk2',
    tags: 'passenger',
    name: 'Marine',
    description: 'Marines',
    transport: 'passenger',
    volume: 1,
    price: {
      min: 79244,
      max: 107212,
      average: 93228
    },
    production: []
  },
  {
    id: 'marine_argon_mk3',
    tags: 'passenger',
    name: 'Marine',
    description: 'Marines',
    transport: 'passenger',
    volume: 1,
    price: {
      min: 316367,
      max: 428025,
      average: 372196
    },
    production: []
  },
  {
    id: 'meat',
    tags: 'container economy',
    name: 'Meat',
    description: 'Though meat comes in a great variety, the most sought-after type as of late is so-called \'vegan meat\', synthesised and cloned not from real animals, but from cell cultures. However, real Argnu meat is still popular within the human population of many worlds.',
    group: 'agricultural',
    factoryName: 'Meat Factory',
    transport: 'container',
    volume: 6,
    price: {
      min: 57,
      max: 94,
      average: 75
    },
    production: [
      {
        time: 450.0,
        amount: 220,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'water',
            amount: 100
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.33
          }
        ]
      }
    ],
    icon: {
      active: 'ware_meat'
    }
  },
  {
    id: 'medicalsupplies',
    tags: 'container economy',
    name: 'Medical Supplies',
    description: 'Medical supplies contain a number of different concoctions and remedies used to keep station workforce healthier and happier during their time aboard. Completely natural in design, these supplies have been vetted by both the Argon Federation and Godrealm of the Paranid to ensure they are both legal and safe, and thus there is no licence necessary to carry or supply them.',
    group: 'pharmaceutical',
    factoryName: 'Medical Supply Factory',
    transport: 'container',
    volume: 2,
    price: {
      min: 92,
      max: 138,
      average: 115
    },
    production: [
      {
        time: 300.0,
        amount: 120,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'spices',
            amount: 30
          },
          {
            ware: 'water',
            amount: 60
          },
          {
            ware: 'wheat',
            amount: 22
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      },
      {
        time: 300.0,
        amount: 120,
        method: 'paranid',
        name: 'Paranid',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'sojabeans',
            amount: 10
          },
          {
            ware: 'spices',
            amount: 30
          },
          {
            ware: 'water',
            amount: 60
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      },
      {
        time: 300.0,
        amount: 120,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'spices',
            amount: 30
          },
          {
            ware: 'sunriseflowers',
            amount: 8
          },
          {
            ware: 'water',
            amount: 60
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      }
    ],
    icon: {
      active: 'ware_medicalsupplies'
    }
  },
  {
    id: 'methane',
    tags: 'economy gas liquid minable',
    name: 'Methane',
    description: 'Found in ample supply in gas nebulas across the Jump Gate network, methane (CH4) is collected by mining ships and taken to refineries to be processed into graphene.',
    group: 'gases',
    factoryName: 'Methane Extractor',
    transport: 'liquid',
    volume: 6,
    price: {
      min: 41,
      max: 55,
      average: 48
    },
    production: [],
    icon: {
      active: 'ware_methane'
    }
  },
  {
    id: 'microchips',
    tags: 'container economy',
    name: 'Microchips',
    description: 'Used in a wide variety of equipment parts, micro-chips are produced using silicon wafers, which, while fragile, allows them to conduct at a much higher rate. This, in turn, allows far better processing in the equipment that uses the micro-chips, which includes many advanced electronics and components.',
    group: 'hightech',
    factoryName: 'Microchip Factory',
    transport: 'container',
    volume: 22,
    price: {
      min: 1364,
      max: 1668,
      average: 1516
    },
    production: [
      {
        time: 600.0,
        amount: 80,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'siliconwafers',
            amount: 200
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_microchips'
    }
  },
  {
    id: 'missilecomponents',
    tags: 'container economy',
    name: 'Missile Components',
    description: 'Missile components are used in the construction of all missiles, often with a different number and configuration making up the construction of each missile. As with ship equipment, missiles are built on demand, and so missile components are bought at and found at shipyards and equipment docks, where most pilots can order missiles on demand.',
    group: 'shiptech',
    factoryName: 'Missile Component Factory',
    transport: 'container',
    volume: 2,
    price: {
      min: 17,
      max: 26,
      average: 21
    },
    production: [
      {
        time: 900.0,
        amount: 330,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedcomposites',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 2
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.3
          }
        ]
      }
    ],
    icon: {
      active: 'ware_missilecomponents'
    }
  },
  {
    id: 'missile_cluster_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Cluster Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1530,
      max: 2070,
      average: 1800
    },
    production: [
      {
        time: 3.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'missilecomponents',
            amount: 12
          }
        ],
        effects: []
      },
      {
        time: 3.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 8
          },
          {
            ware: 'ore',
            amount: 4
          },
          {
            ware: 'silicon',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_cluster_light_mk1',
    tags: 'equipment missile',
    name: 'Light Cluster Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 680,
      max: 920,
      average: 800
    },
    production: [
      {
        time: 1.5,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'missilecomponents',
            amount: 4
          }
        ],
        effects: []
      },
      {
        time: 2.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 6
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_dumbfire_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Dumbfire Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 451,
      max: 610,
      average: 530
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 7
          },
          {
            ware: 'missilecomponents',
            amount: 5
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 2
          },
          {
            ware: 'ore',
            amount: 1
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_dumbfire_heavy_mk2',
    tags: 'equipment missile',
    name: 'Heavy Dumbfire Missile Mk2',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1539,
      max: 2082,
      average: 1810
    },
    production: [
      {
        time: 1.5,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 14
          },
          {
            ware: 'missilecomponents',
            amount: 25
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 9
          },
          {
            ware: 'ore',
            amount: 4
          },
          {
            ware: 'silicon',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_dumbfire_light_mk1',
    tags: 'equipment missile',
    name: 'Light Dumbfire Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 213,
      max: 288,
      average: 250
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'missilecomponents',
            amount: 1
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 1
          },
          {
            ware: 'ore',
            amount: 1
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_dumbfire_light_mk2',
    tags: 'equipment missile',
    name: 'Light Dumbfire Missile Mk2',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 553,
      max: 748,
      average: 650
    },
    production: [
      {
        time: 1.5,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'missilecomponents',
            amount: 5
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 2
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_emp_mk1',
    tags: 'equipment missile',
    name: 'EMP Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 808,
      max: 1093,
      average: 950
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'missilecomponents',
            amount: 11
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_guided_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Guided Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1915,
      max: 2590,
      average: 2253
    },
    production: [
      {
        time: 2.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 16
          },
          {
            ware: 'missilecomponents',
            amount: 3
          },
          {
            ware: 'smartchips',
            amount: 3
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 16
          },
          {
            ware: 'ore',
            amount: 5
          },
          {
            ware: 'silicon',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_guided_light_mk1',
    tags: 'equipment missile',
    name: 'Light Guided Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 729,
      max: 986,
      average: 858
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 8
          },
          {
            ware: 'missilecomponents',
            amount: 1
          },
          {
            ware: 'smartchips',
            amount: 1
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_heatseeker_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Heatseeker Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 2178,
      max: 2947,
      average: 2563
    },
    production: [
      {
        time: 4.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'missilecomponents',
            amount: 6
          },
          {
            ware: 'smartchips',
            amount: 3
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 5
          },
          {
            ware: 'silicon',
            amount: 4
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_heatseeker_light_mk1',
    tags: 'equipment missile',
    name: 'Light Heatseeker Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 839,
      max: 1136,
      average: 988
    },
    production: [
      {
        time: 2.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'missilecomponents',
            amount: 2
          },
          {
            ware: 'smartchips',
            amount: 1
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 1
          },
          {
            ware: 'silicon',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_smart_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Smart Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 2465,
      max: 3335,
      average: 2900
    },
    production: [
      {
        time: 2.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'missilecomponents',
            amount: 3
          },
          {
            ware: 'smartchips',
            amount: 4
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 6
          },
          {
            ware: 'silicon',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_smart_light_mk1',
    tags: 'equipment missile',
    name: 'Light Smart Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1211,
      max: 1639,
      average: 1425
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'missilecomponents',
            amount: 1
          },
          {
            ware: 'smartchips',
            amount: 2
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 3
          },
          {
            ware: 'silicon',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_swarm_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Swarm Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1934,
      max: 2616,
      average: 2275
    },
    production: [
      {
        time: 2.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'missilecomponents',
            amount: 10
          },
          {
            ware: 'smartchips',
            amount: 2
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 4
          },
          {
            ware: 'silicon',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_swarm_light_mk1',
    tags: 'equipment missile',
    name: 'Light Swarm Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 967,
      max: 1308,
      average: 1138
    },
    production: [
      {
        time: 1.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'missilecomponents',
            amount: 5
          },
          {
            ware: 'smartchips',
            amount: 1
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_torpedo_heavy_mk1',
    tags: 'equipment missile',
    name: 'Heavy Torpedo Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 17563,
      max: 23762,
      average: 20663
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'missilecomponents',
            amount: 40
          },
          {
            ware: 'smartchips',
            amount: 35
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'ore',
            amount: 30
          },
          {
            ware: 'silicon',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'missile_torpedo_light_mk1',
    tags: 'equipment missile',
    name: 'Light Torpedo Missile Mk1',
    description: 'No information available',
    group: 'missiles',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 3921,
      max: 5304,
      average: 4613
    },
    production: [
      {
        time: 3.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'missilecomponents',
            amount: 8
          },
          {
            ware: 'smartchips',
            amount: 7
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'ore',
            amount: 20
          },
          {
            ware: 'silicon',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'modpart_enginefuelinjector_t1',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Basic Engine Fuel Injector',
    description: 'Though ship engines no longer require liquid fuel, if it can be safely added to the mixture that powers the engine, it may well be possible to improve engine properties. This requires a fuel injector, not used in ship engines since liquid fuel was a requirement. As they have now fallen out of use, many pilots have simply thrown them away or scrapped them for parts, and so they may be difficult to come across.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_enginefuelinjector_t2',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Advanced Engine Fuel Injector',
    description: 'Though ship engines no longer require liquid fuel, if it can be safely added to the mixture that powers the engine, it may well be possible to improve engine properties. This requires a fuel injector, not used in ship engines since liquid fuel was a requirement. As they have now fallen out of use, many pilots have simply thrown them away or scrapped them for parts, and so they may be difficult to come across.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_enginefuelinjector_t3',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Exceptional Engine Fuel Injector',
    description: 'Though ship engines no longer require liquid fuel, if it can be safely added to the mixture that powers the engine, it may well be possible to improve engine properties. This requires a fuel injector, not used in ship engines since liquid fuel was a requirement. As they have now fallen out of use, many pilots have simply thrown them away or scrapped them for parts, and so they may be difficult to come across.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_extendedfuelcontainer',
    tags: 'crafting equipmentmodpart inventory',
    name: 'Extended Fuel Container',
    description: 'Though it has now been a while since ship engines required liquid fuel to function, these fuel containers can still be found throughout the Jump Gate network, often used to contain something completely different, and sometimes used by modders in engine modifications.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_highenergycatalyst',
    tags: 'crafting equipmentmodpart inventory',
    name: 'High Energy Catalyst',
    description: 'Whether it be a rock or metal, or something man-made, these objects when exposed to specific elements will cause a short but strong and surprising explosion that can be used for a variety of purposes.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_nividiumcrystallite',
    tags: 'crafting equipmentmodpart inventory',
    name: 'Nividium Crystallite',
    description: 'Though a metal in its natural form, under the right conditions, nividium can become a light and strong crystalline structure. Though there are not many uses for this compound, it is rumoured that, among other things, some ship pilots use it and rare ship nanoweaves to improve properties of their ship hulls.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_nividiumoxide',
    tags: 'crafting equipmentmodpart inventory',
    name: 'Nividium Oxide',
    description: 'Nividium oxide is an unstable mixture that when mistreated can be both deadly and messy. When treated properly, however, and handled with care, it becomes a sure-fire, controlled way to produce extra energy in the form of force and excess heat. Racers across the Jump Gate network like to refer to the chemical as \'nox\'.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shieldgeneratorcoil_t1',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Basic Shield Generator Coil',
    description: 'As with all equipment attached to ships in the modern age, ship shields are built on-demand. This means that all shield components are shipped together directly to the shipyards and equipment docks that build and repair ships, and as most pilots are satisfied with what they are given, it is very uncommon to find individual components on their own. If, however, one can find a shield generator coil, it may be possible to modify an existing shield in such a way that the properties can be improved.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shieldgeneratorcoil_t2',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Advanced Shield Generator Coil',
    description: 'As with all equipment attached to ships in the modern age, ship shields are built on-demand. This means that all shield components are shipped together directly to the shipyards and equipment docks that build and repair ships, and as most pilots are satisfied with what they are given, it is very uncommon to find individual components on their own. If, however, one can find a shield generator coil, it may be possible to modify an existing shield in such a way that the properties can be improved.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shieldgeneratorcoil_t3',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Exceptional Shield Generator Coil',
    description: 'Though ship engines no longer require liquid fuel, if it can be safely added to the mixture that powers the engine, it may well be possible to improve engine properties. This requires a fuel injector, not used in ship engines since liquid fuel was a requirement. As they have now fallen out of use, many pilots have simply thrown them away or scrapped them for parts, and so they may be difficult to come across.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shipnanoweave_t1',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Basic Ship Nanoweave',
    description: 'Though today, shipyards across the Jump Gate network are trusted to construct ship hulls from blueprints using hull parts constructed from metals or metal-equivalents, it is rumoured that during the Terran conflict, Beryl developed nanoweaves capable of mimicking or adjusting ship hulls in very specific ways. If these nanoweaves can be found, and understood, it may well be possible to use them to tweak properties of existing ships to make improvements.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shipnanoweave_t2',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Advanced Ship Nanoweave',
    description: 'Though today, shipyards across the Jump Gate network are trusted to construct ship hulls from blueprints using hull parts constructed from metals or metal-equivalents, it is rumoured that during the Terran conflict, Beryl developed nanoweaves capable of mimicking or adjusting ship hulls in very specific ways. If these nanoweaves can be found, and understood, it may well be possible to use them to tweak properties of existing ships to make improvements.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_shipnanoweave_t3',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Exceptional Ship Nanoweave',
    description: 'Though ship engines no longer require liquid fuel, if it can be safely added to the mixture that powers the engine, it may well be possible to improve engine properties. This requires a fuel injector, not used in ship engines since liquid fuel was a requirement. As they have now fallen out of use, many pilots have simply thrown them away or scrapped them for parts, and so they may be difficult to come across.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_tuningsoftware',
    tags: 'crafting equipmentmodpart inventory',
    name: 'Tuning Software',
    description: 'While modifying hardware can take you very far improving a variety of equipment, tuning software can also be used to make improvements to the equipment\'s algorithms and calculations. This may unlock extra potential in the hardware; overriding limits placed on the systems by manufacturers, or simply optimising existing software in such a way that equipment can be used for efficiently.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_weaponchamber_t1',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Basic Weapon Chamber',
    description: 'Though not all weapons, in fact very few, use projectile bullets in the modern day, most still have the equivalent to a chamber, where the shot that will be fired is either loaded or prepared. It is then from the chamber that the bullet is fired. As weapons are now built on-demand, and very few pilots have reason to dismantle them, it is uncommon to find detached weapon chamber. However, if one can be found, it may be possible to modify an existing weapon in a way hitherto unthought of.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_weaponchamber_t2',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Advanced Weapon Chamber',
    description: 'Though not all weapons, in fact very few, use projectile bullets in the modern day, most still have the equivalent to a chamber, where the shot that will be fired is either loaded or prepared. It is then from the chamber that the bullet is fired. As weapons are now built on-demand, and very few pilots have reason to dismantle them, it is uncommon to find detached weapon chamber. However, if one can be found, it may be possible to modify an existing weapon in a way hitherto unthought of.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'modpart_weaponchamber_t3',
    tags: 'crafting equipmentmodpart inventory primarymodpart',
    name: 'Exceptional Weapon Chamber',
    description: 'Though not all weapons, in fact very few, use projectile bullets in the modern day, most still have the equivalent to a chamber, where the shot that will be fired is either loaded or prepared. It is then from the chamber that the bullet is fired. As weapons are now built on-demand, and very few pilots have reason to dismantle them, it is uncommon to find detached weapon chamber. However, if one can be found, it may be possible to modify an existing weapon in a way hitherto unthought of.',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'module_arg_conn_base_01',
    tags: 'module',
    name: 'Argon Base Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 92363,
      max: 124961,
      average: 108662
    },
    production: [
      {
        time: 103.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 17
          },
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 62
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_conn_base_02',
    tags: 'module',
    name: 'Argon Base Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 75585,
      max: 102263,
      average: 88924
    },
    production: [
      {
        time: 82.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 14
          },
          {
            ware: 'energycells',
            amount: 27
          },
          {
            ware: 'hullparts',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_conn_base_03',
    tags: 'module',
    name: 'Argon Base Connection Structure 03',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 98841,
      max: 133727,
      average: 116284
    },
    production: [
      {
        time: 112.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 37
          },
          {
            ware: 'hullparts',
            amount: 68
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_conn_cross_01',
    tags: 'module',
    name: 'Argon Cross Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 65300,
      max: 88348,
      average: 76824
    },
    production: [
      {
        time: 73.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 24
          },
          {
            ware: 'hullparts',
            amount: 44
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_conn_vertical_01',
    tags: 'module',
    name: 'Argon Vertical Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 54125,
      max: 73227,
      average: 63676
    },
    production: [
      {
        time: 59.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 36
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_conn_vertical_02',
    tags: 'module',
    name: 'Argon Vertical Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 70888,
      max: 95908,
      average: 83398
    },
    production: [
      {
        time: 80.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 13
          },
          {
            ware: 'energycells',
            amount: 26
          },
          {
            ware: 'hullparts',
            amount: 48
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_def_claim_01',
    tags: 'module',
    name: 'Argon Administrative Centre',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 744928,
      max: 1007844,
      average: 876386
    },
    production: [
      {
        time: 826.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 137
          },
          {
            ware: 'energycells',
            amount: 274
          },
          {
            ware: 'hullparts',
            amount: 501
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_def_disc_01',
    tags: 'module',
    name: 'Argon Disc Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 533140,
      max: 721308,
      average: 627224
    },
    production: [
      {
        time: 592.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 98
          },
          {
            ware: 'energycells',
            amount: 196
          },
          {
            ware: 'hullparts',
            amount: 359
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_def_tube_01',
    tags: 'module',
    name: 'Argon Bridge Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 462691,
      max: 625993,
      average: 544342
    },
    production: [
      {
        time: 514.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 85
          },
          {
            ware: 'energycells',
            amount: 170
          },
          {
            ware: 'hullparts',
            amount: 312
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_01',
    tags: 'module',
    name: '1M6S Standard Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 293852,
      max: 397564,
      average: 345708
    },
    production: [
      {
        time: 653.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 54
          },
          {
            ware: 'energycells',
            amount: 108
          },
          {
            ware: 'hullparts',
            amount: 198
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_01_hightech',
    tags: 'module',
    name: '1M6S Luxury Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 315326,
      max: 426618,
      average: 370972
    },
    production: [
      {
        time: 699.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 58
          },
          {
            ware: 'energycells',
            amount: 116
          },
          {
            ware: 'hullparts',
            amount: 212
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_01_lowtech',
    tags: 'module',
    name: '1M6S Basic Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 276636,
      max: 374272,
      average: 325454
    },
    production: [
      {
        time: 611.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 51
          },
          {
            ware: 'energycells',
            amount: 101
          },
          {
            ware: 'hullparts',
            amount: 185
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_02',
    tags: 'module',
    name: '3M6S Standard Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 423562,
      max: 573054,
      average: 498308
    },
    production: [
      {
        time: 938.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 78
          },
          {
            ware: 'energycells',
            amount: 155
          },
          {
            ware: 'hullparts',
            amount: 284
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_02_hightech',
    tags: 'module',
    name: '3M6S Luxury Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 435642,
      max: 589398,
      average: 512520
    },
    production: [
      {
        time: 971.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 80
          },
          {
            ware: 'energycells',
            amount: 161
          },
          {
            ware: 'hullparts',
            amount: 294
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_m_02_lowtech',
    tags: 'module',
    name: '3M6S Basic Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 407689,
      max: 551579,
      average: 479634
    },
    production: [
      {
        time: 904.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 75
          },
          {
            ware: 'energycells',
            amount: 150
          },
          {
            ware: 'hullparts',
            amount: 274
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_dock_tradestation_02',
    tags: 'module noblueprint',
    name: '8M Standard Dock Area',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 630652,
      max: 853236,
      average: 741944
    },
    production: [
      {
        time: 1398.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 116
          },
          {
            ware: 'energycells',
            amount: 232
          },
          {
            ware: 'hullparts',
            amount: 424
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_hab_l_01',
    tags: 'module',
    name: 'Argon L Habitat',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 16627714,
      max: 22496318,
      average: 19562016
    },
    production: [
      {
        time: 1155.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 191
          },
          {
            ware: 'energycells',
            amount: 383
          },
          {
            ware: 'hullparts',
            amount: 700
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_hab_m_01',
    tags: 'module',
    name: 'Argon M Habitat',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 11754290,
      max: 15902862,
      average: 13828576
    },
    production: [
      {
        time: 816.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 135
          },
          {
            ware: 'energycells',
            amount: 271
          },
          {
            ware: 'hullparts',
            amount: 495
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_hab_s_01',
    tags: 'module',
    name: 'Argon S Habitat',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 8172621,
      max: 11057075,
      average: 9614848
    },
    production: [
      {
        time: 566.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 94
          },
          {
            ware: 'energycells',
            amount: 188
          },
          {
            ware: 'hullparts',
            amount: 343
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_pier_l_01',
    tags: 'module',
    name: 'Argon 3-Dock T Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2946171,
      max: 3985997,
      average: 3466084
    },
    production: [
      {
        time: 1155.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 542
          },
          {
            ware: 'energycells',
            amount: 1083
          },
          {
            ware: 'hullparts',
            amount: 1980
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_pier_l_02',
    tags: 'module',
    name: 'Argon 1-Dock Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1701192,
      max: 2301612,
      average: 2001402
    },
    production: [
      {
        time: 667.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 313
          },
          {
            ware: 'energycells',
            amount: 625
          },
          {
            ware: 'hullparts',
            amount: 1143
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_pier_l_03',
    tags: 'module',
    name: 'Argon 3-Dock E Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3399016,
      max: 4598668,
      average: 3998842
    },
    production: [
      {
        time: 1333.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 625
          },
          {
            ware: 'energycells',
            amount: 1250
          },
          {
            ware: 'hullparts',
            amount: 2287
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_pier_tradestation_01',
    tags: 'module noblueprint',
    name: 'Argon Trading Station 1-Dock Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1076127,
      max: 1455937,
      average: 1266032
    },
    production: [
      {
        time: 422.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 198
          },
          {
            ware: 'energycells',
            amount: 395
          },
          {
            ware: 'hullparts',
            amount: 723
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_prod_foodrations_01',
    tags: 'module',
    name: 'Food Ration Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1425885,
      max: 1929139,
      average: 1677512
    },
    production: [
      {
        time: 1166.0,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'claytronics',
            amount: 262
          },
          {
            ware: 'energycells',
            amount: 525
          },
          {
            ware: 'hullparts',
            amount: 961
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_prod_meat_01',
    tags: 'module',
    name: 'Meat Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1349848,
      max: 1826264,
      average: 1588056
    },
    production: [
      {
        time: 1155.0,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'claytronics',
            amount: 248
          },
          {
            ware: 'energycells',
            amount: 497
          },
          {
            ware: 'hullparts',
            amount: 910
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_prod_medicalsupplies_01',
    tags: 'module',
    name: 'Argon Medical Supply Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1223505,
      max: 1655331,
      average: 1439418
    },
    production: [
      {
        time: 1137.0,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'claytronics',
            amount: 225
          },
          {
            ware: 'energycells',
            amount: 450
          },
          {
            ware: 'hullparts',
            amount: 823
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_prod_spacefuel_01',
    tags: 'module',
    name: 'Spacefuel Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1735171,
      max: 2347585,
      average: 2041378
    },
    production: [
      {
        time: 1203.0,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'claytronics',
            amount: 319
          },
          {
            ware: 'energycells',
            amount: 638
          },
          {
            ware: 'hullparts',
            amount: 1168
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_prod_wheat_01',
    tags: 'module',
    name: 'Wheat Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1610158,
      max: 2178450,
      average: 1894304
    },
    production: [
      {
        time: 1189.0,
        amount: 1,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'claytronics',
            amount: 296
          },
          {
            ware: 'energycells',
            amount: 592
          },
          {
            ware: 'hullparts',
            amount: 1084
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_container_l_01',
    tags: 'module',
    name: 'Argon L Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 625503,
      max: 846269,
      average: 735886
    },
    production: [
      {
        time: 896.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 115
          },
          {
            ware: 'energycells',
            amount: 230
          },
          {
            ware: 'hullparts',
            amount: 421
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_container_m_01',
    tags: 'module',
    name: 'Argon M Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 445475,
      max: 602701,
      average: 524088
    },
    production: [
      {
        time: 637.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 82
          },
          {
            ware: 'energycells',
            amount: 163
          },
          {
            ware: 'hullparts',
            amount: 299
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_container_s_01',
    tags: 'module',
    name: 'Argon S Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 282224,
      max: 381832,
      average: 332028
    },
    production: [
      {
        time: 403.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 52
          },
          {
            ware: 'energycells',
            amount: 103
          },
          {
            ware: 'hullparts',
            amount: 189
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_liquid_l_01',
    tags: 'module',
    name: 'Argon L Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 625503,
      max: 846269,
      average: 735886
    },
    production: [
      {
        time: 896.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 115
          },
          {
            ware: 'energycells',
            amount: 230
          },
          {
            ware: 'hullparts',
            amount: 421
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_liquid_m_01',
    tags: 'module',
    name: 'Argon M Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 445475,
      max: 602701,
      average: 524088
    },
    production: [
      {
        time: 637.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 82
          },
          {
            ware: 'energycells',
            amount: 163
          },
          {
            ware: 'hullparts',
            amount: 299
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_liquid_s_01',
    tags: 'module',
    name: 'Argon S Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 282224,
      max: 381832,
      average: 332028
    },
    production: [
      {
        time: 403.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 52
          },
          {
            ware: 'energycells',
            amount: 103
          },
          {
            ware: 'hullparts',
            amount: 189
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_solid_l_01',
    tags: 'module',
    name: 'Argon L Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 625503,
      max: 846269,
      average: 735886
    },
    production: [
      {
        time: 896.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 115
          },
          {
            ware: 'energycells',
            amount: 230
          },
          {
            ware: 'hullparts',
            amount: 421
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_solid_m_01',
    tags: 'module',
    name: 'Argon M Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 445475,
      max: 602701,
      average: 524088
    },
    production: [
      {
        time: 637.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 82
          },
          {
            ware: 'energycells',
            amount: 163
          },
          {
            ware: 'hullparts',
            amount: 299
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_solid_s_01',
    tags: 'module',
    name: 'Argon S Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 282224,
      max: 381832,
      average: 332028
    },
    production: [
      {
        time: 403.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 52
          },
          {
            ware: 'energycells',
            amount: 103
          },
          {
            ware: 'hullparts',
            amount: 189
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_arg_stor_tradestation_l_01',
    tags: 'module noblueprint',
    name: 'Argon L Universal Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 668452,
      max: 904376,
      average: 786414
    },
    production: [
      {
        time: 956.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 123
          },
          {
            ware: 'energycells',
            amount: 246
          },
          {
            ware: 'hullparts',
            amount: 449
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_build_dockarea_m_01',
    tags: 'module noplayerblueprint',
    name: 'S/M Ship Fabrication Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 18008821,
      max: 24364875,
      average: 21186848
    },
    production: [
      {
        time: 1997.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 3312
          },
          {
            ware: 'energycells',
            amount: 6620
          },
          {
            ware: 'hullparts',
            amount: 12112
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_build_l_01',
    tags: 'module noplayerblueprint',
    name: 'L Ship Fabrication Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 10147181,
      max: 13728539,
      average: 11937860
    },
    production: [
      {
        time: 1126.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1866
          },
          {
            ware: 'energycells',
            amount: 3731
          },
          {
            ware: 'hullparts',
            amount: 6826
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_build_m_01',
    tags: 'module noplayerblueprint',
    name: 'M Ship Fabrication Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 7481465,
      max: 10121983,
      average: 8801724
    },
    production: [
      {
        time: 830.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1376
          },
          {
            ware: 'energycells',
            amount: 2750
          },
          {
            ware: 'hullparts',
            amount: 5031
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_build_s_01',
    tags: 'module noplayerblueprint',
    name: 'S Ship Fabrication Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 7481465,
      max: 10121983,
      average: 8801724
    },
    production: [
      {
        time: 830.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1376
          },
          {
            ware: 'energycells',
            amount: 2750
          },
          {
            ware: 'hullparts',
            amount: 5031
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_build_xl_01',
    tags: 'module noplayerblueprint',
    name: 'XL Ship Fabrication Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 13235129,
      max: 17906351,
      average: 15570740
    },
    production: [
      {
        time: 1468.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 2434
          },
          {
            ware: 'energycells',
            amount: 4866
          },
          {
            ware: 'hullparts',
            amount: 8902
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturerbase_01',
    tags: 'module',
    name: 'Venture Base Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 92363,
      max: 124961,
      average: 108662
    },
    production: [
      {
        time: 103.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 17
          },
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 62
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturerbase_02',
    tags: 'module',
    name: 'Venture Base Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 75585,
      max: 102263,
      average: 88924
    },
    production: [
      {
        time: 82.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 14
          },
          {
            ware: 'energycells',
            amount: 27
          },
          {
            ware: 'hullparts',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturerbase_03',
    tags: 'module',
    name: 'Venture Base Connection Structure 03',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 98841,
      max: 133727,
      average: 116284
    },
    production: [
      {
        time: 112.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 37
          },
          {
            ware: 'hullparts',
            amount: 68
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturercross_01',
    tags: 'module',
    name: 'Venture Cross Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 65300,
      max: 88348,
      average: 76824
    },
    production: [
      {
        time: 73.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 24
          },
          {
            ware: 'hullparts',
            amount: 44
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturervertical_01',
    tags: 'module',
    name: 'Venture Vertical Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 54125,
      max: 73227,
      average: 63676
    },
    production: [
      {
        time: 59.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 36
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_conn_venturervertical_02',
    tags: 'module',
    name: 'Venture Vertical Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 70888,
      max: 95908,
      average: 83398
    },
    production: [
      {
        time: 80.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 13
          },
          {
            ware: 'energycells',
            amount: 26
          },
          {
            ware: 'hullparts',
            amount: 48
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_dock_m_venturer_01',
    tags: 'module',
    name: 'S/M Venture Sendoff Dock',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 576528,
      max: 780008,
      average: 678268
    },
    production: [
      {
        time: 1279.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 106
          },
          {
            ware: 'energycells',
            amount: 212
          },
          {
            ware: 'hullparts',
            amount: 388
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_dock_xl_venturer_01',
    tags: 'module',
    name: 'L/XL Venture Sendoff Dock',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 761692,
      max: 1030524,
      average: 896108
    },
    production: [
      {
        time: 1692.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 140
          },
          {
            ware: 'energycells',
            amount: 280
          },
          {
            ware: 'hullparts',
            amount: 513
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_equip_dockarea_m_01',
    tags: 'module noplayerblueprint',
    name: 'S/M Ship Maintenance Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 18008821,
      max: 24364875,
      average: 21186848
    },
    production: [
      {
        time: 1997.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 3312
          },
          {
            ware: 'energycells',
            amount: 6620
          },
          {
            ware: 'hullparts',
            amount: 12112
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_equip_l_01',
    tags: 'module noplayerblueprint',
    name: 'L Ship Maintenance Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 10147181,
      max: 13728539,
      average: 11937860
    },
    production: [
      {
        time: 1126.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1866
          },
          {
            ware: 'energycells',
            amount: 3731
          },
          {
            ware: 'hullparts',
            amount: 6826
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_equip_xl_01',
    tags: 'module noplayerblueprint',
    name: 'XL Ship Maintenance Bay',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 13235129,
      max: 17906351,
      average: 15570740
    },
    production: [
      {
        time: 1468.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 2434
          },
          {
            ware: 'energycells',
            amount: 4866
          },
          {
            ware: 'hullparts',
            amount: 8902
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_advancedcomposites_01',
    tags: 'module',
    name: 'Advanced Composite Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3524906,
      max: 4768990,
      average: 4146948
    },
    production: [
      {
        time: 1337.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 648
          },
          {
            ware: 'energycells',
            amount: 1296
          },
          {
            ware: 'hullparts',
            amount: 2373
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_advancedelectronics_01',
    tags: 'module',
    name: 'Advanced Electronics Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2622767,
      max: 3548449,
      average: 3085608
    },
    production: [
      {
        time: 1281.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 482
          },
          {
            ware: 'energycells',
            amount: 965
          },
          {
            ware: 'hullparts',
            amount: 1767
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_antimattercells_01',
    tags: 'module',
    name: 'Antimatter Cell Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 375477,
      max: 507999,
      average: 441738
    },
    production: [
      {
        time: 913.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 69
          },
          {
            ware: 'energycells',
            amount: 138
          },
          {
            ware: 'hullparts',
            amount: 253
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_antimatterconverters_01',
    tags: 'module',
    name: 'Antimatter Converter Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 9681548,
      max: 13098564,
      average: 11390056
    },
    production: [
      {
        time: 1528.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1780
          },
          {
            ware: 'energycells',
            amount: 3560
          },
          {
            ware: 'hullparts',
            amount: 6516
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_claytronics_01',
    tags: 'module',
    name: 'Claytronics Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 15347532,
      max: 20764308,
      average: 18055920
    },
    production: [
      {
        time: 1615.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 2822
          },
          {
            ware: 'energycells',
            amount: 5642
          },
          {
            ware: 'hullparts',
            amount: 10327
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_dronecomponents_01',
    tags: 'module',
    name: 'Drone Component Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 6662268,
      max: 9013656,
      average: 7837962
    },
    production: [
      {
        time: 1457.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1225
          },
          {
            ware: 'energycells',
            amount: 2449
          },
          {
            ware: 'hullparts',
            amount: 4483
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_energycells_01',
    tags: 'module',
    name: 'Energy Cell Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1413819,
      max: 1912813,
      average: 1663316
    },
    production: [
      {
        time: 1164.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 260
          },
          {
            ware: 'energycells',
            amount: 520
          },
          {
            ware: 'hullparts',
            amount: 951
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_engineparts_01',
    tags: 'module',
    name: 'Engine Part Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2116689,
      max: 2863755,
      average: 2490222
    },
    production: [
      {
        time: 1240.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 389
          },
          {
            ware: 'energycells',
            amount: 779
          },
          {
            ware: 'hullparts',
            amount: 1426
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_fieldcoils_01',
    tags: 'module',
    name: 'Field Coil Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 9436671,
      max: 12767261,
      average: 11101966
    },
    production: [
      {
        time: 1523.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 1735
          },
          {
            ware: 'energycells',
            amount: 3470
          },
          {
            ware: 'hullparts',
            amount: 6351
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_graphene_01',
    tags: 'module',
    name: 'Graphene Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 152966,
      max: 206954,
      average: 179960
    },
    production: [
      {
        time: 743.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 28
          },
          {
            ware: 'energycells',
            amount: 57
          },
          {
            ware: 'hullparts',
            amount: 104
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_hullparts_01',
    tags: 'module',
    name: 'Hull Part Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3340194,
      max: 4519086,
      average: 3929640
    },
    production: [
      {
        time: 1327.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 614
          },
          {
            ware: 'energycells',
            amount: 1229
          },
          {
            ware: 'hullparts',
            amount: 2249
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_microchips_01',
    tags: 'module',
    name: 'Microchip Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 4122469,
      max: 5577459,
      average: 4849964
    },
    production: [
      {
        time: 1367.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 758
          },
          {
            ware: 'energycells',
            amount: 1516
          },
          {
            ware: 'hullparts',
            amount: 2774
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_missilecomponents_01',
    tags: 'module',
    name: 'Missile Component Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 191643,
      max: 259281,
      average: 225462
    },
    production: [
      {
        time: 786.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 35
          },
          {
            ware: 'energycells',
            amount: 71
          },
          {
            ware: 'hullparts',
            amount: 131
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_plasmaconductors_01',
    tags: 'module',
    name: 'Plasma Conductor Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2572901,
      max: 3480983,
      average: 3026942
    },
    production: [
      {
        time: 1277.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 473
          },
          {
            ware: 'energycells',
            amount: 946
          },
          {
            ware: 'hullparts',
            amount: 1732
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_quantumtubes_01',
    tags: 'module',
    name: 'Quantum Tube Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2068152,
      max: 2798088,
      average: 2433120
    },
    production: [
      {
        time: 1236.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 380
          },
          {
            ware: 'energycells',
            amount: 761
          },
          {
            ware: 'hullparts',
            amount: 1394
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_refinedmetals_01',
    tags: 'module',
    name: 'Refined Metal Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 197231,
      max: 266841,
      average: 232036
    },
    production: [
      {
        time: 791.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 36
          },
          {
            ware: 'energycells',
            amount: 73
          },
          {
            ware: 'hullparts',
            amount: 135
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_scanningarrays_01',
    tags: 'module',
    name: 'Scanning Array Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3422258,
      max: 4630114,
      average: 4026186
    },
    production: [
      {
        time: 1331.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 629
          },
          {
            ware: 'energycells',
            amount: 1259
          },
          {
            ware: 'hullparts',
            amount: 2305
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_shieldcomponents_01',
    tags: 'module',
    name: 'Shield Component Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2350389,
      max: 3179939,
      average: 2765164
    },
    production: [
      {
        time: 1260.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 432
          },
          {
            ware: 'energycells',
            amount: 865
          },
          {
            ware: 'hullparts',
            amount: 1583
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_siliconwafers_01',
    tags: 'module',
    name: 'Silicon Wafer Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 403430,
      max: 545818,
      average: 474624
    },
    production: [
      {
        time: 927.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 74
          },
          {
            ware: 'energycells',
            amount: 149
          },
          {
            ware: 'hullparts',
            amount: 273
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_smartchips_01',
    tags: 'module',
    name: 'Smart Chip Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 686545,
      max: 928855,
      average: 807700
    },
    production: [
      {
        time: 1027.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 126
          },
          {
            ware: 'energycells',
            amount: 253
          },
          {
            ware: 'hullparts',
            amount: 464
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_spices_01',
    tags: 'module',
    name: 'Spice Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 756543,
      max: 1023558,
      average: 890050
    },
    production: [
      {
        time: 1046.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 139
          },
          {
            ware: 'energycells',
            amount: 278
          },
          {
            ware: 'hullparts',
            amount: 510
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_superfluidcoolant_01',
    tags: 'module',
    name: 'Superfluid Coolant Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 137080,
      max: 185461,
      average: 161270
    },
    production: [
      {
        time: 722.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 25
          },
          {
            ware: 'energycells',
            amount: 51
          },
          {
            ware: 'hullparts',
            amount: 94
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_turretcomponents_01',
    tags: 'module',
    name: 'Turret Component Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2584529,
      max: 3496715,
      average: 3040622
    },
    production: [
      {
        time: 1278.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 475
          },
          {
            ware: 'energycells',
            amount: 951
          },
          {
            ware: 'hullparts',
            amount: 1741
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_water_01',
    tags: 'module',
    name: 'Water Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 195901,
      max: 265043,
      average: 230472
    },
    production: [
      {
        time: 790.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 36
          },
          {
            ware: 'energycells',
            amount: 72
          },
          {
            ware: 'hullparts',
            amount: 132
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_prod_weaponcomponents_01',
    tags: 'module',
    name: 'Weapon Component Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2154927,
      max: 2915489,
      average: 2535208
    },
    production: [
      {
        time: 1244.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 396
          },
          {
            ware: 'energycells',
            amount: 793
          },
          {
            ware: 'hullparts',
            amount: 1452
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_gen_ventureplatform_cross_01',
    tags: 'module',
    name: 'Venture Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 788316,
      max: 1066545,
      average: 927430
    },
    production: [
      {
        time: 874.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 145
          },
          {
            ware: 'energycells',
            amount: 290
          },
          {
            ware: 'hullparts',
            amount: 530
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_base_01',
    tags: 'module',
    name: 'Paranid Base Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 64410,
      max: 87142,
      average: 75776
    },
    production: [
      {
        time: 70.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 23
          },
          {
            ware: 'hullparts',
            amount: 42
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_base_02',
    tags: 'module',
    name: 'Paranid Base Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 91924,
      max: 124368,
      average: 108146
    },
    production: [
      {
        time: 101.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 17
          },
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 61
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_base_03',
    tags: 'module',
    name: 'Paranid Base Connection Structure 03',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 114728,
      max: 155220,
      average: 134974
    },
    production: [
      {
        time: 128.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 21
          },
          {
            ware: 'energycells',
            amount: 43
          },
          {
            ware: 'hullparts',
            amount: 78
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_cross_01',
    tags: 'module',
    name: 'Paranid Cross Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 55015,
      max: 74433,
      average: 64724
    },
    production: [
      {
        time: 63.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 21
          },
          {
            ware: 'hullparts',
            amount: 38
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_cross_02',
    tags: 'module',
    name: 'Paranid Cross Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 114728,
      max: 155220,
      average: 134974
    },
    production: [
      {
        time: 128.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 21
          },
          {
            ware: 'energycells',
            amount: 43
          },
          {
            ware: 'hullparts',
            amount: 78
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_cross_03',
    tags: 'module',
    name: 'Paranid Cross Connection Structure 03',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 91924,
      max: 124368,
      average: 108146
    },
    production: [
      {
        time: 101.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 17
          },
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 61
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_vertical_01',
    tags: 'module',
    name: 'Paranid Vertical Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 54125,
      max: 73227,
      average: 63676
    },
    production: [
      {
        time: 59.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 36
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_conn_vertical_02',
    tags: 'module',
    name: 'Paranid Vertical Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 70888,
      max: 95908,
      average: 83398
    },
    production: [
      {
        time: 80.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 13
          },
          {
            ware: 'energycells',
            amount: 26
          },
          {
            ware: 'hullparts',
            amount: 48
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_def_claim_01',
    tags: 'module',
    name: 'Paranid Administrative Centre',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 760801,
      max: 1029319,
      average: 895060
    },
    production: [
      {
        time: 842.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 140
          },
          {
            ware: 'energycells',
            amount: 279
          },
          {
            ware: 'hullparts',
            amount: 511
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_def_disc_01',
    tags: 'module',
    name: 'Paranid Disc Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 533140,
      max: 721308,
      average: 627224
    },
    production: [
      {
        time: 592.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 98
          },
          {
            ware: 'energycells',
            amount: 196
          },
          {
            ware: 'hullparts',
            amount: 359
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_def_tube_01',
    tags: 'module',
    name: 'Paranid Bridge Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 462691,
      max: 625993,
      average: 544342
    },
    production: [
      {
        time: 514.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 85
          },
          {
            ware: 'energycells',
            amount: 170
          },
          {
            ware: 'hullparts',
            amount: 312
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_hab_l_01',
    tags: 'module',
    name: 'Paranid L Dome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 18262842,
      max: 24708550,
      average: 21485696
    },
    production: [
      {
        time: 1265.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 210
          },
          {
            ware: 'energycells',
            amount: 419
          },
          {
            ware: 'hullparts',
            amount: 767
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_hab_m_01',
    tags: 'module',
    name: 'Paranid M Dome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 11754290,
      max: 15902862,
      average: 13828576
    },
    production: [
      {
        time: 816.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 135
          },
          {
            ware: 'energycells',
            amount: 271
          },
          {
            ware: 'hullparts',
            amount: 495
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_hab_s_01',
    tags: 'module',
    name: 'Paranid S Dome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 8172621,
      max: 11057075,
      average: 9614848
    },
    production: [
      {
        time: 566.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 94
          },
          {
            ware: 'energycells',
            amount: 188
          },
          {
            ware: 'hullparts',
            amount: 343
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_pier_l_01',
    tags: 'module',
    name: 'Paranid 3-Dock T Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3060886,
      max: 4141198,
      average: 3601042
    },
    production: [
      {
        time: 1200.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 563
          },
          {
            ware: 'energycells',
            amount: 1125
          },
          {
            ware: 'hullparts',
            amount: 2058
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_pier_l_02',
    tags: 'module',
    name: 'Paranid 1-Dock Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1766944,
      max: 2390572,
      average: 2078758
    },
    production: [
      {
        time: 693.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 325
          },
          {
            ware: 'energycells',
            amount: 650
          },
          {
            ware: 'hullparts',
            amount: 1188
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_pier_l_03',
    tags: 'module',
    name: 'Paranid 3-Dock E Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3534314,
      max: 4781718,
      average: 4158016
    },
    production: [
      {
        time: 1386.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 650
          },
          {
            ware: 'energycells',
            amount: 1299
          },
          {
            ware: 'hullparts',
            amount: 2377
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_prod_majadust_01',
    tags: 'module',
    name: 'Maja Dust Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2029023,
      max: 2745149,
      average: 2387086
    },
    production: [
      {
        time: 1232.0,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'claytronics',
            amount: 373
          },
          {
            ware: 'energycells',
            amount: 746
          },
          {
            ware: 'hullparts',
            amount: 1366
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_prod_majasnails_01',
    tags: 'module',
    name: 'Maja Snail Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1349848,
      max: 1826264,
      average: 1588056
    },
    production: [
      {
        time: 1155.0,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'claytronics',
            amount: 248
          },
          {
            ware: 'energycells',
            amount: 497
          },
          {
            ware: 'hullparts',
            amount: 910
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_prod_medicalsupplies_01',
    tags: 'module',
    name: 'Paranid Medical Supply Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1229080,
      max: 1662872,
      average: 1445976
    },
    production: [
      {
        time: 1138.0,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'claytronics',
            amount: 226
          },
          {
            ware: 'energycells',
            amount: 451
          },
          {
            ware: 'hullparts',
            amount: 827
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_prod_sojabeans_01',
    tags: 'module',
    name: 'Soja Bean Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1610158,
      max: 2178450,
      average: 1894304
    },
    production: [
      {
        time: 1189.0,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'claytronics',
            amount: 296
          },
          {
            ware: 'energycells',
            amount: 592
          },
          {
            ware: 'hullparts',
            amount: 1084
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_prod_sojahusk_01',
    tags: 'module',
    name: 'Soja Husk Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1719737,
      max: 2326703,
      average: 2023220
    },
    production: [
      {
        time: 1201.0,
        amount: 1,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'claytronics',
            amount: 316
          },
          {
            ware: 'energycells',
            amount: 633
          },
          {
            ware: 'hullparts',
            amount: 1159
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_container_l_01',
    tags: 'module',
    name: 'Paranid L Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 674026,
      max: 911918,
      average: 792972
    },
    production: [
      {
        time: 964.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 124
          },
          {
            ware: 'energycells',
            amount: 247
          },
          {
            ware: 'hullparts',
            amount: 453
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_container_m_01',
    tags: 'module',
    name: 'Paranid M Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 457555,
      max: 619045,
      average: 538300
    },
    production: [
      {
        time: 658.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 84
          },
          {
            ware: 'energycells',
            amount: 169
          },
          {
            ware: 'hullparts',
            amount: 309
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_container_s_01',
    tags: 'module',
    name: 'Paranid S Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 304150,
      max: 411498,
      average: 357824
    },
    production: [
      {
        time: 435.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 56
          },
          {
            ware: 'energycells',
            amount: 112
          },
          {
            ware: 'hullparts',
            amount: 204
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_landmark_l_01',
    tags: 'module noblueprint',
    name: 'Argon L Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 717414,
      max: 970618,
      average: 844016
    },
    production: [
      {
        time: 1025.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 132
          },
          {
            ware: 'energycells',
            amount: 263
          },
          {
            ware: 'hullparts',
            amount: 482
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_liquid_l_01',
    tags: 'module',
    name: 'Paranid L Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 674026,
      max: 911918,
      average: 792972
    },
    production: [
      {
        time: 964.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 124
          },
          {
            ware: 'energycells',
            amount: 247
          },
          {
            ware: 'hullparts',
            amount: 453
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_liquid_m_01',
    tags: 'module',
    name: 'Paranid M Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 457555,
      max: 619045,
      average: 538300
    },
    production: [
      {
        time: 658.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 84
          },
          {
            ware: 'energycells',
            amount: 169
          },
          {
            ware: 'hullparts',
            amount: 309
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_liquid_s_01',
    tags: 'module',
    name: 'Paranid S Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 304150,
      max: 411498,
      average: 357824
    },
    production: [
      {
        time: 435.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 56
          },
          {
            ware: 'energycells',
            amount: 112
          },
          {
            ware: 'hullparts',
            amount: 204
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_solid_l_01',
    tags: 'module',
    name: 'Paranid L Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 674026,
      max: 911918,
      average: 792972
    },
    production: [
      {
        time: 964.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 124
          },
          {
            ware: 'energycells',
            amount: 247
          },
          {
            ware: 'hullparts',
            amount: 453
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_solid_m_01',
    tags: 'module',
    name: 'Paranid M Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 457555,
      max: 619045,
      average: 538300
    },
    production: [
      {
        time: 658.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 84
          },
          {
            ware: 'energycells',
            amount: 169
          },
          {
            ware: 'hullparts',
            amount: 309
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_par_stor_solid_s_01',
    tags: 'module',
    name: 'Paranid S Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 304150,
      max: 411498,
      average: 357824
    },
    production: [
      {
        time: 435.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 56
          },
          {
            ware: 'energycells',
            amount: 112
          },
          {
            ware: 'hullparts',
            amount: 204
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_player_prod_hq_01_macro',
    tags: 'module noblueprint',
    name: 'Unknown Module',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 0,
      max: 0,
      average: 0
    },
    production: []
  },
  {
    id: 'module_tel_conn_base_01',
    tags: 'module',
    name: 'Teladi Base Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 92363,
      max: 124961,
      average: 108662
    },
    production: [
      {
        time: 103.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 17
          },
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 62
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_conn_base_02',
    tags: 'module',
    name: 'Teladi Base Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 75585,
      max: 102263,
      average: 88924
    },
    production: [
      {
        time: 82.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 14
          },
          {
            ware: 'energycells',
            amount: 27
          },
          {
            ware: 'hullparts',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_conn_base_03',
    tags: 'module',
    name: 'Teladi Base Connection Structure 03',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 98841,
      max: 133727,
      average: 116284
    },
    production: [
      {
        time: 112.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 37
          },
          {
            ware: 'hullparts',
            amount: 68
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_conn_cross_01',
    tags: 'module',
    name: 'Teladi Cross Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 65300,
      max: 88348,
      average: 76824
    },
    production: [
      {
        time: 73.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 12
          },
          {
            ware: 'energycells',
            amount: 24
          },
          {
            ware: 'hullparts',
            amount: 44
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_conn_vertical_01',
    tags: 'module',
    name: 'Teladi Vertical Connection Structure 01',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 54125,
      max: 73227,
      average: 63676
    },
    production: [
      {
        time: 59.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'hullparts',
            amount: 36
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_conn_vertical_02',
    tags: 'module',
    name: 'Teladi Vertical Connection Structure 02',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 70888,
      max: 95908,
      average: 83398
    },
    production: [
      {
        time: 80.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 13
          },
          {
            ware: 'energycells',
            amount: 26
          },
          {
            ware: 'hullparts',
            amount: 48
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_def_claim_01',
    tags: 'module',
    name: 'Teladi Administrative Centre',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 749625,
      max: 1014199,
      average: 881912
    },
    production: [
      {
        time: 829.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 138
          },
          {
            ware: 'energycells',
            amount: 275
          },
          {
            ware: 'hullparts',
            amount: 503
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_def_disc_01',
    tags: 'module',
    name: 'Teladi Disc Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 533140,
      max: 721308,
      average: 627224
    },
    production: [
      {
        time: 592.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 98
          },
          {
            ware: 'energycells',
            amount: 196
          },
          {
            ware: 'hullparts',
            amount: 359
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_def_tube_01',
    tags: 'module',
    name: 'Teladi Bridge Defence Platform',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 462691,
      max: 625993,
      average: 544342
    },
    production: [
      {
        time: 514.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 85
          },
          {
            ware: 'energycells',
            amount: 170
          },
          {
            ware: 'hullparts',
            amount: 312
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_hab_l_01',
    tags: 'module',
    name: 'Teladi L Biome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 15822621,
      max: 21407075,
      average: 18614848
    },
    production: [
      {
        time: 1095.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 182
          },
          {
            ware: 'energycells',
            amount: 363
          },
          {
            ware: 'hullparts',
            amount: 664
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_hab_m_01',
    tags: 'module',
    name: 'Teladi M Biome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 10530453,
      max: 14247083,
      average: 12388768
    },
    production: [
      {
        time: 730.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 121
          },
          {
            ware: 'energycells',
            amount: 242
          },
          {
            ware: 'hullparts',
            amount: 443
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_hab_s_01',
    tags: 'module',
    name: 'Teladi S Biome',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 7471187,
      max: 10108077,
      average: 8789632
    },
    production: [
      {
        time: 516.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 86
          },
          {
            ware: 'energycells',
            amount: 171
          },
          {
            ware: 'hullparts',
            amount: 313
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_pier_l_01',
    tags: 'module',
    name: 'Teladi 3-Dock T Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2946171,
      max: 3985997,
      average: 3466084
    },
    production: [
      {
        time: 1155.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 542
          },
          {
            ware: 'energycells',
            amount: 1083
          },
          {
            ware: 'hullparts',
            amount: 1980
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_pier_l_02',
    tags: 'module',
    name: 'Teladi 1-Dock Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1701192,
      max: 2301612,
      average: 2001402
    },
    production: [
      {
        time: 667.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 313
          },
          {
            ware: 'energycells',
            amount: 625
          },
          {
            ware: 'hullparts',
            amount: 1143
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_pier_l_03',
    tags: 'module',
    name: 'Teladi 3-Dock E Pier',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3399016,
      max: 4598668,
      average: 3998842
    },
    production: [
      {
        time: 1333.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 625
          },
          {
            ware: 'energycells',
            amount: 1250
          },
          {
            ware: 'hullparts',
            amount: 2287
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_advancedcomposites_01',
    tags: 'module',
    name: 'Teladi Advanced Composite Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3416014,
      max: 4621666,
      average: 4018840
    },
    production: [
      {
        time: 1329.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 628
          },
          {
            ware: 'energycells',
            amount: 1241
          },
          {
            ware: 'hullparts',
            amount: 2300
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_engineparts_01',
    tags: 'module',
    name: 'Teladi Engine Part Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 2143163,
      max: 2899573,
      average: 2521368
    },
    production: [
      {
        time: 1241.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 394
          },
          {
            ware: 'energycells',
            amount: 778
          },
          {
            ware: 'hullparts',
            amount: 1443
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_hullparts_01',
    tags: 'module',
    name: 'Teladi Hull Part Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3339976,
      max: 4518792,
      average: 3929384
    },
    production: [
      {
        time: 1325.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 614
          },
          {
            ware: 'energycells',
            amount: 1213
          },
          {
            ware: 'hullparts',
            amount: 2249
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_medicalsupplies_01',
    tags: 'module',
    name: 'Teladi Medical Supply Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1219233,
      max: 1649551,
      average: 1434392
    },
    production: [
      {
        time: 1136.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 224
          },
          {
            ware: 'energycells',
            amount: 448
          },
          {
            ware: 'hullparts',
            amount: 822
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_nostropoil_01',
    tags: 'module',
    name: 'Nostrop Oil Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1574127,
      max: 2129701,
      average: 1851914
    },
    production: [
      {
        time: 1184.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 289
          },
          {
            ware: 'energycells',
            amount: 579
          },
          {
            ware: 'hullparts',
            amount: 1063
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_scanningarrays_01',
    tags: 'module',
    name: 'Teladi Scanning Array Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3464989,
      max: 4687927,
      average: 4076458
    },
    production: [
      {
        time: 1332.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 637
          },
          {
            ware: 'energycells',
            amount: 1259
          },
          {
            ware: 'hullparts',
            amount: 2333
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_spaceweed_01',
    tags: 'module',
    name: 'Spaceweed Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3475040,
      max: 4701524,
      average: 4088282
    },
    production: [
      {
        time: 1334.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 639
          },
          {
            ware: 'energycells',
            amount: 1277
          },
          {
            ware: 'hullparts',
            amount: 2338
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_sunriseflowers_01',
    tags: 'module',
    name: 'Sunrise Flower Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1611474,
      max: 2180230,
      average: 1895852
    },
    production: [
      {
        time: 1189.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 296
          },
          {
            ware: 'energycells',
            amount: 592
          },
          {
            ware: 'hullparts',
            amount: 1087
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_swampplant_01',
    tags: 'module',
    name: 'Swamp Plant Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 3475040,
      max: 4701524,
      average: 4088282
    },
    production: [
      {
        time: 1334.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 639
          },
          {
            ware: 'energycells',
            amount: 1277
          },
          {
            ware: 'hullparts',
            amount: 2338
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_prod_teladianium_01',
    tags: 'module',
    name: 'Teladianium Production',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 272830,
      max: 369122,
      average: 320976
    },
    production: [
      {
        time: 853.0,
        amount: 1,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'claytronics',
            amount: 50
          },
          {
            ware: 'energycells',
            amount: 101
          },
          {
            ware: 'hullparts',
            amount: 185
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_container_l_01',
    tags: 'module',
    name: 'Teladi L Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 608287,
      max: 822977,
      average: 715632
    },
    production: [
      {
        time: 869.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 112
          },
          {
            ware: 'energycells',
            amount: 223
          },
          {
            ware: 'hullparts',
            amount: 408
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_container_m_01',
    tags: 'module',
    name: 'Teladi M Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 424014,
      max: 573666,
      average: 498840
    },
    production: [
      {
        time: 607.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 78
          },
          {
            ware: 'energycells',
            amount: 156
          },
          {
            ware: 'hullparts',
            amount: 285
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_container_s_01',
    tags: 'module',
    name: 'Teladi S Container Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 277527,
      max: 375477,
      average: 326502
    },
    production: [
      {
        time: 397.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 51
          },
          {
            ware: 'energycells',
            amount: 102
          },
          {
            ware: 'hullparts',
            amount: 187
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_liquid_l_01',
    tags: 'module',
    name: 'Teladi L Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 608287,
      max: 822977,
      average: 715632
    },
    production: [
      {
        time: 869.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 112
          },
          {
            ware: 'energycells',
            amount: 223
          },
          {
            ware: 'hullparts',
            amount: 408
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_liquid_m_01',
    tags: 'module',
    name: 'Teladi M Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 424014,
      max: 573666,
      average: 498840
    },
    production: [
      {
        time: 607.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 78
          },
          {
            ware: 'energycells',
            amount: 156
          },
          {
            ware: 'hullparts',
            amount: 285
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_liquid_s_01',
    tags: 'module',
    name: 'Teladi S Liquid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 277527,
      max: 375477,
      average: 326502
    },
    production: [
      {
        time: 397.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 51
          },
          {
            ware: 'energycells',
            amount: 102
          },
          {
            ware: 'hullparts',
            amount: 187
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_solid_l_01',
    tags: 'module',
    name: 'Teladi L Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 608287,
      max: 822977,
      average: 715632
    },
    production: [
      {
        time: 869.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 112
          },
          {
            ware: 'energycells',
            amount: 223
          },
          {
            ware: 'hullparts',
            amount: 408
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_solid_m_01',
    tags: 'module',
    name: 'Teladi M Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 424014,
      max: 573666,
      average: 498840
    },
    production: [
      {
        time: 607.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 78
          },
          {
            ware: 'energycells',
            amount: 156
          },
          {
            ware: 'hullparts',
            amount: 285
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_tel_stor_solid_s_01',
    tags: 'module',
    name: 'Teladi S Solid Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 277527,
      max: 375477,
      average: 326502
    },
    production: [
      {
        time: 397.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'claytronics',
            amount: 51
          },
          {
            ware: 'energycells',
            amount: 102
          },
          {
            ware: 'hullparts',
            amount: 187
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_build_m_01',
    tags: 'module noplayerblueprint',
    name: 'M Ship Assembly Matrix',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 781711,
      max: 1057609,
      average: 919660
    },
    production: [
      {
        time: 830.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 2750
          },
          {
            ware: 'ore',
            amount: 6952
          },
          {
            ware: 'silicon',
            amount: 4062
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_build_s_01',
    tags: 'module noplayerblueprint',
    name: 'S Ship Assembly Matrix',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 781711,
      max: 1057609,
      average: 919660
    },
    production: [
      {
        time: 830.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 2750
          },
          {
            ware: 'ore',
            amount: 6952
          },
          {
            ware: 'silicon',
            amount: 4062
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_build_xl_01',
    tags: 'module noplayerblueprint',
    name: 'XL Ship Assembly Matrix',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 1383023,
      max: 1871149,
      average: 1627086
    },
    production: [
      {
        time: 1468.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 4866
          },
          {
            ware: 'ore',
            amount: 12301
          },
          {
            ware: 'silicon',
            amount: 7186
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_def_base_01',
    tags: 'module noplayerblueprint',
    name: 'Xenon Base Module',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 395272,
      max: 534780,
      average: 465026
    },
    production: [
      {
        time: 4195.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 1391
          },
          {
            ware: 'ore',
            amount: 3515
          },
          {
            ware: 'silicon',
            amount: 2054
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_dock_m_01',
    tags: 'module noplayerblueprint',
    name: 'Xenon Dock',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 103180,
      max: 139596,
      average: 121388
    },
    production: [
      {
        time: 2191.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 363
          },
          {
            ware: 'ore',
            amount: 918
          },
          {
            ware: 'silicon',
            amount: 536
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_prod_energycells_01',
    tags: 'module noplayerblueprint',
    name: 'Matrix Solar Panel',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 154982,
      max: 209682,
      average: 182332
    },
    production: [
      {
        time: 582.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 562
          },
          {
            ware: 'ore',
            amount: 963
          },
          {
            ware: 'silicon',
            amount: 963
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'module_xen_stor_01',
    tags: 'module noplayerblueprint',
    name: 'Matrix Storage',
    description: 'No information available',
    transport: 'container',
    volume: 1,
    price: {
      min: 43501,
      max: 58855,
      average: 51178
    },
    production: [
      {
        time: 596.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 153
          },
          {
            ware: 'ore',
            amount: 387
          },
          {
            ware: 'silicon',
            amount: 226
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostduration_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Boost Duration Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostthrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Boost Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostthrust_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Boost Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostthrust_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Boost Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t3',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostthrust_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Boost Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_boostthrust_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Boost Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_forwardthrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Forward Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_forwardthrust_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Forward Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_forwardthrust_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Forward Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t3',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_forwardthrust_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Forward Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_forwardthrust_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Forward Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_rotationthrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Rotation Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_rotationthrust_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Rotation Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t3',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_rotationthrust_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Rotation Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_strafethrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Strafe Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_strafethrust_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Strafe Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelattacktime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Attack Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelchargetime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Charge Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelreleasetime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Release Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelstartthrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Start Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelthrust_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelthrust_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Travel Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelthrust_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Travel Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t3',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelthrust_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Travel Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t1',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_engine_travelthrust_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Travel Thrust Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_enginefuelinjector_t2',
            amount: 1
          },
          {
            ware: 'modpart_extendedfuelcontainer',
            amount: 3
          },
          {
            ware: 'modpart_nividiumoxide',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_capacity_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t1',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_capacity_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t2',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_capacity_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t3',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_capacity_02_mk3',
    tags: 'crafting equipmentmod',
    name: 'Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t3',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_rechargedelay_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Recharge Delay Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t1',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_rechargerate_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Recharge Rate Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t1',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_rechargerate_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Recharge Rate Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t2',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_shield_rechargerate_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Recharge Rate Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_shieldgeneratorcoil_t3',
            amount: 1
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_countermeasurecapacity_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Countermeasure Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_deployablecapacity_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Deployable Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_drag_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Drag Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_drag_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Drag Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_mass_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Mass Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_mass_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Mass Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_mass_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Mass Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t3',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_maxhull_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Max Hull Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_missilecapacity_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Missile Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_radarrange_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Radar Range Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_ship_unitcapacity_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Unit Capacity Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_nividiumcrystallite',
            amount: 3
          },
          {
            ware: 'modpart_shipnanoweave_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_beamlength_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Beam Length Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_chargetime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Charge Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_03_mk1',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_03_mk2',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_04_mk2',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_cooling_05_mk2',
    tags: 'crafting equipmentmod',
    name: 'Cooling Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t3',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_02_mk1',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_02_mk3',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t3',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_03_mk1',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_03_mk2',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_04_mk2',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_damage_05_mk2',
    tags: 'crafting equipmentmod',
    name: 'Damage Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_lifetime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Projectile Lifetime Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_mining_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Mining Multiplier Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_mining_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Mining Multiplier Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t3',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_reload_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Reload Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_rotationspeed_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Rotation Speed Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_speed_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Projectile Speed Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_speed_01_mk3',
    tags: 'crafting equipmentmod',
    name: 'Projectile Speed Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t3',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_sticktime_01_mk1',
    tags: 'crafting equipmentmod',
    name: 'Sticky Projectile Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t1',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_sticktime_01_mk2',
    tags: 'crafting equipmentmod',
    name: 'Sticky Projectile Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_sticktime_02_mk2',
    tags: 'crafting equipmentmod',
    name: 'Sticky Projectile Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'mod_weapon_sticktime_03_mk2',
    tags: 'crafting equipmentmod',
    name: 'Sticky Projectile Time Mod',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'modpart_highenergycatalyst',
            amount: 3
          },
          {
            ware: 'modpart_tuningsoftware',
            amount: 1
          },
          {
            ware: 'modpart_weaponchamber_t2',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'nividium',
    tags: 'economy minable mineral solid',
    name: 'Nividium',
    description: 'A rare metal found in small pockets in asteroids, Nividium has been cut out of any economic use by the improved efficiency with which businesses have been able to use ore and silicon, much easier to find and cheaper to process. However, Nividium is still valuable, and is often transported planet-side to be made into jewelry and art.',
    group: 'minerals',
    factoryName: 'Nividium Mine',
    transport: 'solid',
    volume: 10,
    price: {
      min: 434,
      max: 587,
      average: 510
    },
    production: [],
    icon: {
      active: 'ware_nividium'
    }
  },
  {
    id: 'nividiumgems',
    name: 'nividiumgems',
    transport: 'container',
    volume: 2,
    price: {
      min: 969,
      max: 1184,
      average: 1077
    },
    production: [
      {
        time: 300.0,
        amount: 64,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 90
          },
          {
            ware: 'nividium',
            amount: 120
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_nividiumgems'
    }
  },
  {
    id: 'nostropoil',
    tags: 'container economy',
    name: 'Nostrop Oil',
    description: 'Nostrop oil is squeezed from the leaves of sunrise flowers and mixed with water. Though the Teladi favour it for its simplicity and nutrients, other species have clearly indicated that nostrop oil does not in fact taste at all pleasing.',
    group: 'food',
    factoryName: 'Nostrop Oil Factory',
    transport: 'container',
    volume: 1,
    price: {
      min: 48,
      max: 72,
      average: 60
    },
    production: [
      {
        time: 300.0,
        amount: 320,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'spices',
            amount: 20
          },
          {
            ware: 'sunriseflowers',
            amount: 40
          },
          {
            ware: 'water',
            amount: 40
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.2
          }
        ]
      }
    ],
    icon: {
      active: 'ware_nostropoil'
    }
  },
  {
    id: 'ore',
    tags: 'economy minable mineral solid',
    name: 'Ore',
    description: 'Today ore tends not to be mined on habitable worlds, but harvested from other celestial bodies, mainly asteroids. As could be expected, Ore must always be refined to be of any use.',
    group: 'minerals',
    factoryName: 'Ore Mine',
    transport: 'solid',
    volume: 10,
    price: {
      min: 43,
      max: 58,
      average: 50
    },
    production: [],
    icon: {
      active: 'ware_ore'
    }
  },
  {
    id: 'paintmod_0001',
    tags: 'inventory paintmod',
    name: 'Shade of Innocence',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0002',
    tags: 'inventory paintmod',
    name: 'Federation Pennon',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0003',
    tags: 'inventory paintmod',
    name: 'Republic Standard',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0004',
    tags: 'inventory paintmod',
    name: 'Company Skin',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0005',
    tags: 'inventory paintmod',
    name: 'Scale Plate Greenback',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0006',
    tags: 'inventory paintmod',
    name: 'Foundation',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0007',
    tags: 'inventory paintmod',
    name: 'Hatikvah Banner',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0008',
    tags: 'inventory paintmod',
    name: 'Origin Unknown',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0009',
    tags: 'inventory paintmod',
    name: 'Godrealm Pride',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0010',
    tags: 'inventory paintmod',
    name: 'Order Wrath',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0011',
    tags: 'inventory paintmod',
    name: 'Alliance Honour',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0012',
    tags: 'inventory paintmod',
    name: 'Ministry Buck',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0013',
    tags: 'inventory paintmod',
    name: 'Act of Distraction',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0014',
    tags: 'inventory paintmod',
    name: 'Ianamus Ztealth',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0015',
    tags: 'inventory paintmod',
    name: 'Not Like This',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0016',
    tags: 'inventory paintmod',
    name: 'Washout',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0017',
    tags: 'inventory paintmod',
    name: 'Black Steel',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0018',
    tags: 'inventory paintmod',
    name: 'Grey Steel',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0019',
    tags: 'inventory paintmod',
    name: 'Foundation X',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0020',
    tags: 'inventory paintmod',
    name: 'Matrix Annihilation',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0021',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0021',
    description: 'Paint Mod 0021 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0022',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0022',
    description: 'Paint Mod 0022 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0023',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0023',
    description: 'Paint Mod 0023 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0024',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0024',
    description: 'Paint Mod 0024 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0025',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0025',
    description: 'Paint Mod 0025 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0026',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0026',
    description: 'Paint Mod 0026 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0027',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0027',
    description: 'Paint Mod 0027 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0028',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0028',
    description: 'Paint Mod 0028 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0029',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0029',
    description: 'Paint Mod 0029 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0030',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0030',
    description: 'Paint Mod 0030 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0031',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0031',
    description: 'Paint Mod 0031 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0032',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0032',
    description: 'Paint Mod 0032 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0033',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0033',
    description: 'Paint Mod 0033 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0034',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0034',
    description: 'Paint Mod 0034 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0035',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0035',
    description: 'Paint Mod 0035 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0036',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0036',
    description: 'Paint Mod 0036 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0037',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0037',
    description: 'Paint Mod 0037 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0038',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0038',
    description: 'Paint Mod 0038 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0039',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0039',
    description: 'Paint Mod 0039 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0040',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0040',
    description: 'Paint Mod 0040 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0041',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0041',
    description: 'Paint Mod 0041 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0042',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0042',
    description: 'Paint Mod 0042 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0043',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0043',
    description: 'Paint Mod 0043 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0044',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0044',
    description: 'Paint Mod 0044 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0045',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0045',
    description: 'Paint Mod 0045 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0046',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0046',
    description: 'Paint Mod 0046 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0047',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0047',
    description: 'Paint Mod 0047 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0048',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0048',
    description: 'Paint Mod 0048 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0049',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0049',
    description: 'Paint Mod 0049 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0050',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0050',
    description: 'Paint Mod 0050 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0051',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0051',
    description: 'Paint Mod 0051 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0052',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0052',
    description: 'Paint Mod 0052 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0053',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0053',
    description: 'Paint Mod 0053 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0054',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0054',
    description: 'Paint Mod 0054 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0055',
    tags: 'inventory paintmod',
    name: 'Paint Mod 0055',
    description: 'Paint Mod 0055 Description',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'paintmod_0056',
    tags: 'inventory paintmod',
    name: 'Obsidian X',
    description: 'No information available',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'plasmaconductors',
    tags: 'container economy',
    name: 'Plasma Conductors',
    description: 'These conductors are designed to allow the flow of plasma through a component at the greatest possible efficiency. Though made relatively cheap to produce through years of research and development, plasma conductors remain highly complex pieces of technology. They are used primarily in the construction of weapon and shield components. ',
    group: 'hightech',
    factoryName: 'Plasma Conductor Factory',
    transport: 'container',
    volume: 32,
    price: {
      min: 1485,
      max: 2010,
      average: 1748
    },
    production: [
      {
        time: 900.0,
        amount: 50,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'graphene',
            amount: 96
          },
          {
            ware: 'superfluidcoolant',
            amount: 140
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      },
      {
        time: 900.0,
        amount: 50,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'graphene',
            amount: 96
          },
          {
            ware: 'superfluidcoolant',
            amount: 140
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_plasmaconductors'
    }
  },
  {
    id: 'quantumtubes',
    tags: 'container economy',
    name: 'Quantum Tubes',
    description: 'An example of complex technology being made cheap through years of continuous research, no one outside of those manufacturing the technology quite knows how quantum tubes work. Though the outer wiring itself it easy to make and understand, the internal structure and what the wiring actually carries must be constructed only by those with countless hours of study and examination under their belts; otherwise risking catastrophic failures that can lead to entire shutdowns of the equipment in which they are used.',
    group: 'hightech',
    factoryName: 'Quantum Tube Factory',
    transport: 'container',
    volume: 22,
    price: {
      min: 435,
      max: 588,
      average: 511
    },
    production: [
      {
        time: 720.0,
        amount: 110,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'graphene',
            amount: 116
          },
          {
            ware: 'superfluidcoolant',
            amount: 30
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.3
          }
        ]
      },
      {
        time: 720.0,
        amount: 110,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'graphene',
            amount: 116
          },
          {
            ware: 'superfluidcoolant',
            amount: 30
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.3
          }
        ]
      }
    ],
    icon: {
      active: 'ware_quantumtubes'
    }
  },
  {
    id: 'refinedmetals',
    tags: 'container economy',
    name: 'Refined Metals',
    description: 'Refined from ore found in countless asteroids across the Jump Gate network, these refined metals are cheap to produce and easy to reinforce, making them perfect for use in constructing all kinds of Hull Parts, not just for ships and stations, but also for smaller components that used across all of space.',
    group: 'refined',
    factoryName: 'Ore Refinery',
    transport: 'container',
    volume: 14,
    price: {
      min: 133,
      max: 163,
      average: 148
    },
    production: [
      {
        time: 150.0,
        amount: 100,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 90
          },
          {
            ware: 'ore',
            amount: 240
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_refinedmetals'
    }
  },
  {
    id: 'research_module_build',
    tags: 'hidden research',
    name: 'Build Module Hack',
    description: 'Allows the possibility to steal build module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_defence',
    tags: 'research',
    name: 'Defence Module Hack',
    description: 'Allows the possibility to steal defence module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_dock',
    tags: 'research',
    name: 'Dock Module Hack',
    description: 'Allows the possibility to steal dock module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_habitation',
    tags: 'research',
    name: 'Habitation Module Hack',
    description: 'Allows the possibility to steal habitation module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_production',
    tags: 'research',
    name: 'Production Module Hack',
    description: 'Allows the possibility to steal production module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_storage',
    tags: 'research',
    name: 'Storage Module Hack',
    description: 'Allows the possibility to steal storage module blueprints when scanning their data leaks.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_module_venture',
    tags: 'hidden research',
    name: 'Venture Docks',
    description: 'Allows the construction of experimental modules to send ships to parallel universes. (Requires you to be signed in to online features.)',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_engine_mk1',
    tags: 'research',
    name: 'Basic Engine Mods',
    description: 'Allows the crafting of basic engine mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_engine_mk2',
    tags: 'research',
    name: 'Advanced Engine Mods',
    description: 'Allows the crafting of more advanced engine mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_engine_mk3',
    tags: 'research',
    name: 'Exceptional Engine Mods',
    description: 'Allows the crafting of superior engine mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_shield_mk1',
    tags: 'research',
    name: 'Basic Shield Mods',
    description: 'Allows the crafting of basic shield mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_shield_mk2',
    tags: 'research',
    name: 'Advanced Shield Mods',
    description: 'Allows the crafting of more advanced shield mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_shield_mk3',
    tags: 'research',
    name: 'Exceptional Shield Mods',
    description: 'Allows the crafting of superior shield mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_ship_mk1',
    tags: 'research',
    name: 'Basic Chassis Mods',
    description: 'Allows the crafting of basic chassis mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_ship_mk2',
    tags: 'research',
    name: 'Advanced Chassis Mods',
    description: 'Allows the crafting of more advanced chassis mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_ship_mk3',
    tags: 'research',
    name: 'Exceptional Chassis Mods',
    description: 'Allows the crafting of superior chassis mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_weapon_mk1',
    tags: 'research',
    name: 'Basic Weapon Mods',
    description: 'Allows the crafting of basic weapon mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_weapon_mk2',
    tags: 'research',
    name: 'Advanced Weapon Mods',
    description: 'Allows the crafting of more advanced weapon mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_mod_weapon_mk3',
    tags: 'research',
    name: 'Exceptional Weapon Mods',
    description: 'Allows the crafting of superior weapon mods for ships.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_radioreceiver',
    tags: 'hidden research',
    name: 'Radio Receiver',
    description: 'Allows you to receive radio transmissions from throughout space.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_sensorbooster',
    tags: 'hidden research',
    name: 'Sensor Booster',
    description: 'Allows you to scan station modules for more information.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_teleportation',
    tags: 'research',
    name: 'Teleportation',
    description: 'A by-product of Terran warp research, this will allow teleportation of an individual over a limited range.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_teleportation_range_01',
    tags: 'research',
    name: 'Teleportation - Range I',
    description: 'Increases the range of the personal teleporter from within 1 system to within 3.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_teleportation_range_02',
    tags: 'research',
    name: 'Teleportation - Range II',
    description: 'Increases the range of the personal teleporter from within 3 systems to within 5.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_teleportation_range_03',
    tags: 'research',
    name: 'Teleportation - Range III',
    description: 'Increases the range of the personal teleporter so that you can jump to ships you own across the entire Jump Gate network.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'research_tradeinterface',
    tags: 'hidden research',
    name: 'Trade Interface',
    description: 'Allows you to access trade information from around stations.',
    transport: 'research',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: []
  },
  {
    id: 'resourceprobe_01',
    tags: 'equipment resourceprobe',
    name: 'Resource Probe',
    description: 'Often fired from scout and mining ships deep within a mineral or gas region, resource probes are able to scan both asteroids and gas clouds in order to analyse what elements make up the region, in order to give miners a better idea of what they can find there. Not only can a resource probe discover the different elements making up the field, but also give a rough estimate on its yield.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 5249,
      max: 7101,
      average: 6175
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1
          },
          {
            ware: 'hullparts',
            amount: 1
          },
          {
            ware: 'scanningarrays',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'satellite_mk1',
    tags: 'equipment satellite',
    name: 'Satellite',
    description: 'A static object used for observation, once deployed a satellite will pick up any communications sent and received by both ships and stations on open frequencies within a certain range. They are not one-use objects; a satellite can be deployed in one location, then deactivated and picked back up in a ship, then redeployed in a new location.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 4152,
      max: 5618,
      average: 4885
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1
          },
          {
            ware: 'scanningarrays',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'satellite_mk2',
    tags: 'equipment satellite',
    name: 'Advanced Satellite',
    description: 'A static object used for observation, once deployed a satellite will pick up any communications sent and received by both ships and stations on open frequencies within a certain range. They are not one-use objects; a satellite can be deployed in one location, then deactivated and picked back up in a ship, then redeployed in a new location.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 88760,
      max: 120090,
      average: 104430
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'scanningarrays',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'scanningarrays',
    tags: 'container economy',
    name: 'Scanning Arrays',
    description: 'Scanning arrays have seen elegant redesign over the years so that ships and stations do not risk fragile antennas being broken or destroyed by collisions. Now entirely internal systems, scanning arrays are used not just in ship and station scanners and radars, but are also used in the targeting systems supplied with turret and drone components. ',
    group: 'hightech',
    factoryName: 'Scanning Array Factory',
    transport: 'container',
    volume: 38,
    price: {
      min: 1744,
      max: 2131,
      average: 1938
    },
    production: [
      {
        time: 600.0,
        amount: 40,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'refinedmetals',
            amount: 100
          },
          {
            ware: 'siliconwafers',
            amount: 60
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.24
          }
        ]
      },
      {
        time: 600.0,
        amount: 40,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'siliconwafers',
            amount: 60
          },
          {
            ware: 'teladianium',
            amount: 73
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.24
          }
        ]
      }
    ],
    icon: {
      active: 'ware_scanningarrays'
    }
  },
  {
    id: 'shieldcomponents',
    tags: 'container economy stationbuilding',
    name: 'Shield Components',
    description: 'From generators to coils that maintain energy over time, shield components are a wide arrange of technologies that provide everything necessary to build a variety of shields. Completely modular, each part can be used in each shield, which has led to a wide variety of new-generation shields being produced in recent years. As with all ship equipment, shields are built on-demand, and so shield components are produced in factories and shipped straight to shipyards and equipment docks where they can be more freely used for construction and repair.',
    group: 'shiptech',
    factoryName: 'Shield Component Factory',
    transport: 'container',
    volume: 10,
    price: {
      min: 387,
      max: 581,
      average: 484
    },
    production: [
      {
        time: 1200.0,
        amount: 220,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 70
          },
          {
            ware: 'plasmaconductors',
            amount: 20
          },
          {
            ware: 'quantumtubes',
            amount: 20
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_shieldcomponents'
    }
  },
  {
    id: 'shield_arg_l_standard_01_mk1',
    tags: 'equipment shield',
    name: 'ARG L Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 42166,
      max: 51536,
      average: 46851
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'fieldcoils',
            amount: 13
          },
          {
            ware: 'shieldcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_l_standard_01_mk2',
    tags: 'equipment shield',
    name: 'ARG L Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 205644,
      max: 251343,
      average: 228494
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 100
          },
          {
            ware: 'fieldcoils',
            amount: 65
          },
          {
            ware: 'shieldcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_m_standard_01_mk1',
    tags: 'equipment noplayerblueprint shield',
    name: 'ARG M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12838,
      max: 15691,
      average: 14264
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_m_standard_01_mk2',
    tags: 'equipment noplayerblueprint shield',
    name: 'ARG M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 62115,
      max: 75918,
      average: 69017
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'fieldcoils',
            amount: 15
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_m_standard_02_mk1',
    tags: 'equipment shield',
    name: 'ARG M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12838,
      max: 15691,
      average: 14264
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_m_standard_02_mk2',
    tags: 'equipment shield',
    name: 'ARG M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 61597,
      max: 75285,
      average: 68441
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'fieldcoils',
            amount: 15
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_s_standard_01_mk1',
    tags: 'equipment shield',
    name: 'ARG S Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1218,
      max: 1489,
      average: 1354
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'shieldcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_s_standard_01_mk2',
    tags: 'equipment shield',
    name: 'ARG S Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 10186,
      max: 12449,
      average: 11318
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'fieldcoils',
            amount: 2
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_s_standard_01_mk3',
    tags: 'equipment shield',
    name: 'ARG S Shield Generator Mk3',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49892,
      max: 60979,
      average: 55436
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 10
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_arg_xl_standard_01_mk1',
    tags: 'equipment shield',
    name: 'ARG XL Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 225671,
      max: 275820,
      average: 250745
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 150
          },
          {
            ware: 'fieldcoils',
            amount: 82
          },
          {
            ware: 'shieldcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_l_standard_01_mk1',
    tags: 'equipment shield',
    name: 'PAR L Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 42166,
      max: 51536,
      average: 46851
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'fieldcoils',
            amount: 13
          },
          {
            ware: 'shieldcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_l_standard_01_mk2',
    tags: 'equipment shield',
    name: 'PAR L Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 205644,
      max: 251343,
      average: 228494
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 100
          },
          {
            ware: 'fieldcoils',
            amount: 65
          },
          {
            ware: 'shieldcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_m_standard_01_mk1',
    tags: 'equipment noplayerblueprint shield',
    name: 'PAR M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12838,
      max: 15691,
      average: 14264
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_m_standard_01_mk2',
    tags: 'equipment noplayerblueprint shield',
    name: 'PAR M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 62115,
      max: 75918,
      average: 69017
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'fieldcoils',
            amount: 15
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_m_standard_02_mk1',
    tags: 'equipment shield',
    name: 'PAR M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12015,
      max: 14685,
      average: 13350
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_m_standard_02_mk2',
    tags: 'equipment shield',
    name: 'PAR M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26058,
      max: 31849,
      average: 28954
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'fieldcoils',
            amount: 9
          },
          {
            ware: 'shieldcomponents',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_s_standard_01_mk1',
    tags: 'equipment shield',
    name: 'PAR S Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1218,
      max: 1489,
      average: 1354
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'shieldcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_s_standard_01_mk2',
    tags: 'equipment shield',
    name: 'PAR S Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 10186,
      max: 12449,
      average: 11318
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'fieldcoils',
            amount: 2
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_s_standard_01_mk3',
    tags: 'equipment shield',
    name: 'PAR S Shield Generator Mk3',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49892,
      max: 60979,
      average: 55436
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 10
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_par_xl_standard_01_mk1',
    tags: 'equipment shield',
    name: 'PAR XL Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 225671,
      max: 275820,
      average: 250745
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 150
          },
          {
            ware: 'fieldcoils',
            amount: 82
          },
          {
            ware: 'shieldcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_l_standard_01_mk1',
    tags: 'equipment shield',
    name: 'TEL L Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 42166,
      max: 51536,
      average: 46851
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'fieldcoils',
            amount: 13
          },
          {
            ware: 'shieldcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_l_standard_01_mk2',
    tags: 'equipment shield',
    name: 'TEL L Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 205644,
      max: 251343,
      average: 228494
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 100
          },
          {
            ware: 'fieldcoils',
            amount: 65
          },
          {
            ware: 'shieldcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_m_standard_01_mk1',
    tags: 'equipment noplayerblueprint shield',
    name: 'TEL M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12838,
      max: 15691,
      average: 14264
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_m_standard_01_mk2',
    tags: 'equipment noplayerblueprint shield',
    name: 'TEL M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 62115,
      max: 75918,
      average: 69017
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'fieldcoils',
            amount: 15
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_m_standard_02_mk1',
    tags: 'equipment shield',
    name: 'TEL M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12015,
      max: 14685,
      average: 13350
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 3
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_m_standard_02_mk2',
    tags: 'equipment shield',
    name: 'TEL M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26058,
      max: 31849,
      average: 28954
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'fieldcoils',
            amount: 9
          },
          {
            ware: 'shieldcomponents',
            amount: 6
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_s_standard_01_mk1',
    tags: 'equipment shield',
    name: 'TEL S Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1218,
      max: 1489,
      average: 1354
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'shieldcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_s_standard_01_mk2',
    tags: 'equipment shield',
    name: 'TEL S Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 10186,
      max: 12449,
      average: 11318
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'fieldcoils',
            amount: 2
          },
          {
            ware: 'shieldcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_s_standard_01_mk3',
    tags: 'equipment shield',
    name: 'TEL S Shield Generator Mk3',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49892,
      max: 60979,
      average: 55436
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'fieldcoils',
            amount: 10
          },
          {
            ware: 'shieldcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_tel_xl_standard_01_mk1',
    tags: 'equipment shield',
    name: 'TEL XL Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 225671,
      max: 275820,
      average: 250745
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 150
          },
          {
            ware: 'fieldcoils',
            amount: 82
          },
          {
            ware: 'shieldcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_l_standard_01_mk1',
    tags: 'equipment noplayerblueprint shield',
    name: 'XEN L Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 41386,
      max: 50582,
      average: 45984
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'ore',
            amount: 51
          },
          {
            ware: 'silicon',
            amount: 51
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_l_standard_01_mk2',
    tags: 'equipment noplayerblueprint shield',
    name: 'XEN L Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 110765,
      max: 135379,
      average: 123072
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'ore',
            amount: 138
          },
          {
            ware: 'silicon',
            amount: 138
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_m_standard_01_mk1',
    tags: 'equipment noplayerblueprint shield',
    name: 'XEN M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13478,
      max: 16474,
      average: 14976
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 16
          },
          {
            ware: 'silicon',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_m_standard_01_mk2',
    tags: 'equipment noplayerblueprint shield',
    name: 'XEN M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 27821,
      max: 34003,
      average: 30912
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 34
          },
          {
            ware: 'silicon',
            amount: 34
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_m_standard_02_mk1',
    tags: 'equipment shield',
    name: 'XEN M Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13478,
      max: 16474,
      average: 14976
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 16
          },
          {
            ware: 'silicon',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_m_standard_02_mk2',
    tags: 'equipment shield',
    name: 'XEN M Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 27821,
      max: 34003,
      average: 30912
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 34
          },
          {
            ware: 'silicon',
            amount: 34
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_s_standard_01_mk1',
    tags: 'equipment shield',
    name: 'XEN S Shield Generator Mk1',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1901,
      max: 2323,
      average: 2112
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 2
          },
          {
            ware: 'silicon',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'shield_xen_s_standard_01_mk2',
    tags: 'equipment shield',
    name: 'XEN S Shield Generator Mk2',
    description: 'No information available',
    group: 'shields',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 4579,
      max: 5597,
      average: 5088
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 5
          },
          {
            ware: 'silicon',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_destroyer_01_a',
    tags: 'ship',
    name: 'Behemoth Vanguard',
    description: 'The original design of the Behemoth-class destroyer was put into development mid-way through the Kha\'ak conflict, during which the Titan-class was beginning to show its age and inefficiencies. At first too expensive for a crippled Argon economy, then too complex to produce quickly during the Terran Conflict, the first Behemoth did not ship out until long after that war had ended, and the Jump Gates had begun to catastrophically fail. It was only when Argon Prime and Black Hole Sun came back into contact that the Behemoth could be rolled out more frequently.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 4895057,
      max: 6622724,
      average: 5758890
    },
    production: [
      {
        time: 182.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1008
          },
          {
            ware: 'hullparts',
            amount: 4433
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_destroyer_01_b',
    tags: 'ship',
    name: 'Behemoth Sentinel',
    description: 'The original design of the Behemoth-class destroyer was put into development mid-way through the Kha\'ak conflict, during which the Titan-class was beginning to show its age and inefficiencies. At first too expensive for a crippled Argon economy, then too complex to produce quickly during the Terran Conflict, the first Behemoth did not ship out until long after that war had ended, and the Jump Gates had begun to catastrophically fail. It was only when Argon Prime and Black Hole Sun came back into contact that the Behemoth could be rolled out more frequently.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 5859033,
      max: 7926927,
      average: 6892980
    },
    production: [
      {
        time: 218.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1206
          },
          {
            ware: 'hullparts',
            amount: 5306
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_miner_liquid_01_a',
    tags: 'ship',
    name: 'Magnetar (Gas) Vanguard',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1349018,
      max: 1825142,
      average: 1587080
    },
    production: [
      {
        time: 83.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 461
          },
          {
            ware: 'hullparts',
            amount: 1216
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_miner_liquid_01_b',
    tags: 'ship',
    name: 'Magnetar (Gas) Sentinel',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1639667,
      max: 2218373,
      average: 1929020
    },
    production: [
      {
        time: 101.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 560
          },
          {
            ware: 'hullparts',
            amount: 1478
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_miner_solid_01_a',
    tags: 'ship',
    name: 'Magnetar (Mineral) Vanguard',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1345695,
      max: 1820646,
      average: 1583170
    },
    production: [
      {
        time: 83.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 460
          },
          {
            ware: 'hullparts',
            amount: 1213
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_miner_solid_01_b',
    tags: 'ship',
    name: 'Magnetar (Mineral) Sentinel',
    description: 'As the trend towards collecting natural resources with ships continued, the inefficiencies of the solution started to become clear. While a medium-sized ship had the advantage of moving quickly through mineral and gas regions, their cargo bays were simply not big enough for industrial-scale mining to be lucrative.nnNaturally, the Teladi stepped in to design L-sized resource collectors that could solve that problem, and the Magnetar is the Argon response to these ships; a standardised model that can be built in two variants, allowing it to support both asteroid mining and natural gas collection.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1636344,
      max: 2213877,
      average: 1925110
    },
    production: [
      {
        time: 101.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 559
          },
          {
            ware: 'hullparts',
            amount: 1475
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_01_a',
    tags: 'ship',
    name: 'Veles Vanguard',
    description: 'Designed and produced by the Antigone Republic after the Jump Gates began to realign, the Veles-class freighter is more compact and self-sufficient than any freighter-class ship before it; the reason why it became part of the on-going technology exchange between the Republic and their Argon Federation allies.nnBuilt using a highly modular design, many ship designers have taken the base Veles model and reorganised it, as well as making their own changes to the internal systems, to sell an ever-growing number of variations on the ship. However, the Veles remains a popular choice among traders and station builders.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3162842,
      max: 4279139,
      average: 3720990
    },
    production: [
      {
        time: 195.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1080
          },
          {
            ware: 'hullparts',
            amount: 2851
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_01_b',
    tags: 'ship',
    name: 'Veles Sentinel',
    description: 'Designed and produced by the Antigone Republic after the Jump Gates began to realign, the Veles-class freighter is more compact and self-sufficient than any freighter-class ship before it; the reason why it became part of the on-going technology exchange between the Republic and their Argon Federation allies.nnBuilt using a highly modular design, many ship designers have taken the base Veles model and reorganised it, as well as making their own changes to the internal systems, to sell an ever-growing number of variations on the ship. However, the Veles remains a popular choice among traders and station builders.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3811842,
      max: 5157198,
      average: 4484520
    },
    production: [
      {
        time: 235.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1302
          },
          {
            ware: 'hullparts',
            amount: 3436
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_02_a',
    tags: 'ship',
    name: 'Mokosi Vanguard',
    description: 'When Argon Federation ship designers received the blue-prints for the Veles, it was immediately recognisable as a highly modular ship, and so they began work straight away on different variations that could provide more variety and competition in a ship class that was both needed and popular throughout Argon space.nnOne of the first ships to come from this process was the Mokosi, designed in Black Hole Sun. Though it uses the same base chassis as the Veles, a different container configuration and tweaks to several internal systems to adapt have created a fine addition to the Argon merchant fleet.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3283754,
      max: 4442726,
      average: 3863240
    },
    production: [
      {
        time: 203.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1121
          },
          {
            ware: 'hullparts',
            amount: 2960
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_02_b',
    tags: 'ship',
    name: 'Mokosi Sentinel',
    description: 'When Argon Federation ship designers received the blue-prints for the Veles, it was immediately recognisable as a highly modular ship, and so they began work straight away on different variations that could provide more variety and competition in a ship class that was both needed and popular throughout Argon space.nnOne of the first ships to come from this process was the Mokosi, designed in Black Hole Sun. Though it uses the same base chassis as the Veles, a different container configuration and tweaks to several internal systems to adapt have created a fine addition to the Argon merchant fleet.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3946049,
      max: 5338772,
      average: 4642410
    },
    production: [
      {
        time: 244.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1347
          },
          {
            ware: 'hullparts',
            amount: 3557
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_03_a',
    tags: 'ship',
    name: 'Incarcatura Vanguard',
    description: 'Designed and produced as part of the push to revitalise the Argon economy after the Jump Gate realignment, the relatively new Incarcatura has become a popular alternative to the Veles and Mokosi design. Though there have been some concerns as to its length, that it might caught flight problems, most experts are willing to overlook these problems due to its cargo efficiency.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3195014,
      max: 4322666,
      average: 3758840
    },
    production: [
      {
        time: 197.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1091
          },
          {
            ware: 'hullparts',
            amount: 2880
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_03_b',
    tags: 'ship',
    name: 'Incarcatura Sentinel',
    description: 'Designed and produced as part of the push to revitalise the Argon economy after the Jump Gate realignment, the relatively new Incarcatura has become a popular alternative to the Veles and Mokosi design. Though there have been some concerns as to its length, that it might caught flight problems, most experts are willing to overlook these problems due to its cargo efficiency.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 5157503,
      max: 6977798,
      average: 6067650
    },
    production: [
      {
        time: 319.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1761
          },
          {
            ware: 'hullparts',
            amount: 4649
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_04_a',
    tags: 'ship',
    name: 'Shuyaku Vanguard',
    description: 'Designed in parallel to the Incarcatura, as part of the push to rejuvenate the Argon economy, the Shuyaku-class freighter is a Sonra variant, extending the Terracorp-designed freighter\'s cargo bay at the cost of some manoeuvrability. The Shuyaku also marks the Hatikvah Free League\'s first contribution to the Argon merchant fleet, meant as an offering of good will to both the Federation and the Republic, to show that the Free League was also taking the rebuilding effort seriously.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 4663814,
      max: 6309866,
      average: 5486840
    },
    production: [
      {
        time: 288.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1592
          },
          {
            ware: 'hullparts',
            amount: 4204
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_04_b',
    tags: 'ship',
    name: 'Shuyaku Sentinel',
    description: 'Designed in parallel to the Incarcatura, as part of the push to rejuvenate the Argon economy, the Shuyaku-class freighter is a Sonra variant, extending the Terracorp-designed freighter\'s cargo bay at the cost of some manoeuvrability. The Shuyaku also marks the Hatikvah Free League\'s first contribution to the Argon merchant fleet, meant as an offering of good will to both the Federation and the Republic, to show that the Free League was also taking the rebuilding effort seriously.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 5601271,
      max: 7578190,
      average: 6589730
    },
    production: [
      {
        time: 346.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1913
          },
          {
            ware: 'hullparts',
            amount: 5049
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_05_a',
    tags: 'ship',
    name: 'Sonra Vanguard',
    description: 'Though the Sonra-class freighter was initially designed by Terracorp after the Terran Conflict, the status of development was lost with contact to Home of Light. Quite by chance, project designers were trapped in Black Hole Sun during the Jump Gate shutdown, and were able to get the blueprints of the finished ship to the Argon Federation and Antigone Republic when contact with Argon Prime and Antigone Memorial was re-established.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3700900,
      max: 5007100,
      average: 4354000
    },
    production: [
      {
        time: 229.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1264
          },
          {
            ware: 'hullparts',
            amount: 3336
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_l_trans_container_05_b',
    tags: 'ship',
    name: 'Sonra Sentinel',
    description: 'Though the Sonra-class freighter was initially designed by Terracorp after the Terran Conflict, the status of development was lost with contact to Home of Light. Quite by chance, project designers were trapped in Black Hole Sun during the Jump Gate shutdown, and were able to get the blueprints of the finished ship to the Argon Federation and Antigone Republic when contact with Argon Prime and Antigone Memorial was re-established.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 4430863,
      max: 5994697,
      average: 5212780
    },
    production: [
      {
        time: 274.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1513
          },
          {
            ware: 'hullparts',
            amount: 3994
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_bomber_01_a',
    tags: 'ship',
    name: 'Minotaur Vanguard',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 780878,
      max: 1056482,
      average: 918680
    },
    production: [
      {
        time: 24.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 134
          },
          {
            ware: 'hullparts',
            amount: 708
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_bomber_01_b',
    tags: 'ship',
    name: 'Minotaur Sentinel',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 924273,
      max: 1250487,
      average: 1087380
    },
    production: [
      {
        time: 29.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 159
          },
          {
            ware: 'hullparts',
            amount: 838
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_bomber_02_a',
    tags: 'ship',
    name: 'Minotaur Raider',
    description: 'A ship that saw much upheaval behind the scenes during the Terran Conflict, when it became painfully clear to the Argon that their ships were far inferior to the Terran equivalents, the Minotaur was over the course of the conflict completely redesigned as a mobile weapons-platform, sporting heavy weapons that deal incredible amounts of damage to similarly-sized and larger, slower targets. Unfortunately, the ship was unable to be put into mass-production before crisis crippled the Argon Federation, and as a result the new Minotaur has only recently entered service.',
    transport: 'ship',
    volume: 1,
    price: {
      min: 770942,
      max: 1043039,
      average: 906990
    },
    production: [
      {
        time: 24.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 132
          },
          {
            ware: 'hullparts',
            amount: 699
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_frigate_01_a',
    tags: 'ship',
    name: 'Cerberus Vanguard',
    description: 'The first of the newly-designed M-sized support ships to reach the Federal and Republic navies, the Cerberus-class frigate is primarily designed to target and support smaller and similarly-sized vessels in a defensive capacity. Notably, the Cerberus was also the first ship of its size to support a fully-functional dock for smaller ships; a massive technical challenge for its designers. This has only made it a more popular choice of ship, and saw a new design race explode throughout the Jump Gate network as other ship designers scrambled to copy the Argons\' innovative design.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1002567,
      max: 1356414,
      average: 1179490
    },
    production: [
      {
        time: 31.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 172
          },
          {
            ware: 'hullparts',
            amount: 909
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_frigate_01_b',
    tags: 'ship',
    name: 'Cerberus Sentinel',
    description: 'The first of the newly-designed M-sized support ships to reach the Federal and Republic navies, the Cerberus-class frigate is primarily designed to target and support smaller and similarly-sized vessels in a defensive capacity. Notably, the Cerberus was also the first ship of its size to support a fully-functional dock for smaller ships; a massive technical challenge for its designers. This has only made it a more popular choice of ship, and saw a new design race explode throughout the Jump Gate network as other ship designers scrambled to copy the Argons\' innovative design.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1191190,
      max: 1611610,
      average: 1401400
    },
    production: [
      {
        time: 37.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 205
          },
          {
            ware: 'hullparts',
            amount: 1080
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_miner_liquid_01_a',
    tags: 'ship',
    name: 'Sunder Vanguard',
    description: 'Jonferco\'s response to the PMC\'s Drill design, the Sunder fulfils a similar role to its sister ship but handles gas collection instead of asteroid mining. It is fitted with a non-modular scoop that allows natural gases to be safely placed inside the ship\'s cargo hold. For all the gratitude received by PMC for their work in advancing asteroid mining, Jonferco\'s reply sent the mining community into a complete frenzy, with the possibilities for collecting, refining and utilising natural gases spurring the economy, not just in Argon space but across the entire Jump Gate network, to a brand new high.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 130535,
      max: 176606,
      average: 153570
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 66
          },
          {
            ware: 'hullparts',
            amount: 117
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_miner_liquid_01_b',
    tags: 'ship',
    name: 'Sunder Sentinel',
    description: 'Jonferco\'s response to the PMC\'s Drill design, the Sunder fulfils a similar role to its sister ship but handles gas collection instead of asteroid mining. It is fitted with a non-modular scoop that allows natural gases to be safely placed inside the ship\'s cargo hold. For all the gratitude received by PMC for their work in advancing asteroid mining, Jonferco\'s reply sent the mining community into a complete frenzy, with the possibilities for collecting, refining and utilising natural gases spurring the economy, not just in Argon space but across the entire Jump Gate network, to a brand new high.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 165138,
      max: 223422,
      average: 194280
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 84
          },
          {
            ware: 'hullparts',
            amount: 148
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_miner_solid_01_a',
    tags: 'ship',
    name: 'Drill Vanguard',
    description: 'Towards the end of the last era, the Plutarch Mining Corporation called for a shift away from static station-based asteroid mining towards the far more efficient method of using ships to identify and break down asteroids and bring them to refineries in far less time than it took for a refinery to be attached to a much bigger asteroid. Though it is now different from the PMC\'s original design, the Drill has been in service ever since, inspiring a train of different mining ships to be released all across the old and new Jump Gate network.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 135021,
      max: 182678,
      average: 158850
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 69
          },
          {
            ware: 'hullparts',
            amount: 121
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_miner_solid_01_b',
    tags: 'ship',
    name: 'Drill Sentinel',
    description: 'Towards the end of the last era, the Plutarch Mining Corporation called for a shift away from static station-based asteroid mining towards the far more efficient method of using ships to identify and break down asteroids and bring them to refineries in far less time than it took for a refinery to be attached to a much bigger asteroid. Though it is now different from the PMC\'s original design, the Drill has been in service ever since, inspiring a train of different mining ships to be released all across the old and new Jump Gate network.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 159554,
      max: 215867,
      average: 187710
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 81
          },
          {
            ware: 'hullparts',
            amount: 143
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_trans_container_01_a',
    tags: 'ship',
    name: 'Mercury Vanguard',
    description: 'The latest redesign of the Mercury-class transporter was almost purely aesthetic, with only small changes made to allow the user more modularity and modification options. Other than the aesthetic changes made to keep the model in line with latest style trends, the Mercury remains the same reliable M-sized transporter that has seen popular use across Argon space for so many years.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 177404,
      max: 240017,
      average: 208710
    },
    production: [
      {
        time: 16.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 90
          },
          {
            ware: 'hullparts',
            amount: 159
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_trans_container_01_b',
    tags: 'ship',
    name: 'Mercury Sentinel',
    description: 'The latest redesign of the Mercury-class transporter was almost purely aesthetic, with only small changes made to allow the user more modularity and modification options. Other than the aesthetic changes made to keep the model in line with latest style trends, the Mercury remains the same reliable M-sized transporter that has seen popular use across Argon space for so many years.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 213104,
      max: 288317,
      average: 250710
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 108
          },
          {
            ware: 'hullparts',
            amount: 191
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_trans_container_02_a',
    tags: 'ship',
    name: 'Ides Vanguard',
    description: 'With the Argon Federation desperate to rebuild its economy after the Jump Gates realigned, the sheer number of Mercury-class transporters across Argon space became so high that the value of the popular transporter began to sink rapidly. In an attempt to correct course, the Federation released the Ides. Though they are only slightly aesthetically and technically different, and in fact the Ides is based on the Mercury model, the ship has been pushed as competition to the popular transporter; a marketing strategy that has been well met by the public, and recently allowed for the ship market to find stability.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 177404,
      max: 240017,
      average: 208710
    },
    production: [
      {
        time: 16.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 90
          },
          {
            ware: 'hullparts',
            amount: 159
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_m_trans_container_02_b',
    tags: 'ship',
    name: 'Ides Sentinel',
    description: 'With the Argon Federation desperate to rebuild its economy after the Jump Gates realigned, the sheer number of Mercury-class transporters across Argon space became so high that the value of the popular transporter began to sink rapidly. In an attempt to correct course, the Federation released the Ides. Though they are only slightly aesthetically and technically different, and in fact the Ides is based on the Mercury model, the ship has been pushed as competition to the popular transporter; a marketing strategy that has been well met by the public, and recently allowed for the ship market to find stability.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 213104,
      max: 288317,
      average: 250710
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 108
          },
          {
            ware: 'hullparts',
            amount: 191
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_01_a',
    tags: 'ship',
    name: 'Nova Vanguard',
    description: 'Though the prototype for the new-model Nova-class dogfighter was in development as far back as the Terran Conflict, it never reached mass-production before the Jump Gate shutdown. As such, its first major role was as an escort to Argon Federation exploratory groups that were sent out into newly discovered or rediscovered areas of space as the Jump Gates began to realign.nnIn terms of its class, the new-look Nova is a major step up in ship design, with rotatable engines that make it formidable in keeping up with and tracking targets of a similar size.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 135677,
      max: 183563,
      average: 159620
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 56
          },
          {
            ware: 'hullparts',
            amount: 122
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_01_b',
    tags: 'ship',
    name: 'Nova Sentinel',
    description: 'Though the prototype for the new-model Nova-class dogfighter was in development as far back as the Terran Conflict, it never reached mass-production before the Jump Gate shutdown. As such, its first major role was as an escort to Argon Federation exploratory groups that were sent out into newly discovered or rediscovered areas of space as the Jump Gates began to realign.nnIn terms of its class, the new-look Nova is a major step up in ship design, with rotatable engines that make it formidable in keeping up with and tracking targets of a similar size.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 164594,
      max: 222686,
      average: 193640
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 68
          },
          {
            ware: 'hullparts',
            amount: 148
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_02_a',
    tags: 'ship',
    name: 'Elite Vanguard',
    description: 'Though retired from service for a long time before the Jump Gate shutdown, the push to give any advantage to the Federal and Republic fleets in their fights against the Xenon and the Holy Order of the Pontifex has seen the long-serving Elite redesigned as an interceptor.nnQuick in a straight line and able to fire off short bursts of fire-power before disengaging, the Elite often targets small ships and slower missiles, as well as using its speed and size, in support of the dog-fighters that are able to hold out longer under fire.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 78940,
      max: 106801,
      average: 92870
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 32
          },
          {
            ware: 'hullparts',
            amount: 71
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_02_b',
    tags: 'ship',
    name: 'Elite Sentinel',
    description: 'Though retired from service for a long time before the Jump Gate shutdown, the push to give any advantage to the Federal and Republic fleets in their fights against the Xenon and the Holy Order of the Pontifex has seen the long-serving Elite redesigned as an interceptor.nnQuick in a straight line and able to fire off short bursts of fire-power before disengaging, the Elite often targets small ships and slower missiles, as well as using its speed and size, in support of the dog-fighters that are able to hold out longer under fire.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 95625,
      max: 129375,
      average: 112500
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 39
          },
          {
            ware: 'hullparts',
            amount: 86
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_03_a',
    tags: 'ship',
    name: 'Pulsar Vanguard',
    description: 'No information available',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 116765,
      max: 157976,
      average: 137370
    },
    production: [
      {
        time: 9.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 48
          },
          {
            ware: 'hullparts',
            amount: 105
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_fighter_04_a',
    tags: 'ship',
    name: 'Quasar Vanguard',
    description: 'No information available',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 103403,
      max: 139898,
      average: 121650
    },
    production: [
      {
        time: 8.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 42
          },
          {
            ware: 'hullparts',
            amount: 93
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_heavyfighter_01_a',
    name: 'Eclipse Vanguard',
    description: 'Redesigned using the same combat-ready cockpit used by the new-look Nova, the Eclipse replaces the rotatable engines with a support structure that allows it to carry more weapons - effectively sacrificing the manoeuvrability of the dog-fighter for enough fire-power to be devastating against both small- and medium-sized ships.nnThis sacrifice does make the ship vulnerable to more specialised dog-fighters and interceptors, but nonetheless both the Federal and Republic navy has found the new Eclipse to be a worthy addition to their fleets, with Argon ship designers once again leading the race to design ships effective for both personal and military use.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 192381,
      max: 260280,
      average: 226330
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 79
          },
          {
            ware: 'hullparts',
            amount: 173
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_heavyfighter_01_b',
    name: 'Eclipse Sentinel',
    description: 'Redesigned using the same combat-ready cockpit used by the new-look Nova, the Eclipse replaces the rotatable engines with a support structure that allows it to carry more weapons - effectively sacrificing the manoeuvrability of the dog-fighter for enough fire-power to be devastating against both small- and medium-sized ships.nnThis sacrifice does make the ship vulnerable to more specialised dog-fighters and interceptors, but nonetheless both the Federal and Republic navy has found the new Eclipse to be a worthy addition to their fleets, with Argon ship designers once again leading the race to design ships effective for both personal and military use.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 232399,
      max: 314422,
      average: 273410
    },
    production: [
      {
        time: 17.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 95
          },
          {
            ware: 'hullparts',
            amount: 209
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_heavyfighter_02_a',
    tags: 'ship',
    name: 'Eclipse Vanguard',
    description: 'Redesigned using the same combat-ready cockpit used by the new-look Nova, the Eclipse replaces the rotatable engines with a support structure that allows it to carry more weapons - effectively sacrificing the manoeuvrability of the dog-fighter for enough fire-power to be devastating against both small- and medium-sized ships.nnThis sacrifice does make the ship vulnerable to more specialised dog-fighters and interceptors, but nonetheless both the Federal and Republic navy has found the new Eclipse to be a worthy addition to their fleets, with Argon ship designers once again leading the race to design ships effective for both personal and military use.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 174565,
      max: 236176,
      average: 205370
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 71
          },
          {
            ware: 'hullparts',
            amount: 157
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_miner_solid_01_a',
    tags: 'ship',
    name: 'Courier (Mineral)',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 85621,
      max: 115840,
      average: 100730
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 35
          },
          {
            ware: 'hullparts',
            amount: 77
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_scout_01_a',
    tags: 'ship',
    name: 'Discoverer Vanguard',
    description: 'Long serving as the scout and exploration ship for the Argon fleet, the Discoverer saw little re-design or overhaul until the Jump Gate shutdown. The current model, an overall improvement on the model used before the shutdown, was designed in the Antigone Republic and made available to the Argon Federation as part of an ongoing technology exchange between the two allied factions.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 90075,
      max: 121866,
      average: 105970
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 37
          },
          {
            ware: 'hullparts',
            amount: 81
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_scout_01_b',
    tags: 'ship',
    name: 'Discoverer Sentinel',
    description: 'Long serving as the scout and exploration ship for the Argon fleet, the Discoverer saw little re-design or overhaul until the Jump Gate shutdown. The current model, an overall improvement on the model used before the shutdown, was designed in the Antigone Republic and made available to the Argon Federation as part of an ongoing technology exchange between the two allied factions.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 108953,
      max: 147407,
      average: 128180
    },
    production: [
      {
        time: 8.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 44
          },
          {
            ware: 'hullparts',
            amount: 98
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_trans_container_01_a',
    tags: 'ship',
    name: 'Courier Vanguard',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 160140,
      max: 216660,
      average: 188400
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 66
          },
          {
            ware: 'hullparts',
            amount: 144
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_trans_container_01_b',
    tags: 'ship',
    name: 'Courier Sentinel',
    description: 'After years of outcry from many a trader about the lack of a small and speedy transporter, the up and coming ship manufacturer Jinko-Tekina have supplied both the Argon Federation and Antigone Memorial with the Courier-class s-ship, designed for transporting small numbers of valuable wares across a short distance in order to limit the risk of hijacking as well as to share the load of M- and L-sized transporters that make up the rest of the Argon merchant fleet.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 191250,
      max: 258750,
      average: 225000
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 78
          },
          {
            ware: 'hullparts',
            amount: 172
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_trans_container_02_a',
    tags: 'ship',
    name: 'Callisto Vanguard',
    description: 'No information available',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 82297,
      max: 111343,
      average: 96820
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 74
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_s_trans_container_02_b',
    tags: 'ship',
    name: 'Callisto Sentinel',
    description: 'No information available',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 101210,
      max: 136931,
      average: 119070
    },
    production: [
      {
        time: 8.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 42
          },
          {
            ware: 'hullparts',
            amount: 91
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_builder_01_a',
    tags: 'ship',
    name: 'Mammoth Vanguard',
    description: 'With the method of building stations having changed numerous times since the beginning of the Jump Gate shutdown, many have questioned the necessity for a dedicated building vessel, but the Mammoth has continued to find purpose.nnUndergoing changes with every iteration of the station building method, the last iteration of the Mammoth saw it transformed into more of a mobile platform than a ship; becoming immobile when deployed to a station construction site so that construction drones can easily be ferried from the ship to the site and back again.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 9452145,
      max: 12788196,
      average: 11120170
    },
    production: [
      {
        time: 439.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2428
          },
          {
            ware: 'hullparts',
            amount: 8545
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_builder_01_b',
    tags: 'ship',
    name: 'Mammoth Sentinel',
    description: 'With the method of building stations having changed numerous times since the beginning of the Jump Gate shutdown, many have questioned the necessity for a dedicated building vessel, but the Mammoth has continued to find purpose.nnUndergoing changes with every iteration of the station building method, the last iteration of the Mammoth saw it transformed into more of a mobile platform than a ship; becoming immobile when deployed to a station construction site so that construction drones can easily be ferried from the ship to the site and back again.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 11342553,
      max: 15345807,
      average: 13344180
    },
    production: [
      {
        time: 527.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2913
          },
          {
            ware: 'hullparts',
            amount: 10254
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_carrier_01_a',
    tags: 'ship',
    name: 'Colossus Vanguard',
    description: 'The final ship shared with the Argon Federation by the Antigone Republic as part of their ongoing technology exchange, the new-look Colossus-class carrier was initially designed as such so that it didn\'t use much-needed resources that were sorely lacking in Antigone Memorial during the Jump Gate shutdown.nnWith an array of medium and small docks and launch tubes, the Antigone Colossus is a significant improvement on other Colossus models, able to deploy ships to the battlefield at a much higher rate and collect and store them far more efficiently, at the cost of some of its previous firepower.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 10453215,
      max: 14142585,
      average: 12297900
    },
    production: [
      {
        time: 486.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2685
          },
          {
            ware: 'hullparts',
            amount: 9450
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_carrier_01_b',
    tags: 'ship',
    name: 'Colossus Sentinel',
    description: 'The final ship shared with the Argon Federation by the Antigone Republic as part of their ongoing technology exchange, the new-look Colossus-class carrier was initially designed as such so that it didn\'t use much-needed resources that were sorely lacking in Antigone Memorial during the Jump Gate shutdown.nnWith an array of medium and small docks and launch tubes, the Antigone Colossus is a significant improvement on other Colossus models, able to deploy ships to the battlefield at a much higher rate and collect and store them far more efficiently, at the cost of some of its previous firepower.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 12538308,
      max: 16963593,
      average: 14750950
    },
    production: [
      {
        time: 583.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 3220
          },
          {
            ware: 'hullparts',
            amount: 11335
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_resupplier_01_a',
    name: 'Nomad Vanguard',
    description: 'Very quickly developed during the course of the latest defence against the Xenon, the Nomad is effectively a mobile equipment dock, allowing combat ships to repair and restock and get back to the fight more quickly. This has greatly helped the efficiency of both the Argon Federation and Antigone Republic fleets, and has already begun to see clones created across both Teladi and Paranid space.nnThe ship is not self-sufficient, requiring a defensive escort not to be torn apart in combat. If it can be defended though, the Nomad can prove a devastating support ship.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 8910100,
      max: 12054841,
      average: 10482470
    },
    production: [
      {
        time: 414.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2288
          },
          {
            ware: 'hullparts',
            amount: 8055
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xl_resupplier_01_b',
    name: 'Nomad Sentinel',
    description: 'Very quickly developed during the course of the latest defence against the Xenon, the Nomad is effectively a mobile equipment dock, allowing combat ships to repair and restock and get back to the fight more quickly. This has greatly helped the efficiency of both the Argon Federation and Antigone Republic fleets, and has already begun to see clones created across both Teladi and Paranid space.nnThe ship is not self-sufficient, requiring a defensive escort not to be torn apart in combat. If it can be defended though, the Nomad can prove a devastating support ship.',
    group: 'ships_argon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 10684390,
      max: 14455351,
      average: 12569870
    },
    production: [
      {
        time: 496.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2744
          },
          {
            ware: 'hullparts',
            amount: 9659
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_arg_xs_police_01_a',
    tags: 'drone equipment',
    name: 'Argon Station Security Vessel',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11182,
      max: 15128,
      average: 13155
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_fighter_01_a',
    tags: 'ship',
    name: 'Nodan Vanguard',
    description: 'No information available',
    group: 'ships_alliance',
    transport: 'ship',
    volume: 1,
    price: {
      min: 78659,
      max: 106421,
      average: 92540
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 56
          },
          {
            ware: 'hullparts',
            amount: 70
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_fighter_01_b',
    tags: 'ship',
    name: 'Nodan Sentinel',
    description: 'No information available',
    group: 'ships_alliance',
    transport: 'ship',
    volume: 1,
    price: {
      min: 96645,
      max: 130755,
      average: 113700
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 69
          },
          {
            ware: 'hullparts',
            amount: 86
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_fightingdrone_01_a',
    tags: 'drone equipment',
    name: 'Defence Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11902,
      max: 16103,
      average: 14003
    },
    production: [
      {
        time: 90.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 30
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 15
          },
          {
            ware: 'ore',
            amount: 10
          },
          {
            ware: 'silicon',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_lasertower_01_a',
    tags: 'equipment lasertower',
    name: 'Laser Tower Mk2',
    description: 'Deployed from a compartment of a ship, the laser tower is a static combat unit used primarily in the defence of an area of objective. They use a simple targeting system to turn towards the enemy before firing. Though laser towers can target and hit small ships, they are most effective at medium range against medium or larger targets.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 20664,
      max: 27957,
      average: 24310
    },
    production: [
      {
        time: 1800.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_miningdrone_liquid_01_a',
    tags: 'drone equipment',
    name: 'Gas Collector Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 15326,
      max: 20735,
      average: 18030
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_s_miningdrone_solid_01_a',
    tags: 'drone equipment',
    name: 'Mining Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 15326,
      max: 20735,
      average: 18030
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_xs_buildingdrone_01_a',
    tags: 'drone equipment',
    name: 'Building Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 9654,
      max: 13061,
      average: 11358
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      },
      {
        time: 3.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 14
          },
          {
            ware: 'ore',
            amount: 20
          },
          {
            ware: 'silicon',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_xs_cargodrone_empty_01_a',
    tags: 'drone equipment',
    name: 'Cargo Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 10028,
      max: 13567,
      average: 11798
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      },
      {
        time: 6.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 36
          },
          {
            ware: 'ore',
            amount: 20
          },
          {
            ware: 'silicon',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_xs_lasertower_01_a',
    tags: 'equipment lasertower',
    name: 'Laser Tower Mk1',
    description: 'Deployed from a compartment of a ship, the laser tower is a static combat unit used primarily in the defence of an area of objective. They use a simple targeting system to turn towards the enemy before firing. Though laser towers can target and hit small ships, they are most effective at medium range against medium or larger targets.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 15326,
      max: 20735,
      average: 18030
    },
    production: [
      {
        time: 1800.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_gen_xs_repairdrone_01_a',
    tags: 'drone equipment',
    name: 'Repair Drone',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 9654,
      max: 13061,
      average: 11358
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      },
      {
        time: 3.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 14
          },
          {
            ware: 'ore',
            amount: 20
          },
          {
            ware: 'silicon',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_destroyer_01_a',
    tags: 'ship',
    name: 'Odysseus Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 5225188,
      max: 7069372,
      average: 6147280
    },
    production: [
      {
        time: 195.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1075
          },
          {
            ware: 'hullparts',
            amount: 4732
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_destroyer_01_b',
    tags: 'ship',
    name: 'Odysseus Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 6275338,
      max: 8490163,
      average: 7382750
    },
    production: [
      {
        time: 234.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1292
          },
          {
            ware: 'hullparts',
            amount: 5683
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_miner_liquid_01_a',
    tags: 'ship',
    name: 'Chthonios (Gas) Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1191479,
      max: 1612001,
      average: 1401740
    },
    production: [
      {
        time: 74.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 407
          },
          {
            ware: 'hullparts',
            amount: 1074
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_miner_liquid_01_b',
    tags: 'ship',
    name: 'Chthonios (Gas) Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1439985,
      max: 1948215,
      average: 1694100
    },
    production: [
      {
        time: 89.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 492
          },
          {
            ware: 'hullparts',
            amount: 1298
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_miner_solid_01_a',
    tags: 'ship',
    name: 'Chthonios (Mineral) Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1191479,
      max: 1612001,
      average: 1401740
    },
    production: [
      {
        time: 74.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 407
          },
          {
            ware: 'hullparts',
            amount: 1074
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_miner_solid_01_b',
    tags: 'ship',
    name: 'Chthonios (Mineral) Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1439985,
      max: 1948215,
      average: 1694100
    },
    production: [
      {
        time: 89.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 492
          },
          {
            ware: 'hullparts',
            amount: 1298
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_trans_container_01_a',
    tags: 'ship',
    name: 'Helios Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2059006,
      max: 2785714,
      average: 2422360
    },
    production: [
      {
        time: 127.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 703
          },
          {
            ware: 'hullparts',
            amount: 1856
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_trans_container_01_b',
    tags: 'ship',
    name: 'Helios Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2487219,
      max: 3365061,
      average: 2926140
    },
    production: [
      {
        time: 154.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 849
          },
          {
            ware: 'hullparts',
            amount: 2242
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_trans_container_02_a',
    tags: 'ship',
    name: 'Selene Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2059006,
      max: 2785714,
      average: 2422360
    },
    production: [
      {
        time: 127.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 703
          },
          {
            ware: 'hullparts',
            amount: 1856
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_l_trans_container_02_b',
    tags: 'ship',
    name: 'Selene Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2487219,
      max: 3365061,
      average: 2926140
    },
    production: [
      {
        time: 154.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 849
          },
          {
            ware: 'hullparts',
            amount: 2242
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_corvette_01_a',
    tags: 'ship',
    name: 'Nemesis Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 647420,
      max: 875921,
      average: 761670
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 111
          },
          {
            ware: 'hullparts',
            amount: 587
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_corvette_01_b',
    tags: 'ship',
    name: 'Nemesis Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 776458,
      max: 1050502,
      average: 913480
    },
    production: [
      {
        time: 24.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 133
          },
          {
            ware: 'hullparts',
            amount: 704
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_frigate_01_a',
    tags: 'ship',
    name: 'Gorgon Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1142638,
      max: 1545922,
      average: 1344280
    },
    production: [
      {
        time: 35.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 196
          },
          {
            ware: 'hullparts',
            amount: 1036
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_frigate_01_b',
    tags: 'ship',
    name: 'Gorgon Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1376456,
      max: 1862264,
      average: 1619360
    },
    production: [
      {
        time: 43.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 236
          },
          {
            ware: 'hullparts',
            amount: 1248
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_miner_liquid_01_a',
    tags: 'ship',
    name: 'Plutus (Gas) Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 136119,
      max: 184161,
      average: 160140
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 69
          },
          {
            ware: 'hullparts',
            amount: 122
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_miner_liquid_01_b',
    tags: 'ship',
    name: 'Plutus (Gas) Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 166269,
      max: 224952,
      average: 195610
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 85
          },
          {
            ware: 'hullparts',
            amount: 149
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_miner_solid_01_a',
    tags: 'ship',
    name: 'Plutus (Mineral) Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 136119,
      max: 184161,
      average: 160140
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 69
          },
          {
            ware: 'hullparts',
            amount: 122
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_miner_solid_01_b',
    tags: 'ship',
    name: 'Plutus (Mineral) Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 166269,
      max: 224952,
      average: 195610
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 85
          },
          {
            ware: 'hullparts',
            amount: 149
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_trans_container_01_a',
    tags: 'ship',
    name: 'Demeter Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 180761,
      max: 244559,
      average: 212660
    },
    production: [
      {
        time: 17.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 92
          },
          {
            ware: 'hullparts',
            amount: 162
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_trans_container_01_b',
    tags: 'ship',
    name: 'Demeter Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 234345,
      max: 317055,
      average: 275700
    },
    production: [
      {
        time: 22.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 120
          },
          {
            ware: 'hullparts',
            amount: 210
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_trans_container_02_a',
    tags: 'ship',
    name: 'Hermes Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 180761,
      max: 244559,
      average: 212660
    },
    production: [
      {
        time: 17.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 92
          },
          {
            ware: 'hullparts',
            amount: 162
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_m_trans_container_02_b',
    tags: 'ship',
    name: 'Hermes Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 234345,
      max: 317055,
      average: 275700
    },
    production: [
      {
        time: 22.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 120
          },
          {
            ware: 'hullparts',
            amount: 210
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_fighter_01_a',
    tags: 'ship',
    name: 'Perseus Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 161237,
      max: 218144,
      average: 189690
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 66
          },
          {
            ware: 'hullparts',
            amount: 145
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_fighter_01_b',
    tags: 'ship',
    name: 'Perseus Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 193477,
      max: 261763,
      average: 227620
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 79
          },
          {
            ware: 'hullparts',
            amount: 174
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_fighter_02_a',
    tags: 'ship',
    name: 'Theseus Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 182376,
      max: 246744,
      average: 214560
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 75
          },
          {
            ware: 'hullparts',
            amount: 164
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_fighter_02_b',
    tags: 'ship',
    name: 'Theseus Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 217940,
      max: 294860,
      average: 256400
    },
    production: [
      {
        time: 16.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 89
          },
          {
            ware: 'hullparts',
            amount: 196
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_miner_solid_01_a',
    tags: 'ship',
    name: 'Tethys (Mineral)',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 85621,
      max: 115840,
      average: 100730
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 35
          },
          {
            ware: 'hullparts',
            amount: 77
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_scout_01_a',
    tags: 'ship',
    name: 'Pegasus Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 82297,
      max: 111343,
      average: 96820
    },
    production: [
      {
        time: 6.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 34
          },
          {
            ware: 'hullparts',
            amount: 74
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_scout_01_b',
    tags: 'ship',
    name: 'Pegasus Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 100079,
      max: 135401,
      average: 117740
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 41
          },
          {
            ware: 'hullparts',
            amount: 90
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_trans_container_01_a',
    tags: 'ship',
    name: 'Tethys Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 154556,
      max: 209105,
      average: 181830
    },
    production: [
      {
        time: 11.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 63
          },
          {
            ware: 'hullparts',
            amount: 139
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_s_trans_container_01_b',
    tags: 'ship',
    name: 'Tethys Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 189023,
      max: 255737,
      average: 222380
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 77
          },
          {
            ware: 'hullparts',
            amount: 170
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_builder_01_a',
    tags: 'ship',
    name: 'Heracles Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 9452145,
      max: 12788196,
      average: 11120170
    },
    production: [
      {
        time: 439.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2428
          },
          {
            ware: 'hullparts',
            amount: 8545
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_builder_01_b',
    tags: 'ship',
    name: 'Heracles Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 11342553,
      max: 15345807,
      average: 13344180
    },
    production: [
      {
        time: 527.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2913
          },
          {
            ware: 'hullparts',
            amount: 10254
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_carrier_01_a',
    tags: 'ship',
    name: 'Zeus Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 13600230,
      max: 18400311,
      average: 16000270
    },
    production: [
      {
        time: 632.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 3493
          },
          {
            ware: 'hullparts',
            amount: 12295
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_carrier_01_b',
    tags: 'ship',
    name: 'Zeus Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 16314739,
      max: 22072882,
      average: 19193810
    },
    production: [
      {
        time: 758.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 4190
          },
          {
            ware: 'hullparts',
            amount: 14749
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_resupplier_01_a',
    name: 'Atlas Vanguard',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 9987509,
      max: 13512512,
      average: 11750010
    },
    production: [
      {
        time: 464.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2565
          },
          {
            ware: 'hullparts',
            amount: 9029
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xl_resupplier_01_b',
    name: 'Atlas Sentinel',
    description: 'No information available',
    group: 'ships_paranid',
    transport: 'ship',
    volume: 1,
    price: {
      min: 11985230,
      max: 16215311,
      average: 14100270
    },
    production: [
      {
        time: 557.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 3078
          },
          {
            ware: 'hullparts',
            amount: 10835
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_par_xs_police_01_a',
    tags: 'ship',
    name: 'Paranid Station Security Vessel',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11182,
      max: 15128,
      average: 13155
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_destroyer_01_a',
    tags: 'ship',
    name: 'Phoenix Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 5476958,
      max: 7410002,
      average: 6443480
    },
    production: [
      {
        time: 204.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1127
          },
          {
            ware: 'hullparts',
            amount: 4960
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_destroyer_01_b',
    tags: 'ship',
    name: 'Phoenix Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 6551401,
      max: 8863660,
      average: 7707530
    },
    production: [
      {
        time: 244.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1349
          },
          {
            ware: 'hullparts',
            amount: 5933
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_miner_liquid_01_a',
    tags: 'ship',
    name: 'Crane (Gas) Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1550927,
      max: 2098313,
      average: 1824620
    },
    production: [
      {
        time: 96.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 530
          },
          {
            ware: 'hullparts',
            amount: 1398
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_miner_liquid_01_b',
    tags: 'ship',
    name: 'Crane (Gas) Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1861551,
      max: 2518569,
      average: 2190060
    },
    production: [
      {
        time: 115.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 636
          },
          {
            ware: 'hullparts',
            amount: 1678
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_miner_solid_01_a',
    tags: 'ship',
    name: 'Crane (Mineral) Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1550927,
      max: 2098313,
      average: 1824620
    },
    production: [
      {
        time: 96.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 530
          },
          {
            ware: 'hullparts',
            amount: 1398
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_miner_solid_01_b',
    tags: 'ship',
    name: 'Crane (Mineral) Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1861551,
      max: 2518569,
      average: 2190060
    },
    production: [
      {
        time: 115.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 636
          },
          {
            ware: 'hullparts',
            amount: 1678
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_trans_container_01_a',
    tags: 'ship',
    name: 'Pelican Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2912143,
      max: 3939958,
      average: 3426050
    },
    production: [
      {
        time: 169.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 935
          },
          {
            ware: 'hullparts',
            amount: 2467
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_trans_container_01_b',
    tags: 'ship',
    name: 'Pelican Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3477920,
      max: 4705421,
      average: 4091670
    },
    production: [
      {
        time: 204.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1127
          },
          {
            ware: 'hullparts',
            amount: 2975
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_trans_container_02_a',
    tags: 'ship',
    name: 'Heron Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2935407,
      max: 3971433,
      average: 3453420
    },
    production: [
      {
        time: 155.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 858
          },
          {
            ware: 'hullparts',
            amount: 2266
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_l_trans_container_02_b',
    tags: 'ship',
    name: 'Heron Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 3533357,
      max: 4780424,
      average: 4156890
    },
    production: [
      {
        time: 185.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1025
          },
          {
            ware: 'hullparts',
            amount: 2705
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_bomber_01_a',
    tags: 'ship',
    name: 'Peregrine Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 765425,
      max: 1035575,
      average: 900500
    },
    production: [
      {
        time: 24.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 131
          },
          {
            ware: 'hullparts',
            amount: 694
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_bomber_01_b',
    tags: 'ship',
    name: 'Peregrine Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 905531,
      max: 1225130,
      average: 1065330
    },
    production: [
      {
        time: 28.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 156
          },
          {
            ware: 'hullparts',
            amount: 821
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_frigate_01_a',
    tags: 'ship',
    name: 'Osprey Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1086377,
      max: 1469804,
      average: 1278090
    },
    production: [
      {
        time: 34.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 186
          },
          {
            ware: 'hullparts',
            amount: 985
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_frigate_01_b',
    tags: 'ship',
    name: 'Osprey Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1314712,
      max: 1778728,
      average: 1546720
    },
    production: [
      {
        time: 41.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 226
          },
          {
            ware: 'hullparts',
            amount: 1192
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_miner_liquid_01_a',
    tags: 'ship',
    name: 'Manorina (Gas) Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 169592,
      max: 229448,
      average: 199520
    },
    production: [
      {
        time: 11.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 62
          },
          {
            ware: 'hullparts',
            amount: 109
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_miner_liquid_01_b',
    tags: 'ship',
    name: 'Manorina (Gas) Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 204196,
      max: 276265,
      average: 240230
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 75
          },
          {
            ware: 'hullparts',
            amount: 132
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_miner_solid_01_a',
    tags: 'ship',
    name: 'Manorina (Mineral) Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 169592,
      max: 229448,
      average: 199520
    },
    production: [
      {
        time: 11.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 62
          },
          {
            ware: 'hullparts',
            amount: 109
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_miner_solid_01_b',
    tags: 'ship',
    name: 'Manorina (Mineral) Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 204196,
      max: 276265,
      average: 240230
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 75
          },
          {
            ware: 'hullparts',
            amount: 132
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_trans_container_01_a',
    tags: 'ship',
    name: 'Vulture Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 272238,
      max: 368322,
      average: 320280
    },
    production: [
      {
        time: 25.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 138
          },
          {
            ware: 'hullparts',
            amount: 244
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_trans_container_01_b',
    tags: 'ship',
    name: 'Vulture Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 315784,
      max: 427237,
      average: 371510
    },
    production: [
      {
        time: 29.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 161
          },
          {
            ware: 'hullparts',
            amount: 283
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_trans_container_02_a',
    tags: 'ship',
    name: 'Tern Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 272238,
      max: 368322,
      average: 320280
    },
    production: [
      {
        time: 25.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 138
          },
          {
            ware: 'hullparts',
            amount: 244
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_m_trans_container_02_b',
    tags: 'ship',
    name: 'Tern Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 315784,
      max: 427237,
      average: 371510
    },
    production: [
      {
        time: 29.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 161
          },
          {
            ware: 'hullparts',
            amount: 283
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_fighter_01_a',
    tags: 'ship',
    name: 'Falcon Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 169014,
      max: 228666,
      average: 198840
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 69
          },
          {
            ware: 'hullparts',
            amount: 152
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_fighter_01_b',
    tags: 'ship',
    name: 'Falcon Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 201255,
      max: 272286,
      average: 236770
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 82
          },
          {
            ware: 'hullparts',
            amount: 181
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_fighter_02_a',
    tags: 'ship',
    name: 'Buzzard Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 162333,
      max: 219627,
      average: 190980
    },
    production: [
      {
        time: 12.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 66
          },
          {
            ware: 'hullparts',
            amount: 146
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_fighter_02_b',
    tags: 'ship',
    name: 'Buzzard Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 195704,
      max: 264776,
      average: 230240
    },
    production: [
      {
        time: 14.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 80
          },
          {
            ware: 'hullparts',
            amount: 176
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_miner_solid_01_a',
    tags: 'ship',
    name: 'Magpie (Mineral)',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 93398,
      max: 126362,
      average: 109880
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 38
          },
          {
            ware: 'hullparts',
            amount: 84
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_scout_01_a',
    tags: 'ship',
    name: 'Kestrel Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 94529,
      max: 127892,
      average: 111210
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 39
          },
          {
            ware: 'hullparts',
            amount: 85
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_scout_01_b',
    tags: 'ship',
    name: 'Kestrel Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 113441,
      max: 153479,
      average: 133460
    },
    production: [
      {
        time: 8.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 47
          },
          {
            ware: 'hullparts',
            amount: 102
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_scout_02_a',
    tags: 'ship',
    name: 'Guillemot Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 143455,
      max: 194086,
      average: 168770
    },
    production: [
      {
        time: 11.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 59
          },
          {
            ware: 'hullparts',
            amount: 129
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_scout_02_b',
    tags: 'ship',
    name: 'Guillemot Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 171241,
      max: 231679,
      average: 201460
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 70
          },
          {
            ware: 'hullparts',
            amount: 154
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_trans_container_01_a',
    tags: 'ship',
    name: 'Magpie Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 173468,
      max: 234692,
      average: 204080
    },
    production: [
      {
        time: 13.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 71
          },
          {
            ware: 'hullparts',
            amount: 156
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_s_trans_container_01_b',
    tags: 'ship',
    name: 'Magpie Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 205709,
      max: 278312,
      average: 242010
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 84
          },
          {
            ware: 'hullparts',
            amount: 185
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_builder_01_a',
    tags: 'ship',
    name: 'Albatross Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 9452145,
      max: 12788196,
      average: 11120170
    },
    production: [
      {
        time: 439.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2428
          },
          {
            ware: 'hullparts',
            amount: 8545
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_builder_01_b',
    tags: 'ship',
    name: 'Albatross Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 11342553,
      max: 15345807,
      average: 13344180
    },
    production: [
      {
        time: 527.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2913
          },
          {
            ware: 'hullparts',
            amount: 10254
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_carrier_01_a',
    tags: 'ship',
    name: 'Condor Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 11572631,
      max: 15657089,
      average: 13614860
    },
    production: [
      {
        time: 538.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2972
          },
          {
            ware: 'hullparts',
            amount: 10462
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_carrier_01_b',
    tags: 'ship',
    name: 'Condor Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 13892256,
      max: 18795405,
      average: 16343830
    },
    production: [
      {
        time: 645.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 3568
          },
          {
            ware: 'hullparts',
            amount: 12559
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_resupplier_01_a',
    name: 'Stork Vanguard',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 8065030,
      max: 10911511,
      average: 9488270
    },
    production: [
      {
        time: 375.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2072
          },
          {
            ware: 'hullparts',
            amount: 7291
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xl_resupplier_01_b',
    name: 'Stork Sentinel',
    description: 'No information available',
    group: 'ships_teladi',
    transport: 'ship',
    volume: 1,
    price: {
      min: 9678899,
      max: 13094981,
      average: 11386940
    },
    production: [
      {
        time: 450.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 2486
          },
          {
            ware: 'hullparts',
            amount: 8750
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xs_police_01_a',
    tags: 'drone equipment',
    name: 'Teladi Station Security Vessel A',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11182,
      max: 15128,
      average: 13155
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xs_police_02_a',
    tags: 'drone equipment',
    name: 'Teladi Station Security Vessel B',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11182,
      max: 15128,
      average: 13155
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_tel_xs_police_03_a',
    tags: 'drone equipment',
    name: 'Teladi Station Security Vessel C',
    description: 'No information available',
    group: 'drones',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11182,
      max: 15128,
      average: 13155
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'dronecomponents',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'smartchips',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_m_fighter_01_a',
    tags: 'ship',
    name: 'P',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 33414,
      max: 45207,
      average: 39310
    },
    production: [
      {
        time: 17.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 94
          },
          {
            ware: 'ore',
            amount: 79
          },
          {
            ware: 'silicon',
            amount: 79
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_m_miner_01_a',
    tags: 'ship',
    name: 'S',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 30324,
      max: 41026,
      average: 35675
    },
    production: [
      {
        time: 15.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 85
          },
          {
            ware: 'ore',
            amount: 71
          },
          {
            ware: 'silicon',
            amount: 72
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_s_fighter_01_a',
    tags: 'ship',
    name: 'N',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 14675,
      max: 19855,
      average: 17265
    },
    production: [
      {
        time: 7.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 41
          },
          {
            ware: 'ore',
            amount: 34
          },
          {
            ware: 'silicon',
            amount: 35
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_s_fighter_02_a',
    tags: 'ship',
    name: 'M',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 16932,
      max: 22908,
      average: 19920
    },
    production: [
      {
        time: 9.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 48
          },
          {
            ware: 'ore',
            amount: 40
          },
          {
            ware: 'silicon',
            amount: 40
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_xl_carrier_01_a',
    tags: 'ship',
    name: 'I',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 2150466,
      max: 2909454,
      average: 2529960
    },
    production: [
      {
        time: 1094.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 6049
          },
          {
            ware: 'ore',
            amount: 5070
          },
          {
            ware: 'silicon',
            amount: 5090
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'ship_xen_xl_destroyer_01_a',
    tags: 'ship',
    name: 'K',
    description: 'No information available',
    group: 'ships_xenon',
    transport: 'ship',
    volume: 1,
    price: {
      min: 1033787,
      max: 1398653,
      average: 1216220
    },
    production: [
      {
        time: 526.0,
        amount: 1,
        method: 'default',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 2908
          },
          {
            ware: 'ore',
            amount: 2437
          },
          {
            ware: 'silicon',
            amount: 2447
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'silicon',
    tags: 'economy minable mineral solid',
    name: 'Silicon',
    description: 'Silicon, required for the production of the most common types of silicon wafers, is usually mined or harvested from asteroids or other uninhabited celestial bodies.',
    group: 'minerals',
    factoryName: 'Silicon Mine',
    transport: 'solid',
    volume: 10,
    price: {
      min: 111,
      max: 150,
      average: 130
    },
    production: [],
    icon: {
      active: 'ware_silicon'
    }
  },
  {
    id: 'siliconwafers',
    tags: 'container economy',
    name: 'Silicon Wafers',
    description: 'If a technology requires any kind of chip, it is highly lightly that is uses silicon wafers. Light, efficient and cheap to produce, these wafers are usually layered or constructed in hexagonal meshes to allow for quick transfer of data across a component.',
    group: 'refined',
    factoryName: 'Silicon Refinery',
    transport: 'container',
    volume: 18,
    price: {
      min: 269,
      max: 329,
      average: 299
    },
    production: [
      {
        time: 180.0,
        amount: 120,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 90
          },
          {
            ware: 'silicon',
            amount: 240
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_siliconwafers'
    }
  },
  {
    id: 'smartchips',
    tags: 'container economy',
    name: 'Smart Chips',
    description: 'A specialised form of microchip that contains a small amount of heuristic programming, these chips cannot allow a system to learn, but can allow for small, snap intelligent decision-making that assists in targeting systems and makes autonomous piloting more accurate. These chips are primarily used in guided missiles and drones.',
    group: 'shiptech',
    factoryName: 'Smart Chip Factory',
    transport: 'container',
    volume: 5,
    price: {
      min: 176,
      max: 215,
      average: 195
    },
    production: [
      {
        time: 600.0,
        amount: 80,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 50
          },
          {
            ware: 'siliconwafers',
            amount: 20
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_smartchips'
    }
  },
  {
    id: 'software_dockmk1',
    tags: 'equipment software',
    name: 'Docking Computer Mk1',
    description: 'This flight software automates the final stages of the docking procedure.',
    group: 'software',
    factoryName: 'Docking Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_dockmk2',
    tags: 'equipment software',
    name: 'Docking Computer Mk2',
    description: 'This flight software increases the range at which the docking procedure can be automated.',
    group: 'software',
    factoryName: 'Docking Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 24576,
      max: 40960,
      average: 32768
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_economymk1',
    name: 'Economy Analytics Software Mk1',
    description: 'No information available',
    group: 'software',
    factoryName: 'Economy Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_flightassistmk1',
    tags: 'equipment software',
    name: 'Flight Assist Software Mk1',
    description: 'This flight software assists a pilot by automatically compensating for drift when changing flight direction.',
    group: 'software',
    factoryName: 'Flight Assist Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 6825,
      max: 11375,
      average: 9100
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_hackerspacesuitmk1',
    tags: 'disallowdrop inventory noblueprint noplayerblueprint personalupgrade',
    name: 'Hacking Tool',
    group: 'software',
    factoryName: 'Spacesuit Software',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_oxygenspacesuitmk1',
    tags: 'disallowdrop inventory noblueprint noplayerblueprint personalupgrade',
    name: 'Oxygen Upgrade',
    group: 'software',
    factoryName: 'Spacesuit Software',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_scannerlongrangemk1',
    tags: 'equipment scanner software',
    name: 'Long-range Scanner Software Mk1',
    description: 'This scanning software provides a means to detect objects at great distances.',
    group: 'software',
    factoryName: 'Long-Range Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 29274,
      max: 35779,
      average: 32526
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_scannerlongrangemk2',
    tags: 'equipment scanner software',
    name: 'Long-range Scanner Software Mk2',
    description: 'This scanning software increases scan resolution, allowing more accurate identification of certain types of objects.',
    group: 'software',
    factoryName: 'Long-Range Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 58547,
      max: 71558,
      average: 65052
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_scannerminingmk1',
    tags: 'noblueprint noplayerblueprint scanner',
    name: 'Mining Scanner Software Mk1',
    description: 'No information available',
    group: 'software',
    factoryName: 'Mining Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21814,
      max: 26661,
      average: 24238
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_scannerminingmk2',
    tags: 'noblueprint noplayerblueprint scanner',
    name: 'Mining Scanner Software Mk2',
    description: 'No information available',
    group: 'software',
    factoryName: 'Mining Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 65096,
      max: 79562,
      average: 72329
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_scannerobjectmk1',
    tags: 'equipment scanner software',
    name: 'Basic Scanner',
    description: 'This scanning software provides basic identification of nearby objects.',
    group: 'software',
    factoryName: 'Object Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 10907,
      max: 13331,
      average: 12119
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_scannerobjectmk2',
    tags: 'equipment scanner software',
    name: 'Police Scanner',
    description: 'This scanning software allows a pilot to inspect the contents of the cargo hold of another ship. Its use is illegal unless an appropriate police licence has been obtained.',
    group: 'software',
    factoryName: 'Object Scanner Software',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 36733,
      max: 44896,
      average: 40815
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_scannerobjectmk3',
    tags: 'disallowdrop equipment inventory personalupgrade scanner software',
    name: 'Spacesuit Scanner',
    description: 'This scanning software is used to penetrate even military-grade shielded targets and obtain information. It has a very short range and can only be used while in a space suit. Its use is illegal, with or without a police licence.',
    group: 'software',
    factoryName: 'Spacesuit Software',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 800,
      max: 1200,
      average: 1000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_targetmk1',
    tags: 'equipment software',
    name: 'Targeting Computer Extension Mk1',
    description: 'This targeting software allows a ship\'s targeting system to lock on to small objects such as debris and floating containers.',
    group: 'software',
    factoryName: 'Targeting Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 6144,
      max: 10240,
      average: 8192
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_targetmk2',
    name: 'Targeting Computer Extension Mk2',
    description: 'No information available',
    group: 'software',
    factoryName: 'Targeting Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_trademk1',
    tags: 'equipment software',
    name: 'Trading Computer Extension Mk1',
    description: 'This trading software maintains a link to potential buyers and sellers for a limited time, to provide current trade offer information.',
    group: 'software',
    factoryName: 'Trading Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 8438,
      max: 14063,
      average: 11250
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ],
    icon: {}
  },
  {
    id: 'software_trademk2',
    name: 'Trading Computer Extension Mk2',
    description: 'No information available',
    group: 'software',
    factoryName: 'Trading Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: [],
    icon: {}
  },
  {
    id: 'software_trademk3',
    name: 'Trading Computer Extension Mk3',
    description: 'No information available',
    group: 'software',
    factoryName: 'Trading Software',
    transport: 'software',
    volume: 1,
    price: {
      min: 5000,
      max: 10000,
      average: 7500
    },
    production: [],
    icon: {}
  },
  {
    id: 'sojabeans',
    tags: 'container economy',
    name: 'Soja Beans',
    description: 'A small bean grown all across Paranid space, the soja bean add flavour and nutritional value to the soja husk; the Paranids\' primary food source. While this is its primary purpose, on many Paranid colonies it is also dried and ground into a powder and mixed with water, creating a flavoured and healthy drink that provides Paranid with ample energy.',
    group: 'agricultural',
    factoryName: 'Soja Bean Farm',
    transport: 'container',
    volume: 5,
    price: {
      min: 88,
      max: 132,
      average: 110
    },
    production: [
      {
        time: 300.0,
        amount: 120,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'water',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      }
    ],
    icon: {
      active: 'ware_sojabeans'
    }
  },
  {
    id: 'sojahusk',
    tags: 'container economy',
    name: 'Soja Husk',
    description: 'A Paranid dish; soja beans that have been crushed into a paste and mixed with the flesh of the maja snail, then served in a maja snail shell, soja husk is accepted as both a tasteful and nutritious meal by the Paranid, though there are few non-Paranid who have dared try it.',
    group: 'food',
    factoryName: 'Soja Husk Factory',
    transport: 'container',
    volume: 1,
    price: {
      min: 50,
      max: 83,
      average: 66
    },
    production: [
      {
        time: 300.0,
        amount: 320,
        method: 'default',
        name: 'Paranid',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'majasnails',
            amount: 40
          },
          {
            ware: 'sojabeans',
            amount: 40
          },
          {
            ware: 'spices',
            amount: 20
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.22
          }
        ]
      }
    ],
    icon: {
      active: 'ware_sojahusk'
    }
  },
  {
    id: 'spacefuel',
    tags: 'container economy',
    name: 'Spacefuel',
    description: 'Spacefuel is made from processing and distilling wheat, water and a blend of spices. It is a cheap but strong alcoholic beverage that has been made illegal to trade in bulk across the Jump Gate network in an attempt to avoid drunken accidents on both ships and stations. In order to sell spacefuel as a beverage, one must be a licenced bar owner.',
    group: 'pharmaceutical',
    factoryName: 'Spacefuel Factory',
    transport: 'container',
    volume: 2,
    price: {
      min: 106,
      max: 319,
      average: 213
    },
    production: [
      {
        time: 480.0,
        amount: 120,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'water',
            amount: 100
          },
          {
            ware: 'wheat',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.38
          }
        ]
      }
    ],
    icon: {
      active: 'ware_spacefuel'
    }
  },
  {
    id: 'spaceweed',
    tags: 'container economy',
    name: 'Spaceweed',
    description: 'While seen as part of every-day life in Teladi society, spaceweed has been made illegal in both Argon and Paranid space, as it is seen as a dangerous narcotic. This point is argued heavily by many of those who partake in the drug, which is usually dried, crushed and then smoked, but attempts to legalise it have as of yet failed.',
    group: 'pharmaceutical',
    factoryName: 'Spaceweed Farm',
    transport: 'container',
    volume: 3,
    price: {
      min: 176,
      max: 529,
      average: 352
    },
    production: [
      {
        time: 600.0,
        amount: 225,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 140
          },
          {
            ware: 'spices',
            amount: 40
          },
          {
            ware: 'swampplant',
            amount: 120
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.38
          }
        ]
      }
    ],
    icon: {
      active: 'ware_spaceweed'
    }
  },
  {
    id: 'spices',
    tags: 'container economy',
    name: 'Spices',
    description: 'Spices are used in many food and pharmaceutical products; primarily as an agent to add extra flavour, but also sometimes due to other properties that some are known to have, ranging from acting as a relaxant to a mild hallucinogenic. Factories that legally produce spices are commonly inspected to make sure their produce is in line with the local law, but as they are often shipped as a mixture, it is sometimes difficult to keep an eye on which spice is being used for which purpose.',
    group: 'agricultural',
    factoryName: 'Spice Farm',
    transport: 'container',
    volume: 3,
    price: {
      min: 30,
      max: 46,
      average: 38
    },
    production: [
      {
        time: 600.0,
        amount: 480,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'water',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.4
          }
        ]
      }
    ],
    icon: {
      active: 'ware_spices'
    }
  },
  {
    id: 'sunriseflowers',
    tags: 'container economy',
    name: 'Sunrise Flowers',
    description: 'Known to grow naturally only on Ianamus Zura, the Teladi mastered the art of bio-engineering a near-identical but still artificially grown sunrise flower long ago. When squeezed, the leaves of the sunrise flower produce a bitter-tasting oil that while despised by other species, the Teladi appreciate as an adequate food source.',
    group: 'agricultural',
    factoryName: 'Sunrise Flower Farm',
    transport: 'container',
    volume: 5,
    price: {
      min: 105,
      max: 158,
      average: 132
    },
    production: [
      {
        time: 300.0,
        amount: 100,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'water',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      }
    ],
    icon: {
      active: 'ware_sunriseflowers'
    }
  },
  {
    id: 'superfluidcoolant',
    tags: 'container economy',
    name: 'Superfluid Coolant',
    description: 'Designed with superfluidity to ensure both efficiency and endurance, this coolant is used in complex technical components such as plasma conductors and quantum tubes to protect said components from overheating. The losslessness of kinetic energy afforded by the coolant\'s superfluidity means that it can continue to circulate around the component for a much longer time before needing to be recycled. This has led to such components lifetimes being greatly increased.',
    group: 'refined',
    factoryName: 'Helium Refinery',
    transport: 'container',
    volume: 16,
    price: {
      min: 135,
      max: 165,
      average: 150
    },
    production: [
      {
        time: 240.0,
        amount: 110,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'helium',
            amount: 320
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      }
    ],
    icon: {
      active: 'ware_superfluidcoolant'
    }
  },
  {
    id: 'swampplant',
    tags: 'container economy',
    name: 'Swamp Plant',
    description: 'Cultivated in a warm and humid environment, swamp plant is a small moss-like plant known to have mildly narcotic properties; the reason it is dried and crushed to be used as space weed. Though it is widely known that swamp plant is the main ingredient of a drug made illegal throughout non-Teladi space, producing and trading it itself is not illegal, as it is only in the processing of the plant that the narcotic properties can be unlocked.',
    group: 'agricultural',
    factoryName: 'Swamp Plant Farm',
    transport: 'container',
    volume: 6,
    price: {
      min: 104,
      max: 173,
      average: 138
    },
    production: [
      {
        time: 450.0,
        amount: 120,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'water',
            amount: 100
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.33
          }
        ]
      }
    ],
    icon: {
      active: 'ware_swampplant'
    }
  },
  {
    id: 'teladianium',
    tags: 'container economy',
    name: 'Teladianium',
    description: 'Teladianium is a hard, tough material used by the Teladi for station and, more commonly, ship construction. A lighter compound than the refined metals used in other races\' vessels, Teladianium is traditionally made from chemically treated Teladian mud. However, as the necessary chemicals are rarely found in space, and expensive to produce, the Teladi often replace them with the raw minerals found in asteroids.',
    group: 'refined',
    factoryName: 'Teladianium Foundry',
    transport: 'container',
    volume: 16,
    price: {
      min: 182,
      max: 223,
      average: 202
    },
    production: [
      {
        time: 120.0,
        amount: 80,
        method: 'default',
        name: 'Teladi',
        wares: [
          {
            ware: 'energycells',
            amount: 45
          },
          {
            ware: 'ore',
            amount: 280
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_teladianium'
    }
  },
  {
    id: 'thruster_gen_l_allround_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'L All-round Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 253435,
      max: 309754,
      average: 281595
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 120
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 48
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 324
          },
          {
            ware: 'silicon',
            amount: 324
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_l_allround_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'L All-round Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1266139,
      max: 1547503,
      average: 1406821
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 600
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 240
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 648
          },
          {
            ware: 'silicon',
            amount: 648
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_l_allround_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'L All-round Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6328619,
      max: 7734979,
      average: 7031799
    },
    production: [
      {
        time: 20.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3000
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 1200
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'ore',
            amount: 1296
          },
          {
            ware: 'silicon',
            amount: 1296
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_allround_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M All-round Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 11717,
      max: 14321,
      average: 13019
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 4
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 15
          },
          {
            ware: 'silicon',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_allround_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M All-round Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 58067,
      max: 70971,
      average: 64519
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 20
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 30
          },
          {
            ware: 'silicon',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_allround_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M All-round Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 289300,
      max: 353589,
      average: 321445
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 100
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 100
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 60
          },
          {
            ware: 'silicon',
            amount: 60
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_combat_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M Combat Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 14899,
      max: 18210,
      average: 16555
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 19
          },
          {
            ware: 'silicon',
            amount: 19
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_combat_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M Combat Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 73978,
      max: 90418,
      average: 82198
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 30
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 20
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 38
          },
          {
            ware: 'silicon',
            amount: 38
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_m_combat_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'M Combat Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 368854,
      max: 450821,
      average: 409838
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 150
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 100
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 76
          },
          {
            ware: 'silicon',
            amount: 76
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_allround_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S All-round Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 5353,
      max: 6542,
      average: 5948
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'engineparts',
            amount: 4
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 7
          },
          {
            ware: 'silicon',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_allround_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S All-round Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 83968,
      max: 102627,
      average: 93298
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 40
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 14
          },
          {
            ware: 'silicon',
            amount: 14
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_allround_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S All-round Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 199757,
      max: 244147,
      average: 221952
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 60
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 80
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 28
          },
          {
            ware: 'silicon',
            amount: 28
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_combat_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S Combat Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6241,
      max: 7628,
      average: 6934
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'engineparts',
            amount: 1
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 8
          },
          {
            ware: 'silicon',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_combat_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S Combat Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 39752,
      max: 48586,
      average: 44169
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 12
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 16
          },
          {
            ware: 'silicon',
            amount: 16
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_s_combat_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'S Combat Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 157946,
      max: 193045,
      average: 175495
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 50
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 60
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 32
          },
          {
            ware: 'silicon',
            amount: 32
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_xl_allround_01_mk1',
    tags: 'equipment noplayerblueprint thruster',
    name: 'XL All-round Thrusters Mk1',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 538346,
      max: 657978,
      average: 598162
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 260
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'engineparts',
            amount: 96
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 687
          },
          {
            ware: 'silicon',
            amount: 687
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_xl_allround_01_mk2',
    tags: 'equipment noplayerblueprint thruster',
    name: 'XL All-round Thrusters Mk2',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 2690693,
      max: 3288625,
      average: 2989659
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 1300
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'engineparts',
            amount: 480
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'ore',
            amount: 1374
          },
          {
            ware: 'silicon',
            amount: 1374
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'thruster_gen_xl_allround_01_mk3',
    tags: 'equipment noplayerblueprint thruster',
    name: 'XL All-round Thrusters Mk3',
    description: 'No information available',
    group: 'thrusters',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13451392,
      max: 16440590,
      average: 14945991
    },
    production: [
      {
        time: 30.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'antimatterconverters',
            amount: 6500
          },
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'engineparts',
            amount: 2400
          }
        ],
        effects: []
      },
      {
        time: 10.0,
        amount: 1,
        method: 'xenon',
        name: 'Xenon',
        wares: [
          {
            ware: 'energycells',
            amount: 40
          },
          {
            ware: 'ore',
            amount: 2748
          },
          {
            ware: 'silicon',
            amount: 2748
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turretcomponents',
    tags: 'container economy stationbuilding',
    name: 'Turret Components',
    description: 'After the unification of the design process in station and capital ship weapon systems, many different turrets can be built from different configurations of these turret components.',
    group: 'shiptech',
    factoryName: 'Turret Component Factory',
    transport: 'container',
    volume: 20,
    price: {
      min: 609,
      max: 913,
      average: 761
    },
    production: [
      {
        time: 1800.0,
        amount: 200,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'microchips',
            amount: 20
          },
          {
            ware: 'quantumtubes',
            amount: 20
          },
          {
            ware: 'scanningarrays',
            amount: 10
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.3
          }
        ]
      }
    ],
    icon: {
      active: 'ware_turretcomponents'
    }
  },
  {
    id: 'turret_arg_l_beam_01_mk1',
    tags: 'equipment turret',
    name: 'ARG L Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 135464,
      max: 165567,
      average: 150515
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_l_dumbfire_01_mk1',
    tags: 'equipment turret',
    name: 'ARG L Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 67905,
      max: 82995,
      average: 75450
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 9
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_l_guided_01_mk1',
    tags: 'equipment turret',
    name: 'ARG L Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 78261,
      max: 95652,
      average: 86957
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_l_laser_01_mk1',
    tags: 'equipment turret',
    name: 'ARG L Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 52289,
      max: 63909,
      average: 58099
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 4
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_l_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG L Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49166,
      max: 60092,
      average: 54629
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 21
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_l_plasma_01_mk1',
    tags: 'equipment turret',
    name: 'ARG L Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 93055,
      max: 113734,
      average: 103395
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 39
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_beam_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Beam Turret Mk1',
    description: 'Beam Turret',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45385,
      max: 55471,
      average: 50428
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_beam_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45385,
      max: 55471,
      average: 50428
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_dumbfire_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'ARG M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_dumbfire_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_gatling_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24665,
      max: 30147,
      average: 27406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_gatling_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22857,
      max: 27936,
      average: 25397
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_guided_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'ARG M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26317,
      max: 32166,
      average: 29242
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_guided_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26317,
      max: 32166,
      average: 29242
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21378,
      max: 26128,
      average: 23753
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_laser_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21378,
      max: 26128,
      average: 23753
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16446,
      max: 20101,
      average: 18274
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_mining_02_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16446,
      max: 20101,
      average: 18274
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_plasma_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31249,
      max: 38193,
      average: 34721
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_plasma_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31249,
      max: 38193,
      average: 34721
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_shotgun_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'ARG M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22857,
      max: 27936,
      average: 25397
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_arg_m_shotgun_02_mk1',
    tags: 'equipment turret',
    name: 'ARG M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24665,
      max: 30147,
      average: 27406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_beam_01_mk1',
    tags: 'equipment turret',
    name: 'PAR L Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 135464,
      max: 165567,
      average: 150515
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_dumbfire_01_mk1',
    tags: 'equipment turret',
    name: 'PAR L Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 67905,
      max: 82995,
      average: 75450
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 9
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_guided_01_mk1',
    tags: 'equipment turret',
    name: 'PAR L Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 78261,
      max: 95652,
      average: 86957
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_laser_01_mk1',
    tags: 'equipment turret',
    name: 'PAR L Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 52289,
      max: 63909,
      average: 58099
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 4
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR L Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49166,
      max: 60092,
      average: 54629
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 21
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_l_plasma_01_mk1',
    tags: 'equipment turret',
    name: 'PAR L Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 93055,
      max: 113734,
      average: 103395
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 39
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_beam_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45385,
      max: 55471,
      average: 50428
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_beam_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24665,
      max: 30147,
      average: 27406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_dumbfire_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'PAR M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_dumbfire_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31249,
      max: 38193,
      average: 34721
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_gatling_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24665,
      max: 30147,
      average: 27406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_gatling_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26317,
      max: 32166,
      average: 29242
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_guided_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'PAR M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26317,
      max: 32166,
      average: 29242
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_guided_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45385,
      max: 55471,
      average: 50428
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21378,
      max: 26128,
      average: 23753
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_laser_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16446,
      max: 20101,
      average: 18274
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16446,
      max: 20101,
      average: 18274
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_mining_02_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22857,
      max: 27936,
      average: 25397
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_plasma_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31249,
      max: 38193,
      average: 34721
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_plasma_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21378,
      max: 26128,
      average: 23753
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_shotgun_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'PAR M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22857,
      max: 27936,
      average: 25397
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_par_m_shotgun_02_mk1',
    tags: 'equipment turret',
    name: 'PAR M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25406
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_beam_01_mk1',
    tags: 'equipment turret',
    name: 'TEL L Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 135460,
      max: 165562,
      average: 150511
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 18
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_dumbfire_01_mk1',
    tags: 'equipment turret',
    name: 'TEL L Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 67903,
      max: 82992,
      average: 75447
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 9
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_guided_01_mk1',
    tags: 'equipment turret',
    name: 'TEL L Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 78257,
      max: 95647,
      average: 86952
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_laser_01_mk1',
    tags: 'equipment turret',
    name: 'TEL L Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 52286,
      max: 63906,
      average: 58096
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 4
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL L Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 49163,
      max: 60088,
      average: 54626
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 21
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_l_plasma_01_mk1',
    tags: 'equipment turret',
    name: 'TEL L Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 93050,
      max: 113728,
      average: 103389
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 39
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_beam_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45384,
      max: 55469,
      average: 50426
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_beam_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 45384,
      max: 55469,
      average: 50426
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_dumbfire_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'TEL M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25405
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_dumbfire_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Dumbfire Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22865,
      max: 27946,
      average: 25405
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_gatling_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24664,
      max: 30145,
      average: 27404
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_gatling_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Bolt Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22856,
      max: 27935,
      average: 25395
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_guided_01_mk1',
    tags: 'noplayerblueprint turret',
    name: 'TEL M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26316,
      max: 32164,
      average: 29240
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_guided_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Tracking Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 26316,
      max: 32164,
      average: 29240
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21376,
      max: 26127,
      average: 23752
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_laser_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 21376,
      max: 26127,
      average: 23752
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_mining_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16445,
      max: 20100,
      average: 18273
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_mining_02_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Mining Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16445,
      max: 20100,
      average: 18273
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_plasma_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31247,
      max: 38191,
      average: 34719
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_plasma_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Plasma Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 31247,
      max: 38191,
      average: 34719
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'turretcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_shotgun_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'TEL M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22856,
      max: 27935,
      average: 25395
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_tel_m_shotgun_02_mk1',
    tags: 'equipment turret',
    name: 'TEL M Shard Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24664,
      max: 30145,
      average: 27404
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'turretcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_xen_l_laser_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'XEN L Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13392,
      max: 16368,
      average: 14880
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 25
          },
          {
            ware: 'ore',
            amount: 15
          },
          {
            ware: 'silicon',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_xen_m_beam_02_mk1',
    tags: 'equipment turret',
    name: 'XEN M Beam Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 23242,
      max: 28406,
      average: 25824
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 29
          },
          {
            ware: 'silicon',
            amount: 29
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_xen_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint turret',
    name: 'XEN M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 23242,
      max: 28406,
      average: 25824
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 29
          },
          {
            ware: 'silicon',
            amount: 29
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'turret_xen_m_laser_02_mk1',
    tags: 'equipment turret',
    name: 'XEN M Pulse Turret Mk1',
    description: 'No information available',
    group: 'turrets',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 23242,
      max: 28406,
      average: 25824
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 29
          },
          {
            ware: 'silicon',
            amount: 29
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'water',
    tags: 'container economy',
    name: 'Water',
    description: 'Essential to all known biological life forms, water has never become much of a catalyst for dispute amongst species, owing to its ubiquity in space. It is being used somewhere in the manufacturing process of nearly all goods available across space; especially, however, in the production of edible goods.',
    group: 'water',
    factoryName: 'Ice Refinery',
    transport: 'container',
    volume: 6,
    price: {
      min: 48,
      max: 58,
      average: 53
    },
    production: [
      {
        time: 120.0,
        amount: 220,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'ice',
            amount: 320
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.25
          }
        ]
      }
    ],
    icon: {
      active: 'ware_water'
    }
  },
  {
    id: 'waypointmarker_01',
    tags: 'equipment navbeacon',
    name: 'Nav Beacon',
    description: 'Nav beacons remain the last and best ally of the lost pilot. Once deployed, the beacon will emit a light strong enough to cut through even the thickest nebula, and at a frequency that can be seldom missed. They are often dropped strategically throughout dangerous parts of space, to designate a safe route, or intermittently in heavy nebulas to guarantee that even the worst pilot has a chance of finding their way back home.',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1131,
      max: 1530,
      average: 1330
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 1
          },
          {
            ware: 'hullparts',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weaponcomponents',
    tags: 'container economy',
    name: 'Weapon Components',
    description: 'Made up from such things as trigger and reloading mechanisms, chambers and barrels, weapon components make up the mechanical part of all ship weapons. Combined with specialised advanced electronics, a number of different weapons can be made from the modular components, also across different size ranges. Shipped to shipyards and equipment docks as a single package, these components can then be put together relatively quickly and easily to make any weapon for the final customer on-demand.',
    group: 'shiptech',
    factoryName: 'Weapon Component Factory',
    transport: 'container',
    volume: 20,
    price: {
      min: 586,
      max: 879,
      average: 733
    },
    production: [
      {
        time: 1800.0,
        amount: 200,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 60
          },
          {
            ware: 'hullparts',
            amount: 20
          },
          {
            ware: 'plasmaconductors',
            amount: 30
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.3
          }
        ]
      }
    ],
    icon: {
      active: 'ware_weaponcomponents'
    }
  },
  {
    id: 'weapon_arg_l_destroyer_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'Behemoth Main Battery',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 936709,
      max: 1144866,
      average: 1040788
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 140
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 170
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_arg_m_ion_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Ion Blaster Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 25550,
      max: 31228,
      average: 28389
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_arg_m_ion_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Ion Blaster Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 127231,
      max: 155505,
      average: 141368
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 35
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_arg_s_ion_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Ion Blaster Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 8104,
      max: 9905,
      average: 9005
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_arg_s_ion_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Ion Blaster Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 40003,
      max: 48893,
      average: 44448
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_mine_01',
    tags: 'equipment mine noplayerblueprint',
    name: 'Mine',
    description: 'Mines are a commonly-used static combat tool that explode and cause massive hull damage under a number of circumstances. Some explode on contact, some when a target comes within a certain range. Some even track their targets and can be programmed to recognise friend from foe.',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 4843,
      max: 6552,
      average: 5698
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_mine_02',
    tags: 'equipment mine noplayerblueprint',
    name: 'Tracker Mine',
    description: 'Tracker Mines are deadly devices that have two phases of operation. In the detection phase, the mine detects a valid target within outer detection range and initiates a limited manoeuvre to intercept the target. When it is deemed close enough to trigger, the second detection phase sees the mine\'s explosive payload detonate. Tracker Mines are less effective at chasing fast and agile targets, but can be incredibly dangerous when used in number or against larger and less agile targets.',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 9055,
      max: 12250,
      average: 10653
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 7
          },
          {
            ware: 'smartchips',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_mine_03',
    tags: 'equipment mine noplayerblueprint',
    name: 'Friend/Foe Mine',
    description: 'Friend/Foe Mines are equipped with specialist software that allows the user to program the mine not to respond to friendly targets. This is usually achieved over comm-frequency identification, and friendly targets must stay informed of changes to the frequency as not to accidentally fall foul of the mine\'s dangerous payload - this in of itself is almost always an automated process.',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 17478,
      max: 23647,
      average: 20563
    },
    production: [
      {
        time: 60.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 11
          },
          {
            ware: 'smartchips',
            amount: 30
          },
          {
            ware: 'weaponcomponents',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_beam_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Beam Emitter Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 25530,
      max: 31203,
      average: 28367
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_beam_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Beam Emitter Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 127132,
      max: 155383,
      average: 141257
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_dumbfire_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Dumbfire Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22558,
      max: 27571,
      average: 25064
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_dumbfire_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Dumbfire Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 111753,
      max: 136587,
      average: 124170
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_gatling_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Bolt Repeater Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 23928,
      max: 29245,
      average: 26586
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 12
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_gatling_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Bolt Repeater Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 119121,
      max: 145592,
      average: 132356
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 60
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_guided_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Tracking Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 44770,
      max: 54719,
      average: 49745
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 6
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_guided_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Tracking Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 222815,
      max: 272330,
      average: 247572
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 30
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Pulse Laser Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 20763,
      max: 25377,
      average: 23070
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_laser_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Pulse Laser Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 103297,
      max: 126252,
      average: 114775
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 50
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_mining_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Mining Drill Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16016,
      max: 19575,
      average: 17796
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 7
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_mining_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Mining Drill Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 79562,
      max: 97243,
      average: 88402
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 35
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_plasma_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Plasma Cannon Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 30277,
      max: 37005,
      average: 33641
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 13
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_plasma_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Plasma Cannon Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 150867,
      max: 184393,
      average: 167630
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 65
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_shotgun_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Shard Battery Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22365,
      max: 27335,
      average: 24850
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 8
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_shotgun_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Shard Battery Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 111308,
      max: 136043,
      average: 123676
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 40
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_torpedo_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Torpedo Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 78039,
      max: 95381,
      average: 86710
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 8
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_m_torpedo_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Torpedo Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 389160,
      max: 475640,
      average: 432400
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 40
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 125
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_spacesuit_demolition_01_mk1',
    tags: 'disallowdrop equipment inventory noblueprint noplayerblueprint personalupgrade weapon',
    name: 'Bomb Launcher',
    group: 'weapons',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 8000,
      max: 12000,
      average: 10000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_spacesuit_laser_01_mk1',
    tags: 'disallowdrop equipment inventory noblueprint noplayerblueprint personalupgrade weapon',
    name: 'Hand Laser',
    group: 'weapons',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 800,
      max: 1200,
      average: 1000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_spacesuit_repairlaser_01_mk1',
    tags: 'disallowdrop equipment inventory noblueprint noplayerblueprint personalupgrade weapon',
    name: 'Repair Laser',
    group: 'weapons',
    transport: 'inventory',
    volume: 1,
    price: {
      min: 800,
      max: 1200,
      average: 1000
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_beam_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Beam Emitter Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 23948,
      max: 29269,
      average: 26609
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 2
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 9
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_beam_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Beam Emitter Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 104979,
      max: 128308,
      average: 116643
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 10
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 36
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_dumbfire_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Dumbfire Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6695,
      max: 8183,
      average: 7439
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_dumbfire_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Dumbfire Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 13370,
      max: 16341,
      average: 14855
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_gatling_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Bolt Repeater Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 43055,
      max: 52623,
      average: 47839
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 8
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_gatling_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Bolt Repeater Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 214756,
      max: 262480,
      average: 238618
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 40
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_guided_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Tracking Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 8277,
      max: 10117,
      average: 9197
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_guided_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Tracking Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 40349,
      max: 49316,
      average: 44832
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 10
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_laser_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Pulse Laser Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 16056,
      max: 19624,
      average: 17840
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_laser_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Pulse Laser Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 79761,
      max: 97485,
      average: 88623
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_mining_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Mining Drill Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 6522,
      max: 7971,
      average: 7247
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 1
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_mining_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Mining Drill Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 32092,
      max: 39223,
      average: 35658
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_plasma_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Plasma Cannon Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 12851,
      max: 15707,
      average: 14279
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_plasma_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Plasma Cannon Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 55827,
      max: 68233,
      average: 62030
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 20
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_shotgun_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Shard Battery Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 27152,
      max: 33186,
      average: 30169
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 4
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_shotgun_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Shard Battery Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 135242,
      max: 165296,
      average: 150269
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 20
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_torpedo_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Torpedo Launcher Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22558,
      max: 27571,
      average: 25064
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 5
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_gen_s_torpedo_01_mk2',
    tags: 'equipment noplayerblueprint weapon',
    name: 'S Torpedo Launcher Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 111753,
      max: 136587,
      average: 124170
    },
    production: [
      {
        time: 5.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 20
          },
          {
            ware: 'weaponcomponents',
            amount: 25
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_par_l_destroyer_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'Odysseus Main Battery',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 1000201,
      max: 1222468,
      average: 1111335
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 150
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 180
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_par_m_railgun_01_mk1',
    tags: 'noplayerblueprint weapon',
    name: 'M Mass Driver Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 38209,
      max: 46699,
      average: 42454
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 3
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_par_m_railgun_01_mk2',
    tags: 'noplayerblueprint weapon',
    name: 'M Mass Driver Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 190525,
      max: 232864,
      average: 211694
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 15
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 75
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_par_s_railgun_01_mk1',
    tags: 'noplayerblueprint weapon',
    name: 'S Mass Driver Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 22345,
      max: 27311,
      average: 24828
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 11
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_par_s_railgun_01_mk2',
    tags: 'noplayerblueprint weapon',
    name: 'S Mass Driver Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 111209,
      max: 135922,
      average: 123566
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 55
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_tel_l_destroyer_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'Phoenix Main Battery',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 873217,
      max: 1067265,
      average: 970241
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 130
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 160
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_tel_m_charge_01_mk1',
    tags: 'noplayerblueprint weapon',
    name: 'M Muon Charger Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 27093,
      max: 33113,
      average: 30103
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 14
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_tel_m_charge_01_mk2',
    tags: 'noplayerblueprint weapon',
    name: 'M Muon Charger Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 134944,
      max: 164932,
      average: 149938
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 70
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_tel_s_charge_01_mk1',
    tags: 'noplayerblueprint weapon',
    name: 'S Muon Charger Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 9687,
      max: 11839,
      average: 10763
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 1
          },
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'weaponcomponents',
            amount: 3
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_tel_s_charge_01_mk2',
    tags: 'noplayerblueprint weapon',
    name: 'S Muon Charger Mk2',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 47915,
      max: 58563,
      average: 53239
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'advancedelectronics',
            amount: 5
          },
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'weaponcomponents',
            amount: 15
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_xen_m_laser_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Pulse Laser Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24019,
      max: 29357,
      average: 26688
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 30
          },
          {
            ware: 'silicon',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_xen_m_mining_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'M Mining Drill Mk1',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 24019,
      max: 29357,
      average: 26688
    },
    production: [
      {
        time: 10.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 10
          },
          {
            ware: 'ore',
            amount: 30
          },
          {
            ware: 'silicon',
            amount: 30
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'weapon_xen_s_laser_01_mk1',
    tags: 'equipment noplayerblueprint weapon',
    name: 'Pulse Laser',
    description: 'No information available',
    group: 'weapons',
    transport: 'equipment',
    volume: 1,
    price: {
      min: 778,
      max: 950,
      average: 864
    },
    production: [
      {
        time: 4.0,
        amount: 1,
        method: 'default',
        name: 'Universal',
        wares: [
          {
            ware: 'energycells',
            amount: 5
          },
          {
            ware: 'ore',
            amount: 2
          }
        ],
        effects: []
      }
    ]
  },
  {
    id: 'wheat',
    tags: 'container economy',
    name: 'Wheat',
    description: 'A staple ingredient in food rations, wheat is grown across all of Argon space and consumed on a daily basis in the form of flatbread or bunyos. Where meat is still produced from Argnu, instead of synthesised or cloned, wheat is also fed to the animals, which results in meat of exceptional quality. ',
    group: 'agricultural',
    factoryName: 'Wheat Farm',
    transport: 'container',
    volume: 4,
    price: {
      min: 37,
      max: 61,
      average: 49
    },
    production: [
      {
        time: 300.0,
        amount: 270,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'energycells',
            amount: 30
          },
          {
            ware: 'water',
            amount: 80
          }
        ],
        effects: [
          {
            type: 'work',
            product: 0.28
          }
        ]
      }
    ],
    icon: {
      active: 'ware_wheat'
    }
  },
  {
    id: 'workunit_busy',
    tags: 'workunit',
    name: 'Busy Workunit',
    transport: 'workunit',
    volume: 1,
    price: {
      min: 126,
      max: 126,
      average: 126
    },
    production: [
      {
        time: 3600.0,
        amount: 400,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'foodrations',
            amount: 450
          },
          {
            ware: 'medicalsupplies',
            amount: 270
          }
        ],
        effects: []
      },
      {
        time: 3600.0,
        amount: 400,
        method: 'paranid',
        name: 'Paranid',
        wares: [
          {
            ware: 'medicalsupplies',
            amount: 270
          },
          {
            ware: 'sojahusk',
            amount: 286
          }
        ],
        effects: []
      },
      {
        time: 3600.0,
        amount: 400,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'medicalsupplies',
            amount: 270
          },
          {
            ware: 'nostropoil',
            amount: 228
          }
        ],
        effects: []
      }
    ],
    icon: {
      active: 'ware_workunit_busy'
    }
  },
  {
    id: 'workunit_idle',
    tags: 'workunit',
    name: 'Idle Workunit',
    transport: 'workunit',
    volume: 1,
    price: {
      min: 84,
      max: 84,
      average: 84
    },
    production: [
      {
        time: 3600.0,
        amount: 400,
        method: 'default',
        name: 'Argon',
        wares: [
          {
            ware: 'foodrations',
            amount: 300
          },
          {
            ware: 'medicalsupplies',
            amount: 180
          }
        ],
        effects: []
      },
      {
        time: 3600.0,
        amount: 400,
        method: 'paranid',
        name: 'Paranid',
        wares: [
          {
            ware: 'medicalsupplies',
            amount: 180
          },
          {
            ware: 'sojahusk',
            amount: 191
          }
        ],
        effects: []
      },
      {
        time: 3600.0,
        amount: 400,
        method: 'teladi',
        name: 'Teladi',
        wares: [
          {
            ware: 'medicalsupplies',
            amount: 180
          },
          {
            ware: 'nostropoil',
            amount: 152
          }
        ],
        effects: []
      }
    ],
    icon: {
      active: 'ware_workunit_idle'
    }
  },
  {
    id: 'x4ep1_jttware',
    name: 'Advanced Electronics',
    description: 'Designed specifically to work alongside weapon and turret components, it is a variety of advanced electronics that allow different weapons and turrets to have a range of turning speeds, fire rates and cooldowns. Whereas field coils for shields and antimatter converters for engines are more modular and can be used \'across the board\', different weapons and turrets expect different electronic systems to be used in order to ensure the correct properties. However, as all equipment is built and repaired on demand, all advanced electronics are shipped to shipyards and equipment docks together.',
    group: 'shiptech',
    factoryName: 'Unknown Station',
    transport: 'container',
    volume: 15,
    price: {
      min: 1,
      max: 1,
      average: 1
    },
    production: [],
    icon: {
      active: 'ware_advancedelectronics'
    }
  }
]
