import { Route, RouteOptions, RoutePlanner, TravelTimes } from '../map/route-planner';
import type { Sector } from '../shared/services/model/model';

/** Travel times per start sector, computed on first use, for one ship's speed and charge. */
export class TravelCache {
	private readonly ids: Set<string>;
	private readonly times = new Map<string, TravelTimes>();
	private readonly routes = new Map<string, Route | undefined>();

	constructor(
		private readonly sectors: readonly Sector[],
		private readonly options: RouteOptions
	) {
		this.ids = new Set(sectors.map((x) => x.id));
	}

	/** undefined when `from` is not a known sector */
	from(sector: string): TravelTimes | undefined {
		if (!this.ids.has(sector)) {
			return undefined;
		}
		let times = this.times.get(sector);
		if (!times) {
			times = RoutePlanner.travelTimes(this.sectors, sector, this.options);
			this.times.set(sector, times);
		}
		return times;
	}

	/** cached per from>to; undefined when unreachable */
	route(from: string, to: string): Route | undefined {
		const key = `${from}>${to}`;
		if (this.routes.has(key)) {
			return this.routes.get(key);
		}
		const route = this.from(from)?.route(to);
		this.routes.set(key, route);
		return route;
	}
}
