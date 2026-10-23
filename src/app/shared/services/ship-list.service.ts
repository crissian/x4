import { Injectable } from '@angular/core';
import { ShipList } from './data/ship-list-data';
import { EntityStore } from './entity.service';
import { ShipListItem } from './model/model';

/** The slim list of ships for pickers and planners, without the slots, prices and production of the full ships. */
@Injectable({ providedIn: 'root' })
export class ShipListService extends EntityStore<ShipListItem> {
	constructor() {
		super(ShipList as ShipListItem[]);
	}
}
