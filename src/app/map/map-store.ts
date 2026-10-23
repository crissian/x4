import { Injectable, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { disabled, form, min } from '@angular/forms/signals';
import { LocalStorage } from '../core/services/local-storage';
import { GAME_VERSIONS } from '../shared/services/constants';
import { AbandonedShips } from '../shared/services/data/abandoned-ships-data';
import { FactionService } from '../shared/services/faction.service';
import { AbandonedShip, Faction, Sector, ShipListItem } from '../shared/services/model/model';
import { OwnShips } from '../savegame/own-ships/own-ships';
import { ShipListService } from '../shared/services/ship-list.service';
import { TravelDrives } from '../shared/services/travel-drives';
import { SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { CLUSTER_RADIUS, GalaxyLayout, SectorShape } from './galaxy-layout';
import { MapGeometry } from './map-geometry';
import { Mining } from './mining';
import { PanZoom, ViewBox } from './pan-zoom';
import { RouteOptions, RoutePlanner } from './route-planner';
import { MapSaveLayer } from './save/map-save-layer';
import { StationMarkers } from './station-marker';

export type ColorMode = 'owner' | 'sunlight' | 'security' | 'resource';
export type PriceLevel = 'min' | 'avg' | 'max';
export type PanelTab = 'route' | 'mining' | 'stations' | 'abandoned';

export const NEUTRAL = StationMarkers.NEUTRAL;

/**
 * State shared by the galaxy map, its layers and side panels. Editable state is held in signal
 * form models; everything else is derived. Provided by the map page, so it lives as long as the page.
 */
@Injectable()
export class MapStore {
	/** Narrowest view in map units: one sector hex fills it, so its stations stand apart. */
	static readonly MIN_VIEW_WIDTH = CLUSTER_RADIUS / 2;
	/** The speed (m/s) and charge (s) of a miner without a travel drive. */
	private static readonly NO_DRIVE: RouteOptions = { speed: 1000, charge: 0 };

	private readonly sectors = inject(SectorService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(WareService);
	private readonly ships = inject(ShipListService);
	private readonly ownShips = inject(OwnShips);
	private readonly save = inject(MapSaveLayer);
	private readonly geometry = inject(MapGeometry);

	readonly layout = this.geometry.layout;
	readonly sectorList = this.geometry.sectorList;
	readonly shapeById = this.geometry.shapeById;
	readonly resourceWares = [...new Set(this.sectorList.flatMap((x) => x.resources.map((r) => r.ware)))]
		.map((id) => ({ id, name: this.wareName(id) }))
		.sort((a, b) => a.name.localeCompare(b.name));

	// view: pan and zoom in map units
	readonly size = signal({ width: 1000, height: 700 });
	readonly view = signal<ViewBox>(this.home());
	/** The view of the map canvas, which drives it with the pointer and its zoom buttons. */
	readonly panZoom = new PanZoom(this.view, this.size, () => ({
		minWidth: MapStore.MIN_VIEW_WIDTH,
		maxWidth: this.layout.bounds.w * 3,
	}));
	readonly showSectorLabels = computed(() => (CLUSTER_RADIUS / 2) * this.panZoom.scale() > 34);
	readonly showLabels = computed(() => CLUSTER_RADIUS * this.panZoom.scale() > 30);

	readonly selected = signal<string | undefined>(undefined);
	readonly hovered = signal<{ shape: SectorShape; x: number; y: number } | undefined>(undefined);
	/** Right-click menu on a sector. */
	readonly menu = signal<{ sector: Sector; x: number; y: number } | undefined>(undefined);
	/** Side panel tab. */
	readonly tab = signal<PanelTab>('route');

	// header settings
	readonly settings = signal({ mode: 'owner' as ColorMode, resource: 'ore', search: '' });
	readonly settingsForm = form(this.settings);
	readonly mode = computed(() => this.settings().mode);
	readonly resource = computed(() => this.settings().resource);

	/** Content packs shown on the map, indexed by version; stored as the list of shown versions. */
	readonly versions = LocalStorage.persistedSignal<boolean[]>(
		'map-versions',
		GAME_VERSIONS.map(() => true),
		{
			parse: (value) => (Array.isArray(value) ? GAME_VERSIONS.map((_, i) => value.includes(i)) : undefined),
			serialize: (value) => value.flatMap((shown, i) => (shown ? [i] : [])),
		}
	);
	readonly versionsForm = form(this.versions);
	readonly shownVersionCount = computed(() => this.versions().filter((x) => x).length);
	/** A save is active with its map data: its sectors replace the version choice. */
	readonly saveActive = this.save.active;
	/** Only discovered sectors are drawn (canvas only; panels keep using every sector of the set). */
	readonly hidesUnknown = computed(() => this.save.active() && this.save.discoveredOnly());
	/** The sectors of the save, or those of the shown versions. */
	private readonly setShapes = computed(() => {
		const ids = this.save.sectorIds();
		return this.layout.shapes.filter((x) => (ids ? ids.has(x.sector.id) : this.isShown(x.sector.version)));
	});
	private readonly visibleSectors = computed(() => this.setShapes().map((x) => x.sector));
	readonly drawnIds = computed(() => {
		const hide = this.hidesUnknown();
		const sectors = this.save.sectors();
		return new Set(this.setShapes().flatMap((x) => (hide && !sectors.get(x.sector.id)?.known ? [] : x.sector.id)));
	});
	readonly visibleShapes = computed(() => {
		const ids = this.drawnIds();
		return this.setShapes().filter((x) => ids.has(x.sector.id));
	});
	readonly visibleLinks = computed(() => {
		const ids = this.drawnIds();
		return this.layout.links.filter((x) => ids.has(x.from.sector.id) && ids.has(x.to.sector.id));
	});

	// route planner: sectors are picked by name from a datalist
	readonly routeShips = [...this.ships.getEntities()]
		.filter((x) => TravelDrives.canTravel(x))
		.sort((a, b) => a.name.localeCompare(b.name));
	/** The player's ships in the active save that have a travel drive. */
	readonly routeOwnShips = computed(() => this.ownShips.list().filter((x) => TravelDrives.canTravel(x)));
	readonly routeModel = signal({ from: '', to: '', ship: '', ...RoutePlanner.DEFAULT_OPTIONS });
	readonly routeForm = form(this.routeModel, (route) => {
		min(route.speed, RoutePlanner.MIN_SPEED);
		min(route.charge, 0);
		// a picked ship sets the speed and charge
		disabled(route.speed, ({ valueOf }) => !!valueOf(route.ship));
		disabled(route.charge, ({ valueOf }) => !!valueOf(route.ship));
	});
	private readonly routeShip = computed(() => this.routeModel().ship);
	readonly routeFrom = computed(() => this.sectorByName(this.routeModel().from)?.id);
	readonly routeTo = computed(() => this.sectorByName(this.routeModel().to)?.id);
	private readonly travelCharge = computed(() => Math.max(0, this.routeModel().charge || 0));

	readonly travel = computed(() => {
		const from = this.routeFrom();
		const speed = Math.max(RoutePlanner.MIN_SPEED, this.routeModel().speed || RoutePlanner.DEFAULT_OPTIONS.speed);
		return from ? RoutePlanner.travelTimes(this.visibleSectors(), from, { speed, charge: this.travelCharge() }) : undefined;
	});
	readonly route = computed(() => {
		const to = this.routeTo();
		return to ? this.travel()?.route(to) : undefined;
	});
	readonly routePoints = computed(() =>
		(this.route()?.steps ?? [])
			.flatMap((x) => this.shapeById.get(x.sector.id) ?? [])
			.map((x) => `${x.x},${x.y}`)
			.join(' ')
	);

	// mining: the home sector is the route start
	readonly miningWare = computed(() => this.wares.getEntity(this.resource()));
	readonly miners = computed(() => {
		const ware = this.miningWare();
		return ware ? Mining.minersFor(this.ships.getEntities(), ware) : [];
	});
	/** Mining settings; the miner resets to the first one able to carry the resource. */
	readonly miningModel = linkedSignal<ShipListItem[], { miner: string; fillMinutes: number; price: PriceLevel }>({
		source: this.miners,
		computation: (miners, previous) => ({
			fillMinutes: 10,
			price: 'avg',
			...previous?.value,
			miner: miners[0]?.id ?? '',
		}),
	});
	readonly miningForm = form(this.miningModel, (mining) => {
		min(mining.fillMinutes, 1);
	});
	readonly miner = computed(() => this.miners().find((x) => x.id === this.miningModel().miner));
	readonly minerSpeed = computed(() => {
		const miner = this.miner();
		return miner?.travel?.speed ?? 0;
	});
	readonly miningUnits = computed(() => {
		const ware = this.miningWare();
		const miner = this.miner();
		return ware?.volume && miner ? Math.floor(Mining.minerCapacity(miner, ware) / ware.volume) : 0;
	});
	/**
	 * How both mining views time the miner: its travel speed (at least the route minimum) and the charge of its
	 * fastest drive; kept while they stay the same.
	 */
	readonly minerTravelOptions = computed<RouteOptions | undefined>(
		() => {
			const miner = this.miner();
			if (!miner) {
				return undefined;
			}
			const options = TravelDrives.options(miner, MapStore.NO_DRIVE);
			return { speed: Math.max(RoutePlanner.MIN_SPEED, options.speed), charge: options.charge };
		},
		{ equal: (a, b) => a?.speed === b?.speed && a?.charge === b?.charge }
	);
	private readonly minerTravel = computed(() => {
		const from = this.routeFrom();
		const options = this.minerTravelOptions();
		return from && options ? RoutePlanner.travelTimes(this.visibleSectors(), from, options) : undefined;
	});

	/** Sectors holding the selected resource: credits per hour from the home sector, or the richest first. */
	readonly miningSectors = computed(() => {
		const travel = this.minerTravel();
		const amounts = this.resourceAmounts();
		const ware = this.miningWare();
		const miner = this.miner();
		const { fillMinutes, price } = this.miningModel();
		const capacity = ware && miner ? Mining.minerCapacity(miner, ware) : 0;
		return this.visibleSectors()
			.filter((x) => amounts.has(x.id))
			.map((sector) => {
				const time = travel?.time.get(sector.id);
				return {
					sector,
					amount: amounts.get(sector.id) ?? 0,
					time,
					jumps: travel?.route(sector.id)?.jumps,
					trip:
						time != null && ware
							? Mining.miningTrip(time, capacity, ware, ware.price[price], Math.max(1, fillMinutes || 10))
							: undefined,
				};
			})
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (travel ? (b.trip?.perHour ?? 0) - (a.trip?.perHour ?? 0) : b.amount - a.amount))
			.slice(0, 25);
	});

	// abandoned ships
	readonly abandonedModel = signal({ show: true });
	readonly abandonedForm = form(this.abandonedModel);
	/** Abandoned ships in the drawn sectors; the version choice only applies without a save. */
	readonly abandoned = computed(() => {
		const drawn = this.drawnIds();
		const saveActive = this.save.active();
		return (AbandonedShips as AbandonedShip[])
			.filter((x) => saveActive || this.isShown(x.version))
			.flatMap((item) => {
				const shape = drawn.has(item.sector) ? this.shapeById.get(item.sector) : undefined;
				return shape ? [{ item, shape, ship: this.ships.getEntity(item.ship), ...GalaxyLayout.markerPosition(shape, item.x, item.z) }] : [];
			});
	});

	// sector colors
	/** Total amount of the selected resource per sector. */
	readonly resourceAmounts = computed(() => {
		const ware = this.resource();
		const amounts = new Map<string, number>();
		for (const sector of this.sectorList) {
			const amount = sector.resources
				.filter((r) => r.ware === ware)
				.reduce((a, r) => a + r.count * r.yieldAmount, 0);
			if (amount > 0) {
				amounts.set(sector.id, amount);
			}
		}
		return amounts;
	});
	private readonly maxResource = computed(() => Math.max(1, ...this.resourceAmounts().values()));

	readonly ownerLegend = computed(() => {
		const counts = new Map<string, number>();
		for (const sector of this.save.active() ? this.visibleSectors() : this.sectorList) {
			const owner = this.save.ownerOf(sector) ?? '';
			counts.set(owner, (counts.get(owner) ?? 0) + 1);
		}
		return [...counts]
			.map(([id, count]) => {
				const faction: Faction | undefined = this.factions.getEntity(id);
				return { id, count, name: faction?.name ?? $localize`Unclaimed`, color: faction?.color ?? NEUTRAL };
			})
			.sort((a, b) => b.count - a.count);
	});

	readonly fills = computed(() => {
		const mode = this.mode();
		const result = new Map<string, { fill: string; opacity: number }>();
		for (const { sector } of this.layout.shapes) {
			switch (mode) {
				case 'owner': {
					const color = this.save.ownerFaction(sector)?.color;
					result.set(sector.id, { fill: color ?? NEUTRAL, opacity: color ? 0.5 : 0.2 });
					break;
				}
				case 'sunlight':
					result.set(sector.id, { fill: MapStore.sunlightColor(sector.sunlight), opacity: 0.85 });
					break;
				case 'security':
					result.set(sector.id, { fill: MapStore.securityColor(sector.security), opacity: 0.7 });
					break;
				case 'resource': {
					const amount = this.resourceAmounts().get(sector.id);
					const t = amount ? Math.log(1 + amount) / Math.log(1 + this.maxResource()) : 0;
					result.set(sector.id, {
						fill: amount ? '#14b8a6' : NEUTRAL,
						opacity: amount ? 0.2 + 0.75 * t : 0.12,
					});
					break;
				}
			}
		}
		return result;
	});

	constructor() {
		// a picked ship sets the travel speed and drive charge; an own ship also its sector as the start
		effect(() => {
			const key = this.routeShip();
			const own = this.ownShips.find(key);
			const ship = own ?? this.ships.getEntity(key);
			if (ship) {
				untracked(() => {
					this.routeModel.update((route) => {
						const options = TravelDrives.options(ship, route);
						const from = route.from || (own ? this.sectorName(own.sector) : '');
						return { ...route, from, speed: Math.round(options.speed), charge: options.charge };
					});
				});
			}
		});
	}

	setRouteFrom(id: string | undefined) {
		this.routeModel.update((route) => ({ ...route, from: this.sectorName(id) }));
	}

	setRouteTo(id: string | undefined) {
		this.routeModel.update((route) => ({ ...route, to: this.sectorName(id) }));
	}

	swapRoute() {
		this.routeModel.update((route) => ({ ...route, from: route.to, to: route.from }));
	}

	/** Selects a sector and centers the view on it. */
	focus(id: string) {
		const shape = this.shapeById.get(id);
		this.selected.set(shape ? id : undefined);
		if (shape) {
			this.settings.update((settings) => ({ ...settings, search: shape.sector.name }));
			const w = CLUSTER_RADIUS * 14;
			const h = (w * this.size().height) / this.size().width;
			this.view.set({ x: shape.x - w / 2, y: shape.y - h / 2, w });
		}
	}

	resetView() {
		this.view.set(this.home());
	}

	/** CSS transform keeping a popup at (x, y) inside the map. */
	keepInside(x: number, y: number) {
		return PanZoom.keepInside(x, y, this.size());
	}

	sectorByName(name: string): Sector | undefined {
		const key = name.trim().toLowerCase();
		return key ? this.sectorList.find((x) => x.name.toLowerCase() === key) : undefined;
	}

	sectorName(id: string | undefined) {
		return id ? (this.sectors.getEntity(id)?.name ?? id) : '';
	}

	faction(id: string | undefined) {
		return id ? this.factions.getEntity(id) : undefined;
	}

	wareName(id: string) {
		return this.wares.getEntity(id)?.name ?? id;
	}

	resourceNames(sector: Sector) {
		return [...new Set(sector.resources.map((r) => this.wareName(r.ware)))].join(', ');
	}

	resourceAmount(sector: Sector) {
		return this.resourceAmounts().get(sector.id) ?? 0;
	}

	/** Content packs added after the stored choice are shown. */
	isShown(version: number) {
		return this.versions()[version] ?? true;
	}

	private home(): ViewBox {
		const size = untracked(() => this.size?.() ?? { width: 1000, height: 700 });
		// fit the whole galaxy, centered
		return PanZoom.fit(this.layout.bounds, size);
	}

	/** Sunlight 0% .. 200%+ from deep blue to bright yellow. */
	private static sunlightColor(value: number | undefined): string {
		if (value == null) {
			return NEUTRAL;
		}
		const t = Math.max(0, Math.min(1, value / 2));
		return `hsl(${(230 - 180 * t).toFixed(0)} 85% ${(22 + 43 * t).toFixed(0)}%)`;
	}

	/** Security 0 .. 1 from red to green. */
	private static securityColor(value: number | undefined): string {
		if (value == null) {
			return NEUTRAL;
		}
		const t = Math.max(0, Math.min(1, value));
		return `hsl(${(120 * t).toFixed(0)} 75% 45%)`;
	}
}
