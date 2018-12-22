import { Races } from './data/race-data';
import { Injectable } from '@angular/core';
import { Race } from './model/model';
import { EntityService } from './entity.service';

@Injectable()
export class RaceService implements EntityService<Race> {
  getEntities(): Race[] {
    return Races.all;
  }

  getEntity(id: any): Race {
    return Races[id];
  }
}
