import type { Ship } from './model/model';
import type { ShipStatsService } from './ship-stats.service';

type Engine = ReturnType<ShipStatsService['engines']>[number];

export class TravelDrives {
	/** Engine with the best travel thrust, used for the travel drive charge time. */
	static fastest(stats: ShipStatsService, ship: Ship): Engine | undefined {
		return stats
			.engines(ship)
			.reduce<Engine | undefined>((best, x) => (!best || TravelDrives.score(x) > TravelDrives.score(best) ? x : best), undefined);
	}

	private static score(x: Engine): number {
		return (x.thrust?.forward ?? 0) * (x.travel?.thrust ?? 0);
	}
}
