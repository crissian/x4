import { Size } from './data/size-data';
import { Equipment, Ship } from './model/model';

export interface Handling {
	/** Strafe speed in m/s, sideways and up/down. */
	strafeH: number;
	strafeV: number;
	/** Turn rates in °/s. */
	pitch: number;
	yaw: number;
	roll: number;
	/** Seconds to reach about 63 % of the maximum rate. */
	pitchResponse: number;
	yawResponse: number;
	rollResponse: number;
	strafeResponse: number;
}

const NONE: Handling = {
	strafeH: 0,
	strafeV: 0,
	pitch: 0,
	yaw: 0,
	roll: 0,
	pitchResponse: 0,
	yawResponse: 0,
	rollResponse: 0,
	strafeResponse: 0,
};

/**
 * Strafe speed and turn rates of a ship with a thruster, using the same first-order drag model as
 * the forward speed: steady state = force / drag, response time = inertia (or mass) / drag.
 * Equipment mods, crew and the speed-dependent steering curve are ignored.
 */
export class ShipHandling {
	static handling(ship: Ship, thruster: Equipment | undefined): Handling {
		const data = thruster?.thruster;
		const drag = ship.drag;
		if (!data || !drag) {
			return { ...NONE };
		}
		const ratio = (value: number | undefined, by: number | undefined) => (value && by ? value / by : 0);
		return {
			strafeH: ratio(data.strafe, drag.horizontal),
			strafeV: ratio(data.strafe, drag.vertical),
			pitch: ratio(data.pitch, drag.pitch),
			yaw: ratio(data.yaw, drag.yaw),
			roll: ratio(data.roll, drag.roll),
			pitchResponse: ratio(ship.inertia?.pitch, drag.pitch),
			yawResponse: ratio(ship.inertia?.yaw, drag.yaw),
			rollResponse: ratio(ship.inertia?.roll, drag.roll),
			strafeResponse: ratio(ship.mass, drag.horizontal),
		};
	}

	/** Connection tag of the ship's thruster size: `Size.small` ('Small') is 'small'. */
	static sizeTag(ship: Ship): string | undefined {
		return (Object.keys(Size) as (keyof typeof Size)[]).find((key) => Size[key] === ship.thruster);
	}
}
