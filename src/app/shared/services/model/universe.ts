export interface Planet {
  name?: string;
  class?: string;
  geology?: string;
  atmosphere?: string;
  population?: string;
  maxPopulation?: number;
  settlements?: string;
  moons?: Planet[];
}

/** A star system (cluster) holding one or more sectors. Coordinates are in km. */
export interface Cluster {
  id: string;
  version: number;
  name: string;
  description?: string;
  x: number;
  z: number;
  environment?: string;
  suns: string[];
  planets: Planet[];
  sectors: string[];
}

export interface SectorResource {
  ware: string;
  size: string;
  yield: string;
  speed: string;
  /** Number of resource areas of this kind. */
  count: number;
  /** Amount held by one area. */
  yieldAmount: number;
  /** Minutes until a depleted area recovers. */
  respawnDelay: number;
  /** Area radius in meters. */
  radius: number;
}

export interface SectorLink {
  sector: string;
  type: 'gate' | 'accelerator';
  /** Position of the gate inside the sector, in km. */
  x: number;
  z: number;
}

/** Superhighway entry point inside a sector, in km. */
export interface HighwayLink {
  sector: string;
  x: number;
  z: number;
}

/** A claimable ship placed in the universe at game start. */
export interface AbandonedShip {
  ship: string;
  sector: string;
  version: number;
  /** Position inside the sector, in km. */
  x: number;
  y: number;
  z: number;
  /** Set when the ship only appears after a condition is met. */
  condition?: string;
}

export interface Sector {
  id: string;
  version: number;
  cluster: string;
  name: string;
  description?: string;
  /** Offset inside the cluster, in km. */
  x: number;
  z: number;
  /** Solar output multiplier, 1 = 100%. */
  sunlight?: number;
  economy?: number;
  security?: number;
  /** Faction owning the sector at game start (estimated from the stations placed there). */
  owner?: string;
  resources: SectorResource[];
  gates: SectorLink[];
  highways: string[];
  highwayLinks?: HighwayLink[];
}

/** Fixed station created at game start (shipyard, wharf, equipment dock, ...). */
export interface GodStation {
  id: string;
  type: 'shipyard' | 'wharf' | 'equipmentdock' | 'tradestation' | 'defence' | 'piratebase';
  owner?: string;
  sector: string;
  version: number;
  /** Position inside the sector in km, missing when the game picks a random spot. */
  x?: number;
  z?: number;
}

/** Predefined map zone: where it sits inside its sector. Stations in a zone are positioned relative to it. */
export interface Zone {
  id: string;
  sector: string;
  /** Offset inside the sector, in km. */
  x: number;
  z: number;
}
