import { Wares } from './data/wares-data';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { WareGroups } from './data/ware-groups-data';
import { Ware } from './model/ware';
import { WareGroup } from './model/ware-group';
import { WareTransport } from './model/ware-transport';
import { Price } from './model/price';
import { Production } from './model/production';

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

  equipment = [

  ];
}

@Injectable()
export class WareService {
  private wares: Ware[];
  private wareGroups: WareGroup[];

  getEntities() {
    if (this.wares == null) {
      this.wareGroups = WareGroups.map(x => WareGroup.initialize(x));
      this.wares = Wares.map(x => {
        const ware = Ware.initialize(x);

        ware.group = this.wareGroups.find(g => g.id == x.group);
        ware.transport = WareTransport.get(x.transport);
        ware.price = new Price(x.price.min, x.price.max, x.price.average);
        ware.icon = x.icon == null ? null : x.icon.active;

        ware.production = this.getProduction(x.production);

        return ware;
      });

      // this.wares.forEach(x =)
    }
  }

  private getProduction(production: any[]): any {
    return production.map(prod => {
      const item = <any>new Production();

      item.time = prod.time;
      item.amount = prod.amount;
      item.method = prod.method;
      item.name = prod.name;
      item.wares = null;
      item.effects = null;

      return item;
    });
  }

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

  getEquipment() {
    const results = Wares
      .filter(x => x.transport === 'ship')
      .map(x => this.map(x))
      .sort((a, b ) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });

    return of(results);
  }

  getShips() {
    const results = Wares
      .filter(x => x.transport === 'ship')
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

  getWaresUsingWare(id: string) {
    const results = Wares
      .filter(x => WareType.ware.indexOf(x.group) >= 0 && this.isUsing(x, id));
    return of(results);
  }

  private isUsing(ware: any, wareId: string) {
    for (let i = 0; i < ware.production.length; i ++) {
      const production = ware.production[i];
      if (production.wares.find(y => y.ware == wareId) != null) {
        return true;
      }
    }

    return false;
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
