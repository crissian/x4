import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import { Size } from '../../shared/services/data/size-data';
import type { GodStation, Ship } from '../../shared/services/model/model';
import { ShipBuildClasses } from './ship-build-classes';

/** A station that builds and sells a ship. */
export interface SellerStation {
	/** save station code, or game start station id */
	id: string;
	type: 'shipyard' | 'wharf';
	owner: string;
	sector: string;
	known: boolean;
	/** the save station, for its name */
	save?: SaveStation;
}

/**
 * The stations selling a ship: those that can build its size and whose owner is one of the factions selling it.
 * Player stations, wrecks and stations under construction never sell.
 */
export class ShipSellerStations {
	static fromGameStart(ship: Ship, stations: readonly GodStation[]): SellerStation[] {
		const owners = ShipSellerStations.owners(ship);
		return stations
			.filter((x) => (x.type === 'shipyard' || x.type === 'wharf') && owners.has(x.owner ?? ''))
			.filter((x) => ShipBuildClasses.ofGameStart(x).includes(ship.size as Size))
			.map((x) => ({
				id: x.id,
				type: x.type as SellerStation['type'],
				owner: x.owner!,
				sector: x.sector,
				known: true,
			}));
	}

	static fromSave(ship: Ship, map: SaveMap): SellerStation[] {
		const owners = ShipSellerStations.owners(ship);
		const result: SellerStation[] = [];
		for (const station of map.stations) {
			if (station.state || !owners.has(station.owner)) {
				continue;
			}
			const sizes = ShipBuildClasses.ofSave(station);
			if (!sizes.includes(ship.size as Size)) {
				continue;
			}
			const shipyard = sizes.includes(Size.large) || sizes.includes(Size.extralarge);
			result.push({
				id: station.code,
				type: shipyard ? 'shipyard' : 'wharf',
				owner: station.owner,
				sector: station.sector,
				known: station.known,
				save: station,
			});
		}
		return result;
	}

	private static owners(ship: Ship): Set<string> {
		const ids = new Set((ship.owners ?? []).map((x) => x.id));
		ids.delete('player');
		return ids;
	}
}
