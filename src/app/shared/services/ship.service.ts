import { EntityService } from './entity.service';
import { Ship } from './model/model';
import { Ships } from './data/ships-data';
import { Injectable } from '@angular/core';

@Injectable()
export class ShipService implements EntityService<Ship> {
  getEntities(): Ship[] {
    return Ships;
  }

  getEntity(id: any): Ship {
    return this.getEntities()
      .find(x => x.id == id);
  }

  getEntitiesUsingWare(wareId: any) {
    return this.getEntities()
      .filter(x => this.isUsing(x, wareId));
  }

  private isUsing(entity: Ship, wareId: string) {
    for (let i = 0; i < entity.production.length; i ++) {
      const production = entity.production[i];
      if (production.wares.find(y => y.ware == wareId) != null) {
        return true;
      }
    }

    return false;
  }
}
