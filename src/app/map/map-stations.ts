import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { EnumLabels } from '../core/enum-labels';
import { GAME_START_STATION_TYPES, STATION_TYPES, StationTypeInfo } from '../shared/services/constants';
import { GodStations } from '../shared/services/data/god-stations-data';
import { Size } from '../shared/services/data/size-data';
import { EquipmentService } from '../shared/services/equipment.service';
import { Faction, GodStation } from '../shared/services/model/model';
import { ShipService } from '../shared/services/ship.service';
import { GalaxyLayout, SectorShape } from './galaxy-layout';
import { MapStore } from './map-store';
import { MapSaveLayer } from './save/map-save-layer';

/** A station placed on the map: a game start station, or a station of the active save. */
export interface StationMarker {
	id: string;
	sector: string;
	owner: string | undefined;
	/** `StationTypeInfo` id */
	typeId: string;
	type: StationTypeInfo;
	faction: Faction | undefined;
	shape: SectorShape;
	x: number;
	y: number;
	/** the save's station name; game start stations have none */
	name?: string;
	player: boolean;
	known: boolean;
	/** km from the sector centre when beyond the drawing range */
	farKm?: number;
	state?: 'construction' | 'wreck';
}

/**
 * Stations on the map and the "where to buy" search: the stations the game creates at the start, or
 * the stations of the active save. Provided by the map page next to `MapStore`.
 */
@Injectable()
export class MapStations {
	private readonly store = inject(MapStore);
	private readonly save = inject(MapSaveLayer);
	private readonly ships = inject(ShipService);
	private readonly equipment = inject(EquipmentService);

	readonly stationsModel = signal({
		types: Object.fromEntries(
			STATION_TYPES.map((x) => [x.id, x.id !== 'defence' && x.id !== 'piratebase'])
		) as Record<string, boolean>,
		/** Name of the ship or equipment to buy, picked from a datalist. */
		buy: '',
	});
	readonly stationsForm = form(this.stationsModel);
	/** The save station under the pointer; x/y are pixels in the map. */
	readonly hovered = signal<{ marker: StationMarker; x: number; y: number } | undefined>(undefined);

	/** Types with a toggle: factories and others only exist in saves. */
	readonly typeList = computed(() => (this.save.active() ? STATION_TYPES : GAME_START_STATION_TYPES));

	readonly stations = computed(() => (this.save.active() ? this.saveStations() : this.gameStartStations()));
	/** Stations of the shown types, for the panel. */
	readonly stationList = computed(() => {
		const types = this.stationsModel().types;
		return this.stations().filter((x) => types[x.typeId]);
	});
	/** Stations drawn on the map: also leaves out undiscovered ones when only discovered sectors show. */
	readonly stationMarkers = computed(() => {
		const hide = this.store.hidesUnknown();
		const drawn = this.store.drawnIds();
		return this.stationList().filter((x) => !hide || (x.known && drawn.has(x.sector)));
	});

	readonly buyOptions = [
		...this.ships.getEntities().map((x) => ({ id: `ship:${x.id}`, name: $localize`${x.name}:name: (ship, ${EnumLabels.label(x.size)}:size:)` })),
		...this.equipment
			.getEntities()
			.filter((x) => x.owners?.length)
			.map((x) => ({ id: `equipment:${x.id}`, name: `${x.name} (${x.type ? EnumLabels.label(x.type) : $localize`equipment`})` })),
	].sort((a, b) => a.name.localeCompare(b.name));
	readonly buyItem = computed(() => {
		const name = this.stationsModel().buy.trim().toLowerCase();
		return name ? this.buyOptions.find((x) => x.name.toLowerCase() === name)?.id : undefined;
	});

	/** Stations selling the chosen item, closest to the route start first. Player stations never sell. */
	readonly sellers = computed(() => {
		const [kind, id] = this.buyItem()?.split(':') ?? [];
		if (!id) {
			return [];
		}
		let owners: string[];
		let types: string[];
		if (kind === 'ship') {
			const ship = this.ships.getEntity(id);
			owners = (ship?.owners ?? []).map((x) => x.id);
			// wharfs build small and medium ships, shipyards large and extra large ones
			types = [Size.small, Size.medium, Size.extrasmall].includes(ship?.size as Size) ? ['wharf'] : ['shipyard'];
		} else {
			owners = (this.equipment.getEntity(id)?.owners ?? []).map((x) => x.id);
			types = ['equipmentdock', 'wharf', 'shipyard'];
		}
		const travel = this.store.travel();
		return this.stations()
			.filter((x) => types.includes(x.typeId) && owners.includes(x.owner ?? '') && !x.player)
			.map((x) => ({ ...x, time: travel?.time.get(x.sector) }))
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (a.time ?? 0) - (b.time ?? 0) || a.shape.sector.name.localeCompare(b.shape.sector.name));
	});

	private saveStations(): StationMarker[] {
		return this.save.stations().map((x) => ({
			id: x.station.code,
			sector: x.station.sector,
			owner: x.station.owner,
			typeId: x.type,
			type: MapStations.typeInfo(x.type),
			faction: x.faction,
			shape: x.shape,
			x: x.x,
			y: x.y,
			name: x.name,
			player: x.player,
			known: x.known,
			farKm: x.farKm,
			state: x.station.state,
		}));
	}

	private gameStartStations(): StationMarker[] {
		return (GodStations as GodStation[])
			.filter((x) => this.store.isShown(x.version))
			.flatMap((station, i) => {
				const shape = this.store.shapeById.get(station.sector);
				if (!shape) {
					return [];
				}
				// stations without a fixed spot are spread around the sector center
				const angle = i * 2.4;
				const position =
					station.x != null
						? GalaxyLayout.markerPosition(shape, station.x, station.z ?? 0)
						: {
								x: shape.x + Math.cos(angle) * shape.r * 0.35,
								y: shape.y + Math.sin(angle) * shape.r * 0.35,
							};
				return [
					{
						id: station.id,
						sector: station.sector,
						owner: station.owner,
						typeId: station.type,
						type: MapStations.typeInfo(station.type),
						faction: this.store.faction(station.owner),
						shape,
						player: false,
						known: true,
						...position,
					},
				];
			});
	}

	private static typeInfo(id: string): StationTypeInfo {
		return STATION_TYPES.find((x) => x.id === id) ?? STATION_TYPES[STATION_TYPES.length - 1];
	}
}
