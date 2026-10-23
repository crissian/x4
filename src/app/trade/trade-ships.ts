import { RoutePlanner } from '../map/route-planner';
import type { ShipListItem, Ware } from '../shared/services/model/model';
import { TravelDrives } from '../shared/services/travel-drives';
import type { TradeShipSpec, TradeWareInfo } from './trade-route-model';

export class TradeShips {
	static readonly CUSTOM: TradeShipSpec = { capacity: { container: 3000 }, ...RoutePlanner.DEFAULT_OPTIONS };

	/** ships with cargo and a travel drive, by name */
	static list<T extends ShipListItem>(ships: readonly T[]): T[] {
		return ships.filter((x) => TradeShips.canTrade(x)).sort((a, b) => a.name.localeCompare(b.name));
	}

	/** A ship with cargo holds and a travel drive. */
	static canTrade(ship: Pick<ShipListItem, 'cargo' | 'travel'>): boolean {
		return (ship.cargo?.length ?? 0) > 0 && TravelDrives.canTravel(ship);
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

	/** m³ of all holds together */
	static capacity(ship: ShipListItem): number {
		return (ship.cargo ?? []).reduce((sum, x) => sum + x.max, 0);
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
