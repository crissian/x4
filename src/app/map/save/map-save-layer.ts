import { Injectable, InjectionToken, Signal, WritableSignal, computed, inject } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LazyValue } from '../../core/lazy-value';
import { LocalStorage } from '../../core/services/local-storage';
import { ActiveSave } from '../../savegame/active-save';
import type { SaveSector, SaveStation } from '../../savegame/map/save-map-model';
import type { StationNamer } from '../../savegame/map/station-name';
import type { StationTypeId } from '../../savegame/map/station-type';
import { SavegameStore } from '../../savegame/savegame-store';
import { FactionService } from '../../shared/services/faction.service';
import type { Faction, Sector } from '../../shared/services/model/model';
import { GalaxyLayout, SectorShape } from '../galaxy-layout';
import { StationMarkers } from '../station-marker';
import { SaveStationNames } from './save-station-names';

/**
 * The sector shapes by sector id (`MapGeometry.shapeById`). Injected rather than set by the geometry so the
 * layer has no dependency on it; the map page provides it with `useFactory: () => inject(MapGeometry).shapeById`.
 */
export const MAP_SHAPES = new InjectionToken<ReadonlyMap<string, SectorShape>>('MAP_SHAPES');

export interface MapSaveStation {
	station: SaveStation;
	name: string;
	type: StationTypeId;
	faction: Faction | undefined;
	player: boolean;
	known: boolean;
	shape: SectorShape;
	x: number;
	y: number;
	/** km from the sector centre when beyond the 500 km drawing range, else undefined */
	farKm?: number;
}

export interface PlayerShipCount {
	total: number;
	/** [xs, s, m, l, xl] */
	bySize: number[];
}

/** The lazily loaded data the layer places and names stations with. */
interface SaveLayerData {
	namer: StationNamer;
	zones: ReadonlyMap<string, { x: number; z: number }>;
}

/** The active save's stations and ships placed on the galaxy map. Provided by the map page. */
@Injectable()
export class MapSaveLayer {
	private static readonly RANGE_KM = 500;

	private readonly save = inject(SavegameStore);
	private readonly shapes = inject(MAP_SHAPES);
	private readonly factions = inject(FactionService);
	private readonly stationNames = inject(SaveStationNames);

	/** undefined for an older save without map data */
	private readonly saveMap = inject(ActiveSave).map;
	/** The game texts, station macros and zones load in their own chunk, only once a save has map data. */
	private readonly data = new LazyValue(
		() => !!this.saveMap(),
		() => this.loadData()
	);
	private readonly loaded = this.data.value;
	/** The save's map data once everything needed to draw it is loaded. */
	private readonly map = computed(() => (this.loaded() ? this.saveMap() : undefined));

	/** An active save with map data. */
	readonly active = computed(() => !!this.map());
	/** The active save must be loaded again: outdated and its file not kept, or re-extracting it failed. */
	readonly reloadNeeded = computed(() => {
		const id = this.save.activeId();
		return id !== null && this.save.status(id) === 'reload-needed';
	});
	/** A save is active but its map data (or what draws it) is still loading. */
	readonly pending = computed(
		() => this.save.activeId() !== null && !this.map() && !this.reloadNeeded() && !this.data.failed()
	);
	readonly sectorIds: Signal<ReadonlySet<string> | null> = computed(() => {
		const map = this.map();
		return map ? new Set(map.sectors.map((x) => x.id)) : null;
	});
	readonly sectors: Signal<ReadonlyMap<string, SaveSector>> = computed(
		() => new Map((this.map()?.sectors ?? []).map((x) => [x.id, x]))
	);
	readonly stations: Signal<MapSaveStation[]> = computed(() => {
		const data = this.loaded();
		return data ? (this.map()?.stations ?? []).flatMap((station) => this.place(station, data)) : [];
	});
	readonly playerShips: Signal<ReadonlyMap<string, PlayerShipCount>> = computed(
		() =>
			new Map(
				Object.entries(this.map()?.playerShips ?? {}).map(([sector, bySize]) => [
					sector,
					{ total: bySize.reduce((a, b) => a + b, 0), bySize: [...bySize] },
				])
			)
	);
	readonly discoveredOnly: WritableSignal<boolean> = LocalStorage.persistedSignal('map-discovered-only', false, {
		parse: (value) => (typeof value === 'boolean' ? value : undefined),
	});
	readonly discoveredOnlyForm = form(this.discoveredOnly);

	/** The owner of the sector in the active save, else at game start; undefined when nobody owns it. */
	ownerOf(sector: Sector | undefined): string | undefined {
		const owner = this.active() ? this.sectors().get(sector?.id ?? '')?.owner : sector?.owner;
		return owner?.replace(/^ownerless$/, '') || undefined;
	}

	/** The faction owning the sector in the active save, else at game start. */
	ownerFaction(sector: Sector | undefined): Faction | undefined {
		const owner = this.ownerOf(sector);
		return owner ? this.factions.getEntity(owner) : undefined;
	}

	/** The colour of the faction owning the sector, or the neutral colour. */
	ownerColor(sector: Sector | undefined): string {
		return this.ownerFaction(sector)?.color ?? StationMarkers.NEUTRAL;
	}

	private async loadData(): Promise<SaveLayerData> {
		const [namer, { Zones }] = await Promise.all([
			this.stationNames.loadNamer(),
			import('../../shared/services/data/zones-data'),
		]);
		return { namer, zones: new Map(Zones.all.map((x) => [x.id, x])) };
	}

	private place(station: SaveStation, data: SaveLayerData): MapSaveStation[] {
		const shape = this.shapes.get(station.sector);
		// without a zone the position is relative to the sector; an unknown zone cannot be placed
		const zone = station.zone ? data.zones.get(station.zone) : { x: 0, z: 0 };
		if (!shape || !zone) {
			return [];
		}
		const x = zone.x + station.x;
		const z = zone.z + station.z;
		const distance = Math.hypot(x, z);
		const far = distance > MapSaveLayer.RANGE_KM;
		// far stations sit on the edge of the drawing range, in their true direction
		const scale = far ? MapSaveLayer.RANGE_KM / distance : 1;
		return [
			{
				station,
				name: data.namer.name(station),
				type: data.namer.type(station),
				faction: this.factions.getEntity(station.owner),
				player: station.owner === 'player',
				known: station.known,
				shape,
				...GalaxyLayout.markerPosition(shape, x * scale, z * scale),
				farKm: far ? distance : undefined,
			},
		];
	}
}
