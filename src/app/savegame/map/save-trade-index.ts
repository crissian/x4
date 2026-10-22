import type { SaveMap } from './save-map-model';
import type { StationNamer } from './station-name';

/** A station's offer of one ware. */
export interface SaveTradeRow {
	/** station code */
	id: string;
	station: string;
	owner: string;
	sector: string;
	sectorName: string;
	/** Cr */
	price: number;
	amount: number;
	playerOnly: boolean;
}

export interface SaveWareTrade {
	/** cheapest first */
	sellers: SaveTradeRow[];
	/** highest price first */
	buyers: SaveTradeRow[];
}

/** Display names the index needs, already translated. */
export interface SaveTradeNames {
	owner(id: string): string;
	sector(id: string): string;
}

/** The offers of the known stations of a save by ware. Loaded lazily with the save code it uses. */
export class SaveTradeIndex {
	private readonly byWare = new Map<string, SaveWareTrade>();

	constructor(map: SaveMap, namer: StationNamer, names: SaveTradeNames) {
		for (const station of map.stations) {
			if (!station.known || !station.offers?.length) {
				continue;
			}
			const base = {
				id: station.code,
				station: namer.name(station),
				owner: names.owner(station.owner),
				sector: station.sector,
				sectorName: names.sector(station.sector),
			};
			for (const offer of station.offers) {
				const trade = this.trade(offer.ware);
				const row = { ...base, price: offer.price, amount: offer.amount, playerOnly: !!offer.playerOnly };
				(offer.sell ? trade.sellers : trade.buyers).push(row);
			}
		}
		for (const trade of this.byWare.values()) {
			trade.sellers.sort((a, b) => a.price - b.price);
			trade.buyers.sort((a, b) => b.price - a.price);
		}
	}

	/** The sellers and buyers of a ware; empty lists when no known station trades it. */
	forWare(ware: string): SaveWareTrade {
		return this.byWare.get(ware) ?? { sellers: [], buyers: [] };
	}

	private trade(ware: string): SaveWareTrade {
		let trade = this.byWare.get(ware);
		if (!trade) {
			trade = { sellers: [], buyers: [] };
			this.byWare.set(ware, trade);
		}
		return trade;
	}
}
