/* tslint:disable:max-line-length */
import { EquipmentType } from './equipment-type-data';
import { EquipmentClass } from './equipment-class-data';
import { Races } from './race-data';
import { Factions } from './factions-data';
import { Size } from './size-data';

export const Equipment = [
   {
      id: 'countermeasure_flares_01',
      name: 'Flares',
      description: 'A piece of equipment tried and tested over hundreds of years, the modern flare has continued to be a boon for many a combat pilot in recent years. Forcibly ejected from a compartment of a ship, flares then explode so that the sudden heat signature may distract a guided missile from its original target, and before exploding additionally send out a small electro-magnetic signature that can disrupt a target lock before a missile is even fired.',
      type: EquipmentType.countermeasures,
      equipmentClass: EquipmentClass.countermeasure,
      price: { min: 2179, max: 2663, avg: 2421 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedcomposites', amount: 1 },
               { ware: 'energycells', amount: 9 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 4 },
               { ware: 'silicon', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_l_allround_01_mk1',
      name: 'ARG L All-round Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4033,
      price: { min: 321518, max: 392966, avg: 357242 },
      owners: [ Factions.argon ],
      thrust: { forward: 5083, reverse: 5591 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 147 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 67 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_l_travel_01_mk1',
      name: 'ARG L Travel Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4033,
      price: { min: 589519, max: 720523, avg: 655021 },
      owners: [ Factions.argon ],
      thrust: { forward: 4841, reverse: 4357 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 278 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 113 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_allround_01_mk1',
      name: 'ARG M All-round Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 11767, max: 14382, avg: 13074 },
      owners: [ Factions.argon ],
      thrust: { forward: 1094, reverse: 1039 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_allround_01_mk2',
      name: 'ARG M All-round Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 58166, max: 71092, avg: 64629 },
      owners: [ Factions.argon ],
      thrust: { forward: 1323, reverse: 1341 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 18 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 22 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_allround_01_mk3',
      name: 'ARG M All-round Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 287722, max: 351660, avg: 319691 },
      owners: [ Factions.argon ],
      thrust: { forward: 1477, reverse: 1542 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 90 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 110 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_combat_01_mk1',
      name: 'ARG M Combat Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 14357, max: 17547, avg: 15952 },
      owners: [ Factions.argon ],
      thrust: { forward: 1148, reverse: 1206 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_combat_01_mk2',
      name: 'ARG M Combat Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 69711, max: 85202, avg: 77457 },
      owners: [ Factions.argon ],
      thrust: { forward: 1390, reverse: 1605 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 22 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 26 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_combat_01_mk3',
      name: 'ARG M Combat Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 345444, max: 422209, avg: 383827 },
      owners: [ Factions.argon ],
      thrust: { forward: 1550, reverse: 1872 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 110 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 130 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_travel_01_mk1',
      name: 'ARG M Travel Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 13062, max: 15964, avg: 14513 },
      owners: [ Factions.argon ],
      thrust: { forward: 1094, reverse: 984 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_travel_01_mk2',
      name: 'ARG M Travel Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 65234, max: 79730, avg: 72482 },
      owners: [ Factions.argon ],
      thrust: { forward: 1323, reverse: 1191 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 20 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_m_travel_01_mk3',
      name: 'ARG M Travel Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 331013, max: 404572, avg: 367793 },
      owners: [ Factions.argon ],
      thrust: { forward: 1477, reverse: 1329 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 105 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 125 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_allround_01_mk1',
      name: 'ARG S All-round Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 5526, max: 6754, avg: 6140 },
      owners: [ Factions.argon ],
      thrust: { forward: 396, reverse: 416 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_allround_01_mk2',
      name: 'ARG S All-round Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 26370, max: 32230, avg: 29300 },
      owners: [ Factions.argon ],
      thrust: { forward: 479, reverse: 574 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 8 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_allround_01_mk3',
      name: 'ARG S All-round Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 123301, max: 150701, avg: 137001 },
      owners: [ Factions.argon ],
      thrust: { forward: 535, reverse: 679 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 40 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 45 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_combat_01_mk1',
      name: 'ARG S Combat Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 8116, max: 9919, avg: 9017 },
      owners: [ Factions.argon ],
      thrust: { forward: 416, reverse: 499 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_combat_01_mk2',
      name: 'ARG S Combat Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 40504, max: 49505, avg: 45005 },
      owners: [ Factions.argon ],
      thrust: { forward: 503, reverse: 710 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 12 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_combat_01_mk3',
      name: 'ARG S Combat Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 181023, max: 221250, avg: 201137 },
      owners: [ Factions.argon ],
      thrust: { forward: 561, reverse: 850 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 60 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 65 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_travel_01_mk1',
      name: 'ARG S Travel Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 6821, max: 8336, avg: 7579 },
      owners: [ Factions.argon ],
      thrust: { forward: 396, reverse: 396 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_travel_01_mk2',
      name: 'ARG S Travel Engine Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 34732, max: 42450, avg: 38591 },
      owners: [ Factions.argon ],
      thrust: { forward: 479, reverse: 499 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 10 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 14 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_s_travel_01_mk3',
      name: 'ARG S Travel Engine Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 166592, max: 203613, avg: 185103 },
      owners: [ Factions.argon ],
      thrust: { forward: 535, reverse: 568 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 55 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 60 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_xl_allround_01_mk1',
      name: 'ARG XL All-round Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 12193,
      price: { min: 424061, max: 518297, avg: 471179 },
      owners: [ Factions.argon ],
      thrust: { forward: 14571, reverse: 16028 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 193 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 89 },
            ],
         },
      ]
   },
   {
      id: 'engine_arg_xl_travel_01_mk1',
      name: 'ARG XL Travel Engine Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 9955,
      price: { min: 748675, max: 915047, avg: 831861 },
      owners: [ Factions.argon ],
      thrust: { forward: 13877, reverse: 12490 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 349 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 148 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_l_allround_01_mk1',
      name: 'PAR L All-round Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4018,
      price: { min: 321518, max: 392966, avg: 357242 },
      owners: [ Factions.paranid ],
      thrust: { forward: 5235, reverse: 5759 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 147 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 67 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_l_travel_01_mk1',
      name: 'PAR L Travel Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4018,
      price: { min: 589519, max: 720523, avg: 655021 },
      owners: [ Factions.paranid ],
      thrust: { forward: 4986, reverse: 4488 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 278 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 113 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_allround_01_mk1',
      name: 'PAR M All-round Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 11767, max: 14382, avg: 13074 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1127, reverse: 1070 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_allround_01_mk2',
      name: 'PAR M All-round Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 58166, max: 71092, avg: 64629 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1363, reverse: 1381 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 18 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 22 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_allround_01_mk3',
      name: 'PAR M All-round Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 287722, max: 351660, avg: 319691 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1521, reverse: 1588 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 90 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 110 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_combat_01_mk1',
      name: 'PAR M Combat Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 14357, max: 17547, avg: 15952 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1183, reverse: 1242 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_combat_01_mk2',
      name: 'PAR M Combat Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 69711, max: 85202, avg: 77457 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1431, reverse: 1654 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 22 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 26 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_combat_01_mk3',
      name: 'PAR M Combat Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 345444, max: 422209, avg: 383827 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1597, reverse: 1928 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 110 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 130 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_travel_01_mk1',
      name: 'PAR M Travel Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 13062, max: 15964, avg: 14513 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1127, reverse: 1014 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_travel_01_mk2',
      name: 'PAR M Travel Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 65234, max: 79730, avg: 72482 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1363, reverse: 1227 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 20 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_m_travel_01_mk3',
      name: 'PAR M Travel Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 331013, max: 404572, avg: 367793 },
      owners: [ Factions.paranid ],
      thrust: { forward: 1521, reverse: 1369 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 105 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 125 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_allround_01_mk1',
      name: 'PAR S All-round Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 5526, max: 6754, avg: 6140 },
      owners: [ Factions.paranid ],
      thrust: { forward: 408, reverse: 428 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_allround_01_mk2',
      name: 'PAR S All-round Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 26370, max: 32230, avg: 29300 },
      owners: [ Factions.paranid ],
      thrust: { forward: 494, reverse: 591 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 8 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_allround_01_mk3',
      name: 'PAR S All-round Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 123301, max: 150701, avg: 137001 },
      owners: [ Factions.paranid ],
      thrust: { forward: 551, reverse: 700 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 40 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 45 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_combat_01_mk1',
      name: 'PAR S Combat Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 8116, max: 9919, avg: 9017 },
      owners: [ Factions.paranid ],
      thrust: { forward: 428, reverse: 514 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_combat_01_mk2',
      name: 'PAR S Combat Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 40504, max: 49505, avg: 45005 },
      owners: [ Factions.paranid ],
      thrust: { forward: 518, reverse: 731 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 12 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_combat_01_mk3',
      name: 'PAR S Combat Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 181023, max: 221250, avg: 201137 },
      owners: [ Factions.paranid ],
      thrust: { forward: 578, reverse: 876 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 60 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 65 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_travel_01_mk1',
      name: 'PAR S Travel Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 6821, max: 8336, avg: 7579 },
      owners: [ Factions.paranid ],
      thrust: { forward: 408, reverse: 408 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_travel_01_mk2',
      name: 'PAR S Travel Engine Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 34732, max: 42450, avg: 38591 },
      owners: [ Factions.paranid ],
      thrust: { forward: 494, reverse: 514 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 10 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 14 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_s_travel_01_mk3',
      name: 'PAR S Travel Engine Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 166592, max: 203613, avg: 185103 },
      owners: [ Factions.paranid ],
      thrust: { forward: 551, reverse: 585 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 55 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 60 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_xl_allround_01_mk1',
      name: 'PAR XL All-round Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 9899,
      price: { min: 424061, max: 518297, avg: 471179 },
      owners: [ Factions.paranid ],
      thrust: { forward: 15008, reverse: 16509 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 193 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 89 },
            ],
         },
      ]
   },
   {
      id: 'engine_par_xl_travel_01_mk1',
      name: 'PAR XL Travel Engine Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 9955,
      price: { min: 748675, max: 915047, avg: 831861 },
      owners: [ Factions.paranid ],
      thrust: { forward: 14294, reverse: 12864 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 349 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 148 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_l_allround_01_mk1',
      name: 'TEL L All-round Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4018,
      price: { min: 321235, max: 392621, avg: 356928 },
      owners: [ Factions.teladi ],
      thrust: { forward: 4930, reverse: 5424 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 147 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 67 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_l_travel_01_mk1',
      name: 'TEL L Travel Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4018,
      price: { min: 588999, max: 719887, avg: 654443 },
      owners: [ Factions.teladi ],
      thrust: { forward: 4696, reverse: 4226 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 278 },
               { ware: 'energycells', amount: 25 },
               { ware: 'engineparts', amount: 113 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_allround_01_mk1',
      name: 'TEL M All-round Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 11757, max: 14370, avg: 13064 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1061, reverse: 1008 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_allround_01_mk2',
      name: 'TEL M All-round Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 58118, max: 71033, avg: 64575 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1284, reverse: 1301 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 18 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 22 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_allround_01_mk3',
      name: 'TEL M All-round Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 287479, max: 351363, avg: 319421 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1432, reverse: 1496 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 90 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 110 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_combat_01_mk1',
      name: 'TEL M Combat Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 14345, max: 17533, avg: 15939 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1114, reverse: 1170 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_combat_01_mk2',
      name: 'TEL M Combat Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 69652, max: 85131, avg: 77391 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1348, reverse: 1557 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 22 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 26 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_combat_01_mk3',
      name: 'TEL M Combat Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 345151, max: 421851, avg: 383501 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1504, reverse: 1816 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 110 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 130 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_travel_01_mk1',
      name: 'TEL M Travel Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 13051, max: 15952, avg: 14501 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1061, reverse: 955 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 15 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_travel_01_mk2',
      name: 'TEL M Travel Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 65179, max: 79663, avg: 72421 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1284, reverse: 1155 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 20 },
               { ware: 'energycells', amount: 30 },
               { ware: 'engineparts', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_m_travel_01_mk3',
      name: 'TEL M Travel Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 330733, max: 404229, avg: 367481 },
      owners: [ Factions.teladi ],
      thrust: { forward: 1432, reverse: 1289 },
      production: [
         {
            time: 15,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 105 },
               { ware: 'energycells', amount: 60 },
               { ware: 'engineparts', amount: 125 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_allround_01_mk1',
      name: 'TEL S All-round Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 5522, max: 6749, avg: 6135 },
      owners: [ Factions.teladi ],
      thrust: { forward: 384, reverse: 403 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_allround_01_mk2',
      name: 'TEL S All-round Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 26348, max: 32203, avg: 29276 },
      owners: [ Factions.teladi ],
      thrust: { forward: 465, reverse: 557 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 8 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_allround_01_mk3',
      name: 'TEL S All-round Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 123197, max: 150574, avg: 136885 },
      owners: [ Factions.teladi ],
      thrust: { forward: 519, reverse: 659 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 40 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 45 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_combat_01_mk1',
      name: 'TEL S Combat Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 8110, max: 9912, avg: 9011 },
      owners: [ Factions.teladi ],
      thrust: { forward: 403, reverse: 484 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_combat_01_mk2',
      name: 'TEL S Combat Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 40471, max: 49464, avg: 44967 },
      owners: [ Factions.teladi ],
      thrust: { forward: 488, reverse: 688 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 12 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_combat_01_mk3',
      name: 'TEL S Combat Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 180869, max: 221062, avg: 200966 },
      owners: [ Factions.teladi ],
      thrust: { forward: 544, reverse: 825 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 60 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 65 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_travel_01_mk1',
      name: 'TEL S Travel Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 6816, max: 8330, avg: 7573 },
      owners: [ Factions.teladi ],
      thrust: { forward: 384, reverse: 384 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_travel_01_mk2',
      name: 'TEL S Travel Engine Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 34703, max: 42415, avg: 38559 },
      owners: [ Factions.teladi ],
      thrust: { forward: 465, reverse: 484 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 10 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 14 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_s_travel_01_mk3',
      name: 'TEL S Travel Engine Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 166451, max: 203440, avg: 184946 },
      owners: [ Factions.teladi ],
      thrust: { forward: 519, reverse: 551 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 55 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 60 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_xl_allround_01_mk1',
      name: 'TEL XL All-round Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 9939,
      price: { min: 423689, max: 517843, avg: 470766 },
      owners: [ Factions.teladi ],
      thrust: { forward: 14134, reverse: 15547 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 193 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 89 },
            ],
         },
      ]
   },
   {
      id: 'engine_tel_xl_travel_01_mk1',
      name: 'TEL XL Travel Engine Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 9955,
      price: { min: 748015, max: 914241, avg: 831128 },
      owners: [ Factions.teladi ],
      thrust: { forward: 14134, reverse: 15547 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 349 },
               { ware: 'energycells', amount: 50 },
               { ware: 'engineparts', amount: 148 },
            ],
         },
      ]
   },
   {
      id: 'engine_xen_l_allround_01_mk1',
      name: 'XEN L All-round Engine Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      hull: 4033,
      price: { min: 321322, max: 392726, avg: 357024 },
      owners: [ Factions.xenon ],
      thrust: { forward: 5083, reverse: 5591 },
      production: [
         {
            time: 8,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'ore', amount: 411 },
               { ware: 'silicon', amount: 411 },
            ],
         },
      ]
   },
   {
      id: 'engine_xen_m_combat_01_mk1',
      name: 'XEN M Combat Engine Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 15811, max: 19325, avg: 17568 },
      owners: [ Factions.xenon ],
      thrust: { forward: 1403, reverse: 1662 },
      production: [
         {
            time: 4,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 19 },
               { ware: 'silicon', amount: 19 },
            ],
         },
      ]
   },
   {
      id: 'engine_xen_m_travel_01_mk1',
      name: 'XEN M Travel Engine Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 14256, max: 17424, avg: 15840 },
      owners: [ Factions.xenon ],
      thrust: { forward: 1336, reverse: 1125 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 17 },
               { ware: 'silicon', amount: 17 },
            ],
         },
      ]
   },
   {
      id: 'engine_xen_s_combat_01_mk1',
      name: 'XEN S Combat Engine Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 6134, max: 7498, avg: 6816 },
      owners: [ Factions.xenon ],
      thrust: { forward: 503, reverse: 768 },
      production: [
         {
            time: 2,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 7 },
               { ware: 'silicon', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'engine_xen_xl_allround_01_mk1',
      name: 'XEN XL All-round Engine Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.engines,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      hull: 29561,
      price: { min: 424138, max: 518390, avg: 471264 },
      owners: [ Factions.xenon ],
      thrust: { forward: 14571, reverse: 16028 },
      production: [
         {
            time: 16,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'ore', amount: 541 },
               { ware: 'silicon', amount: 541 },
            ],
         },
      ]
   },
   {
      id: 'missile_cluster_heavy_mk1',
      name: 'Heavy Cluster Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 12141,
      hull: 913,
      price: { min: 1530, max: 2070, avg: 1800 },
      production: [
         {
            time: 3,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 30 },
               { ware: 'missilecomponents', amount: 12 },
            ],
         },
         {
            time: 3,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 8 },
               { ware: 'ore', amount: 4 },
               { ware: 'silicon', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'missile_cluster_light_mk1',
      name: 'Light Cluster Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 6745,
      hull: 326,
      price: { min: 680, max: 920, avg: 800 },
      production: [
         {
            time: 1.5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'missilecomponents', amount: 4 },
            ],
         },
         {
            time: 2,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 6 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_dumbfire_heavy_mk1',
      name: 'Heavy Dumbfire Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 3960,
      hull: 59,
      price: { min: 451, max: 610, avg: 530 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 7 },
               { ware: 'missilecomponents', amount: 5 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 2 },
               { ware: 'ore', amount: 1 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_dumbfire_heavy_mk2',
      name: 'Heavy Dumbfire Missile Mk2',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 4320,
      hull: 65,
      price: { min: 1539, max: 2082, avg: 1810 },
      production: [
         {
            time: 1.5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 14 },
               { ware: 'missilecomponents', amount: 25 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 9 },
               { ware: 'ore', amount: 4 },
               { ware: 'silicon', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'missile_dumbfire_light_mk1',
      name: 'Light Dumbfire Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 2200,
      hull: 21,
      price: { min: 213, max: 288, avg: 250 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'missilecomponents', amount: 1 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 1 },
               { ware: 'ore', amount: 1 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_dumbfire_light_mk2',
      name: 'Light Dumbfire Missile Mk2',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 2400,
      hull: 23,
      price: { min: 553, max: 748, avg: 650 },
      production: [
         {
            time: 1.5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'missilecomponents', amount: 5 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 2 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_emp_mk1',
      name: 'EMP Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 0,
      hull: 23,
      price: { min: 808, max: 1093, avg: 950 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'missilecomponents', amount: 11 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_guided_heavy_mk1',
      name: 'Heavy Guided Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 3520,
      hull: 72,
      price: { min: 1915, max: 2590, avg: 2253 },
      production: [
         {
            time: 2,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 16 },
               { ware: 'missilecomponents', amount: 3 },
               { ware: 'smartchips', amount: 3 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 16 },
               { ware: 'ore', amount: 5 },
               { ware: 'silicon', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'missile_guided_light_mk1',
      name: 'Light Guided Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 1956,
      hull: 26,
      price: { min: 729, max: 986, avg: 858 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 8 },
               { ware: 'missilecomponents', amount: 1 },
               { ware: 'smartchips', amount: 1 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_heatseeker_heavy_mk1',
      name: 'Heavy Heatseeker Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 3592,
      hull: 63,
      price: { min: 2178, max: 2947, avg: 2563 },
      production: [
         {
            time: 4,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'missilecomponents', amount: 6 },
               { ware: 'smartchips', amount: 3 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 5 },
               { ware: 'silicon', amount: 4 },
            ],
         },
      ]
   },
   {
      id: 'missile_heatseeker_light_mk1',
      name: 'Light Heatseeker Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 1995,
      hull: 23,
      price: { min: 839, max: 1136, avg: 988 },
      production: [
         {
            time: 2,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'missilecomponents', amount: 2 },
               { ware: 'smartchips', amount: 1 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 1 },
               { ware: 'silicon', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'missile_smart_heavy_mk1',
      name: 'Heavy Smart Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 3378,
      hull: 81,
      price: { min: 2465, max: 3335, avg: 2900 },
      production: [
         {
            time: 2,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'missilecomponents', amount: 3 },
               { ware: 'smartchips', amount: 4 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 6 },
               { ware: 'silicon', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'missile_smart_light_mk1',
      name: 'Light Smart Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 1877,
      hull: 29,
      price: { min: 1211, max: 1639, avg: 1425 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'missilecomponents', amount: 1 },
               { ware: 'smartchips', amount: 2 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 3 },
               { ware: 'silicon', amount: 2 },
            ],
         },
      ]
   },
   {
      id: 'missile_swarm_heavy_mk1',
      name: 'Heavy Swarm Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 690,
      hull: 77,
      price: { min: 1934, max: 2616, avg: 2275 },
      production: [
         {
            time: 2,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'missilecomponents', amount: 10 },
               { ware: 'smartchips', amount: 2 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 4 },
               { ware: 'silicon', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'missile_swarm_light_mk1',
      name: 'Light Swarm Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 383,
      hull: 27,
      price: { min: 967, max: 1308, avg: 1138 },
      production: [
         {
            time: 1,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'missilecomponents', amount: 5 },
               { ware: 'smartchips', amount: 1 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 2 },
            ],
         },
      ]
   },
   {
      id: 'missile_torpedo_heavy_mk1',
      name: 'Heavy Torpedo Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 17246,
      hull: 194,
      price: { min: 17563, max: 23762, avg: 20663 },
      production: [
         {
            time: 6,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'missilecomponents', amount: 40 },
               { ware: 'smartchips', amount: 35 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'ore', amount: 30 },
               { ware: 'silicon', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'missile_torpedo_light_mk1',
      name: 'Light Torpedo Missile Mk1',
      description: 'No information available',
      type: EquipmentType.missiles,
      equipmentClass: EquipmentClass.missile,
      explosionDamage: 9581,
      hull: 69,
      price: { min: 3921, max: 5304, avg: 4613 },
      production: [
         {
            time: 3,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'missilecomponents', amount: 8 },
               { ware: 'smartchips', amount: 7 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'ore', amount: 20 },
               { ware: 'silicon', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_l_standard_01_mk1',
      name: 'ARG L Shield Generator Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 27769, rate: 262, delay: 27.9 },
      price: { min: 42166, max: 51536, avg: 46851 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'fieldcoils', amount: 13 },
               { ware: 'shieldcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_l_standard_01_mk2',
      name: 'ARG L Shield Generator Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 33059, rate: 405, delay: 27.9 },
      price: { min: 205644, max: 251343, avg: 228494 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 100 },
               { ware: 'fieldcoils', amount: 65 },
               { ware: 'shieldcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_m_standard_01_mk1',
      name: 'ARG M Shield Generator Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3680, rate: 47, delay: 23.1 },
      price: { min: 12838, max: 15691, avg: 14264 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_m_standard_01_mk2',
      name: 'ARG M Shield Generator Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4381, rate: 73, delay: 23.1 },
      price: { min: 62115, max: 75918, avg: 69017 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'fieldcoils', amount: 15 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_m_standard_02_mk1',
      name: 'ARG M Shield Generator Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3680, rate: 47, delay: 23.1 },
      price: { min: 12838, max: 15691, avg: 14264 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_m_standard_02_mk2',
      name: 'ARG M Shield Generator Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4381, rate: 73, delay: 23.1 },
      price: { min: 61597, max: 75285, avg: 68441 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'fieldcoils', amount: 15 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_s_standard_01_mk1',
      name: 'ARG S Shield Generator Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 827, rate: 82, delay: 12.1 },
      price: { min: 1218, max: 1489, avg: 1354 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'shieldcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_s_standard_01_mk2',
      name: 'ARG S Shield Generator Mk2',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 988, rate: 128, delay: 12.1 },
      price: { min: 10186, max: 12449, avg: 11318 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'fieldcoils', amount: 2 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_s_standard_01_mk3',
      name: 'ARG S Shield Generator Mk3',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 1411, rate: 219, delay: 12.1 },
      price: { min: 49892, max: 60979, avg: 55436 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 10 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_arg_xl_standard_01_mk1',
      name: 'ARG XL Shield Generator Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.extralarge,
      hull: 6000,
      recharge: { max: 92565, rate: 637, delay: 34.5 },
      price: { min: 225671, max: 275820, avg: 250745 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 150 },
               { ware: 'fieldcoils', amount: 82 },
               { ware: 'shieldcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_l_standard_01_mk1',
      name: 'PAR L Shield Generator Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 24992, rate: 277, delay: 23.7 },
      price: { min: 42166, max: 51536, avg: 46851 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'fieldcoils', amount: 13 },
               { ware: 'shieldcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_l_standard_01_mk2',
      name: 'PAR L Shield Generator Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 29753, rate: 429, delay: 23.7 },
      price: { min: 205644, max: 251343, avg: 228494 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 100 },
               { ware: 'fieldcoils', amount: 65 },
               { ware: 'shieldcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_m_standard_01_mk1',
      name: 'PAR M Shield Generator Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3312, rate: 50, delay: 19.6 },
      price: { min: 12838, max: 15691, avg: 14264 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_m_standard_01_mk2',
      name: 'PAR M Shield Generator Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3943, rate: 77, delay: 19.6 },
      price: { min: 62115, max: 75918, avg: 69017 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'fieldcoils', amount: 15 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_m_standard_02_mk1',
      name: 'PAR M Shield Generator Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3312, rate: 50, delay: 19.6 },
      price: { min: 12015, max: 14685, avg: 13350 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_m_standard_02_mk2',
      name: 'PAR M Shield Generator Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3943, rate: 77, delay: 19.6 },
      price: { min: 26058, max: 31849, avg: 28954 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'fieldcoils', amount: 9 },
               { ware: 'shieldcomponents', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_s_standard_01_mk1',
      name: 'PAR S Shield Generator Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 745, rate: 87, delay: 10.2 },
      price: { min: 1218, max: 1489, avg: 1354 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'shieldcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_s_standard_01_mk2',
      name: 'PAR S Shield Generator Mk2',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 889, rate: 135, delay: 10.2 },
      price: { min: 10186, max: 12449, avg: 11318 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'fieldcoils', amount: 2 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_s_standard_01_mk3',
      name: 'PAR S Shield Generator Mk3',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 1270, rate: 232, delay: 10.2 },
      price: { min: 49892, max: 60979, avg: 55436 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 10 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_par_xl_standard_01_mk1',
      name: 'PAR XL Shield Generator Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.extralarge,
      hull: 6000,
      recharge: { max: 83308, rate: 674, delay: 29.3 },
      price: { min: 225671, max: 275820, avg: 250745 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 150 },
               { ware: 'fieldcoils', amount: 82 },
               { ware: 'shieldcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_l_standard_01_mk1',
      name: 'TEL L Shield Generator Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 30546, rate: 250, delay: 41.6 },
      price: { min: 42166, max: 51536, avg: 46851 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'fieldcoils', amount: 13 },
               { ware: 'shieldcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_l_standard_01_mk2',
      name: 'TEL L Shield Generator Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 36365, rate: 387, delay: 41.6 },
      price: { min: 205644, max: 251343, avg: 228494 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 100 },
               { ware: 'fieldcoils', amount: 65 },
               { ware: 'shieldcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_m_standard_01_mk1',
      name: 'TEL M Shield Generator Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4048, rate: 45, delay: 26.5 },
      price: { min: 12838, max: 15691, avg: 14264 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_m_standard_01_mk2',
      name: 'TEL M Shield Generator Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4819, rate: 70, delay: 26.5 },
      price: { min: 62115, max: 75918, avg: 69017 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'fieldcoils', amount: 15 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_m_standard_02_mk1',
      name: 'TEL M Shield Generator Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4048, rate: 45, delay: 26.5 },
      price: { min: 12015, max: 14685, avg: 13350 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 3 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_m_standard_02_mk2',
      name: 'TEL M Shield Generator Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 4819, rate: 70, delay: 26.5 },
      price: { min: 26058, max: 31849, avg: 28954 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'fieldcoils', amount: 9 },
               { ware: 'shieldcomponents', amount: 6 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_s_standard_01_mk1',
      name: 'TEL S Shield Generator Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 910, rate: 79, delay: 13.9 },
      price: { min: 1218, max: 1489, avg: 1354 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'shieldcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_s_standard_01_mk2',
      name: 'TEL S Shield Generator Mk2',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 1087, rate: 122, delay: 13.9 },
      price: { min: 10186, max: 12449, avg: 11318 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'fieldcoils', amount: 2 },
               { ware: 'shieldcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_s_standard_01_mk3',
      name: 'TEL S Shield Generator Mk3',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 1552, rate: 210, delay: 13.9 },
      price: { min: 49892, max: 60979, avg: 55436 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'fieldcoils', amount: 10 },
               { ware: 'shieldcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'shield_tel_xl_standard_01_mk1',
      name: 'TEL XL Shield Generator Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.extralarge,
      hull: 6000,
      recharge: { max: 101821, rate: 609, delay: 51.6 },
      price: { min: 225671, max: 275820, avg: 250745 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 150 },
               { ware: 'fieldcoils', amount: 82 },
               { ware: 'shieldcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_l_standard_01_mk1',
      name: 'XEN L Shield Generator Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 23604, rate: 262, delay: 30.8 },
      price: { min: 41386, max: 50582, avg: 45984 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'ore', amount: 51 },
               { ware: 'silicon', amount: 51 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_l_standard_01_mk2',
      name: 'XEN L Shield Generator Mk2',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.large,
      hull: 2000,
      recharge: { max: 28100, rate: 405, delay: 30.8 },
      price: { min: 110765, max: 135379, avg: 123072 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 50 },
               { ware: 'ore', amount: 138 },
               { ware: 'silicon', amount: 138 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_m_standard_01_mk1',
      name: 'XEN M Shield Generator Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3128, rate: 47, delay: 25.5 },
      price: { min: 13478, max: 16474, avg: 14976 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 16 },
               { ware: 'silicon', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_m_standard_01_mk2',
      name: 'XEN M Shield Generator Mk2',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3723, rate: 73, delay: 19.6 },
      price: { min: 27821, max: 34003, avg: 30912 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 34 },
               { ware: 'silicon', amount: 34 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_m_standard_02_mk1',
      name: 'XEN M Shield Generator Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3128, rate: 47, delay: 25.5 },
      price: { min: 13478, max: 16474, avg: 14976 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 16 },
               { ware: 'silicon', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_m_standard_02_mk2',
      name: 'XEN M Shield Generator Mk2',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.medium,
      hull: 500,
      recharge: { max: 3723, rate: 73, delay: 25.5 },
      price: { min: 27821, max: 34003, avg: 30912 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 34 },
               { ware: 'silicon', amount: 34 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_s_standard_01_mk1',
      name: 'XEN S Shield Generator Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 703, rate: 82, delay: 13.3 },
      price: { min: 1901, max: 2323, avg: 2112 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 2 },
               { ware: 'silicon', amount: 2 },
            ],
         },
      ]
   },
   {
      id: 'shield_xen_s_standard_01_mk2',
      name: 'XEN S Shield Generator Mk2',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.shields,
      equipmentClass: EquipmentClass.shieldgenerator,
      size: Size.small,
      recharge: { max: 840, rate: 128, delay: 13.3 },
      price: { min: 4579, max: 5597, avg: 5088 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 5 },
               { ware: 'silicon', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'ship_arg_xs_police_01_a',
      name: 'Argon Station Security Vessel',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 281,
      price: { min: 11182, max: 15128, avg: 13155 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_s_fightingdrone_01_a',
      name: 'Defence Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_s,
      hull: 1900,
      price: { min: 11902, max: 16103, avg: 14003 },
      production: [
         {
            time: 90,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 30 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 15 },
               { ware: 'ore', amount: 10 },
               { ware: 'silicon', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_s_miningdrone_liquid_01_a',
      name: 'Gas Collector Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_s,
      hull: 1700,
      price: { min: 15326, max: 20735, avg: 18030 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_s_miningdrone_solid_01_a',
      name: 'Mining Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_s,
      hull: 1700,
      price: { min: 15326, max: 20735, avg: 18030 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_xs_buildingdrone_01_a',
      name: 'Building Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 207,
      price: { min: 9654, max: 13061, avg: 11358 },
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
         {
            time: 3,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 14 },
               { ware: 'ore', amount: 20 },
               { ware: 'silicon', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_xs_cargodrone_empty_01_a',
      name: 'Cargo Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 523,
      price: { min: 10028, max: 13567, avg: 11798 },
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
         {
            time: 6,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 36 },
               { ware: 'ore', amount: 20 },
               { ware: 'silicon', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'ship_gen_xs_repairdrone_01_a',
      name: 'Repair Drone',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 207,
      price: { min: 9654, max: 13061, avg: 11358 },
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
         {
            time: 3,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 14 },
               { ware: 'ore', amount: 20 },
               { ware: 'silicon', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'ship_tel_xs_police_01_a',
      name: 'Teladi Station Security Vessel A',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 281,
      price: { min: 11182, max: 15128, avg: 13155 },
      owners: [ Factions.ministry, Factions.teladi ],
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'ship_tel_xs_police_02_a',
      name: 'Teladi Station Security Vessel B',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 281,
      price: { min: 11182, max: 15128, avg: 13155 },
      owners: [ Factions.ministry, Factions.teladi ],
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'ship_tel_xs_police_03_a',
      name: 'Teladi Station Security Vessel C',
      description: 'No information available',
      type: EquipmentType.drones,
      equipmentClass: EquipmentClass.ship_xs,
      hull: 281,
      price: { min: 11182, max: 15128, avg: 13155 },
      owners: [ Factions.ministry, Factions.teladi ],
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'dronecomponents', amount: 1 },
               { ware: 'energycells', amount: 50 },
               { ware: 'smartchips', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'software_dockmk1',
      name: 'Docking Computer Mk1',
      description: 'This flight software automates the final stages of the docking procedure.',
      price: { min: 5000, max: 10000, avg: 7500 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_dockmk2',
      name: 'Docking Computer Mk2',
      description: 'This flight software increases the range at which the docking procedure can be automated.',
      price: { min: 24576, max: 40960, avg: 32768 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_flightassistmk1',
      name: 'Flight Assist Software Mk1',
      description: 'This flight software assists a pilot by automatically compensating for drift when changing flight direction.',
      price: { min: 6825, max: 11375, avg: 9100 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_scannerlongrangemk1',
      name: 'Long-range Scanner Software Mk1',
      description: 'This scanning software provides a means to detect objects at great distances.',
      type: EquipmentType.software,
      equipmentClass: EquipmentClass.scanner,
      price: { min: 29274, max: 35779, avg: 32526 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_scannerlongrangemk2',
      name: 'Long-range Scanner Software Mk2',
      description: 'This scanning software increases scan resolution, allowing more accurate identification of certain types of objects.',
      type: EquipmentType.software,
      equipmentClass: EquipmentClass.scanner,
      price: { min: 58547, max: 71558, avg: 65052 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_scannerobjectmk1',
      name: 'Basic Scanner',
      description: 'This scanning software provides basic identification of nearby objects.',
      type: EquipmentType.software,
      equipmentClass: EquipmentClass.scanner,
      price: { min: 10907, max: 13331, avg: 12119 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_scannerobjectmk2',
      name: 'Police Scanner',
      description: 'This scanning software allows a pilot to inspect the contents of the cargo hold of another ship. Its use is illegal unless an appropriate police licence has been obtained.',
      type: EquipmentType.software,
      equipmentClass: EquipmentClass.scanner,
      price: { min: 36733, max: 44896, avg: 40815 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_targetmk1',
      name: 'Targeting Computer Extension Mk1',
      description: 'This targeting software allows a ship\'s targeting system to lock on to small objects such as debris and floating containers.',
      price: { min: 6144, max: 10240, avg: 8192 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'software_trademk1',
      name: 'Trading Computer Extension Mk1',
      description: 'This trading software maintains a link to potential buyers and sellers for a limited time, to provide current trade offer information.',
      price: { min: 8438, max: 14063, avg: 11250 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_l_allround_01_mk1',
      name: 'L All-round Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      price: { min: 253435, max: 309754, avg: 281595 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 120 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 48 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 324 },
               { ware: 'silicon', amount: 324 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_l_allround_01_mk2',
      name: 'L All-round Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      price: { min: 1266139, max: 1547503, avg: 1406821 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 600 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 240 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 648 },
               { ware: 'silicon', amount: 648 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_l_allround_01_mk3',
      name: 'L All-round Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.large,
      price: { min: 6328619, max: 7734979, avg: 7031799 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 20,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3000 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 1200 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'ore', amount: 1296 },
               { ware: 'silicon', amount: 1296 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_allround_01_mk1',
      name: 'M All-round Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 11717, max: 14321, avg: 13019 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 4 },
               { ware: 'energycells', amount: 5 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 15 },
               { ware: 'silicon', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_allround_01_mk2',
      name: 'M All-round Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 58067, max: 70971, avg: 64519 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 20 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 20 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 30 },
               { ware: 'silicon', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_allround_01_mk3',
      name: 'M All-round Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 289300, max: 353589, avg: 321445 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 100 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 100 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 60 },
               { ware: 'silicon', amount: 60 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_combat_01_mk1',
      name: 'M Combat Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 14899, max: 18210, avg: 16555 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 6 },
               { ware: 'energycells', amount: 5 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 19 },
               { ware: 'silicon', amount: 19 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_combat_01_mk2',
      name: 'M Combat Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 73978, max: 90418, avg: 82198 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 30 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 20 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 38 },
               { ware: 'silicon', amount: 38 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_m_combat_01_mk3',
      name: 'M Combat Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.medium,
      price: { min: 368854, max: 450821, avg: 409838 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 150 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 100 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 76 },
               { ware: 'silicon', amount: 76 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_allround_01_mk1',
      name: 'S All-round Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 5353, max: 6542, avg: 5948 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'engineparts', amount: 4 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 7 },
               { ware: 'silicon', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_allround_01_mk2',
      name: 'S All-round Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 83968, max: 102627, avg: 93298 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 20 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 40 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 14 },
               { ware: 'silicon', amount: 14 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_allround_01_mk3',
      name: 'S All-round Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 199757, max: 244147, avg: 221952 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 60 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 80 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 28 },
               { ware: 'silicon', amount: 28 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_combat_01_mk1',
      name: 'S Combat Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 6241, max: 7628, avg: 6934 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 3 },
               { ware: 'energycells', amount: 5 },
               { ware: 'engineparts', amount: 1 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 8 },
               { ware: 'silicon', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_combat_01_mk2',
      name: 'S Combat Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 39752, max: 48586, avg: 44169 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 15 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 12 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 16 },
               { ware: 'silicon', amount: 16 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_s_combat_01_mk3',
      name: 'S Combat Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.small,
      price: { min: 157946, max: 193045, avg: 175495 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 50 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 60 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 32 },
               { ware: 'silicon', amount: 32 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_xl_allround_01_mk1',
      name: 'XL All-round Thrusters Mk1',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      price: { min: 538346, max: 657978, avg: 598162 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 260 },
               { ware: 'energycells', amount: 10 },
               { ware: 'engineparts', amount: 96 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 687 },
               { ware: 'silicon', amount: 687 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_xl_allround_01_mk2',
      name: 'XL All-round Thrusters Mk2',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      price: { min: 2690693, max: 3288625, avg: 2989659 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 1300 },
               { ware: 'energycells', amount: 20 },
               { ware: 'engineparts', amount: 480 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 20 },
               { ware: 'ore', amount: 1374 },
               { ware: 'silicon', amount: 1374 },
            ],
         },
      ]
   },
   {
      id: 'thruster_gen_xl_allround_01_mk3',
      name: 'XL All-round Thrusters Mk3',
      description: 'No information available',
      type: EquipmentType.thrusters,
      equipmentClass: EquipmentClass.engine,
      size: Size.extralarge,
      price: { min: 13451392, max: 16440590, avg: 14945991 },
      thrust: { forward: 0, reverse: 0 },
      production: [
         {
            time: 30,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'antimatterconverters', amount: 6500 },
               { ware: 'energycells', amount: 40 },
               { ware: 'engineparts', amount: 2400 },
            ],
         },
         {
            time: 10,
            amount: 1,
            method: 'xenon',
            name: 'Xenon',
            wares: [
               { ware: 'energycells', amount: 40 },
               { ware: 'ore', amount: 2748 },
               { ware: 'silicon', amount: 2748 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_beam_01_mk1',
      name: 'ARG L Beam Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 135464, max: 165567, avg: 150515 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 18 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_dumbfire_01_mk1',
      name: 'ARG L Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 67905, max: 82995, avg: 75450 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 9 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_guided_01_mk1',
      name: 'ARG L Tracking Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 78261, max: 95652, avg: 86957 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_laser_01_mk1',
      name: 'ARG L Pulse Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 52289, max: 63909, avg: 58099 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 4 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_mining_01_mk1',
      name: 'ARG L Mining Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 49166, max: 60092, avg: 54629 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 21 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_l_plasma_01_mk1',
      name: 'ARG L Plasma Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 93055, max: 113734, avg: 103395 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 39 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_beam_01_mk1',
      name: 'ARG M Beam Turret Mk1',
      description: 'Beam Turret',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 45385, max: 55471, avg: 50428 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_beam_02_mk1',
      name: 'ARG M Beam Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 45385, max: 55471, avg: 50428 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_dumbfire_02_mk1',
      name: 'ARG M Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 22865, max: 27946, avg: 25406 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_gatling_01_mk1',
      name: 'ARG M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 24665, max: 30147, avg: 27406 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_gatling_02_mk1',
      name: 'ARG M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 22857, max: 27936, avg: 25397 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_guided_02_mk1',
      name: 'ARG M Tracking Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 26317, max: 32166, avg: 29242 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_laser_01_mk1',
      name: 'ARG M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 21378, max: 26128, avg: 23753 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_laser_02_mk1',
      name: 'ARG M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 21378, max: 26128, avg: 23753 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_mining_01_mk1',
      name: 'ARG M Mining Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 16446, max: 20101, avg: 18274 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_mining_02_mk1',
      name: 'ARG M Mining Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 593,
      price: { min: 16446, max: 20101, avg: 18274 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_plasma_01_mk1',
      name: 'ARG M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 31249, max: 38193, avg: 34721 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_plasma_02_mk1',
      name: 'ARG M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 31249, max: 38193, avg: 34721 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_shotgun_01_mk1',
      name: 'ARG M Shard Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 22857, max: 27936, avg: 25397 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_arg_m_shotgun_02_mk1',
      name: 'ARG M Shard Turret Mk1',
      description: 'No information available',
      race: Races.argon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 24665, max: 30147, avg: 27406 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_beam_01_mk1',
      name: 'PAR L Beam Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2298,
      price: { min: 135464, max: 165567, avg: 150515 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 18 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_dumbfire_01_mk1',
      name: 'PAR L Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 67905, max: 82995, avg: 75450 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 9 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_guided_01_mk1',
      name: 'PAR L Tracking Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 78261, max: 95652, avg: 86957 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_laser_01_mk1',
      name: 'PAR L Pulse Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 52289, max: 63909, avg: 58099 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 4 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_mining_01_mk1',
      name: 'PAR L Mining Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 49166, max: 60092, avg: 54629 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 21 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_l_plasma_01_mk1',
      name: 'PAR L Plasma Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 93055, max: 113734, avg: 103395 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 39 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_beam_01_mk1',
      name: 'PAR M Beam Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 45385, max: 55471, avg: 50428 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_beam_02_mk1',
      name: 'PAR M Beam Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 24665, max: 30147, avg: 27406 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_dumbfire_02_mk1',
      name: 'PAR M Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 31249, max: 38193, avg: 34721 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_gatling_01_mk1',
      name: 'PAR M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 24665, max: 30147, avg: 27406 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_gatling_02_mk1',
      name: 'PAR M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 26317, max: 32166, avg: 29242 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_guided_02_mk1',
      name: 'PAR M Tracking Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 45385, max: 55471, avg: 50428 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_laser_01_mk1',
      name: 'PAR M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 21378, max: 26128, avg: 23753 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_laser_02_mk1',
      name: 'PAR M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 16446, max: 20101, avg: 18274 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_mining_01_mk1',
      name: 'PAR M Mining Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 16446, max: 20101, avg: 18274 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_mining_02_mk1',
      name: 'PAR M Mining Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 22857, max: 27936, avg: 25397 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_plasma_01_mk1',
      name: 'PAR M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 31249, max: 38193, avg: 34721 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_plasma_02_mk1',
      name: 'PAR M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 21378, max: 26128, avg: 23753 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_shotgun_01_mk1',
      name: 'PAR M Shard Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 22857, max: 27936, avg: 25397 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_par_m_shotgun_02_mk1',
      name: 'PAR M Shard Turret Mk1',
      description: 'No information available',
      race: Races.paranid,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 22865, max: 27946, avg: 25406 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_beam_01_mk1',
      name: 'TEL L Beam Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2457,
      price: { min: 135460, max: 165562, avg: 150511 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 18 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_dumbfire_01_mk1',
      name: 'TEL L Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 67903, max: 82992, avg: 75447 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 9 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_guided_01_mk1',
      name: 'TEL L Tracking Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.large,
      hull: 5178,
      price: { min: 78257, max: 95647, avg: 86952 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_laser_01_mk1',
      name: 'TEL L Pulse Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2458,
      price: { min: 52286, max: 63906, avg: 58096 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 4 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_mining_01_mk1',
      name: 'TEL L Mining Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2394,
      price: { min: 49163, max: 60088, avg: 54626 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 21 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_l_plasma_01_mk1',
      name: 'TEL L Plasma Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2456,
      price: { min: 93050, max: 113728, avg: 103389 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 39 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_beam_01_mk1',
      name: 'TEL M Beam Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 45384, max: 55469, avg: 50426 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_beam_02_mk1',
      name: 'TEL M Beam Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 602,
      price: { min: 45384, max: 55469, avg: 50426 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_dumbfire_02_mk1',
      name: 'TEL M Dumbfire Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 22865, max: 27946, avg: 25405 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_gatling_01_mk1',
      name: 'TEL M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 24664, max: 30145, avg: 27404 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_gatling_02_mk1',
      name: 'TEL M Bolt Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 602,
      price: { min: 22856, max: 27935, avg: 25395 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_guided_02_mk1',
      name: 'TEL M Tracking Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.missileturret,
      size: Size.medium,
      hull: 1105,
      price: { min: 26316, max: 32164, avg: 29240 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_laser_01_mk1',
      name: 'TEL M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 21376, max: 26127, avg: 23752 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_laser_02_mk1',
      name: 'TEL M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 602,
      price: { min: 21376, max: 26127, avg: 23752 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_mining_01_mk1',
      name: 'TEL M Mining Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 16445, max: 20100, avg: 18273 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_mining_02_mk1',
      name: 'TEL M Mining Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 16445, max: 20100, avg: 18273 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_plasma_01_mk1',
      name: 'TEL M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 31247, max: 38191, avg: 34719 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_plasma_02_mk1',
      name: 'TEL M Plasma Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 602,
      price: { min: 31247, max: 38191, avg: 34719 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 10 },
               { ware: 'turretcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_shotgun_01_mk1',
      name: 'TEL M Shard Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 22856, max: 27935, avg: 25395 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'turret_tel_m_shotgun_02_mk1',
      name: 'TEL M Shard Turret Mk1',
      description: 'No information available',
      race: Races.teladi,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 602,
      price: { min: 24664, max: 30145, avg: 27404 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'turretcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'turret_xen_l_laser_01_mk1',
      name: 'XEN L Pulse Turret Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.large,
      hull: 2431,
      price: { min: 13392, max: 16368, avg: 14880 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 25 },
               { ware: 'ore', amount: 15 },
               { ware: 'silicon', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'turret_xen_m_beam_02_mk1',
      name: 'XEN M Beam Turret Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 511,
      price: { min: 23242, max: 28406, avg: 25824 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 29 },
               { ware: 'silicon', amount: 29 },
            ],
         },
      ]
   },
   {
      id: 'turret_xen_m_laser_01_mk1',
      name: 'XEN M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      price: { min: 23242, max: 28406, avg: 25824 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 29 },
               { ware: 'silicon', amount: 29 },
            ],
         },
      ]
   },
   {
      id: 'turret_xen_m_laser_02_mk1',
      name: 'XEN M Pulse Turret Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.turrets,
      equipmentClass: EquipmentClass.turret,
      size: Size.medium,
      hull: 595,
      price: { min: 23242, max: 28406, avg: 25824 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 29 },
               { ware: 'silicon', amount: 29 },
            ],
         },
      ]
   },
   {
      id: 'weapon_arg_l_destroyer_01_mk1',
      name: 'Behemoth Main Battery',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.large,
      hull: 8000,
      price: { min: 936709, max: 1144866, avg: 1040788 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 140 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 170 },
            ],
         },
      ]
   },
   {
      id: 'weapon_arg_m_ion_01_mk1',
      name: 'M Ion Blaster Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 25550, max: 31228, avg: 28389 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'weapon_arg_m_ion_01_mk2',
      name: 'M Ion Blaster Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 127231, max: 155505, avg: 141368 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 15 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 35 },
            ],
         },
      ]
   },
   {
      id: 'weapon_arg_s_ion_01_mk1',
      name: 'S Ion Blaster Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 8104, max: 9905, avg: 9005 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 2 },
            ],
         },
      ]
   },
   {
      id: 'weapon_arg_s_ion_01_mk2',
      name: 'S Ion Blaster Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 40003, max: 48893, avg: 44448 },
      owners: [ Factions.argon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_mine_01',
      name: 'Mine',
      description: 'Mines are a commonly-used static combat tool that explode and cause massive hull damage under a number of circumstances. Some explode on contact, some when a target comes within a certain range. Some even track their targets and can be programmed to recognise friend from foe.',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.mine,
      explosionDamage: 10000,
      hull: 100,
      price: { min: 4843, max: 6552, avg: 5698 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_mine_02',
      name: 'Tracker Mine',
      description: 'Tracker Mines are deadly devices that have two phases of operation. In the detection phase, the mine detects a valid target within outer detection range and initiates a limited manoeuvre to intercept the target. When it is deemed close enough to trigger, the second detection phase sees the mine\'s explosive payload detonate. Tracker Mines are less effective at chasing fast and agile targets, but can be incredibly dangerous when used in number or against larger and less agile targets.',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.mine,
      explosionDamage: 10000,
      hull: 100,
      price: { min: 9055, max: 12250, avg: 10653 },
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 7 },
               { ware: 'smartchips', amount: 10 },
               { ware: 'weaponcomponents', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_mine_03',
      name: 'Friend/Foe Mine',
      description: 'Friend/Foe Mines are equipped with specialist software that allows the user to program the mine not to respond to friendly targets. This is usually achieved over comm-frequency identification, and friendly targets must stay informed of changes to the frequency as not to accidentally fall foul of the mine\'s dangerous payload - this in of itself is almost always an automated process.',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.mine,
      explosionDamage: 10000,
      hull: 100,
      price: { min: 17478, max: 23647, avg: 20563 },
      production: [
         {
            time: 60,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 11 },
               { ware: 'smartchips', amount: 30 },
               { ware: 'weaponcomponents', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_beam_01_mk1',
      name: 'M Beam Emitter Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 25530, max: 31203, avg: 28367 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_beam_01_mk2',
      name: 'M Beam Emitter Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 127132, max: 155383, avg: 141257 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 10 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_dumbfire_01_mk1',
      name: 'M Dumbfire Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 22558, max: 27571, avg: 25064 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_dumbfire_01_mk2',
      name: 'M Dumbfire Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 111753, max: 136587, avg: 124170 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 15 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_gatling_01_mk1',
      name: 'M Bolt Repeater Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 23928, max: 29245, avg: 26586 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 12 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_gatling_01_mk2',
      name: 'M Bolt Repeater Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 119121, max: 145592, avg: 132356 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 60 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_guided_01_mk1',
      name: 'M Tracking Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 44770, max: 54719, avg: 49745 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 6 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_guided_01_mk2',
      name: 'M Tracking Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 222815, max: 272330, avg: 247572 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 30 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_laser_01_mk1',
      name: 'M Pulse Laser Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 20763, max: 25377, avg: 23070 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_laser_01_mk2',
      name: 'M Pulse Laser Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 103297, max: 126252, avg: 114775 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 50 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_mining_01_mk1',
      name: 'M Mining Drill Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 16016, max: 19575, avg: 17796 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 7 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_mining_01_mk2',
      name: 'M Mining Drill Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 79562, max: 97243, avg: 88402 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 35 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_plasma_01_mk1',
      name: 'M Plasma Cannon Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 30277, max: 37005, avg: 33641 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 13 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_plasma_01_mk2',
      name: 'M Plasma Cannon Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 150867, max: 184393, avg: 167630 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 10 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 65 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_shotgun_01_mk1',
      name: 'M Shard Battery Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 22365, max: 27335, avg: 24850 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 8 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_shotgun_01_mk2',
      name: 'M Shard Battery Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 111308, max: 136043, avg: 123676 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 10 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 40 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_torpedo_01_mk1',
      name: 'M Torpedo Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 78039, max: 95381, avg: 86710 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 8 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_m_torpedo_01_mk2',
      name: 'M Torpedo Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.medium,
      hull: 1001,
      price: { min: 389160, max: 475640, avg: 432400 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 40 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 125 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_beam_01_mk1',
      name: 'S Beam Emitter Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 23948, max: 29269, avg: 26609 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 2 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 9 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_beam_01_mk2',
      name: 'S Beam Emitter Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 104979, max: 128308, avg: 116643 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 10 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 36 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_dumbfire_01_mk1',
      name: 'S Dumbfire Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 6695, max: 8183, avg: 7439 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_dumbfire_01_mk2',
      name: 'S Dumbfire Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 13370, max: 16341, avg: 14855 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_gatling_01_mk1',
      name: 'S Bolt Repeater Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 43055, max: 52623, avg: 47839 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 8 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 3 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_gatling_01_mk2',
      name: 'S Bolt Repeater Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 214756, max: 262480, avg: 238618 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 40 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 15 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_guided_01_mk1',
      name: 'S Tracking Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 8277, max: 10117, avg: 9197 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 2 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_guided_01_mk2',
      name: 'S Tracking Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 40349, max: 49316, avg: 44832 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 10 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_laser_01_mk1',
      name: 'S Pulse Laser Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 16056, max: 19624, avg: 17840 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_laser_01_mk2',
      name: 'S Pulse Laser Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 79761, max: 97485, avg: 88623 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 15 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_mining_01_mk1',
      name: 'S Mining Drill Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 6522, max: 7971, avg: 7247 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 1 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_mining_01_mk2',
      name: 'S Mining Drill Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 32092, max: 39223, avg: 35658 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_plasma_01_mk1',
      name: 'S Plasma Cannon Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 12851, max: 15707, avg: 14279 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 1 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_plasma_01_mk2',
      name: 'S Plasma Cannon Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 55827, max: 68233, avg: 62030 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 5 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 20 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_shotgun_01_mk1',
      name: 'S Shard Battery Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 27152, max: 33186, avg: 30169 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 4 },
               { ware: 'energycells', amount: 5 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_shotgun_01_mk2',
      name: 'S Shard Battery Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      hull: 500,
      price: { min: 135242, max: 165296, avg: 150269 },
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 20 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_torpedo_01_mk1',
      name: 'S Torpedo Launcher Mk1',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 22558, max: 27571, avg: 25064 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 3 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 5 },
            ],
         },
      ]
   },
   {
      id: 'weapon_gen_s_torpedo_01_mk2',
      name: 'S Torpedo Launcher Mk2',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.missilelauncher,
      size: Size.small,
      hull: 500,
      price: { min: 111753, max: 136587, avg: 124170 },
      production: [
         {
            time: 5,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 15 },
               { ware: 'energycells', amount: 20 },
               { ware: 'weaponcomponents', amount: 25 },
            ],
         },
      ]
   },
   {
      id: 'weapon_par_l_destroyer_01_mk1',
      name: 'Odysseus Main Battery',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.large,
      hull: 8000,
      price: { min: 1000201, max: 1222468, avg: 1111335 },
      owners: [ Factions.paranid ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 150 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 180 },
            ],
         },
      ]
   },
   {
      id: 'weapon_tel_l_destroyer_01_mk1',
      name: 'Phoenix Main Battery',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.large,
      hull: 8000,
      price: { min: 873217, max: 1067265, avg: 970241 },
      owners: [ Factions.teladi ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'advancedelectronics', amount: 130 },
               { ware: 'energycells', amount: 10 },
               { ware: 'weaponcomponents', amount: 160 },
            ],
         },
      ]
   },
   {
      id: 'weapon_xen_m_laser_01_mk1',
      name: 'M Pulse Laser Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      hull: 1001,
      price: { min: 24019, max: 29357, avg: 26688 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 30 },
               { ware: 'silicon', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'weapon_xen_m_mining_01_mk1',
      name: 'M Mining Drill Mk1',
      description: 'No information available',
      race: Races.xenon,
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.medium,
      price: { min: 24019, max: 29357, avg: 26688 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 10,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 10 },
               { ware: 'ore', amount: 30 },
               { ware: 'silicon', amount: 30 },
            ],
         },
      ]
   },
   {
      id: 'weapon_xen_s_laser_01_mk1',
      name: 'Pulse Laser',
      description: 'No information available',
      type: EquipmentType.weapons,
      equipmentClass: EquipmentClass.weapon,
      size: Size.small,
      price: { min: 778, max: 950, avg: 864 },
      owners: [ Factions.xenon ],
      production: [
         {
            time: 4,
            amount: 1,
            method: 'default',
            name: 'Universal',
            wares: [
               { ware: 'energycells', amount: 5 },
               { ware: 'ore', amount: 2 },
            ],
         },
      ]
   },
];
