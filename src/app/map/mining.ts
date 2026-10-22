import { ShipPurpose } from '../shared/services/data/ship-purpose-data';
import { Ship, Ware } from '../shared/services/model/model';

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
	static minerCapacity(ship: Ship, ware: Ware): number {
		const transport = ware.transport?.toLowerCase();
		return (ship.cargo ?? []).filter((x) => x.types.some((t) => t.id === transport)).reduce((total, x) => total + x.max, 0);
	}

	/** Mining ships able to carry the ware, largest hold first. */
	static minersFor(ships: readonly Ship[], ware: Ware): Ship[] {
		return ships
			.filter((x) => x.purpose === ShipPurpose.mine && Mining.minerCapacity(x, ware) > 0)
			.sort((a, b) => Mining.minerCapacity(b, ware) - Mining.minerCapacity(a, ware) || a.name.localeCompare(b.name));
	}

	/**
	 * @param travelTime one-way seconds between the home sector and the mining sector
	 * @param capacity cargo volume in m³
	 * @param fillMinutes minutes to fill the hold
	 * @param dockTime seconds spent docking and selling
	 */
	static miningTrip(travelTime: number, capacity: number, ware: Ware, price: number, fillMinutes: number, dockTime = 60): MiningTrip {
		const units = ware.volume > 0 ? Math.floor(capacity / ware.volume) : 0;
		const tripTime = 2 * travelTime + fillMinutes * 60 + dockTime;
		const tripValue = units * price;
		return { units, tripTime, tripValue, perHour: tripTime > 0 ? (tripValue * 3600) / tripTime : 0 };
	}
}
