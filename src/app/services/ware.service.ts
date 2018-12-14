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
    const result = this.getWareInternal(id, true);
    return of(result);
  }

  private getWareInternal(id: string, loadProductionWares = true) {
    const entity = Wares.find(x => x.id === id);
    return this.map(entity, loadProductionWares);
  }

  private map(entity: any, mapProduction = false) {
    const group = WareGroups.find(g => g.id === entity.group);
    const result = { ...entity, group: group };

    if (mapProduction) {
      if (result.production != null) {
        result.production.forEach(x => {
          for (let i = 0; i < x.wares.length; i ++) {
            const ware = x.wares[i];
            if (typeof ware.ware === 'string') {
              x.wares[i] = {...ware, ware: this.getWareInternal(ware.ware, false)};
            }
          }
        });
      }
    }

    return result;
  }
}
