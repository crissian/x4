export class Transport {
  static readonly container = new Transport('container', 'Container');
  static readonly inventory = new Transport('inventory', 'Inventory');
  static readonly equipment = new Transport('equipment', 'Equipment');
  static readonly passenger = new Transport('passenger', 'Passenger');
  static readonly liquid = new Transport('liquid', 'Liquid');
  static readonly solid = new Transport('solid', 'Solid');
  static readonly research = new Transport('research', 'Research');
  static readonly ship = new Transport('ship', 'Ship');
  static readonly software = new Transport('software', 'Software');
  static readonly workunit = new Transport('workunit', 'Work Unit');

  static all = [
    Transport.container,
    Transport.inventory,
    Transport.equipment,
    Transport.passenger,
    Transport.liquid,
    Transport.solid,
    Transport.research,
    Transport.ship,
    Transport.software,
    Transport.workunit
  ];

  static get(id: string) {
    return Transport.all.find(x => x.id == id);
  }

  constructor(public id: string, public name: string) {
  }
}
