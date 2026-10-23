import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { GameText } from '../core/game-text';
import { LazyValue } from '../core/lazy-value';
import { GAME_START_STATION_TYPES, STATION_TYPES } from '../shared/services/constants';
import { GodStations } from '../shared/services/data/god-stations-data';
import { Size } from '../shared/services/data/size-data';
import { GodStation } from '../shared/services/model/model';
import { ShipListService } from '../shared/services/ship-list.service';
import { MapBuyOptions } from './map-buy-options';
import { MapStore } from './map-store';
import { MapSaveLayer } from './save/map-save-layer';
import { StationHover, StationMarker, StationMarkers } from './station-marker';

/**
 * Stations on the map and the "where to buy" search: the stations the game creates at the start, or
 * the stations of the active save. Provided by the map page next to `MapStore`.
 */
@Injectable()
export class MapStations {
	private static readonly EQUIPMENT_SELLERS = ['equipmentdock', 'wharf', 'shipyard'];

	private readonly store = inject(MapStore);
	private readonly save = inject(MapSaveLayer);
	private readonly ships = inject(ShipListService);
	/** Equipment for "where to buy", loaded with the stations panel: the map has no other use for it. */
	private readonly equipment = LazyValue.service(
		() => this.store.tab() === 'stations',
		() =>
			GameText.withTexts(['equipment'], () => import('../shared/services/equipment.service')).then(
				(x) => x.EquipmentService
			)
	);

	readonly stationsModel = signal({
		types: Object.fromEntries(
			STATION_TYPES.map((x) => [x.id, x.id !== 'defence' && x.id !== 'piratebase'])
		) as Record<string, boolean>,
		/** The ship or equipment to buy: `ship:<id>` or `equipment:<id>`, empty for none. */
		buy: '',
	});
	readonly stationsForm = form(this.stationsModel);
	/** The save station under the pointer. */
	readonly hovered = signal<StationHover | undefined>(undefined);

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

	/** Ships by size, and equipment by type once loaded, for the "where to buy" picker. */
	readonly buyOptions = computed(() =>
		MapBuyOptions.build(
			this.ships.getEntities(),
			(this.equipment.value()?.getEntities() ?? []).filter((x) => x.owners?.length)
		)
	);
	readonly buyItem = computed(() => this.stationsModel().buy || undefined);

	/** Stations selling the chosen item, closest to the route start first. Player stations never sell. */
	readonly sellers = computed(() => {
		const [kind, id] = this.buyItem()?.split(':') ?? [];
		if (!id) {
			return [];
		}
		let owners: string[];
		let sells: (station: StationMarker) => boolean;
		if (kind === 'ship') {
			const ship = this.ships.getEntity(id);
			owners = (ship?.owners ?? []).map((x) => x.id);
			// the build modules decide which sizes a wharf or shipyard builds, see ShipBuildClasses
			sells = (x) => x.shipSizes.includes(ship?.size as Size);
		} else {
			owners = (this.equipment.value()?.getEntity(id)?.owners ?? []).map((x) => x.id);
			sells = (x) => MapStations.EQUIPMENT_SELLERS.includes(x.typeId);
		}
		const travel = this.store.travel();
		return this.stations()
			.filter((x) => !x.state && !x.player && owners.includes(x.owner ?? '') && sells(x))
			.map((x) => ({ ...x, time: travel?.time.get(x.sector) }))
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (a.time ?? 0) - (b.time ?? 0) || a.shape.sector.name.localeCompare(b.shape.sector.name));
	});

	private saveStations(): StationMarker[] {
		return this.save.stations().map((x) => StationMarkers.fromSave(x));
	}

	private gameStartStations(): StationMarker[] {
		return (GodStations as GodStation[])
			.filter((x) => this.store.isShown(x.version))
			.flatMap((station, i) => {
				const shape = this.store.shapeById.get(station.sector);
				return shape ? [StationMarkers.fromGameStart(station, i, shape, this.store.faction(station.owner))] : [];
			});
	}
}
