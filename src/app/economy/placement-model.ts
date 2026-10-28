import type { PlacementMinerNeed } from './placement-miners';

/** `closed`: the station makes its whole chain, the player mines the raw wares; `open`: it buys its inputs. */
export type PlacementLoop = 'closed' | 'open';

/** What ranks the spots: the score (Cr/h with the resources and sunlight factors), the Cr/h alone, or the payback. */
export type PlacementRank = 'score' | 'income' | 'payback';

/** What the station suggestions count: how far a new factory sells, and which stations and sectors count. */
export interface PlacementOptions {
	loop: PlacementLoop;
	/** jumps a new factory sells within */
	jumps: number;
	/** leave out the sectors owned by a faction hostile to the player */
	hideHostile: boolean;
	/** player-owned stations count unless false */
	includePlayer: boolean;
	/** what ranks the spots; the score when not given */
	rank?: PlacementRank;
}

/** A sector within reach of a candidate spot and what its own stations add to the ware's balance. */
export interface PlacementTarget {
	sector: string;
	jumps: number;
	/** 1 at the spot, falling linearly with the jumps, see `PlacementScorer.weight` */
	weight: number;
	/** the sector's own net per hour (produced minus consumed) */
	net: number;
	/** the shortage per hour left once the existing surpluses supplied their nearest short sectors, 0 or more */
	left: number;
	/** weight × left: what the sector adds to the absorbable */
	pull: number;
}

/** An input of the ware's recipe and how well the reach around a spot supplies it. */
export interface PlacementInput {
	ware: string;
	/** weighted net per hour within reach; undefined for mined wares, whose mining is not counted */
	balance?: number;
	/** mined or collected: in reach when a sector within reach has the resource */
	mined: boolean;
	covered: boolean;
}

/** A mined ware of a closed-loop chain and the nearest sector within reach that has it. */
export interface PlacementResource {
	ware: string;
	/** jumps to the nearest sector with the resource, undefined when none is within reach */
	jumps?: number;
	/** the weight of that sector (1 at the spot, falling linearly), 0 when none is within reach */
	weight: number;
}

/** One suggested factory: a ware to make in a sector, what the market around it swallows and what it earns. */
export interface PlacementSpot {
	ware: string;
	sector: string;
	/** the production modules the reachable shortage has room for */
	modules: number;
	/** units per hour the reach can take: the weighted shortage left within reach after the existing supply */
	absorbable: number;
	/** units per hour one production module makes at full workforce (with the sector's sunlight for energy cells) */
	moduleOutput: number;
	loop: PlacementLoop;
	/** Cr per unit sold: the average price, less the input cost at average prices when the inputs are bought */
	margin: number;
	/** min(modules × module output, absorbable) × margin, Cr per hour */
	crPerHour: number;
	/** the sector sunlight, 1 = 100% */
	sunlight: number;
	/** Cr to build the production modules (with the closed-loop chain) and the miners, at average prices */
	buildCost: number;
	/** the miners bringing the mined wares of a closed loop, see `PlacementMiners`; empty when buying inputs */
	miners: PlacementMinerNeed[];
	/** Cr of the miners, part of the build cost */
	minerCost: number;
	/** hours the station takes to earn its build cost */
	payback: number;
	/** a module's payback at 100% sunlight over its payback here, 0..1, see `PlacementReturns.efficiency` */
	efficiency: number;
	/** Cr per hour × the inputs or resources factor × the efficiency: the default ranking key */
	score: number;
	/** share of the inputs (buying) or of the chain's mined resources (closed loop) in reach, 0..1; 1 without any */
	coverage: number;
	/** sector security from the game data, undefined when unknown */
	security?: number;
	/** needed to build ships or station modules, a demand the capacity does not count */
	building: boolean;
	/** the inputs around the spot when they are bought, else empty */
	inputs: PlacementInput[];
	/** the mined wares of the closed-loop chain and where they are, else empty */
	resources: PlacementResource[];
	/** the sectors behind the absorbable, the biggest pull first; sectors whose stations neither make nor use it are left out */
	targets: PlacementTarget[];
}

/** A ranked list cut to its first rows, with the number found. */
export interface PlacementResult {
	spots: PlacementSpot[];
	total: number;
}
