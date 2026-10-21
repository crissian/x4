export interface Race {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface License {
  type: string;
  name: string;
  icon?: string;
  price: number;
  /** Relation needed to buy the license, -1 .. 1 (see `relationToReputation`). */
  minRelation?: number;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  race?: Race;
  icon: string;
  color?: string;
  licenses?: License[];
}
