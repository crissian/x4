import { Injectable } from '@angular/core';
import { GameStarts } from '../shared/services/data/game-starts-data';
import { EntityStore } from '../shared/services/entity.service';
import type { GameStart } from './game-start-model';

@Injectable({ providedIn: 'root' })
export class GameStartService extends EntityStore<GameStart> {
	constructor() {
		super(GameStarts.all as GameStart[]);
	}
}
