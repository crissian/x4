export class WareGroup {
  constructor(public id: string, public name: string) {
  }

  static initialize(json: any) {
    return new WareGroup(json.id, json.name);
  }
}
