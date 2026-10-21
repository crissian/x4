import { Injectable } from '@angular/core';
import { Equipments } from './data/equipment-data';
import { EntityStore } from './entity.service';
import { Equipment } from './model/model';

@Injectable({ providedIn: 'root' })
export class EquipmentService extends EntityStore<Equipment> {
	constructor() {
		super(Equipments as Equipment[]);
	}
}
