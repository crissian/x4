import type { SaveRelations, SaveStation } from '../../savegame/map/save-map-model';
import type { Ware } from '../../shared/services/model/model';
import { TradeRouteFinder } from '../../trade/trade-route-finder';
import { TradeRules } from '../../trade/trade-route-model';
import type { TravelCache } from '../../trade/travel-cache';
import { Mining, MiningTrip } from '../mining';

export interface MiningBuyersInput {
	stations: readonly SaveStation[];
	relations?: SaveRelations;
	ware: Ware;
	/** the sectors holding the ware: sector id -> units in its fields */
	sectors: ReadonlyMap<string, number>;
	/** the miner's hold for the ware, m³ */
	capacity: number;
	fillMinutes: number;
	/** only buyers within `NEAR_JUMPS` of this sector */
	near?: string;
}

/** Mining in one sector and selling to one station. */
export interface MiningPair {
	/** the mining sector */
	sector: string;
	/** units in the mining sector's fields */
	amount: number;
	station: SaveStation;
	/** Cr per unit */
	price: number;
	/** units the station wants at save time */
	wanted: number;
	/** jumps from the mining sector to the buyer */
	jumps: number;
	/** the buyer takes less than a full hold */
	thin: boolean;
	trip: MiningTrip;
}

interface Buyer {
	station: SaveStation;
	price: number;
	amount: number;
}

/** Ranks mining sector -> buyer station pairs of a save by credits per hour for one miner. */
export class MiningBuyers {
	/** buyers this many jumps or fewer from the home sector are near it */
	static readonly NEAR_JUMPS = 2;

	/** Every reachable pair, best credits per hour first. */
	static rank(input: MiningBuyersInput, cache: TravelCache): MiningPair[] {
		const { ware, capacity } = input;
		const fullHold = ware.volume > 0 ? Math.floor(capacity / ware.volume) : 0;
		if (fullHold <= 0) {
			return [];
		}
		const buyers = MiningBuyers.buyers(input, cache);
		const pairs: MiningPair[] = [];
		for (const [sector, amount] of input.sectors) {
			const travel = cache.from(sector);
			for (const buyer of buyers) {
				const time = travel?.time.get(buyer.station.sector);
				if (time == null) {
					continue;
				}
				pairs.push({
					sector,
					amount,
					station: buyer.station,
					price: buyer.price,
					wanted: buyer.amount,
					jumps: cache.route(sector, buyer.station.sector)?.jumps ?? 0,
					thin: buyer.amount < fullHold,
					trip: Mining.miningTrip(
						time,
						capacity,
						ware,
						buyer.price,
						input.fillMinutes,
						TradeRules.DOCK_SECONDS,
						buyer.amount
					),
				});
			}
		}
		return pairs.sort((a, b) => b.trip.perHour - a.trip.perHour);
	}

	/** The best buyer of each mining sector, in the order of `pairs`. */
	static bestPerSector(pairs: readonly MiningPair[]): MiningPair[] {
		const seen = new Set<string>();
		return pairs.filter((x) => !seen.has(x.sector) && !!seen.add(x.sector));
	}

	/** The best `limit` buyers for one mining sector. */
	static buyersFor(pairs: readonly MiningPair[], sector: string, limit: number): MiningPair[] {
		return pairs.filter((x) => x.sector === sector).slice(0, limit);
	}

	/** Known, running, not hostile stations buying the ware, with their best buy offer. */
	private static buyers(input: MiningBuyersInput, cache: TravelCache): Buyer[] {
		const result: Buyer[] = [];
		for (const station of input.stations) {
			if (
				station.state ||
				!station.known ||
				TradeRouteFinder.isHostile(station.owner, input.relations) ||
				!MiningBuyers.isNear(station, input.near, cache)
			) {
				continue;
			}
			const offers = (station.offers ?? []).filter(
				(x) => x.ware === input.ware.id && !x.sell && !x.playerOnly && x.amount > 0
			);
			if (offers.length) {
				const best = offers.reduce((a, b) => (b.price > a.price ? b : a));
				result.push({ station, price: best.price, amount: best.amount });
			}
		}
		return result;
	}

	private static isNear(station: SaveStation, near: string | undefined, cache: TravelCache): boolean {
		if (!near) {
			return true;
		}
		const jumps = cache.route(near, station.sector)?.jumps;
		return jumps != null && jumps <= MiningBuyers.NEAR_JUMPS;
	}
}
