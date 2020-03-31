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
import { EnumFn } from '../../core/services/enum-fn';

@Component({
   templateUrl: './equipments.component.html'
})
export class EquipmentsComponent extends EntityListComponent<Equipment> implements OnInit {
   sizes: string[];
   races: Race[];
   equipmentTypes: string[];
   equipmentClasses: string[];

   constructor(service: EquipmentService,
               private raceService: RaceService,
               router: Router,
               route: ActivatedRoute,
               private titleService: Title) {
      super(service, router, route);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations / Split Vendetta - Equipment');

      this.sizes = EnumFn.values(Size);
      this.equipmentTypes = EnumFn.values(EquipmentType);
      this.equipmentClasses = EnumFn.values(EquipmentClass);

      this.races = this.raceService.getEntities();

      super.ngOnInit();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }
}
