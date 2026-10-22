import { Injectable, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { disabled, form, min } from '@angular/forms/signals';
import { enumLabel } from '../core/enum-labels';
import { persistedSignal } from '../core/services/local-storage';
import { GAME_VERSIONS, STATION_TYPES, StationTypeInfo } from '../shared/services/constants';
import { AbandonedShips } from '../shared/services/data/abandoned-ships-data';
import { GodStations } from '../shared/services/data/god-stations-data';
import { Size } from '../shared/services/data/size-data';
import { EquipmentService } from '../shared/services/equipment.service';
import { FactionService } from '../shared/services/faction.service';
import { AbandonedShip, Faction, GodStation, Sector, Ship } from '../shared/services/model/model';
import { ShipStatsService } from '../shared/services/ship-stats.service';
import { ShipService } from '../shared/services/ship.service';
import { ClusterService, SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { CLUSTER_RADIUS, SectorShape, layoutGalaxy } from './galaxy-layout';
import { minerCapacity, minersFor, miningTrip } from './mining';
import { travelTimes } from './route-planner';

export type ColorMode = 'owner' | 'sunlight' | 'security' | 'resource';
export type PriceLevel = 'min' | 'avg' | 'max';
export type PanelTab = 'route' | 'mining' | 'stations' | 'abandoned';

export interface ViewBox {
	x: number;
	y: number;
	w: number;
}

export const NEUTRAL = '#6b7280';
const LABEL_PX = 11;

/** Sunlight 0% .. 200%+ from deep blue to bright yellow. */
function sunlightColor(value: number | undefined): string {
	if (value == null) {
		return NEUTRAL;
	}
	const t = Math.max(0, Math.min(1, value / 2));
	return `hsl(${(230 - 180 * t).toFixed(0)} 85% ${(22 + 43 * t).toFixed(0)}%)`;
}

/** Security 0 .. 1 from red to green. */
function securityColor(value: number | undefined): string {
	if (value == null) {
		return NEUTRAL;
	}
	const t = Math.max(0, Math.min(1, value));
	return `hsl(${(120 * t).toFixed(0)} 75% 45%)`;
}

/** Splits a long name over two lines. */
export function wrap(name: string): string[] {
	if (name.length <= 14) {
		return [name];
	}
	const middle = name.length / 2;
	let split = -1;
	for (let i = 0; i < name.length; i++) {
		if (name[i] === ' ' && (split < 0 || Math.abs(i - middle) < Math.abs(split - middle))) {
			split = i;
		}
	}
	return split < 0 ? [name] : [name.slice(0, split), name.slice(split + 1)];
}

/** Map position of a point inside a sector (km); game positions are within roughly ±500 km of the center. */
function markerPosition(shape: SectorShape, x: number, z: number) {
	const scale = (shape.r * 0.7) / 500;
	const clamp = (v: number) => Math.max(-shape.r * 0.7, Math.min(shape.r * 0.7, v));
	return { x: shape.x + clamp(x * scale), y: shape.y + clamp(-z * scale) };
}

/** Engine with the best travel thrust, used for the travel drive charge time. */
function fastestTravelEngine(stats: ShipStatsService, ship: Ship) {
	const score = (x: { thrust?: { forward: number }; travel?: { thrust: number } }) =>
		(x.thrust?.forward ?? 0) * (x.travel?.thrust ?? 0);
	const engines = stats.engines(ship);
	return engines.reduce<(typeof engines)[number] | undefined>(
		(best, x) => (!best || score(x) > score(best) ? x : best),
		undefined
	);
}

/**
 * State shared by the galaxy map, its layers and side panels. Editable state is held in signal
 * form models; everything else is derived. Provided by the map page, so it lives as long as the page.
 */
@Injectable()
export class MapStore {
	private readonly sectors = inject(SectorService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(WareService);
	private readonly ships = inject(ShipService);
	private readonly shipStats = inject(ShipStatsService);
	private readonly equipment = inject(EquipmentService);

	readonly layout = layoutGalaxy(inject(ClusterService).getEntities(), (id) => this.sectors.getEntity(id));
	readonly sectorList = this.layout.shapes.map((x) => x.sector).sort((a, b) => a.name.localeCompare(b.name));
	readonly shapeById = new Map(this.layout.shapes.map((x) => [x.sector.id, x]));
	readonly resourceWares = [...new Set(this.sectorList.flatMap((x) => x.resources.map((r) => r.ware)))]
		.map((id) => ({ id, name: this.wareName(id) }))
		.sort((a, b) => a.name.localeCompare(b.name));

	// view: pan and zoom in map units
	readonly size = signal({ width: 1000, height: 700 });
	readonly view = signal<ViewBox>(this.home());
	readonly viewBox = computed(() => {
		const view = this.view();
		const size = this.size();
		return `${view.x} ${view.y} ${view.w} ${(view.w * size.height) / size.width}`;
	});
	/** Screen pixels per map unit. */
	readonly scale = computed(() => this.size().width / this.view().w);
	readonly fontSize = computed(() => LABEL_PX / this.scale());
	readonly showSectorLabels = computed(() => (CLUSTER_RADIUS / 2) * this.scale() > 34);
	readonly showLabels = computed(() => CLUSTER_RADIUS * this.scale() > 30);

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
	readonly versions = persistedSignal<boolean[]>(
		'map-versions',
		GAME_VERSIONS.map(() => true),
		{
			parse: (value) => (Array.isArray(value) ? GAME_VERSIONS.map((_, i) => value.includes(i)) : undefined),
			serialize: (value) => value.flatMap((shown, i) => (shown ? [i] : [])),
		}
	);
	readonly versionsForm = form(this.versions);
	readonly shownVersionCount = computed(() => this.versions().filter((x) => x).length);
	readonly visibleShapes = computed(() => this.layout.shapes.filter((x) => this.isShown(x.sector.version)));
	readonly visibleLinks = computed(() =>
		this.layout.links.filter((x) => this.isShown(x.from.sector.version) && this.isShown(x.to.sector.version))
	);
	private readonly visibleSectors = computed(() => this.visibleShapes().map((x) => x.sector));

	// route planner: sectors are picked by name from a datalist
	readonly routeShips = [...this.ships.getEntities()]
		.filter((x) => this.shipStats.maxStats(x).travel > 0)
		.sort((a, b) => a.name.localeCompare(b.name));
	readonly routeModel = signal({ from: '', to: '', ship: '', speed: 3000, charge: 5 });
	readonly routeForm = form(this.routeModel, (route) => {
		min(route.speed, 100);
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
		const speed = Math.max(100, this.routeModel().speed || 3000);
		return from ? travelTimes(this.visibleSectors(), from, { speed, charge: this.travelCharge() }) : undefined;
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
		return ware ? minersFor(this.ships.getEntities(), ware) : [];
	});
	/** Mining settings; the miner resets to the first one able to carry the resource. */
	readonly miningModel = linkedSignal<Ship[], { miner: string; fillMinutes: number; price: PriceLevel }>({
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
		return miner ? this.shipStats.maxStats(miner).travel : 0;
	});
	readonly miningUnits = computed(() => {
		const ware = this.miningWare();
		const miner = this.miner();
		return ware?.volume && miner ? Math.floor(minerCapacity(miner, ware) / ware.volume) : 0;
	});
	private readonly minerTravel = computed(() => {
		const from = this.routeFrom();
		return from && this.miner()
			? travelTimes(this.visibleSectors(), from, {
					speed: this.minerSpeed() || 1000,
					charge: this.travelCharge(),
				})
			: undefined;
	});

	/** Sectors holding the selected resource: credits per hour from the home sector, or the richest first. */
	readonly miningSectors = computed(() => {
		const travel = this.minerTravel();
		const amounts = this.resourceAmounts();
		const ware = this.miningWare();
		const miner = this.miner();
		const { fillMinutes, price } = this.miningModel();
		const capacity = ware && miner ? minerCapacity(miner, ware) : 0;
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
							? miningTrip(time, capacity, ware, ware.price[price], Math.max(1, fillMinutes || 10))
							: undefined,
				};
			})
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (travel ? (b.trip?.perHour ?? 0) - (a.trip?.perHour ?? 0) : b.amount - a.amount))
			.slice(0, 25);
	});

	// game start stations
	readonly stationsModel = signal({
		types: Object.fromEntries(
			STATION_TYPES.map((x) => [x.id, x.id !== 'defence' && x.id !== 'piratebase'])
		) as Record<string, boolean>,
		/** Name of the ship or equipment to buy, picked from a datalist. */
		buy: '',
	});
	readonly stationsForm = form(this.stationsModel);
	readonly stations = computed(() =>
		(GodStations as GodStation[])
			.filter((x) => this.isShown(x.version))
			.flatMap((station, i) => {
				const shape = this.shapeById.get(station.sector);
				if (!shape) {
					return [];
				}
				// stations without a fixed spot are spread around the sector center
				const angle = i * 2.4;
				const position =
					station.x != null
						? markerPosition(shape, station.x, station.z ?? 0)
						: {
								x: shape.x + Math.cos(angle) * shape.r * 0.35,
								y: shape.y + Math.sin(angle) * shape.r * 0.35,
							};
				const type: StationTypeInfo = STATION_TYPES.find((t) => t.id === station.type)!;
				return [{ station, shape, type, faction: this.faction(station.owner), ...position }];
			})
	);
	readonly stationMarkers = computed(() => {
		const types = this.stationsModel().types;
		return this.stations().filter((x) => types[x.station.type]);
	});

	readonly buyOptions = [
		...this.ships.getEntities().map((x) => ({ id: `ship:${x.id}`, name: $localize`${x.name}:name: (ship, ${enumLabel(x.size)}:size:)` })),
		...this.equipment
			.getEntities()
			.filter((x) => x.owners?.length)
			.map((x) => ({ id: `equipment:${x.id}`, name: `${x.name} (${x.type ? enumLabel(x.type) : $localize`equipment`})` })),
	].sort((a, b) => a.name.localeCompare(b.name));
	readonly buyItem = computed(() => {
		const name = this.stationsModel().buy.trim().toLowerCase();
		return name ? this.buyOptions.find((x) => x.name.toLowerCase() === name)?.id : undefined;
	});

	/** Stations selling the chosen item, closest to the route start first. */
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
		const travel = this.travel();
		return this.stations()
			.filter((x) => types.includes(x.station.type) && owners.includes(x.station.owner ?? ''))
			.map((x) => ({ ...x, time: travel?.time.get(x.station.sector) }))
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (a.time ?? 0) - (b.time ?? 0) || a.shape.sector.name.localeCompare(b.shape.sector.name));
	});

	// abandoned ships
	readonly abandonedModel = signal({ show: true });
	readonly abandonedForm = form(this.abandonedModel);
	readonly abandoned = computed(() =>
		(AbandonedShips as AbandonedShip[])
			.filter((x) => this.isShown(x.version))
			.flatMap((item) => {
				const shape = this.shapeById.get(item.sector);
				return shape ? [{ item, shape, ship: this.ships.getEntity(item.ship), ...markerPosition(shape, item.x, item.z) }] : [];
			})
	);

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
		for (const sector of this.sectorList) {
			counts.set(sector.owner ?? '', (counts.get(sector.owner ?? '') ?? 0) + 1);
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
					const color = this.factions.getEntity(sector.owner ?? '')?.color;
					result.set(sector.id, { fill: color ?? NEUTRAL, opacity: color ? 0.5 : 0.2 });
					break;
				}
				case 'sunlight':
					result.set(sector.id, { fill: sunlightColor(sector.sunlight), opacity: 0.85 });
					break;
				case 'security':
					result.set(sector.id, { fill: securityColor(sector.security), opacity: 0.7 });
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
		// a picked ship sets the travel speed and drive charge
		effect(() => {
			const ship = this.ships.getEntity(this.routeShip());
			if (ship) {
				untracked(() => {
					const charge = fastestTravelEngine(this.shipStats, ship)?.travel?.charge;
					this.routeModel.update((route) => ({
						...route,
						speed: Math.round(this.shipStats.maxStats(ship).travel),
						charge: charge ?? route.charge,
					}));
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
		const size = this.size();
		const dx = x > size.width - 290 ? 'calc(-100% - 2rem)' : '0';
		const dy = y > size.height - 220 ? 'calc(-100% - 2rem)' : '0';
		return `translate(${dx}, ${dy})`;
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
	private isShown(version: number) {
		return this.versions()[version] ?? true;
	}

	private home(): ViewBox {
		const { x, y, w, h } = this.layout.bounds;
		const size = untracked(() => this.size?.() ?? { width: 1000, height: 700 });
		// fit the whole galaxy, centered
		const fitW = Math.max(w, (h * size.width) / size.height);
		const fitH = (fitW * size.height) / size.width;
		return { x: x - (fitW - w) / 2, y: y - (fitH - h) / 2, w: fitW };
	}
}
