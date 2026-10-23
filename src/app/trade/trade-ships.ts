import { RoutePlanner } from '../map/route-planner';
import type { ShipListItem, Ware } from '../shared/services/model/model';
import { TravelDrives } from '../shared/services/travel-drives';
import type { TradeShipSpec, TradeWareInfo } from './trade-route-model';

export class TradeShips {
	static readonly CUSTOM: TradeShipSpec = { capacity: { container: 3000 }, ...RoutePlanner.DEFAULT_OPTIONS };

	/** ships with cargo and a travel drive, by name */
	static list<T extends ShipListItem>(ships: readonly T[]): T[] {
		return ships
			.filter((x) => (x.cargo?.length ?? 0) > 0 && TravelDrives.canTravel(x))
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	static spec(ship: ShipListItem): TradeShipSpec {
		const capacity: Record<string, number> = {};
		for (const hold of ship.cargo ?? []) {
			for (const type of hold.types) {
				capacity[type.id] = (capacity[type.id] ?? 0) + hold.max;
			}
		}
		return { capacity, ...TravelDrives.options(ship, TradeShips.CUSTOM) };
	}

	static custom(volume: number, type: string, speed: number, charge: number): TradeShipSpec {
		return { capacity: { [type]: volume }, speed, charge };
	}

	static wareInfo(ware: Ware): TradeWareInfo {
		return {
			volume: ware.volume,
			transport: ware.transport.toLowerCase(),
			illegalIn: (ware.illegal ?? []).map((x) => x.id),
		};
	}
}
