export class WareTransport {
  static readonly container = new WareTransport('container', 'Container');
  static readonly inventory = new WareTransport('inventory', 'Inventory');
  static readonly equipment = new WareTransport('equipment', 'Equipment');
  static readonly passenger = new WareTransport('passenger', 'Passenger');
  static readonly liquid = new WareTransport('liquid', 'Liquid');
  static readonly solid = new WareTransport('solid', 'Solid');
  static readonly research = new WareTransport('research', 'Research');
  static readonly ship = new WareTransport('ship', 'Ship');
  static readonly software = new WareTransport('software', 'Software');
  static readonly workunit = new WareTransport('workunit', 'Work Unit');

  static all = [
    WareTransport.container,
    WareTransport.inventory,
    WareTransport.equipment,
    WareTransport.passenger,
    WareTransport.liquid,
    WareTransport.solid,
    WareTransport.research,
    WareTransport.ship,
    WareTransport.software,
    WareTransport.workunit
  ];

  static get(id: string) {
    return WareTransport.all.find(x => x.id == id);
  }

  constructor(public id: string, public name: string) {
  }
}
