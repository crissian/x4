import { Component, OnInit } from '@angular/core';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { Equipment, Race } from '../../shared/services/model/model';
import { ActivatedRoute, Router } from '@angular/router';
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

   constructor(service: EquipmentService,
               private raceService: RaceService,
               private router: Router,
               private route: ActivatedRoute,
               private titleService: Title) {
      super(service);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Equipment');

      this.races = this.raceService.getEntities();
      this.equipmentTypes = Object.keys(EquipmentType).map(x => EquipmentType[x]);
      this.equipmentClasses = Object.keys(EquipmentClass).map(x => EquipmentClass[x]);

      super.ngOnInit();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }
}
