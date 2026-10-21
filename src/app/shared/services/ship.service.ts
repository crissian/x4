import { Injectable } from '@angular/core';
import { Ships } from './data/ships-data';
import { EntityStore, usesWare } from './entity.service';
import { Ship } from './model/model';

@Injectable({ providedIn: 'root' })
export class ShipService extends EntityStore<Ship> {
	constructor() {
		super(Ships as Ship[]);
	}

	getEntitiesUsingWare(wareId: string): Ship[] {
		return this.getEntities().filter((x) => usesWare(x, wareId));
	}
}
