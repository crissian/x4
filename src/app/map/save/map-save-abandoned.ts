import { Injectable, Signal, computed, inject } from '@angular/core';
import { LazyValue } from '../../core/lazy-value';
import { ActiveSave } from '../../savegame/active-save';
import type { SaveOwnerlessShip } from '../../savegame/empire/save-empire-model';
import { AbandonedShips } from '../../shared/services/data/abandoned-ships-data';
import type { AbandonedShip, ShipListItem } from '../../shared/services/model/model';
import { ShipListService } from '../../shared/services/ship-list.service';
import { GalaxyLayout, SectorShape } from '../galaxy-layout';
import { MapStore } from '../map-store';
import { AbandonedSaveStatus, AbandonedStatus } from './abandoned-save-status';

/** An ownerless ship of the save that is not on the game start list, placed on the map. */
export interface ExtraAbandonedMarker {
	ship: SaveOwnerlessShip;
	model: ShipListItem | undefined;
	shape: SectorShape;
	/** sector position in km */
	at: { x: number; z: number };
	x: number;
	y: number;
}

/**
 * The abandoned ships with the active save: which ships of the game start list are still ownerless, and the
 * ownerless ships the list doesn't have. Provided by the map page next to `MapStore`.
 */
@Injectable()
export class MapSaveAbandoned {
	private readonly store = inject(MapStore);
	private readonly ships = inject(ShipListService);
	private readonly activeSave = inject(ActiveSave);
	private readonly ownModels = computed(() => new Set((this.activeSave.empire()?.ships ?? []).map((x) => x.macro)));
	/** The zone positions, for ships in a predefined zone; loaded in their own chunk with the first such ship. */
	private readonly zones = new LazyValue(
		() => !!this.activeSave.empire()?.ownerless.some((x) => x.zone),
		() =>
			import('../../shared/services/data/zones-data').then(
				({ Zones }) => new Map(Zones.all.map((x) => [x.id, x]))
			)
	).value;

	/** A save with ownerless ship data is active. */
	readonly active = computed(() => !!this.activeSave.empire());

	private readonly matches = computed(() => {
		const ownerless = this.activeSave.empire()?.ownerless;
		if (!ownerless) {
			return undefined;
		}
		const list = AbandonedShips as AbandonedShip[];
		const result = AbandonedSaveStatus.match(list, ownerless, (x) => this.position(x));
		return { byItem: new Map(list.map((item, i) => [item, result.statuses[i]])), extras: result.extras };
	});

	/** The save status of a ship of the start list; undefined without a save. */
	status(item: AbandonedShip): AbandonedStatus | undefined {
		return this.matches()?.byItem.get(item);
	}

	/** The player owns a ship of this model in the save. */
	owns(model: string): boolean {
		return this.ownModels().has(model);
	}

	/** The ownerless ships not on the start list, in the drawn sectors. */
	readonly extras: Signal<ExtraAbandonedMarker[]> = computed(() => {
		const drawn = this.store.drawnIds();
		return (this.matches()?.extras ?? []).flatMap((ship) => {
			const shape = drawn.has(ship.sector) ? this.store.shapeById.get(ship.sector) : undefined;
			if (!shape || (ship.zone && !this.zones())) {
				return [];
			}
			const at = this.position(ship);
			return [
				{
					ship,
					model: this.ships.getEntity(ship.macro),
					shape,
					at,
					...GalaxyLayout.markerPosition(shape, at.x, at.z),
				},
			];
		});
	});

	/** The sector position of a save ship: its zone's position plus its own; an unknown zone counts as the centre. */
	private position(ship: SaveOwnerlessShip): { x: number; z: number } {
		const zone = ship.zone ? this.zones()?.get(ship.zone) : undefined;
		return { x: (zone?.x ?? 0) + ship.x, z: (zone?.z ?? 0) + ship.z };
	}
}
