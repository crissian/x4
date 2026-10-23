import { Injectable, inject } from '@angular/core';
import { EquipmentService } from '../../shared/services/equipment.service';
import type { ShipTravel } from '../../shared/services/model/model';
import { ShipPerformance } from '../../shared/services/ship-performance';
import { ShipService } from '../../shared/services/ship.service';
import type { SaveShip } from '../map/save-map-model';

/**
 * The travel speed and drive charge of a save ship with the engines it has installed. Loaded in its own chunk
 * (it needs the full ship and equipment data), by `OwnShips`.
 */
@Injectable({ providedIn: 'root' })
export class OwnShipTravel {
	private readonly ships = inject(ShipService);
	private readonly equipment = inject(EquipmentService);

	/** undefined for an unknown ship or engine, or an engine without a travel drive */
	travel(saveShip: SaveShip): ShipTravel | undefined {
		const ship = this.ships.getEntity(saveShip.macro);
		const engine = saveShip.engine ? this.equipment.getEntity(saveShip.engine) : undefined;
		if (!ship || !engine) {
			return undefined;
		}
		const speeds = ShipPerformance.flightSpeeds(ship, engine, saveShip.engines ?? ship.engines.length);
		return speeds.travel > 0 ? { speed: speeds.travel, charge: speeds.travelCharge } : undefined;
	}
}
