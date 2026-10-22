import type { SaveOffer, SaveStation } from './save-map-model';

/** Reads the trade offers and modules of a save station. */
export class StationTrade {
	/** The distinct wares a station sells (or buys), in save order. */
	static wares(station: SaveStation, sell: boolean): string[] {
		return [...new Set((station.offers ?? []).filter((x) => x.sell === sell).map((x) => x.ware))];
	}

	/** The sell (or buy) offers of a station. */
	static offers(station: SaveStation, sell: boolean): SaveOffer[] {
		return (station.offers ?? []).filter((x) => x.sell === sell);
	}

	/** The modules of a station with how many of each. */
	static modules(station: SaveStation): { id: string; count: number }[] {
		return station.modules.map((id, i) => ({ id, count: station.moduleCounts?.[i] ?? 1 }));
	}

	/** The first `max` names and how many more there are. */
	static firstOf(names: readonly string[], max = 3): { names: string[]; more: number } {
		return { names: names.slice(0, max), more: Math.max(0, names.length - max) };
	}
}
