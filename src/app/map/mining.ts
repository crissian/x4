import { ShipPurpose } from '../shared/services/data/ship-purpose-data';
import { ShipListItem, Ware } from '../shared/services/model/model';

/**
 * Mining trips: fly from the home sector to the resource, fill the hold, fly back and sell.
 * The game's mining speed depends on the asteroid, the miner's equipment and crew, so the time
 * to fill the hold is an input of the calculation.
 */

export interface MiningTrip {
	/** Units carried per trip. */
	units: number;
	/** Seconds for one full trip. */
	tripTime: number;
	/** Credits per trip and per hour at the given price. */
	tripValue: number;
	perHour: number;
}

export class Mining {
	/** Cargo capacity a ship can use for a ware (only the holds of the ware's transport type). */
	static minerCapacity(ship: Pick<ShipListItem, 'cargo'>, ware: Ware): number {
		const transport = ware.transport?.toLowerCase();
		return (ship.cargo ?? []).filter((x) => x.types.some((t) => t.id === transport)).reduce((total, x) => total + x.max, 0);
	}

	/** Whether the ship is a miner with a hold for the ware: solid miners for ore, gas miners for gases. */
	static canMine(ship: Pick<ShipListItem, 'purpose' | 'cargo'>, ware: Ware): boolean {
		return ship.purpose === ShipPurpose.mine && Mining.minerCapacity(ship, ware) > 0;
	}

	/** Mining ships able to carry the ware, largest hold first. */
	static minersFor<T extends ShipListItem>(ships: readonly T[], ware: Ware): T[] {
		return Mining.minersAmong(ships, ware, (x) => x);
	}

	/** The entries (such as own ships) whose ship can mine the ware, largest hold first, then by the ship's name. */
	static minersAmong<T>(items: readonly T[], ware: Ware, shipOf: (item: T) => ShipListItem): T[] {
		return items
			.filter((x) => Mining.canMine(shipOf(x), ware))
			.sort((a, b) => {
				const [x, y] = [shipOf(a), shipOf(b)];
				return Mining.minerCapacity(y, ware) - Mining.minerCapacity(x, ware) || x.name.localeCompare(y.name);
			});
	}

	/**
	 * @param travelTime one-way seconds between the home sector and the mining sector
	 * @param capacity cargo volume in m³
	 * @param fillMinutes minutes to fill the hold
	 * @param dockTime seconds spent docking and selling
	 * @param maxUnits units the buyer takes, when fewer than a full hold
	 */
	static miningTrip(
		travelTime: number,
		capacity: number,
		ware: Ware,
		price: number,
		fillMinutes: number,
		dockTime = 60,
		maxUnits = Infinity
	): MiningTrip {
		const units = ware.volume > 0 ? Math.min(Math.floor(capacity / ware.volume), maxUnits) : 0;
		const tripTime = 2 * travelTime + fillMinutes * 60 + dockTime;
		const tripValue = units * price;
		return { units, tripTime, tripValue, perHour: tripTime > 0 ? (tripValue * 3600) / tripTime : 0 };
	}
}
