import { Injectable, Signal, computed, inject } from '@angular/core';
import { MapSaveLayer, PlayerShipCount } from './map-save-layer';

/** What the player has in one sector of the active save. */
export interface SectorPresence {
	/** undefined when the player has no ships there */
	ships: PlayerShipCount | undefined;
	stations: number;
}

/**
 * The per-sector status of the active save: undiscovered, contested and the player's presence. Shared by the
 * canvas, its labels, the tooltip and the legend; everything is empty without a save. Provided by the map page.
 */
@Injectable()
export class MapSaveSectors {
	private readonly save = inject(MapSaveLayer);

	/** Sectors the player has not discovered. */
	readonly unknown: Signal<ReadonlySet<string>> = computed(
		() => new Set([...this.save.sectors()].filter(([, x]) => !x.known).map(([id]) => id))
	);
	readonly contested: Signal<ReadonlySet<string>> = computed(
		() => new Set([...this.save.sectors()].filter(([, x]) => x.contested).map(([id]) => id))
	);
	/** Sectors holding player ships or stations. */
	readonly presence: Signal<ReadonlyMap<string, SectorPresence>> = computed(() => {
		const result = new Map<string, SectorPresence>();
		for (const [sector, ships] of this.save.playerShips()) {
			result.set(sector, { ships, stations: 0 });
		}
		for (const station of this.save.stations()) {
			if (station.player) {
				const sector = station.station.sector;
				const entry = result.get(sector) ?? { ships: undefined, stations: 0 };
				entry.stations++;
				result.set(sector, entry);
			}
		}
		return result;
	});
}
