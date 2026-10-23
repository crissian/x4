import { Injectable, Signal, computed, inject } from '@angular/core';
import { GameTextRef } from '../../core/game-text-ref';
import { LazyValue } from '../../core/lazy-value';
import { GameTexts } from '../../shared/services/data/game-texts-data';
import { ShipListService } from '../../shared/services/ship-list.service';
import { SectorService } from '../../shared/services/universe.service';
import { ActiveSave } from '../active-save';
import { OwnShip, OwnShipList } from './own-ship-list';

/**
 * The player's ships of the active save for the ship pickers, with their travel speed from the installed engines.
 * Empty without a save that has ships (a save read before they were, or none at all), and until the engine data
 * has loaded in its own chunk.
 */
@Injectable({ providedIn: 'root' })
export class OwnShips {
	private readonly activeSave = inject(ActiveSave);
	private readonly models = inject(ShipListService);
	private readonly sectors = inject(SectorService);
	private readonly calculator = LazyValue.service(
		() => !!this.activeSave.ships()?.length,
		() => import('./own-ship-travel').then((x) => x.OwnShipTravel)
	);

	readonly list: Signal<OwnShip[]> = computed(() => {
		const ships = this.activeSave.ships();
		const calculator = this.calculator.value();
		if (!ships?.length || !calculator) {
			return [];
		}
		return OwnShipList.build(ships, {
			model: (id) => this.models.getEntity(id),
			travel: (ship) => calculator.travel(ship),
			sectorName: (id) => this.sectors.getEntity(id)?.name ?? id,
			text: (ref) => GameTextRef.resolve(ref, GameTexts),
		});
	});
	private readonly byKey = computed(() => new Map(this.list().map((x) => [x.key, x])));

	/** The ship with this key in the active save, undefined when there is none (yet). */
	find(key: string): OwnShip | undefined {
		return OwnShipList.isKey(key) ? this.byKey().get(key) : undefined;
	}
}
