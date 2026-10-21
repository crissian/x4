import { Injectable } from '@angular/core';
import { Factions } from './data/factions-data';
import { EntityStore } from './entity.service';
import { Faction } from './model/model';

@Injectable({ providedIn: 'root' })
export class FactionService extends EntityStore<Faction> {
	constructor() {
		super(Factions.all as Faction[]);
	}
}
