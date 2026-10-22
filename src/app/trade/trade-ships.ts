import type { Ship, Ware } from '../shared/services/model/model';
import type { ShipStatsService } from '../shared/services/ship-stats.service';
import { TravelDrives } from '../shared/services/travel-drives';
import type { TradeShipSpec, TradeWareInfo } from './trade-route-model';

export class TradeShips {
	static readonly CUSTOM: TradeShipSpec = { capacity: { container: 3000 }, speed: 3000, charge: 5 };

	/** ships with cargo and a travel drive, by name */
	static list(ships: readonly Ship[], stats: ShipStatsService): Ship[] {
		return ships
			.filter((x) => (x.cargo?.length ?? 0) > 0 && stats.maxStats(x).travel > 0)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	static spec(ship: Ship, stats: ShipStatsService): TradeShipSpec {
		const capacity: Record<string, number> = {};
		for (const hold of ship.cargo ?? []) {
			for (const type of hold.types) {
				capacity[type.id] = (capacity[type.id] ?? 0) + hold.max;
			}
		}
		return {
			capacity,
			speed: stats.maxStats(ship).travel,
			charge: TravelDrives.fastest(stats, ship)?.travel?.charge ?? TradeShips.CUSTOM.charge,
		};
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
