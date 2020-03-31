import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Race, Ship } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ShipService } from '../../shared/services/ship.service';
import { RaceService } from '../../shared/services/race.service';
import { Size } from '../../shared/services/data/size-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';
import { EnumFn } from '../../core/services/enum-fn';

@Component({
   templateUrl: './ships.component.html'
})
export class ShipsComponent extends EntityListComponent<Ship> implements OnInit {
   sizes: string[];
   races: Race[];
   shipTypes: string[];
   purposes: string[];

   constructor(entityService: ShipService,
               private raceService: RaceService,
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
      this.races = this.raceService.getEntities();

      super.ngOnInit();
   }

   calculateWeapons(entity: Ship) {
      return entity.weapons ? entity.weapons.length : 0;
   }

   calculateTurrets(entity: Ship) {
      return entity.turrets ? entity.turrets.length : 0;
   }

   calculateShields(entity: Ship) {
      if (!entity.shields) {
         return 0;
      }

      return entity.shields.filter(x => !x.group).length;
   }
}
