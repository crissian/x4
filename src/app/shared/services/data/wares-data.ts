/* tslint:disable:max-line-length */
import { WareGroups } from './ware-groups-data';
import { TransportType } from './transport-data';
import { Effects } from './effects-data';

export const Wares = {
   advancedcomposites: {
      id: 'advancedcomposites',
      version: 0,
      name: 'Advanced Composites',
      description: 'Formed from some of the refined resources collected from mining ships, advanced composites is a general term for many compounds created to serve several purposes; most commonly used in the production of a variety of equipment parts.',
      factoryName: 'Advanced Composite Factory',
      icon: 'ware_advancedcomposites',
      volume: 32,
      transport: TransportType.container,
      price: { min: 432, max: 648, avg: 540 },
      group: WareGroups.hightech,
      production: [
         {
            time: 300,
            amount: 60,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'graphene', amount: 80 },
               { ware: 'refinedmetals', amount: 80 },
            ],
            effects: [
               { type: Effects.work, product: 0.2 },
            ],
         },
         {
            time: 300,
            amount: 60,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'graphene', amount: 80 },
               { ware: 'teladianium', amount: 58 },
            ],
            effects: [
               { type: Effects.work, product: 0.2 },
            ],
         },
      ]
   },
   advancedelectronics: {
      id: 'advancedelectronics',
      version: 0,
      name: 'Advanced Electronics',
      description: 'Designed specifically to work alongside weapon and turret components, it is a variety of advanced electronics that allow different weapons and turrets to have a range of turning speeds, fire rates and cooldowns. Whereas field coils for shields and antimatter converters for engines are more modular and can be used \'across the board\', different weapons and turrets expect different electronic systems to be used in order to ensure the correct properties. However, as all equipment is built and repaired on demand, all advanced electronics are shipped to shipyards and equipment docks together.',
      factoryName: 'Advanced Electronics Factory',
      icon: 'ware_advancedelectronics',
      volume: 30,
      transport: TransportType.container,
      price: { min: 710, max: 1318, avg: 1014 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 720,
            amount: 60,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'microchips', amount: 44 },
               { ware: 'quantumtubes', amount: 20 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   antimattercells: {
      id: 'antimattercells',
      version: 0,
      name: 'Antimatter Cells',
      description: 'Highly advanced magnetic storage devices that carry antimatter. Due to the effect of Hawking radiation and their being self-powered, antimatter cells cannot store antimatter indefinitely. They are produced and filled using refined hydrogen and primarily used in the production of engine parts, and also can be miniaturised to be used in claytronics.',
      factoryName: 'Antimatter Cell Factory',
      icon: 'ware_antimattercells',
      volume: 18,
      transport: TransportType.container,
      price: { min: 121, max: 282, avg: 202 },
      group: WareGroups.refined,
      production: [
         {
            time: 120,
            amount: 110,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 100 },
               { ware: 'hydrogen', amount: 320 },
            ],
            effects: [
               { type: Effects.work, product: 0.21 },
            ],
         },
      ]
   },
   antimatterconverters: {
      id: 'antimatterconverters',
      version: 0,
      name: 'Antimatter Converters',
      description: 'Attached to the antimatter cells used in engine parts for both main engines and thrusters, antimatter converters fine-tune the amount of energy used to a more specific configuration. It is the use of this component that allows so many variations of engine, as their number and set up greatly impact the power and efficiency of the final product.',
      factoryName: 'Antimatter Converter Factory',
      icon: 'ware_antimatterconverters',
      volume: 10,
      transport: TransportType.container,
      price: { min: 248, max: 461, avg: 354 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 300,
            amount: 150,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedcomposites', amount: 20 },
               { ware: 'energycells', amount: 80 },
               { ware: 'microchips', amount: 30 },
            ],
            effects: [
               { type: Effects.work, product: 0.23 },
            ],
         },
      ]
   },
   claytronics: {
      id: 'claytronics',
      version: 0,
      name: 'Claytronics',
      description: 'More commonly known as programmable matter, claytronics are made up of millions of individual nanometre-scale computers known as catoms. This technology lives at the heart of any non-Xenon station, used to build anything from internal wiring to computer systems and control mechanisms - effectively everything but the hull of the station itself. Claytronics are always in high-demand, as the universe rebuilds itself after the Jump Gate shutdown.',
      factoryName: 'Claytronics Factory',
      icon: 'ware_claytronics',
      volume: 24,
      transport: TransportType.container,
      price: { min: 1734, max: 2346, avg: 2040 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 900,
            amount: 120,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimattercells', amount: 100 },
               { ware: 'energycells', amount: 140 },
               { ware: 'microchips', amount: 160 },
               { ware: 'quantumtubes', amount: 100 },
            ],
            effects: [
               { type: Effects.work, product: 0.2 },
            ],
         },
      ]
   },
   dronecomponents: {
      id: 'dronecomponents',
      version: 0,
      name: 'Drone Components',
      description: 'Much like weapon and turret components, drone components have been generalised and standardised across much of the Jump Gate network to be modularly used in all kinds of drone, making them a highly sought-after resource. Drone components are directly shipped to shipyards, equipment docks and stations to source drone-building, which is done on-demand as and when it is necessary.',
      factoryName: 'Drone Component Factory',
      icon: 'ware_dronecomponents',
      volume: 30,
      transport: TransportType.container,
      price: { min: 685, max: 1142, avg: 914 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 1200,
            amount: 120,
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
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   energycells: {
      id: 'energycells',
      version: 0,
      name: 'Energy Cells',
      description: 'Contrary to common belief, Energy Cells are not simply glorified batteries; actually, they are sophisticated bio-chemical (or bio-mechanical, depending on technology) devices capable of storing energy near or at 100% efficiency.',
      factoryName: 'Solar Power Plant',
      icon: 'ware_energycells',
      volume: 1,
      transport: TransportType.container,
      price: { min: 10, max: 22, avg: 16 },
      group: WareGroups.energy,
      production: [
         {
            time: 60,
            amount: 200,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   engineparts: {
      id: 'engineparts',
      version: 0,
      name: 'Engine Parts',
      description: 'Comprised of a number of different components that make up ship engines, engine parts are delivered straight to the end customer, most commonly shipyards and equipment docks, who then use them themselves to produce or repair engines. While naturally engine parts are a very necessary resource across the entire Jump Gate network, the ability to produce and repair engines on demand, instead of requiring an entirely separate production step for each, has greatly streamlined the universal economy.',
      factoryName: 'Engine Part Factory',
      icon: 'ware_engineparts',
      volume: 15,
      transport: TransportType.container,
      price: { min: 128, max: 237, avg: 182 },
      group: WareGroups.hightech,
      production: [
         {
            time: 900,
            amount: 240,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimattercells', amount: 80 },
               { ware: 'energycells', amount: 60 },
               { ware: 'refinedmetals', amount: 96 },
            ],
            effects: [
               { type: Effects.work, product: 0.27 },
            ],
         },
         {
            time: 900,
            amount: 240,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'antimattercells', amount: 80 },
               { ware: 'energycells', amount: 60 },
               { ware: 'teladianium', amount: 70 },
            ],
            effects: [
               { type: Effects.work, product: 0.27 },
            ],
         },
      ]
   },
   fieldcoils: {
      id: 'fieldcoils',
      version: 0,
      name: 'Field Coils',
      description: 'Used to fine-tune the arrays used on ship and station shielding, field coils allow for much more modulation than using shield components alone. As such shipyards have begun using them to build a much wider variety of shields than was previously available. Like many of the components used on ships - that aren\'t the hull itself - shield components are shipped straight to shipyards and equipment docks so that shields can be produced on-demand.',
      factoryName: 'Field Coil Factory',
      icon: 'ware_fieldcoils',
      volume: 15,
      transport: TransportType.container,
      price: { min: 247, max: 576, avg: 412 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 600,
            amount: 200,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'plasmaconductors', amount: 40 },
               { ware: 'quantumtubes', amount: 43 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   foodrations: {
      id: 'foodrations',
      version: 0,
      name: 'Food Rations',
      description: 'Food Rations come in a large variety; as far as rations for the species Homo sapiens are concerned, they mainly contain wheat, freeze-dried meat and different spices as well as vitamins and essential minerals.',
      factoryName: 'Food Ration Factory',
      icon: 'ware_foodrations',
      volume: 1,
      transport: TransportType.container,
      price: { min: 12, max: 29, avg: 21 },
      group: WareGroups.food,
      production: [
         {
            time: 240,
            amount: 328,
            method: 'default',
            name: 'Argon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'meat', amount: 40 },
               { ware: 'spices', amount: 20 },
               { ware: 'wheat', amount: 40 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   graphene: {
      id: 'graphene',
      version: 0,
      name: 'Graphene',
      description: 'Produced from refined and heavily modified methane gas in the modern era, graphene is a semi-metal that has many uncommon properties. Due to its strength and resistance to heat and electricity, it is used to produce a variety of tech-level resources, and is also used to help in the reinforcement of hull parts.',
      factoryName: 'Graphene Refinery',
      icon: 'ware_graphene',
      volume: 20,
      transport: TransportType.container,
      price: { min: 100, max: 233, avg: 166 },
      group: WareGroups.refined,
      production: [
         {
            time: 240,
            amount: 110,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 80 },
               { ware: 'methane', amount: 320 },
            ],
            effects: [
               { type: Effects.work, product: 0.27 },
            ],
         },
      ]
   },
   helium: {
      id: 'helium',
      version: 0,
      name: 'Helium',
      description: 'A colourless, odourless and non-toxic noble gas, helium is found in great abundance in gas nebulas across the entire Jump Gate network and is usually collected by mining ships to be refined into superfluid coolant.',
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
      description: 'Made from refined metals or teladianium, Hull Parts are most commonly used to build the hulls of ships and stations, though they do have some other uses such as in drones and weapons. Usually layered for additional protection, and using other compounds to further reinforce, Hull Parts are still cheap to produce - a bonus, considering their position as the most frequently used resource in the Jump Gate network.',
      factoryName: 'Hull Part Factory',
      icon: 'ware_hullparts',
      volume: 12,
      transport: TransportType.container,
      price: { min: 146, max: 272, avg: 209 },
      group: WareGroups.hightech,
      production: [
         {
            time: 900,
            amount: 330,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 80 },
               { ware: 'graphene', amount: 40 },
               { ware: 'refinedmetals', amount: 280 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
         {
            time: 900,
            amount: 330,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 80 },
               { ware: 'graphene', amount: 40 },
               { ware: 'teladianium', amount: 204 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   hydrogen: {
      id: 'hydrogen',
      version: 0,
      name: 'Hydrogen',
      description: 'Historically, Hydrogen has been used mainly in H-fusion generators. These days however, with the rise of sustainable M/AM mass conversion, Hydrogen is routinely converted into anti-Hydrogen for use in Antimatter Cells.',
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
      description: 'H2O in its solid state of aggregation, used for industrial water supplies and general consumption after treatment.',
      factoryName: 'Ice Mine',
      icon: 'ware_ice',
      volume: 8,
      transport: TransportType.solid,
      price: { min: 26, max: 35, avg: 30 },
      group: WareGroups.ice,
      production: [
      ]
   },
   majadust: {
      id: 'majadust',
      version: 0,
      name: 'Maja Dust',
      description: 'Chemically processed from crushed maja snail shells, maja dust is a relaxant and hallucinogenic sold as a powder-substance that is inhaled. Though any official Paranid government would have the populous believe that maja dust is not commonly consumed, it is thought to be highly likely, particularly in light of the ongoing Paranid civil war, that many Paranid and non-Paranid alike are partaking in the outlawed substance.',
      factoryName: 'Maja Dust Factory',
      icon: 'ware_majadust',
      volume: 6,
      transport: TransportType.container,
      price: { min: 94, max: 323, avg: 208 },
      group: WareGroups.pharmaceutical,
      production: [
         {
            time: 600,
            amount: 80,
            method: 'default',
            name: 'Paranid',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'majasnails', amount: 120 },
               { ware: 'spices', amount: 60 },
            ],
            effects: [
               { type: Effects.work, product: 0.4 },
            ],
         },
      ]
   },
   majasnails: {
      id: 'majasnails',
      version: 0,
      name: 'Maja Snails',
      description: 'Grown across many Paranid colonies, as well as in tanks across Paranid space, maja snails provide Paranid with a good number of the nutrients they need to survive. Commonly treated very well, once a snail dies its shell and flesh are both processed as part of soja husk, along with soja beans. The shell of the maja snail is also commonly used as the main ingredient of the drug known as maja dust.',
      factoryName: 'Maja Snail Farm',
      icon: 'ware_majasnails',
      volume: 6,
      transport: TransportType.container,
      price: { min: 35, max: 81, avg: 58 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 450,
            amount: 174,
            method: 'default',
            name: 'Paranid',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'water', amount: 100 },
            ],
            effects: [
               { type: Effects.work, product: 0.33 },
            ],
         },
      ]
   },
   meat: {
      id: 'meat',
      version: 0,
      name: 'Meat',
      description: 'Though meat comes in a great variety, the most sought-after type as of late is so-called \'vegan meat\', synthesised and cloned not from real animals, but from cell cultures. However, real Argnu meat is still popular within the human population of many worlds.',
      factoryName: 'Meat Factory',
      icon: 'ware_meat',
      volume: 6,
      transport: TransportType.container,
      price: { min: 29, max: 68, avg: 48 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 450,
            amount: 220,
            method: 'default',
            name: 'Argon',
            wares: [
               { ware: 'energycells', amount: 40 },
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
      description: 'Medical supplies contain a number of different concoctions and remedies used to keep station workforce healthier and happier during their time aboard. Completely natural in design, these supplies have been vetted by both the Argon Federation and Godrealm of the Paranid to ensure they are both legal and safe, and thus there is no licence necessary to carry or supply them.',
      factoryName: 'Medical Supply Factory',
      icon: 'ware_medicalsupplies',
      volume: 2,
      transport: TransportType.container,
      price: { min: 43, max: 89, avg: 66 },
      group: WareGroups.pharmaceutical,
      production: [
         {
            time: 300,
            amount: 120,
            method: 'default',
            name: 'Argon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'spices', amount: 30 },
               { ware: 'water', amount: 60 },
               { ware: 'wheat', amount: 22 },
            ],
            effects: [
               { type: Effects.work, product: 0.28 },
            ],
         },
         {
            time: 300,
            amount: 120,
            method: 'paranid',
            name: 'Paranid',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'sojabeans', amount: 10 },
               { ware: 'spices', amount: 30 },
               { ware: 'water', amount: 60 },
            ],
            effects: [
               { type: Effects.work, product: 0.28 },
            ],
         },
         {
            time: 300,
            amount: 120,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'spices', amount: 30 },
               { ware: 'sunriseflowers', amount: 8 },
               { ware: 'water', amount: 60 },
            ],
            effects: [
               { type: Effects.work, product: 0.28 },
            ],
         },
         {
            time: 300,
            amount: 120,
            method: 'split',
            name: 'Split',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'scruffinfruits', amount: 21 },
               { ware: 'spices', amount: 30 },
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
      description: 'Found in ample supply in gas nebulas across the Jump Gate network, methane (CH4) is collected by mining ships and taken to refineries to be processed into graphene.',
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
      description: 'Used in a wide variety of equipment parts, micro-chips are produced using silicon wafers, which, while fragile, allows them to conduct at a much higher rate. This, in turn, allows far better processing in the equipment that uses the micro-chips, which includes many advanced electronics and components.',
      factoryName: 'Microchip Factory',
      icon: 'ware_microchips',
      volume: 22,
      transport: TransportType.container,
      price: { min: 805, max: 1090, avg: 948 },
      group: WareGroups.hightech,
      production: [
         {
            time: 600,
            amount: 80,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'siliconwafers', amount: 200 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   missilecomponents: {
      id: 'missilecomponents',
      version: 0,
      name: 'Missile Components',
      description: 'Missile components are used in the construction of all missiles, often with a different number and configuration making up the construction of each missile. As with ship equipment, missiles are built on demand, and so missile components are bought at and found at shipyards and equipment docks, where most pilots can order missiles on demand.',
      factoryName: 'Missile Component Factory',
      icon: 'ware_missilecomponents',
      volume: 2,
      transport: TransportType.container,
      price: { min: 6, max: 13, avg: 9 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 900,
            amount: 330,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedcomposites', amount: 2 },
               { ware: 'energycells', amount: 20 },
               { ware: 'hullparts', amount: 2 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
            ],
         },
      ]
   },
   nividium: {
      id: 'nividium',
      version: 0,
      name: 'Nividium',
      description: 'A rare metal found in small pockets in asteroids, Nividium has been cut out of any economic use by the improved efficiency with which businesses have been able to use ore and silicon, much easier to find and cheaper to process. However, Nividium is still valuable, and is often transported planet-side to be made into jewelry and art.',
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
      description: 'Nostrop oil is squeezed from the leaves of sunrise flowers and mixed with water. Though the Teladi favour it for its simplicity and nutrients, other species have clearly indicated that nostrop oil does not in fact taste at all pleasing.',
      factoryName: 'Nostrop Oil Factory',
      icon: 'ware_nostropoil',
      volume: 1,
      transport: TransportType.container,
      price: { min: 20, max: 47, avg: 34 },
      group: WareGroups.food,
      production: [
         {
            time: 300,
            amount: 320,
            method: 'default',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'spices', amount: 20 },
               { ware: 'sunriseflowers', amount: 40 },
               { ware: 'water', amount: 40 },
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
      description: 'Today ore tends not to be mined on habitable worlds, but harvested from other celestial bodies, mainly asteroids. As could be expected, Ore must always be refined to be of any use.',
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
      description: 'These conductors are designed to allow the flow of plasma through a component at the greatest possible efficiency. Though made relatively cheap to produce through years of research and development, plasma conductors remain highly complex pieces of technology. They are used primarily in the construction of weapon and shield components. ',
      factoryName: 'Plasma Conductor Factory',
      icon: 'ware_plasmaconductors',
      volume: 32,
      transport: TransportType.container,
      price: { min: 769, max: 1282, avg: 1026 },
      group: WareGroups.hightech,
      production: [
         {
            time: 900,
            amount: 50,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'graphene', amount: 96 },
               { ware: 'superfluidcoolant', amount: 140 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
         {
            time: 900,
            amount: 50,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'graphene', amount: 96 },
               { ware: 'superfluidcoolant', amount: 140 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   quantumtubes: {
      id: 'quantumtubes',
      version: 0,
      name: 'Quantum Tubes',
      description: 'An example of complex technology being made cheap through years of continuous research, no one outside of those manufacturing the technology quite knows how quantum tubes work. Though the outer wiring itself it easy to make and understand, the internal structure and what the wiring actually carries must be constructed only by those with countless hours of study and examination under their belts; otherwise risking catastrophic failures that can lead to entire shutdowns of the equipment in which they are used.',
      factoryName: 'Quantum Tube Factory',
      icon: 'ware_quantumtubes',
      volume: 22,
      transport: TransportType.container,
      price: { min: 225, max: 375, avg: 300 },
      group: WareGroups.hightech,
      production: [
         {
            time: 720,
            amount: 110,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'graphene', amount: 116 },
               { ware: 'superfluidcoolant', amount: 30 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
            ],
         },
         {
            time: 720,
            amount: 110,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'graphene', amount: 116 },
               { ware: 'superfluidcoolant', amount: 30 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
            ],
         },
      ]
   },
   refinedmetals: {
      id: 'refinedmetals',
      version: 0,
      name: 'Refined Metals',
      description: 'Refined from ore found in countless asteroids across the Jump Gate network, these refined metals are cheap to produce and easy to reinforce, making them perfect for use in constructing all kinds of Hull Parts, not just for ships and stations, but also for smaller components that used across all of space.',
      factoryName: 'Ore Refinery',
      icon: 'ware_refinedmetals',
      volume: 14,
      transport: TransportType.container,
      price: { min: 89, max: 207, avg: 148 },
      group: WareGroups.refined,
      production: [
         {
            time: 150,
            amount: 100,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 90 },
               { ware: 'ore', amount: 240 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   scanningarrays: {
      id: 'scanningarrays',
      version: 0,
      name: 'Scanning Arrays',
      description: 'Scanning arrays have seen elegant redesign over the years so that ships and stations do not risk fragile antennas being broken or destroyed by collisions. Now entirely internal systems, scanning arrays are used not just in ship and station scanners and radars, but are also used in the targeting systems supplied with turret and drone components. ',
      factoryName: 'Scanning Array Factory',
      icon: 'ware_scanningarrays',
      volume: 38,
      transport: TransportType.container,
      price: { min: 842, max: 1264, avg: 1053 },
      group: WareGroups.hightech,
      production: [
         {
            time: 600,
            amount: 40,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'refinedmetals', amount: 100 },
               { ware: 'siliconwafers', amount: 60 },
            ],
            effects: [
               { type: Effects.work, product: 0.24 },
            ],
         },
         {
            time: 600,
            amount: 40,
            method: 'teladi',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'siliconwafers', amount: 60 },
               { ware: 'teladianium', amount: 73 },
            ],
            effects: [
               { type: Effects.work, product: 0.24 },
            ],
         },
      ]
   },
   shieldcomponents: {
      id: 'shieldcomponents',
      version: 0,
      name: 'Shield Components',
      description: 'From generators to coils that maintain energy over time, shield components are a wide arrange of technologies that provide everything necessary to build a variety of shields. Completely modular, each part can be used in each shield, which has led to a wide variety of new-generation shields being produced in recent years. As with all ship equipment, shields are built on-demand, and so shield components are produced in factories and shipped straight to shipyards and equipment docks where they can be more freely used for construction and repair.',
      factoryName: 'Shield Component Factory',
      icon: 'ware_shieldcomponents',
      volume: 10,
      transport: TransportType.container,
      price: { min: 113, max: 264, avg: 188 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 1200,
            amount: 220,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 70 },
               { ware: 'plasmaconductors', amount: 20 },
               { ware: 'quantumtubes', amount: 20 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   silicon: {
      id: 'silicon',
      version: 0,
      name: 'Silicon',
      description: 'Silicon, required for the production of the most common types of silicon wafers, is usually mined or harvested from asteroids or other uninhabited celestial bodies.',
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
      description: 'If a technology requires any kind of chip, it is highly likely that is uses silicon wafers. Light, efficient and cheap to produce, these wafers are usually layered or constructed in hexagonal meshes to allow for quick transfer of data across a component.',
      factoryName: 'Silicon Refinery',
      icon: 'ware_siliconwafers',
      volume: 18,
      transport: TransportType.container,
      price: { min: 180, max: 419, avg: 299 },
      group: WareGroups.refined,
      production: [
         {
            time: 180,
            amount: 120,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 90 },
               { ware: 'silicon', amount: 240 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   smartchips: {
      id: 'smartchips',
      version: 0,
      name: 'Smart Chips',
      description: 'A specialised form of microchip that contains a small amount of heuristic programming, these chips cannot allow a system to learn, but can allow for small, snap intelligent decision-making that assists in targeting systems and makes autonomous piloting more accurate. These chips are primarily used in guided missiles and drones.',
      factoryName: 'Smart Chip Factory',
      icon: 'ware_smartchips',
      volume: 2,
      transport: TransportType.container,
      price: { min: 46, max: 69, avg: 57 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 600,
            amount: 160,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'siliconwafers', amount: 20 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   sojabeans: {
      id: 'sojabeans',
      version: 0,
      name: 'Soja Beans',
      description: 'A small bean grown all across Paranid space, the soja bean add flavour and nutritional value to the soja husk; the Paranids\' primary food source. While this is its primary purpose, on many Paranid colonies it is also dried and ground into a powder and mixed with water, creating a flavoured and healthy drink that provides Paranid with ample energy.',
      factoryName: 'Soja Bean Farm',
      icon: 'ware_sojabeans',
      volume: 5,
      transport: TransportType.container,
      price: { min: 40, max: 93, avg: 67 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 300,
            amount: 120,
            method: 'default',
            name: 'Paranid',
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
   sojahusk: {
      id: 'sojahusk',
      version: 0,
      name: 'Soja Husk',
      description: 'A Paranid dish; soja beans that have been crushed into a paste and mixed with the flesh of the maja snail, then served in a maja snail shell, soja husk is accepted as both a tasteful and nutritious meal by the Paranid, though there are few non-Paranid who have dared try it.',
      factoryName: 'Soja Husk Factory',
      icon: 'ware_sojahusk',
      volume: 1,
      transport: TransportType.container,
      price: { min: 19, max: 45, avg: 32 },
      group: WareGroups.food,
      production: [
         {
            time: 300,
            amount: 320,
            method: 'default',
            name: 'Paranid',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'majasnails', amount: 40 },
               { ware: 'sojabeans', amount: 40 },
               { ware: 'spices', amount: 20 },
            ],
            effects: [
               { type: Effects.work, product: 0.22 },
            ],
         },
      ]
   },
   spacefuel: {
      id: 'spacefuel',
      version: 0,
      name: 'Spacefuel',
      description: 'Spacefuel is made from processing and distilling wheat, water and a blend of spices. It is a cheap but strong alcoholic beverage that has been made illegal to trade in bulk across the Jump Gate network in an attempt to avoid drunken accidents on both ships and stations. In order to sell spacefuel as a beverage, one must be a licenced bar owner.',
      factoryName: 'Spacefuel Factory',
      icon: 'ware_spacefuel',
      volume: 2,
      transport: TransportType.container,
      price: { min: 60, max: 207, avg: 133 },
      group: WareGroups.pharmaceutical,
      production: [
         {
            time: 480,
            amount: 120,
            method: 'default',
            name: 'Argon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'water', amount: 100 },
               { ware: 'wheat', amount: 80 },
            ],
            effects: [
               { type: Effects.work, product: 0.38 },
            ],
         },
      ]
   },
   spaceweed: {
      id: 'spaceweed',
      version: 0,
      name: 'Spaceweed',
      description: 'While seen as part of every-day life in Teladi society, spaceweed has been made illegal in both Argon and Paranid space, as it is seen as a dangerous narcotic. This point is argued heavily by many of those who partake in the drug, which is usually dried, crushed and then smoked, but attempts to legalise it have as of yet failed.',
      factoryName: 'Spaceweed Farm',
      icon: 'ware_spaceweed',
      volume: 3,
      transport: TransportType.container,
      price: { min: 75, max: 257, avg: 166 },
      group: WareGroups.pharmaceutical,
      production: [
         {
            time: 600,
            amount: 225,
            method: 'default',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 140 },
               { ware: 'spices', amount: 40 },
               { ware: 'swampplant', amount: 120 },
            ],
            effects: [
               { type: Effects.work, product: 0.38 },
            ],
         },
      ]
   },
   spices: {
      id: 'spices',
      version: 0,
      name: 'Spices',
      description: 'Spices are used in many food and pharmaceutical products; primarily as an agent to add extra flavour, but also sometimes due to other properties that some are known to have, ranging from acting as a relaxant to a mild hallucinogenic. Factories that legally produce spices are commonly inspected to make sure their produce is in line with the local law, but as they are often shipped as a mixture, it is sometimes difficult to keep an eye on which spice is being used for which purpose.',
      factoryName: 'Spice Farm',
      icon: 'ware_spices',
      volume: 3,
      transport: TransportType.container,
      price: { min: 12, max: 28, avg: 20 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 600,
            amount: 480,
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
      description: 'Known to grow naturally only on Ianamus Zura, the Teladi mastered the art of bio-engineering a near-identical but still artificially grown sunrise flower long ago. When squeezed, the leaves of the sunrise flower produce a bitter-tasting oil that while despised by other species, the Teladi appreciate as an adequate food source.',
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
      description: 'Designed with superfluidity to ensure both efficiency and endurance, this coolant is used in complex technical components such as plasma conductors and quantum tubes to protect said components from overheating. The losslessness of kinetic energy afforded by the coolant\'s superfluidity means that it can continue to circulate around the component for a much longer time before needing to be recycled. This has led to such components lifetimes being greatly increased.',
      factoryName: 'Helium Refinery',
      icon: 'ware_superfluidcoolant',
      volume: 16,
      transport: TransportType.container,
      price: { min: 90, max: 211, avg: 150 },
      group: WareGroups.refined,
      production: [
         {
            time: 240,
            amount: 110,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'helium', amount: 320 },
            ],
            effects: [
               { type: Effects.work, product: 0.28 },
            ],
         },
      ]
   },
   swampplant: {
      id: 'swampplant',
      version: 0,
      name: 'Swamp Plant',
      description: 'Cultivated in a warm and humid environment, swamp plant is a small moss-like plant known to have mildly narcotic properties; the reason it is dried and crushed to be used as space weed. Though it is widely known that swamp plant is the main ingredient of a drug made illegal throughout non-Teladi space, producing and trading it itself is not illegal, as it is only in the processing of the plant that the narcotic properties can be unlocked.',
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
               { type: Effects.work, product: 0.33 },
            ],
         },
      ]
   },
   teladianium: {
      id: 'teladianium',
      version: 0,
      name: 'Teladianium',
      description: 'Teladianium is a hard, tough material used by the Teladi for station and, more commonly, ship construction. A lighter compound than the refined metals used in other races\' vessels, Teladianium is traditionally made from chemically treated Teladian mud. However, as the necessary chemicals are rarely found in space, and expensive to produce, the Teladi often replace them with the raw minerals found in asteroids.',
      factoryName: 'Teladianium Foundry',
      icon: 'ware_teladianium',
      volume: 16,
      transport: TransportType.container,
      price: { min: 121, max: 283, avg: 202 },
      group: WareGroups.refined,
      production: [
         {
            time: 120,
            amount: 80,
            method: 'default',
            name: 'Teladi',
            wares: [
               { ware: 'energycells', amount: 45 },
               { ware: 'ore', amount: 280 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   turretcomponents: {
      id: 'turretcomponents',
      version: 0,
      name: 'Turret Components',
      description: 'After the unification of the design process in station and capital ship weapon systems, many different turrets can be built from different configurations of these turret components.',
      factoryName: 'Turret Component Factory',
      icon: 'ware_turretcomponents',
      volume: 20,
      transport: TransportType.container,
      price: { min: 164, max: 383, avg: 273 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 1800,
            amount: 200,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'microchips', amount: 20 },
               { ware: 'quantumtubes', amount: 20 },
               { ware: 'scanningarrays', amount: 10 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
            ],
         },
      ]
   },
   water: {
      id: 'water',
      version: 0,
      name: 'Water',
      description: 'Essential to all known biological life forms, water has never become much of a catalyst for dispute amongst species, owing to its ubiquity in space. It is being used somewhere in the manufacturing process of nearly all goods available across space; especially, however, in the production of edible goods.',
      factoryName: 'Ice Refinery',
      icon: 'ware_water',
      volume: 6,
      transport: TransportType.container,
      price: { min: 32, max: 74, avg: 53 },
      group: WareGroups.water,
      production: [
         {
            time: 120,
            amount: 220,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'ice', amount: 320 },
            ],
            effects: [
               { type: Effects.work, product: 0.25 },
            ],
         },
      ]
   },
   weaponcomponents: {
      id: 'weaponcomponents',
      version: 0,
      name: 'Weapon Components',
      description: 'Made up from such things as trigger and reloading mechanisms, chambers and barrels, weapon components make up the mechanical part of all ship weapons. Combined with specialised advanced electronics, a number of different weapons can be made from the modular components, also across different size ranges. Shipped to shipyards and equipment docks as a single package, these components can then be put together relatively quickly and easily to make any weapon for the final customer on-demand.',
      factoryName: 'Weapon Component Factory',
      icon: 'ware_weaponcomponents',
      volume: 20,
      transport: TransportType.container,
      price: { min: 171, max: 399, avg: 285 },
      group: WareGroups.shiptech,
      production: [
         {
            time: 1800,
            amount: 200,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 60 },
               { ware: 'hullparts', amount: 20 },
               { ware: 'plasmaconductors', amount: 30 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
            ],
         },
      ]
   },
   wheat: {
      id: 'wheat',
      version: 0,
      name: 'Wheat',
      description: 'A staple ingredient in food rations, wheat is grown across all of Argon space and consumed on a daily basis in the form of flatbread or bunyos. Where meat is still produced from Argnu, instead of synthesised or cloned, wheat is also fed to the animals, which results in meat of exceptional quality. ',
      factoryName: 'Wheat Farm',
      icon: 'ware_wheat',
      volume: 4,
      transport: TransportType.container,
      price: { min: 19, max: 44, avg: 31 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 300,
            amount: 270,
            method: 'default',
            name: 'Argon',
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
   cheltmeat: {
      id: 'cheltmeat',
      version: 1,
      name: 'Chelt Meat',
      description: 'Chelts are sea-bound creatures that once roamed the seas and oceans of the Split home planet. The Split harvested them for meat, oil and their skins, which they used to create a tough leather like material. However, Chelts were eventually over-hunted and almost brought to extinction. Nowadays Chelts are grown in space, in Chelt Aquariums, and used to produce food for Split workers to consume.',
      factoryName: 'Chelt Aquarium',
      icon: 'ware_cheltmeat',
      volume: 7,
      transport: TransportType.container,
      price: { min: 31, max: 72, avg: 51 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 450,
            amount: 250,
            method: 'default',
            name: 'Split',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'water', amount: 120 },
            ],
            effects: [
               { type: Effects.work, product: 0.33 },
            ],
         },
      ]
   },
   scruffinfruits: {
      id: 'scruffinfruits',
      version: 1,
      name: 'Scruffin Fruit',
      description: 'Scruffin are fruit similar to sweet potatoes. They are grown by Split farmers in large, open fields on a number of planets, as well as in space aboard large installations known as Scruffin Farms. Scruffin flesh is  a versatile foodstuff that, when processed, provides the basis of  a number of Split food types. Although Scruffin are traded both inside and outside Split territory, they are mainly in demand in areas where Split workers are in abundance.',
      factoryName: 'Scruffin Farm',
      icon: 'ware_scruffinfruit',
      volume: 6,
      transport: TransportType.container,
      price: { min: 17, max: 40, avg: 28 },
      group: WareGroups.agricultural,
      production: [
         {
            time: 300,
            amount: 300,
            method: 'default',
            name: 'Split',
            wares: [
               { ware: 'energycells', amount: 30 },
               { ware: 'water', amount: 80 },
            ],
            effects: [
               { type: Effects.work, product: 0.3 },
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
   Wares.refinedmetals,
   Wares.scanningarrays,
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
];
