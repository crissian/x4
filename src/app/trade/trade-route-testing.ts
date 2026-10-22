import type { SaveMap, SaveOffer, SaveStation } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import type { TradeInput, TradeWareInfo } from './trade-route-model';

/** Test fixtures: sectors a <-> b <-> c with gates at the centre, plus x without gates. */
export class TradeRouteTesting {
	static readonly WARES: Readonly<Record<string, TradeWareInfo>> = {
		ec: { volume: 6, transport: 'container', illegalIn: [] },
		water: { volume: 6, transport: 'liquid', illegalIn: [] },
		spice: { volume: 1, transport: 'container', illegalIn: ['argon'] },
	};

	static sector(id: string, links: string[]): Sector {
		return {
			id,
			version: 0,
			cluster: id,
			name: id,
			x: 0,
			z: 0,
			resources: [],
			gates: links.map((sector) => ({ sector, type: 'gate', x: 0, z: 0 })),
			highways: [],
			highwayLinks: [],
		};
	}

	static readonly SECTORS: readonly Sector[] = [
		TradeRouteTesting.sector('a', ['b']),
		TradeRouteTesting.sector('b', ['a', 'c']),
		TradeRouteTesting.sector('c', ['b']),
		TradeRouteTesting.sector('x', []),
	];

	static sell(ware: string, price: number, amount: number, playerOnly?: boolean): SaveOffer {
		return { ware, sell: true, price, amount, ...(playerOnly ? { playerOnly } : {}) };
	}

	static buy(ware: string, price: number, amount: number, playerOnly?: boolean): SaveOffer {
		return { ware, sell: false, price, amount, ...(playerOnly ? { playerOnly } : {}) };
	}

	static station(code: string, sector: string, offers: SaveOffer[], extra: Partial<SaveStation> = {}): SaveStation {
		return {
			code,
			macro: 'station',
			owner: 'teladi',
			sector,
			x: 0,
			z: 0,
			known: true,
			modules: [],
			offers,
			...extra,
		};
	}

	static map(stations: SaveStation[], owners: Record<string, string> = {}): SaveMap {
		const sectors = ['a', 'b', 'c', 'x'].map((id) => ({
			id,
			owner: owners[id] ?? 'teladi',
			contested: false,
			known: true,
		}));
		return { sectors, stations, playerShips: {} };
	}

	static input(stations: SaveStation[], extra: Partial<TradeInput> = {}): TradeInput {
		return {
			map: TradeRouteTesting.map(stations),
			sectors: TradeRouteTesting.SECTORS,
			ware: (id) => TradeRouteTesting.WARES[id],
			ship: { capacity: { container: 3000 }, speed: 3000, charge: 5 },
			filters: { hideHostile: true, playerOnly: true, hideIllegal: false },
			...extra,
		};
	}
}
