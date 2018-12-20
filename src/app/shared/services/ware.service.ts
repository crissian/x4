import { AllWares, Wares } from './data/wares-data';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Ware, WareGroup } from './model/model';
import { WareGroups } from './data/ware-groups-data';

@Injectable()
export class WareService {
  private static order = {
    gases: 0,
    ice: 10,
    minerals: 20,
    energy: 30,
    water: 40,
    refined: 50,
    agricultural: 60,
    food: 70,
    pharmaceutical: 80,
    hightech: 90,
    shiptech: 100
  };

  getWares(): Ware[] {
    return AllWares;
  }

  getShips() {
    return of([]);
  }

  getWare(id: string): Ware {
    return Wares[id];
  }

  getWaresUsingWare(id: string): Ware[] {
    const results = AllWares
      .filter(x => this.isUsing(x, id));
    return results;
  }

  private isUsing(ware: Ware, wareId: string) {
    for (let i = 0; i < ware.production.length; i ++) {
      const production = ware.production[i];
      if (production.wares.find(y => y.ware == wareId) != null) {
        return true;
      }
    }

    return false;
  }

  compareGroups(a: WareGroup, b: WareGroup) {
    const aidx = WareService.order[a.id];
    const bidx = WareService.order[b.id];

    if (aidx == bidx) {
      return this.compareProp(a, b, 'name');
    }

    return aidx - bidx;
  }

  compareWares(a: Ware, b: Ware) {
    const aidx = WareService.order[a.group.id];
    const bidx = WareService.order[b.group.id];

    if (aidx == bidx) {
      return this.compareProp(a, b, 'name');
    }

    return aidx - bidx;
  }

  private compareProp(a: any, b: any, prop: string) {
    if (a[prop] < b[prop]) {
      return -1;
    } else if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  }
}
