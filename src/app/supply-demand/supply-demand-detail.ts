import type { WareStationFlow } from '../economy/economy-model';
import type { SaveOffer, SaveStation } from '../savegame/map/save-map-model';

/** An offer of a station for the ware. */
export interface StationOffer {
	station: SaveStation;
	price: number;
	amount: number;
}

/** What the detail panel lists about a ware: the biggest producers and consumers, the best offers. */
export class SupplyDemandDetail {
	/** Stations listed per group. */
	static readonly TOP = 5;

	/** The stations that make the most of the ware per hour. */
	static producers(flows: readonly WareStationFlow[]): WareStationFlow[] {
		return flows
			.filter((x) => x.produced > 0)
			.sort((a, b) => b.produced - a.produced)
			.slice(0, SupplyDemandDetail.TOP);
	}

	/** The stations that use the most of the ware per hour. */
	static consumers(flows: readonly WareStationFlow[]): WareStationFlow[] {
		return flows
			.filter((x) => x.consumed > 0)
			.sort((a, b) => b.consumed - a.consumed)
			.slice(0, SupplyDemandDetail.TOP);
	}

	/**
	 * The best offers of the ware at the stations: the cheapest ones to buy from (`sell`) or the best paying ones
	 * to sell to. Shady offers restricted to the player are left out, as in the market columns.
	 */
	static offers(stations: readonly SaveStation[], ware: string, sell: boolean): StationOffer[] {
		const found: StationOffer[] = [];
		for (const station of stations) {
			for (const offer of station.offers ?? []) {
				if (SupplyDemandDetail.counts(offer, ware, sell)) {
					found.push({ station, price: offer.price, amount: offer.amount });
				}
			}
		}
		return found.sort((a, b) => (sell ? a.price - b.price : b.price - a.price)).slice(0, SupplyDemandDetail.TOP);
	}

	private static counts(offer: SaveOffer, ware: string, sell: boolean): boolean {
		return offer.ware === ware && offer.sell === sell && !offer.playerOnly && offer.amount > 0;
	}
}
