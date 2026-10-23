import type { Sector } from '../../shared/services/model/model';
import type { MiningTrip } from '../mining';

/** How many miners keep one buyer fed, from its built capacity and from its demand at save time. */
export interface MinersEstimate {
	/** units one miner delivers per hour, a full hold per trip */
	perMiner: number;
	/** miners keeping the station's modules at full supply; undefined when its modules use none of the ware */
	capacityMiners?: number;
	/** the station's consumption per hour at full supply */
	consumedPerHour: number;
	/** units wanted at save time */
	wantedNow: number;
	/** full holds the demand at save time takes */
	holdsNow: number;
	/** hours one miner takes to deliver them */
	hoursNowOneMiner: number;
	/** units per hour the mining sector's fields regrow (approximate) */
	regrowth?: number;
	/** the capacity miners take more than the fields regrow */
	outpaces: boolean;
}

export class MinersNeeded {
	/**
	 * @param fullHold units in the miner's full hold
	 * @param regrowthPerHour see `regrowth`
	 */
	static estimate(
		trip: MiningTrip,
		consumedPerHour: number,
		offerAmount: number,
		fullHold: number,
		regrowthPerHour?: number
	): MinersEstimate {
		const perMiner = trip.tripTime > 0 ? (fullHold * 3600) / trip.tripTime : 0;
		const capacityMiners = consumedPerHour > 0 && perMiner > 0 ? Math.ceil(consumedPerHour / perMiner) : undefined;
		const holdsNow = fullHold > 0 ? Math.ceil(offerAmount / fullHold) : 0;
		return {
			perMiner,
			capacityMiners,
			consumedPerHour,
			wantedNow: offerAmount,
			holdsNow,
			hoursNowOneMiner: (holdsNow * trip.tripTime) / 3600,
			regrowth: regrowthPerHour,
			outpaces: regrowthPerHour != null && capacityMiners != null && capacityMiners * perMiner > regrowthPerHour,
		};
	}

	/** Units per hour a sector's fields of the ware regrow: each field's yield once per respawn delay (minutes). */
	static regrowth(sector: Sector, ware: string): number {
		return sector.resources
			.filter((x) => x.ware === ware && x.respawnDelay > 0)
			.reduce((sum, x) => sum + (x.count * x.yieldAmount * 60) / x.respawnDelay, 0);
	}
}
