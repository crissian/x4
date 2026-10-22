import { DestroyRef, Injectable, Injector, computed, effect, inject, signal, untracked } from '@angular/core';
import { disabled, form, min } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { LazyValue } from '../core/lazy-value';
import type { RouteStep } from '../map/route-planner';
import type { SaveMap, SaveRelations, SaveStation } from '../savegame/map/save-map-model';
import { StationNamer } from '../savegame/map/station-name';
import { SavegameFormat } from '../savegame/savegame-format';
import { SavegameStore } from '../savegame/savegame-store';
import { FactionService } from '../shared/services/faction.service';
import type { Sector } from '../shared/services/model/model';
import { ShipStatsService } from '../shared/services/ship-stats.service';
import { ShipService } from '../shared/services/ship.service';
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

	private readonly savegames = inject(SavegameStore);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly sectorService = inject(SectorService);
	private readonly wareService = inject(WareService);
	private readonly shipService = inject(ShipService);
	private readonly shipStats = inject(ShipStatsService);
	private readonly factions = inject(FactionService);
	private readonly injector = inject(Injector);
	private readonly wareInfos = new Map<string, TradeWareInfo | undefined>();

	readonly save = this.savegames.active;
	readonly saveMap = computed(() => this.save()?.data?.['map'] as SaveMap | undefined);
	private readonly relations = computed(() => this.save()?.data?.['relations'] as SaveRelations | undefined);
	/** The save has map data from before relations were read, so hostile stations can't be told apart. */
	readonly reloadNeeded = computed(() => !!this.saveMap() && !this.relations());
	/** The save has no map data and must be loaded again. */
	readonly saveOutdated = computed(() => {
		const save = this.save();
		return !!save && !this.saveMap() && this.savegames.status(save.id) === 'reload-needed';
	});
	readonly gameTime = computed(() => SavegameFormat.time(this.save()?.info.gameTime ?? 0));

	/** The cargo ships with their size and total hold. */
	readonly ships = TradeShips.list(this.shipService.getEntities(), this.shipStats).map((ship) => ({
		id: ship.id,
		name: ship.name,
		size: ship.size,
		capacity: (ship.cargo ?? []).reduce((sum, x) => sum + x.max, 0),
	}));
	/** The sectors of the save, by name. */
	readonly sectors = computed<Sector[]>(() => {
		const ids = new Set((this.saveMap()?.sectors ?? []).map((x) => x.id));
		return this.sectorService
			.getEntities()
			.filter((x) => ids.has(x.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	});
	/** The wares the save's stations trade, by name. */
	readonly wares = computed(() => {
		const ids = new Set((this.saveMap()?.stations ?? []).flatMap((x) => (x.offers ?? []).map((o) => o.ware)));
		return this.wareService
			.getEntities()
			.filter((x) => ids.has(x.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	private readonly lookups: TradeRouteLookups = {
		ship: (id) => this.ships.some((x) => x.id === id),
		sectorName: (id) => this.sectorService.getEntity(id)?.name,
		sectorId: (name) => {
			const key = name.trim().toLowerCase();
			return key ? this.sectorService.getEntities().find((x) => x.name.toLowerCase() === key)?.id : undefined;
		},
		ware: (id) => !!id && !!this.wareService.getEntity(id),
	};

	readonly model = signal<TradeRoutesModel>(
		TradeRouteQuery.read(this.activatedRoute.snapshot.queryParamMap, this.lookups)
	);
	readonly form = form(this.model, (x) => {
		min(x.cargo, TradeRouteQuery.MIN.cargo);
		min(x.speed, TradeRouteQuery.MIN.speed);
		min(x.charge, TradeRouteQuery.MIN.charge);
		min(x.jumps, TradeRouteQuery.MIN.jumps);
		// the jumps limit applies to a near sector
		disabled(x.jumps, ({ valueOf }) => !valueOf(x.near).trim());
	});
	/** The model with out of range numbers back at their defaults. */
	private readonly filterModel = computed(() => TradeRouteQuery.clean(this.model()));
	readonly custom = computed(() => this.model().ship === TradeRouteQuery.CUSTOM);
	readonly near = computed(() => this.lookups.sectorId(this.filterModel().near));
	private readonly selectedKey = signal(this.activatedRoute.snapshot.queryParamMap.get('route') ?? '');

	/** Kept while the ship's numbers stay the same, so editing text filters doesn't search again. */
	readonly ship = computed<TradeShipSpec>(
		() => {
			const model = this.filterModel();
			const ship = model.ship === TradeRouteQuery.CUSTOM ? undefined : this.shipService.getEntity(model.ship);
			return ship
				? TradeShips.spec(ship, this.shipStats)
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

	private readonly namer = new LazyValue(
		() => !!this.saveMap(),
		async () => {
			const { SiteNamingTables } = await import('../map/save/site-naming-tables');
			return new StationNamer(this.injector.get(SiteNamingTables));
		}
	);
	readonly rows = computed<TradeRouteRow[]>(() => {
		const namer = this.namer.value();
		return this.result().routes.map((route) => ({
			route,
			ware: this.wareService.getEntity(route.ware)?.name ?? route.ware,
			seller: this.stationName(route.seller, namer),
			buyer: this.stationName(route.buyer, namer),
			sellerSector: this.sectorName(route.seller.sector),
			buyerSector: this.sectorName(route.buyer.sector),
		}));
	});
	/** The route named in the URL, else the first one. */
	readonly selected = computed<TradeRouteRow | undefined>(() => {
		const rows = this.rows();
		const key = this.selectedKey();
		return rows.find((x) => x.route.key === key) ?? rows[0];
	});
	/** The selected route's sectors from seller to buyer. */
	readonly steps = computed<RouteStep[]>(() => {
		const route = this.selected()?.route;
		return route ? (this.cache().route(route.seller.sector, route.buyer.sector)?.steps ?? []) : [];
	});

	/** The URL params last written to, or read from, the URL (none yet, so the first write cleans the URL); used to skip writes that change nothing. */
	private urlKey = '';

	constructor() {
		// the filters and the selection are kept in the URL
		effect(() => {
			const queryParams = this.params(this.filterModel(), this.selectedKey());
			const key = JSON.stringify(queryParams);
			if (key === this.urlKey) {
				return;
			}
			this.urlKey = key;
			untracked(
				() =>
					void this.router.navigate([], {
						relativeTo: this.activatedRoute,
						queryParams,
						queryParamsHandling: 'merge',
						replaceUrl: true,
					})
			);
		});
		// the form follows URL changes it didn't write itself, such as the header link clearing the params
		const subscription = this.activatedRoute.queryParamMap.pipe(skip(1)).subscribe((params) => {
			const model = TradeRouteQuery.clean(TradeRouteQuery.read(params, this.lookups));
			const selected = params.get('route') ?? '';
			const key = this.paramsKey(model, selected);
			if (key !== this.urlKey) {
				this.urlKey = key;
				this.model.set(TradeRouteQuery.read(params, this.lookups));
				this.selectedKey.set(selected);
			}
		});
		inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
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

	private params(model: TradeRoutesModel, route: string) {
		return { ...TradeRouteQuery.write(model, this.lookups), route: route || null };
	}

	private paramsKey(model: TradeRoutesModel, route: string): string {
		return JSON.stringify(this.params(model, route));
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

	/** The station name and its owner's short name; the code until the naming tables load. */
	private stationName(station: SaveStation, namer: StationNamer | undefined): string {
		const name = namer?.name(station) ?? station.code;
		const owner = station.owner === 'player' ? undefined : this.factions.getEntity(station.owner)?.shortName;
		return owner && !name.startsWith(`${owner} `) ? `${name} (${owner})` : name;
	}
}
