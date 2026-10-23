import { Injectable, Signal, WritableSignal, computed, inject } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LocalStorage } from '../../core/services/local-storage';
import { ActiveSave } from '../../savegame/active-save';
import type { Sector } from '../../shared/services/model/model';
import type { SectorShape } from '../galaxy-layout';
import { MapStore } from '../map-store';
import { HostileFaction, HostilePresence, HostileSector, HostileStationKind } from './hostile-presence';

/** A faction's presence in a sector, placed on the map. */
export interface HostileMarker extends HostileSector {
	shape: SectorShape;
	/** "Shipyard, Defence platform ×2" */
	summary: string;
}

/**
 * Where the Xenon and Kha'ak have stations and ships in the active save, and the map layer toggles for them (off
 * until turned on, remembered). Provided by the map page next to `MapStore`.
 */
@Injectable()
export class MapHostiles {
	static readonly COLORS: Record<HostileFaction, string> = { xenon: '#ef4444', khaak: '#c084fc' };

	private readonly store = inject(MapStore);
	private readonly activeSave = inject(ActiveSave);

	/** The layers shown on the map. */
	readonly layers: WritableSignal<Record<HostileFaction, boolean>> = LocalStorage.persistedSignal(
		'map-hostile-layers',
		{ xenon: false, khaak: false },
		{
			parse: (value) =>
				value && typeof value === 'object'
					? {
							xenon: (value as Record<string, unknown>)['xenon'] === true,
							khaak: (value as Record<string, unknown>)['khaak'] === true,
						}
					: undefined,
		}
	);
	readonly layersForm = form(this.layers);

	/** A save with map data is active (ship counts need the empire data too, stations don't). */
	readonly active = computed(() => !!this.activeSave.map());

	/** Every faction presence in the drawn sectors, by sector name, Xenon first. */
	readonly sectors: Signal<HostileMarker[]> = computed(() => {
		const map = this.activeSave.map();
		if (!map) {
			return [];
		}
		const hide = this.store.hidesUnknown();
		const drawn = this.store.drawnIds();
		return HostilePresence.build(
			map.stations,
			this.activeSave.empire()?.hostileShips ?? {},
			(x) => !hide || x.known
		)
			.flatMap((item) => {
				const shape = drawn.has(item.sector) ? this.store.shapeById.get(item.sector) : undefined;
				return shape ? [{ ...item, shape, summary: MapHostiles.summary(item) }] : [];
			})
			.sort(
				(a, b) =>
					a.shape.sector.name.localeCompare(b.shape.sector.name) ||
					HostilePresence.FACTIONS.indexOf(a.faction) - HostilePresence.FACTIONS.indexOf(b.faction)
			);
	});

	/** The presences of the factions whose layer is on. */
	readonly markers = computed(() => {
		const layers = this.layers();
		return this.sectors().filter((x) => layers[x.faction]);
	});

	readonly counts = computed(() => {
		const sectors = this.sectors();
		return Object.fromEntries(
			HostilePresence.FACTIONS.map((faction) => {
				const own = sectors.filter((x) => x.faction === faction);
				return [faction, { sectors: own.length, stations: own.reduce((sum, x) => sum + x.stations, 0) }];
			})
		) as Record<HostileFaction, { sectors: number; stations: number }>;
	});

	static factionName(faction: HostileFaction): string {
		return faction === 'xenon' ? $localize`Xenon` : $localize`Kha'ak`;
	}

	/** The hover text of a marker: faction, sector, stations and ships. */
	static title(marker: HostileMarker, sector: Sector): string {
		const parts = [marker.summary, marker.shipTotal ? $localize`${marker.shipTotal}:count: ships` : ''].filter(
			Boolean
		);
		return `${MapHostiles.factionName(marker.faction)} – ${sector.name}: ${parts.join('; ')}`;
	}

	/** The station kinds with their counts, e.g. "Hive, Weapon platform ×4". */
	static summary(item: HostileSector): string {
		return item.kinds
			.map((x) => (x.count > 1 ? `${MapHostiles.kindLabel(x.kind)} ×${x.count}` : MapHostiles.kindLabel(x.kind)))
			.join(', ');
	}

	static kindLabel(kind: HostileStationKind): string {
		switch (kind) {
			case 'hive':
				return $localize`:hostile station:Hive`;
			case 'nest':
				return $localize`:hostile station:Nest`;
			case 'weaponplatform':
				return $localize`:hostile station:Weapon platform`;
			case 'shipyard':
				return $localize`:hostile station:Shipyard`;
			case 'factory':
				return $localize`:hostile station:Factory`;
			case 'defence':
				return $localize`:hostile station:Defence platform`;
			case 'turret':
				return $localize`:hostile station:Turret`;
			case 'asteroidbase':
				return $localize`:hostile station:Asteroid base`;
			default:
				return $localize`:hostile station:Station`;
		}
	}
}
