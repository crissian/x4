import { MinersNeeded } from '../map/mining/miners-needed';
import { Mining } from '../map/mining';
import { RoutePlanner } from '../map/route-planner';
import { Size } from '../shared/services/data/size-data';
import type { Sector, ShipListItem, Ware } from '../shared/services/model/model';
import { TravelDrives } from '../shared/services/travel-drives';
import { TravelCache } from '../trade/travel-cache';

/** The miners bringing one mined ware of a closed-loop station, and what they cost. */
export interface PlacementMinerNeed {
	ware: string;
	/** ship id of the reference miner; undefined when no L miner can mine the ware */
	miner?: string;
	/** the sector of the nearest field by travel time; undefined when none is reachable */
	field?: string;
	/** miners keeping the modules supplied, fractional (shown rounded up); infinite without a miner or a field */
	count: number;
	/** count × the miner's average hull price, Cr */
	cost: number;
}

/**
 * The miners a closed-loop station needs for the mined wares of its chain, the mining panel's maths: one miner
 * delivers a full hold per trip (`Mining.miningTrip`: fly to the field, fill the hold in `FILL_MINUTES`, fly back,
 * dock), see `MinersNeeded`. The reference miner of a ware is the L miner with the most hold per credit, timed with
 * its own travel drive; the field is the nearest of the given sectors with the resource, by travel time.
 */
export class PlacementMiners {
	static readonly FILL_MINUTES = Mining.DEFAULT_FILL_MINUTES;

	private readonly byWare = new Map<string, ShipListItem | undefined>();
	private readonly caches = new Map<string, TravelCache>();

	/**
	 * @param ships the ship list, priced
	 * @param sectors the game sectors the routes run through
	 * @param fields the sectors with fields of a ware
	 */
	constructor(
		private readonly ships: readonly ShipListItem[],
		private readonly sectors: readonly Sector[],
		private readonly ware: (id: string) => Ware | undefined,
		private readonly fields: (ware: string) => readonly string[]
	) {}

	/** The cost of the miners of all mined wares; infinite when one of them can't be mined. */
	static cost(needs: readonly PlacementMinerNeed[]): number {
		return needs.reduce((sum, x) => sum + x.cost, 0);
	}

	/** The L miner with the most hold for the ware per credit of hull price, cached per ware. */
	miner(ware: string): ShipListItem | undefined {
		if (!this.byWare.has(ware)) {
			const entity = this.ware(ware);
			const value = (ship: ShipListItem) =>
				entity && ship.price?.avg > 0 ? Mining.minerCapacity(ship, entity) / ship.price.avg : 0;
			const best = entity
				? Mining.minersFor(
						this.ships.filter((x) => x.size === Size.large && TravelDrives.canTravel(x)),
						entity
					).reduce<ShipListItem | undefined>((a, b) => (!a || value(b) > value(a) ? b : a), undefined)
				: undefined;
			this.byWare.set(ware, best && value(best) > 0 ? best : undefined);
		}
		return this.byWare.get(ware);
	}

	/**
	 * The miners a station in `sector` needs for the mined wares it uses per hour; none without a ship list.
	 * @param mined units per hour of each mined ware
	 */
	needs(sector: string, mined: readonly { ware: string; amount: number }[]): PlacementMinerNeed[] {
		if (!this.ships.length) {
			return [];
		}
		return mined.map(({ ware, amount }): PlacementMinerNeed => {
			const miner = this.miner(ware);
			const entity = this.ware(ware);
			if (!miner || !entity) {
				return { ware, count: Infinity, cost: Infinity };
			}
			const nearest = this.nearest(miner, sector, ware);
			if (!nearest) {
				return { ware, miner: miner.id, count: Infinity, cost: Infinity };
			}
			const capacity = Mining.minerCapacity(miner, entity);
			const trip = Mining.miningTrip(nearest.time, capacity, entity, 0, PlacementMiners.FILL_MINUTES);
			const { perMiner } = MinersNeeded.estimate(trip, amount, 0, trip.units);
			const count = perMiner > 0 ? amount / perMiner : Infinity;
			return { ware, miner: miner.id, field: nearest.sector, count, cost: count * miner.price.avg };
		});
	}

	/** The field sector of the ware nearest to `sector` for the miner, and the one-way travel seconds. */
	private nearest(miner: ShipListItem, sector: string, ware: string): { sector: string; time: number } | undefined {
		const times = this.cache(miner).from(sector)?.time;
		let best: { sector: string; time: number } | undefined;
		for (const field of this.fields(ware)) {
			const time = times?.get(field);
			if (time !== undefined && (!best || time < best.time)) {
				best = { sector: field, time };
			}
		}
		return best;
	}

	private cache(miner: ShipListItem): TravelCache {
		let cache = this.caches.get(miner.id);
		if (!cache) {
			cache = new TravelCache(this.sectors, TravelDrives.options(miner, RoutePlanner.DEFAULT_OPTIONS));
			this.caches.set(miner.id, cache);
		}
		return cache;
	}
}
