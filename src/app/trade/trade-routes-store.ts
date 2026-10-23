import { Injectable, computed, inject, signal } from '@angular/core';
import { disabled, form, min } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import type { RouteStep } from '../map/route-planner';
import { SaveStationNames } from '../map/save/save-station-names';
import { ActiveSave } from '../savegame/active-save';
import type { SaveStation } from '../savegame/map/save-map-model';
import { OwnShipList } from '../savegame/own-ships/own-ship-list';
import { OwnShips } from '../savegame/own-ships/own-ships';
import { FilterLookups } from '../shared/services/filter-lookups';
import { ShipListService } from '../shared/services/ship-list.service';
import { SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { TradeRouteFinder } from './trade-route-finder';
import type { TradeFilters, TradeRoute, TradeRouteResult, TradeShipSpec, TradeWareInfo } from './trade-route-model';
import { TradeRouteLookups, TradeRouteQuery, TradeRoutesModel } from './trade-route-query';
import { TradeShips } from './trade-ships';
import { TravelCache } from './travel-cache';

/** A table row: the route with the names it shows. */
export interface TradeRouteRow {
	route: TradeRoute;
	ware: string;
	/** station name and owner */
	seller: string;
	buyer: string;
	sellerSector: string;
	buyerSector: string;
}

/**
 * State of the trade routes page: the filters (a signal form kept in the URL query params), the routes found in
 * the active save and the selected route. Provided by the page.
 */
@Injectable()
export class TradeRoutesStore {
	static readonly DEFAULTS = TradeRouteQuery.DEFAULTS;
	static readonly CARGO_TYPES = TradeRouteQuery.CARGO_TYPES;
	static readonly CUSTOM = TradeRouteQuery.CUSTOM;

	private readonly activeSave = inject(ActiveSave);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly sectorService = inject(SectorService);
	private readonly wareService = inject(WareService);
	private readonly shipService = inject(ShipListService);
	private readonly stationNames = inject(SaveStationNames);
	private readonly allOwnShips = inject(OwnShips);
	private readonly wareInfos = new Map<string, TradeWareInfo | undefined>();

	readonly save = this.activeSave.save;
	readonly saveMap = this.activeSave.map;
	private readonly relations = this.activeSave.relations;
	/** The save has map data from before relations were read, so hostile stations can't be told apart. */
	readonly reloadNeeded = computed(() => !!this.saveMap() && !this.relations());
	readonly status = this.activeSave.status;
	readonly gameTime = this.activeSave.gameTime;

	/** The cargo ships with their size and total hold. */
	readonly ships = TradeShips.list(this.shipService.getEntities()).map((ship) => ({
		id: ship.id,
		name: ship.name,
		size: ship.size,
		capacity: TradeShips.capacity(ship),
	}));
	/** The player's cargo ships in the active save, with their total hold. */
	readonly ownShips = computed(() =>
		this.allOwnShips
			.list()
			.filter((x) => TradeShips.canTrade({ cargo: x.model.cargo, travel: x.travel }))
			.map((own) => ({ ...own, capacity: TradeShips.capacity(own.model) }))
	);
	/** The sectors of the save, by name. */
	readonly sectors = this.activeSave.sectors;
	/** The wares the save's stations trade, by name. */
	readonly wares = computed(() => {
		const ids = new Set((this.saveMap()?.stations ?? []).flatMap((x) => (x.offers ?? []).map((o) => o.ware)));
		return this.wareService
			.getEntities()
			.filter((x) => ids.has(x.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	private readonly lookups: TradeRouteLookups = {
		...new FilterLookups(this.sectorService, this.wareService),
		// own ships load with the save, after the URL is read: their keys are kept until then
		ship: (id) => this.ships.some((x) => x.id === id) || OwnShipList.isKey(id),
	};

	readonly model = signal<TradeRoutesModel>(
		TradeRouteQuery.read(this.activatedRoute.snapshot.queryParamMap, this.lookups)
	);
	readonly form = form(this.model, (x) => {
		min(x.cargo, TradeRouteQuery.RANGES.cargo.min);
		min(x.speed, TradeRouteQuery.RANGES.speed.min);
		min(x.charge, TradeRouteQuery.RANGES.charge.min);
		min(x.jumps, TradeRouteQuery.RANGES.jumps.min);
		// the jumps limit applies to a near sector
		disabled(x.jumps, ({ valueOf }) => !valueOf(x.near).trim());
	});
	/** The model with out of range numbers back at their defaults. */
	private readonly filterModel = computed(() => TradeRouteQuery.clean(this.model()));
	/** The own ship picked, undefined for a ship model, the custom ship, or an own ship not in the active save. */
	private readonly ownShip = computed(() => this.allOwnShips.find(this.model().ship));
	/** The custom ship's numbers apply: picked, or an own ship that isn't in the active save (or not loaded yet). */
	readonly custom = computed(() => {
		const ship = this.model().ship;
		return ship === TradeRouteQuery.CUSTOM || (OwnShipList.isKey(ship) && !this.ownShip());
	});
	readonly near = computed(() => this.lookups.sectorId(this.filterModel().near));
	private readonly selectedKey = signal(this.activatedRoute.snapshot.queryParamMap.get('route') ?? '');

	/** Kept while the ship's numbers stay the same, so editing text filters doesn't search again. */
	readonly ship = computed<TradeShipSpec>(
		() => {
			const model = this.filterModel();
			const own = this.ownShip();
			const ship = own ? { ...own.model, travel: own.travel } : this.shipService.getEntity(model.ship);
			return ship && !this.custom()
				? TradeShips.spec(ship)
				: TradeShips.custom(model.cargo, model.cargoType, model.speed, model.charge);
		},
		{ equal: TradeRoutesStore.sameShip }
	);
	/** Kept while the speed and charge stay the same, so other filter changes reuse the travel times. */
	private readonly travelOptions = computed(
		() => {
			const { speed, charge } = this.ship();
			return { speed, charge };
		},
		{ equal: (a, b) => a.speed === b.speed && a.charge === b.charge }
	);
	readonly cache = computed(() => new TravelCache(this.sectors(), this.travelOptions()));
	/** Kept while the values stay the same: a keystroke that changes nothing doesn't search again. */
	readonly filters = computed<TradeFilters>(
		() => {
			const model = this.filterModel();
			const near = this.near();
			return {
				near,
				maxJumps: near ? model.jumps : undefined,
				ware: model.ware || undefined,
				hideHostile: model.hideHostile,
				playerOnly: model.playerOnly,
				bestPerOffer: model.bestPerOffer,
				hideIllegal: model.illegal === 'hide',
			};
		},
		{
			equal: (a, b) =>
				a.near === b.near &&
				a.maxJumps === b.maxJumps &&
				a.ware === b.ware &&
				a.hideHostile === b.hideHostile &&
				a.playerOnly === b.playerOnly &&
				a.bestPerOffer === b.bestPerOffer &&
				a.hideIllegal === b.hideIllegal,
		}
	);
	readonly result = computed<TradeRouteResult>(() => {
		const map = this.saveMap();
		if (!map) {
			return { routes: [], total: 0 };
		}
		return TradeRouteFinder.find(
			{
				map,
				relations: this.relations(),
				sectors: this.sectors(),
				ware: (id) => this.wareInfo(id),
				ship: this.ship(),
				filters: this.filters(),
			},
			this.cache()
		);
	});

	readonly rows = computed<TradeRouteRow[]>(() =>
		this.result().routes.map((route) => ({
			route,
			ware: this.wareService.getEntity(route.ware)?.name ?? route.ware,
			seller: this.stationNames.label(route.seller),
			buyer: this.stationNames.label(route.buyer),
			sellerSector: this.sectorName(route.seller.sector),
			buyerSector: this.sectorName(route.buyer.sector),
		}))
	);
	/** The route named in the URL, else the first one. */
	readonly selected = computed<TradeRouteRow | undefined>(() =>
		QueryParamSync.pick(this.rows(), this.selectedKey(), (x) => x.route.key)
	);
	/** The selected route's sectors from seller to buyer. */
	readonly steps = computed<RouteStep[]>(() => {
		const route = this.selected()?.route;
		return route ? (this.cache().route(route.seller.sector, route.buyer.sector)?.steps ?? []) : [];
	});

	constructor() {
		// the filters and the selection are kept in the URL
		QueryParamSync.connect(
			computed(() => ({ model: this.filterModel(), route: this.selectedKey() })),
			{
				read: (params) => ({
					model: TradeRouteQuery.read(params, this.lookups),
					route: params.get('route') ?? '',
				}),
				write: ({ model, route }) => ({ ...TradeRouteQuery.write(model, this.lookups), route: route || null }),
			},
			({ model, route }) => {
				this.model.set(model);
				this.selectedKey.set(route);
			}
		);
	}

	private static sameShip(a: TradeShipSpec, b: TradeShipSpec): boolean {
		const keys = Object.keys(a.capacity);
		return (
			a.speed === b.speed &&
			a.charge === b.charge &&
			keys.length === Object.keys(b.capacity).length &&
			keys.every((x) => a.capacity[x] === b.capacity[x])
		);
	}

	select(row: TradeRouteRow): void {
		this.selectedKey.set(row.route.key);
	}

	sectorName(id: string): string {
		return this.sectorService.getEntity(id)?.name ?? id;
	}

	/** The station's amount of the route's ware: stock at the seller, demand at the buyer. */
	static amount(station: SaveStation, route: TradeRoute, sell: boolean): number {
		const price = sell ? route.buyPrice : route.sellPrice;
		const offers = (station.offers ?? []).filter((x) => x.ware === route.ware && x.sell === sell);
		return (offers.find((x) => x.price === price) ?? offers[0])?.amount ?? 0;
	}

	private wareInfo(id: string): TradeWareInfo | undefined {
		if (!this.wareInfos.has(id)) {
			const ware = this.wareService.getEntity(id);
			this.wareInfos.set(id, ware ? TradeShips.wareInfo(ware) : undefined);
		}
		return this.wareInfos.get(id);
	}
}
