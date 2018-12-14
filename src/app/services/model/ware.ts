import { WareGroup } from './ware-group';
import { Price } from './price';
import { Production } from './production';

export class Ware {
  id: string;
  tags: string;
  name: string;
  description: string;
  volume: number;
  icon: string;

  group: WareGroup;
  transport: Transport;
  price: Price;
  production: Production[];

  static initialize(json: any) {
    const entity = new Ware();
    entity.id = json.id;
    entity.tags = json.tags;
    entity.name = json.name;
    entity.description = json.description;
    entity.volume = json.volume;
    entity.icon = json.icon == null ? null : json.icon.active;
    entity.price = new Price(json.price.min, json.price.max, json.price.avg);

    return entity;
  }
}
