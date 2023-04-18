import { EntityService } from './entity.service';
import { Equipment } from './model/model';
import { Equipments } from './data/equipment-data';
import { Injectable } from '@angular/core';

@Injectable()
export class EquipmentService implements EntityService<Equipment> {
   getEntities(): Equipment[] {
      return Equipments as any[];
   }

   getEntity(id: any): Equipment {
      return Equipments.find(x => x.id == id) as Equipment;
   }
}
