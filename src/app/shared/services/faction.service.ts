import { Injectable } from '@angular/core';
import { Factions } from './data/factions-data';
import { EntityService } from './entity.service';
import { Faction } from './model/model';

@Injectable()
export class FactionService implements EntityService<Faction> {
  getEntities() {
    return Factions.all as any[];
  }

  getEntity(id: any): Faction {
    return Factions[id];
  }
}
