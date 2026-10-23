import type { SaveOffer, SaveRelations, SaveStation } from '../savegame/map/save-map-model';
import {
	TradeInput,
	TradeRoute,
	TradeRouteResult,
	TradeRules,
	TradeShipSpec,
	TradeWareInfo,
} from './trade-route-model';
import { TradeRouteGrouping } from './trade-route-grouping';
import { TradeTransit } from './trade-transit';
import { TravelCache } from './travel-cache';

/** One usable offer, with what the pair loop needs worked out once. */
interface TradeOffer {
	station: SaveStation;
	offer: SaveOffer;
}

interface WareOffers {
	info: TradeWareInfo;
	/** units in a full hold */
	hold: number;
	sellers: TradeOffer[];
	buyers: TradeOffer[];
}

/** Pairs sell offers with richer buy offers of the same ware and ranks them by profit per minute. */
export class TradeRouteFinder {
	static find(input: TradeInput, cache?: TravelCache): TradeRouteResult {
		const travel = cache ?? new TravelCache(input.sectors, { speed: input.ship.speed, charge: input.ship.charge });
		const owners = new Map(input.map.sectors.map((x) => [x.id, x.owner]));
		const routes: TradeRoute[] = [];
		for (const [ware, offers] of TradeRouteFinder.group(input)) {
			for (const seller of offers.sellers) {
				TradeRouteFinder.pair(input, travel, owners, ware, offers, seller, routes);
			}
		}
		routes.sort((a, b) => b.profitPerMinute - a.profitPerMinute);
		const ranked = input.filters.bestPerOffer ? TradeRouteGrouping.bestPerOffer(routes) : routes;
		return { routes: ranked.slice(0, TradeRules.MAX_ROWS), total: ranked.length };
	}

	static capacityFor(ship: TradeShipSpec, ware: TradeWareInfo): number {
		return ship.capacity[ware.transport] ?? 0;
	}

	static isHostile(owner: string, relations: SaveRelations | undefined): boolean {
		return owner !== 'player' && relations != null && (relations[owner] ?? 0) <= TradeRules.HOSTILE_RELATION;
	}

	/** The usable offers by ware, after the station, ware and offer filters. */
	private static group(input: TradeInput): Map<string, WareOffers> {
		const { filters } = input;
		const wares = new Map<string, WareOffers | null>();
		for (const station of input.map.stations) {
			if (station.state || (filters.hideHostile && TradeRouteFinder.isHostile(station.owner, input.relations))) {
				continue;
			}
			for (const offer of station.offers ?? []) {
				if (
					offer.amount <= 0 ||
					(filters.ware && offer.ware !== filters.ware) ||
					(offer.playerOnly && !filters.playerOnly)
				) {
					continue;
				}
				let offers = wares.get(offer.ware);
				if (offers === undefined) {
					offers = TradeRouteFinder.wareOffers(input, offer.ware);
					wares.set(offer.ware, offers);
				}
				if (offers) {
					(offer.sell ? offers.sellers : offers.buyers).push({ station, offer });
				}
			}
		}
		const result = new Map<string, WareOffers>();
		for (const [ware, offers] of wares) {
			if (offers && offers.sellers.length && offers.buyers.length) {
				result.set(ware, offers);
			}
		}
		return result;
	}

	/** null when the ware is unknown or doesn't fit the ship's hold */
	private static wareOffers(input: TradeInput, ware: string): WareOffers | null {
		const info = input.ware(ware);
		const hold = info
			? Math.floor(TradeRouteFinder.capacityFor(input.ship, info) / Math.max(info.volume, 1e-9))
			: 0;
		return info && hold > 0 ? { info, hold, sellers: [], buyers: [] } : null;
	}

	/** Adds the routes from one sell offer to every richer buyer. */
	private static pair(
		input: TradeInput,
		travel: TravelCache,
		owners: ReadonlyMap<string, string>,
		ware: string,
		offers: WareOffers,
		seller: TradeOffer,
		routes: TradeRoute[]
	): void {
		const from = seller.station.sector;
		if (!travel.from(from)) {
			return;
		}
		let startSeconds = 0;
		const { near, maxJumps } = input.filters;
		if (near) {
			const start = travel.route(near, from);
			if (!start || (maxJumps != null && start.jumps > maxJumps)) {
				return;
			}
			startSeconds = start.time;
		}
		const buyPrice = seller.offer.price;
		const minHold = TradeRules.THIN_SHARE * offers.hold;
		for (const buyer of offers.buyers) {
			const sellPrice = buyer.offer.price;
			if (sellPrice <= buyPrice || buyer.station === seller.station) {
				continue;
			}
			const trip = travel.route(from, buyer.station.sector);
			if (!trip) {
				continue;
			}
			const illegalSectors = TradeTransit.illegalSectors(trip.steps, owners, offers.info.illegalIn);
			if (illegalSectors.length && input.filters.hideIllegal) {
				continue;
			}
			const margin = Math.round((sellPrice - buyPrice) * 100) / 100;
			const units = Math.min(seller.offer.amount, buyer.offer.amount, offers.hold);
			const profit = margin * units;
			const seconds = startSeconds + trip.time + 2 * TradeRules.DOCK_SECONDS;
			// duplicate offers can give the same route key; the first match wins (spec)
			routes.push({
				key: `${seller.station.code}~${buyer.station.code}~${ware}`,
				ware,
				seller: seller.station,
				buyer: buyer.station,
				buyPrice,
				sellPrice,
				margin,
				units,
				profit,
				jumps: trip.jumps,
				travelSeconds: trip.time,
				startSeconds,
				seconds,
				profitPerMinute: profit / (seconds / 60),
				thin: units < minHold,
				playerOnly: !!(seller.offer.playerOnly || buyer.offer.playerOnly),
				illegalSectors,
			});
		}
	}
}
