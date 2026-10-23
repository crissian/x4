import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LocalStorage } from '../../core/services/local-storage';
import { RoutePlanner, TravelTimes } from '../../map/route-planner';
import { SaveStationNames } from '../../map/save/save-station-names';
import { ActiveSave } from '../../savegame/active-save';
import type { StationTypeInfo } from '../../shared/services/constants';
import { FactionService, LicenseRequirement } from '../../shared/services/faction.service';
import type { Faction, Sector, ShipListItem } from '../../shared/services/model/model';
import { StationTypes } from '../../shared/services/station-types';
import { SectorService } from '../../shared/services/universe.service';
import { SellerStanding, Standing } from './seller-standing';
import { SellerStation, ShipSellerStations } from './ship-seller-stations';

/** A table row: a station selling the ship, with its distance and the player's standing. */
export interface SellerRow {
	id: string;
	type: StationTypeInfo;
	name: string;
	owner: string;
	faction?: Faction;
	sectorId: string;
	sector?: Sector;
	known: boolean;
	/** set when a from sector is picked and the station's sector can be reached */
	jumps?: number;
	/** seconds */
	time?: number;
	requirement?: LicenseRequirement;
	standing: Standing;
}

export interface ShipSellerModel {
	/** the from sector's name, as typed */
	from: string;
}

/**
 * The stations selling a ship, nearest first from a sector the player picks: those of the active save when it has
 * map data, else the stations the game creates at the start. Provided by the card.
 */
@Injectable()
export class ShipSellerFinder {
	private readonly activeSave = inject(ActiveSave);
	private readonly stationNames = inject(SaveStationNames);
	private readonly factions = inject(FactionService);
	private readonly sectorService = inject(SectorService);

	private readonly source = signal<Signal<ShipListItem | undefined>>(signal(undefined));
	/** The ship whose sellers are listed. */
	readonly ship = computed(() => this.source()());

	private readonly saveMap = this.activeSave.map;
	private readonly relations = this.activeSave.relations;
	private readonly licences = this.activeSave.licences;
	private readonly godStations = this.stationNames.godStations(() => !this.saveMap());

	/** The stations come from the active save. */
	readonly fromSave = computed(() => !!this.saveMap());
	/** The save has relations, so the standing is checked. */
	readonly withStanding = computed(() => !!this.relations());

	readonly model = LocalStorage.persistedSignal<ShipSellerModel>(
		'ship-sellers-from',
		{ from: '' },
		{ parse: (x) => (typeof (x as ShipSellerModel)?.from === 'string' ? (x as ShipSellerModel) : undefined) }
	);
	readonly form = form(this.model);

	/** The sectors to pick from and route through: the save's, else all, by name. */
	readonly sectors = computed<Sector[]>(() =>
		this.saveMap()
			? this.activeSave.sectors()
			: [...this.sectorService.getEntities()].sort((a, b) => a.name.localeCompare(b.name))
	);
	/** The picked from sector, when the text names one. */
	readonly from = computed(() => {
		const key = this.model().from.trim().toLowerCase();
		return key ? this.sectors().find((x) => x.name.toLowerCase() === key) : undefined;
	});
	private readonly travel = computed<TravelTimes | undefined>(() => {
		const from = this.from();
		return from ? RoutePlanner.travelTimes(this.sectors(), from.id, RoutePlanner.DEFAULT_OPTIONS) : undefined;
	});

	/** The rows, nearest first (or by owner and sector without a from sector); null while loading. */
	readonly rows = computed<SellerRow[] | null>(() => {
		const ship = this.ship();
		if (!ship) {
			return [];
		}
		const stations = this.stations(ship);
		if (!stations) {
			return null;
		}
		const requirements = new Map(this.factions.sellers(ship.owners, ship.license).map((x) => [x.faction.id, x]));
		const rows = stations.map((x) => this.row(x, requirements.get(x.station.owner)));
		return this.travel() ? rows.sort(ShipSellerFinder.byTime) : rows.sort(ShipSellerFinder.byPlace);
	});

	/** Lists the sellers of the given ship (the card's input). */
	connect(ship: Signal<ShipListItem | undefined>): void {
		this.source.set(ship);
	}

	private stations(ship: ShipListItem): { station: SellerStation; name: string }[] | null {
		const map = this.saveMap();
		if (map) {
			const namer = this.stationNames.namer();
			return namer
				? ShipSellerStations.fromSave(ship, map).map((station) => ({
						station,
						name: namer.name(station.save!),
					}))
				: null;
		}
		const god = this.godStations();
		return god
			? ShipSellerStations.fromGameStart(ship, god).map((station) => ({
					station,
					name: this.stationNames.gameStart(station.owner, station.type),
				}))
			: null;
	}

	private row(
		{ station, name }: { station: SellerStation; name: string },
		requirement?: LicenseRequirement
	): SellerRow {
		const travel = this.travel();
		const time = travel?.time.get(station.sector);
		const faction = requirement?.faction ?? this.factions.getEntity(station.owner);
		return {
			id: station.id,
			type: StationTypes.info(station.type),
			name,
			owner: station.owner,
			faction,
			sectorId: station.sector,
			sector: this.sectorService.getEntity(station.sector),
			known: station.known,
			time,
			jumps: time != null ? travel!.route(station.sector)?.jumps : undefined,
			requirement,
			standing: requirement
				? SellerStanding.of(requirement, this.relations(), this.licences())
				: { status: this.relations() ? 'ok' : 'unknown' },
		};
	}

	/** Reachable first, by time, then by name. */
	private static byTime(a: SellerRow, b: SellerRow): number {
		return (a.time ?? Infinity) - (b.time ?? Infinity) || a.name.localeCompare(b.name);
	}

	private static byPlace(a: SellerRow, b: SellerRow): number {
		return (
			(a.faction?.name ?? a.owner).localeCompare(b.faction?.name ?? b.owner) ||
			(a.sector?.name ?? a.sectorId).localeCompare(b.sector?.name ?? b.sectorId) ||
			a.name.localeCompare(b.name)
		);
	}
}
