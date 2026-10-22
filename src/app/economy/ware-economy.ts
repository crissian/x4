import { Diagnoses } from './diagnosis';
import type { StationFlows, WareEconomy } from './economy-model';
import { SectorBalances } from './sector-balance';
import type { WareClass } from './ware-classes';

interface Accumulator {
	produced: number;
	consumed: number;
	producers: number;
	consumers: number;
	stock: number;
	wanted: number;
	lowestSell?: number;
	highestBuy?: number;
	sellValue: number;
}

/** Sums station flows and offers into one row per ware. */
export class WareEconomies {
	/**
	 * One row per ware that the stations make, use or offer, in no particular order.
	 * @param averagePrice the ware's average price in Cr; undefined for an unknown ware, which gets no row
	 * @param classOf mined and building wares are diagnosed from the market only, and have no value when mined
	 */
	static rows(
		stations: readonly StationFlows[],
		averagePrice: (ware: string) => number | undefined,
		classOf: (ware: string) => WareClass = () => ({ mined: false, building: false, partlyBuilding: false })
	): WareEconomy[] {
		const wares = new Map<string, Accumulator>();
		const get = (ware: string) => {
			let item = wares.get(ware);
			if (!item) {
				item = { produced: 0, consumed: 0, producers: 0, consumers: 0, stock: 0, wanted: 0, sellValue: 0 };
				wares.set(ware, item);
			}
			return item;
		};

		for (const { station, flows } of stations) {
			for (const flow of flows) {
				const item = get(flow.ware);
				item.produced += flow.produced;
				item.consumed += flow.consumed;
				item.producers += flow.produced > 0 ? 1 : 0;
				item.consumers += flow.consumed > 0 ? 1 : 0;
			}
			for (const offer of station.offers ?? []) {
				// shady offers are for the player only: not part of the market
				if (offer.playerOnly) {
					continue;
				}
				const item = get(offer.ware);
				if (offer.sell) {
					item.stock += offer.amount;
					item.sellValue += offer.price * offer.amount;
					item.lowestSell = Math.min(item.lowestSell ?? Infinity, offer.price);
				} else {
					item.wanted += offer.amount;
					item.highestBuy = Math.max(item.highestBuy ?? -Infinity, offer.price);
				}
			}
		}

		const rows: WareEconomy[] = [];
		for (const [ware, item] of wares) {
			const price = averagePrice(ware);
			if (price === undefined) {
				continue;
			}
			const net = item.produced - item.consumed;
			const priceIndex = item.stock > 0 && price > 0 ? (item.sellValue / item.stock / price) * 100 : undefined;
			const { mined, building, partlyBuilding } = classOf(ware);
			const marketBased = mined || building;
			const balance = mined ? 0 : SectorBalances.ratio({ produced: item.produced, consumed: item.consumed, net });
			rows.push({
				ware,
				produced: item.produced,
				consumed: item.consumed,
				net,
				balance,
				value: mined ? 0 : net * price,
				producers: item.producers,
				consumers: item.consumers,
				stock: item.stock,
				wanted: item.wanted,
				lowestSell: item.lowestSell,
				highestBuy: item.highestBuy,
				priceIndex,
				mined,
				building,
				partlyBuilding,
				marketBased,
				diagnosis: Diagnoses.of(balance, priceIndex, marketBased),
			});
		}
		return rows;
	}
}
