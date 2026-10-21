import { Injectable } from '@angular/core';
import { Races } from './data/race-data';
import { EntityStore } from './entity.service';
import { Race } from './model/model';

@Injectable({ providedIn: 'root' })
export class RaceService extends EntityStore<Race> {
	constructor() {
		super(Races.all as Race[]);
	}
}
