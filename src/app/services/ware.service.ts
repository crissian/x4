import { Wares } from './wares';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { WareGroups } from './ware-groups';

export class WareType {
  static ware = [
    'agricultural',
    'energy',
    'food',
    'gases',
    'hightech',
    'ice',
    'minerals',
    'pharmaceutical',
    'refined',
    'water',
    'shiptech',
    'weapontech'
  ];
}

@Injectable()
export class WareService {
  getWares() {
    const results = Wares
      .filter(x => WareType.ware.indexOf(x.group) >= 0)
      .map(x => this.map(x))
      .sort((a, b ) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });

    return of(results);
  }

  getWare(id: string) {
    const entity = Wares.find(x => x.id === id);
    return of(this.map(entity));
  }

  private map(entity: any) {
    const group = WareGroups.find(g => g.id === entity.group);
    return { ...entity, group: group };
  }
}
