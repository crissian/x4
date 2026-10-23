import type { RouteOptions } from '../../map/route-planner';
import type { ShipTravel } from './model/model';

export class TravelDrives {
	/** A ship with a travel speed, so it can plan routes. */
	static canTravel(ship: { travel?: ShipTravel }): boolean {
		return (ship.travel?.speed ?? 0) > 0;
	}

	/**
	 * The travel options of a ship: its top travel speed and the charge of its fastest drive; `fallback` fills in
	 * what the ship lacks (no travel speed, or no travel drive).
	 */
	static options(ship: { travel?: ShipTravel }, fallback: Readonly<RouteOptions>): RouteOptions {
		return {
			speed: ship.travel?.speed || fallback.speed,
			charge: ship.travel?.charge ?? fallback.charge,
		};
	}
}
