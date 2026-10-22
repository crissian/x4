import type { SaveMap, SaveRelations, SaveStation } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';

export class TradeRules {
	/** seconds spent docking per station, so twice per trip */
	static readonly DOCK_SECONDS = 60;
	static readonly MAX_ROWS = 200;
	/** a route carrying less than this share of a full hold is thin */
	static readonly THIN_SHARE = 0.1;
	/** a player relation at or below this is hostile */
	static readonly HOSTILE_RELATION = -0.01;
}

/** m³ per cargo type id ('container' | 'solid' | 'liquid' | 'condensate'), lower case */
export interface TradeShipSpec {
	capacity: Readonly<Record<string, number>>;
	speed: number;
	charge: number;
}

/** transport is the cargo type id in lower case; illegalIn holds faction ids */
export interface TradeWareInfo {
	volume: number;
	transport: string;
	illegalIn: readonly string[];
}

export interface TradeFilters {
	near?: string;
	maxJumps?: number;
	ware?: string;
	hideHostile: boolean;
	playerOnly: boolean;
	/** leave out the routes that carry the ware through a sector where it is illegal */
	hideIllegal: boolean;
}

export interface TradeInput {
	map: SaveMap;
	relations?: SaveRelations;
	sectors: readonly Sector[];
	ware(id: string): TradeWareInfo | undefined;
	ship: TradeShipSpec;
	filters: TradeFilters;
}

export interface TradeRoute {
	/** `${seller.code}~${buyer.code}~${ware}` */
	key: string;
	ware: string;
	seller: SaveStation;
	buyer: SaveStation;
	/** Cr per unit paid at the seller, received at the buyer */
	buyPrice: number;
	sellPrice: number;
	margin: number;
	units: number;
	profit: number;
	/** seller → buyer */
	jumps: number;
	/** seconds seller → buyer, without docking */
	travelSeconds: number;
	/** seconds near sector → seller; 0 without a near sector */
	startSeconds: number;
	/** startSeconds + travelSeconds + 2 * DOCK_SECONDS */
	seconds: number;
	profitPerMinute: number;
	thin: boolean;
	playerOnly: boolean;
	/** the sectors of the loaded leg (seller to buyer) whose owner makes the ware illegal; empty is legal */
	illegalSectors: string[];
}

export interface TradeRouteResult {
	routes: TradeRoute[];
	total: number;
}
