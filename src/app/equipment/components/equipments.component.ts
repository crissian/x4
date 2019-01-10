import { Component, OnInit } from '@angular/core';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { Equipment, Race } from '../../shared/services/model/model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EquipmentService } from '../../shared/services/equipment.service';
import { Size } from '../../shared/services/data/size-data';
import { RaceService } from '../../shared/services/race.service';
import { EquipmentType } from '../../shared/services/data/equipment-type-data';
import { EquipmentClass } from '../../shared/services/data/equipment-class-data';

@Component({
   templateUrl: './equipments.component.html'
})
export class EquipmentsComponent extends EntityListComponent<Equipment> implements OnInit {
   sizes = Size.all;
   races: Race[];
   equipmentTypes: string[];
   equipmentClasses: string[];

   nameFilter = '';
   sizeFilter = '';
   raceFilter = '';
   typeFilter = '';
   classFilter = '';

   constructor(service: EquipmentService,
               private raceService: RaceService,
               private router: Router, private titleService: Title) {
      super(service);
   }

   filter(x: Equipment, text: string): boolean {
      if (this.nameFilter && x.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) < 0) {
         return false;
      }

      if (this.sizeFilter && x.size != this.sizeFilter) {
         return false;
      }

      if (this.raceFilter) {
         if (x.race == null) {
            return false;
         }
         if (x.race.id != this.raceFilter) {
            return false;
         }
      }

      if (this.typeFilter && x.type != this.typeFilter) {
         return false;
      }

      if (this.classFilter && x.equipmentClass != this.classFilter) {
         return false;
      }

      return true;
   }

   onSelectCore(item: Equipment) {
      return this.router.navigate([ '/equipment', item.id ]);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Equipment');

      this.races = this.raceService.getEntities();
      this.equipmentTypes = Object.keys(EquipmentType).map(x => EquipmentType[x]);
      this.equipmentClasses = Object.keys(EquipmentClass).map(x => EquipmentClass[x]);

      super.ngOnInit();
   }
}
