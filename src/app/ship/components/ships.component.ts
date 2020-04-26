import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Equipment, Race, Ship } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ShipService } from '../../shared/services/ship.service';
import { RaceService } from '../../shared/services/race.service';
import { Size } from '../../shared/services/data/size-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';
import { EnumFn } from '../../core/services/enum-fn';
import {EquipmentService} from '../../shared/services/equipment.service';
import {EquipmentType} from '../../shared/services/data/equipment-type-data';
import {CargoTypes} from '../../shared/services/data/cargo-types-data';

@Component({
   templateUrl: './ships.component.html'
})
export class ShipsComponent extends EntityListComponent<Ship> implements OnInit {
   sizes: string[];
   races: Race[];
   shipTypes: string[];
   engines: Equipment[];
   thrusters: Equipment[];
   purposes: string[];
   cargoTypes: CargoTypes[];

   constructor(entityService: ShipService,
               private raceService: RaceService,
               private equipmentService: EquipmentService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(entityService, router, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations / Split Vendetta - Ships');

      this.sizes = EnumFn.values(Size);
      this.shipTypes = EnumFn.values(ShipType);
      this.purposes = EnumFn.values(ShipPurpose);
      this.cargoTypes = EnumFn.values(CargoTypes);
      this.races = this.raceService.getEntities();

      this.engines = this.equipmentService.getEntities().filter(e => e.type === EquipmentType.engines);
      this.thrusters = this.equipmentService.getEntities().filter(e => e.type === EquipmentType.thrusters);
      super.ngOnInit();
   }

   maxSpeed = (entity: Ship) => {
      const compatibleEngines = this.compatibleEngines(entity);
      // calculate speed for each engine and take the fastest one.
      return compatibleEngines
         .map(engine => this.calculateMaxForwardSpeed(engine, entity))
         .reduce((max, x) => (x > max) ? x : max, 0);
   }

   // TODO parse the required data from engine macro (travel section). Optional boost section. After adding the data, the code in line 64 can be uncommented.
   maxTravelSpeed = (entity: Ship) => {
      const compatibleEngines = this.compatibleEngines(entity);
      // calculate speed for each engine and take the fastest one.
      return compatibleEngines
         .map(engine => this.calculateMaxForwardSpeed(engine, entity) /* * engine.travel.thrust*/) // Missing data for travel thrust
         .reduce((max, x) => (x > max) ? x : max, 0);
   }

   maxForwardAcceleration = (entity: Ship) => {
      const compatibleEngines = this.compatibleEngines(entity);
      // calculate acceleration for each engine and take the fastest one.
      return compatibleEngines
         .map(engine => this.calculateMaxForwardAcceleration(engine, entity))
         .reduce((max, x) => (x > max) ? x : max, 0);
   }

   compatibleEngines = (entity: Ship) => {
      const engineSlots = entity.engines;
      if (engineSlots.length <= 0) {
         return [];
      }
      return this.engines.filter(e => e.size === entity.thruster);
   }

   engineCount(entity: Ship) {
      return entity.engines ? entity.engines.length : 0;
   }

   weaponCount(entity: Ship) {
      return entity.weapons ? entity.weapons.length : 0;
   }

   turretCount(entity: Ship) {
      return entity.turrets ? entity.turrets.length : 0;
   }

   shieldCount(entity: Ship) {
      if (!entity.shields) {
         return 0;
      }

      return entity.shields.filter(x => !x.group).length;
   }

   cargoSize(entity: Ship) {
      return entity.cargo ? entity.cargo[0].max : 0;
   }

   private calculateMaxForwardSpeed(engine: Equipment, ship: Ship) {
      return Math.floor(engine.thrust.forward * this.engineCount(ship) / ship.drag.forward);
   }

   private calculateMaxForwardAcceleration(engine: Equipment, ship: Ship) {
      return Math.floor(engine.thrust.forward * this.engineCount(ship) / ship.mass);
   }
}
