import { DecimalPipe, PercentPipe } from '@angular/common';
import {
	Component,
	DestroyRef,
	ElementRef,
	computed,
	effect,
	inject,
	input,
	signal,
	untracked,
	viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideX, LucideZoomIn, LucideZoomOut, LucideExpand } from '@lucide/angular';
import { AbandonedShips } from '../shared/services/data/abandoned-ships-data';
import { FactionService } from '../shared/services/faction.service';
import { AbandonedShip, Faction, Sector } from '../shared/services/model/model';
import { ShipStatsService } from '../shared/services/ship-stats.service';
import { ShipService } from '../shared/services/ship.service';
import { ClusterService, GAME_VERSIONS, SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { CLUSTER_RADIUS, SectorShape, layoutGalaxy } from './galaxy-layout';
import { formatDuration, travelTimes } from './route-planner';

type ColorMode = 'owner' | 'sunlight' | 'security' | 'resource';

const VERSIONS_KEY = 'map-versions';

function readVersions(): number[] {
	try {
		const value = JSON.parse(localStorage.getItem(VERSIONS_KEY) ?? 'null');
		return Array.isArray(value) ? value : GAME_VERSIONS.map((_, i) => i);
	} catch {
		return GAME_VERSIONS.map((_, i) => i);
	}
}

/** Security 0 .. 1 from red to green. */
function securityColor(value: number | undefined): string {
	if (value == null) {
		return NEUTRAL;
	}
	const t = Math.max(0, Math.min(1, value));
	return `hsl(${(120 * t).toFixed(0)} 75% 45%)`;
}

interface ViewBox {
	x: number;
	y: number;
	w: number;
}

const NEUTRAL = '#6b7280';
const LABEL_PX = 11;

/** Sunlight 0% .. 200%+ from deep blue to bright yellow. */
function sunlightColor(value: number | undefined): string {
	if (value == null) {
		return NEUTRAL;
	}
	const t = Math.max(0, Math.min(1, value / 2));
	const hue = 230 - 180 * t;
	const light = 22 + 43 * t;
	return `hsl(${hue.toFixed(0)} 85% ${light.toFixed(0)}%)`;
}

/** Splits a long name over two lines. */
function wrap(name: string): string[] {
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

@Component({
	imports: [PercentPipe, DecimalPipe, RouterLink, LucideX, LucideZoomIn, LucideZoomOut, LucideExpand],
	templateUrl: './map.component.html',
	host: { class: 'block' },
})
export default class MapComponent {
	private readonly router = inject(Router);
	private readonly sectors = inject(SectorService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(WareService);
	private readonly ships = inject(ShipService);
	private readonly shipStats = inject(ShipStatsService);

	/** Sector to highlight, from the `?sector=` query parameter. */
	readonly sector = input<string>();

	private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

	protected readonly layout = layoutGalaxy(inject(ClusterService).getEntities(), (id) => this.sectors.getEntity(id));
	protected readonly mode = signal<ColorMode>('owner');
	protected readonly resource = signal('ore');
	protected readonly selected = signal<string | undefined>(undefined);
	protected readonly hovered = signal<{ shape: SectorShape; x: number; y: number } | undefined>(undefined);
	protected readonly search = signal('');

	private readonly size = signal({ width: 1000, height: 700 });
	protected readonly view = signal<ViewBox>(this.home());

	protected readonly viewBox = computed(() => {
		const view = this.view();
		const size = this.size();
		return `${view.x} ${view.y} ${view.w} ${(view.w * size.height) / size.width}`;
	});

	/** Screen pixels per map unit. */
	private readonly scale = computed(() => this.size().width / this.view().w);
	protected readonly fontSize = computed(() => LABEL_PX / this.scale());
	protected readonly showSectorLabels = computed(() => (CLUSTER_RADIUS / 2) * this.scale() > 34);
	protected readonly showLabels = computed(() => CLUSTER_RADIUS * this.scale() > 30);

	protected readonly sectorList = this.layout.shapes.map((x) => x.sector).sort((a, b) => a.name.localeCompare(b.name));

	/** Content packs shown on the map. */
	protected readonly gameVersions = GAME_VERSIONS.map((name, id) => ({ id, name }));
	protected readonly versions = signal(new Set(readVersions()));
	protected readonly versionsOpen = signal(false);
	protected readonly visibleShapes = computed(() => this.layout.shapes.filter((x) => this.versions().has(x.sector.version)));
	protected readonly visibleLinks = computed(() =>
		this.layout.links.filter((x) => this.versions().has(x.from.sector.version) && this.versions().has(x.to.sector.version))
	);
	private readonly visibleSectors = computed(() => this.visibleShapes().map((x) => x.sector));
	private readonly shapeById = new Map(this.layout.shapes.map((x) => [x.sector.id, x]));

	// route planner
	protected readonly routeShips = [...this.ships.getEntities()]
		.filter((x) => this.shipStats.maxStats(x).travel > 0)
		.sort((a, b) => a.name.localeCompare(b.name));
	protected readonly routeFrom = signal<string | undefined>(undefined);
	protected readonly routeTo = signal<string | undefined>(undefined);
	protected readonly routeShip = signal('');
	protected readonly travelSpeed = signal(3000);
	protected readonly travelCharge = signal(5);
	protected readonly formatDuration = formatDuration;

	private readonly travel = computed(() => {
		const from = this.routeFrom();
		return from
			? travelTimes(this.visibleSectors(), from, { speed: this.travelSpeed(), charge: this.travelCharge() })
			: undefined;
	});

	protected readonly route = computed(() => {
		const to = this.routeTo();
		return to ? this.travel()?.route(to) : undefined;
	});

	protected readonly routePoints = computed(() =>
		(this.route()?.steps ?? [])
			.map((x) => this.shapeById.get(x.sector.id))
			.map((x) => `${x.x},${x.y}`)
			.join(' ')
	);

	/** Sectors holding the selected resource, closest to the route start first. */
	protected readonly miningSectors = computed(() => {
		const travel = this.travel();
		const amounts = this.resourceAmounts();
		return this.visibleSectors()
			.filter((x) => amounts.has(x.id))
			.map((sector) => ({
				sector,
				amount: amounts.get(sector.id),
				time: travel?.time.get(sector.id),
				jumps: travel?.route(sector.id)?.jumps,
			}))
			.filter((x) => !travel || x.time != null)
			.sort((a, b) => (travel ? a.time - b.time : b.amount - a.amount))
			.slice(0, 20);
	});

	// abandoned ships
	protected readonly showAbandoned = signal(true);
	protected readonly abandoned = computed(() =>
		(AbandonedShips as AbandonedShip[])
			.filter((x) => this.versions().has(x.version) && this.shapeById.has(x.sector))
			.map((item) => {
				const shape = this.shapeById.get(item.sector);
				// game positions are within roughly ±500 km of the sector center
				const scale = (shape.r * 0.7) / 500;
				const clamp = (v: number) => Math.max(-shape.r * 0.7, Math.min(shape.r * 0.7, v));
				return {
					item,
					shape,
					ship: this.ships.getEntity(item.ship),
					x: shape.x + clamp(item.x * scale),
					y: shape.y + clamp(-item.z * scale),
				};
			})
	);

	protected readonly resourceWares = [...new Set(this.sectorList.flatMap((x) => x.resources.map((r) => r.ware)))]
		.map((id) => ({ id, name: this.wares.getEntity(id)?.name ?? id }))
		.sort((a, b) => a.name.localeCompare(b.name));

	/** Total amount of the selected resource per sector. */
	private readonly resourceAmounts = computed(() => {
		const ware = this.resource();
		const amounts = new Map<string, number>();
		for (const sector of this.sectorList) {
			const amount = sector.resources.filter((r) => r.ware === ware).reduce((a, r) => a + r.count * r.yieldAmount, 0);
			if (amount > 0) {
				amounts.set(sector.id, amount);
			}
		}
		return amounts;
	});

	private readonly maxResource = computed(() => Math.max(1, ...this.resourceAmounts().values()));

	protected readonly ownerLegend = computed(() => {
		const counts = new Map<string, number>();
		for (const sector of this.sectorList) {
			counts.set(sector.owner ?? '', (counts.get(sector.owner ?? '') ?? 0) + 1);
		}
		return [...counts]
			.map(([id, count]) => {
				const faction: Faction | undefined = this.factions.getEntity(id);
				return { id, count, name: faction?.name ?? 'Unclaimed', color: faction?.color ?? NEUTRAL };
			})
			.sort((a, b) => b.count - a.count);
	});

	protected readonly fills = computed(() => {
		const mode = this.mode();
		const result = new Map<string, { fill: string; opacity: number }>();
		for (const { sector } of this.layout.shapes) {
			switch (mode) {
				case 'owner': {
					const color = this.factions.getEntity(sector.owner)?.color;
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
					result.set(sector.id, { fill: amount ? '#14b8a6' : NEUTRAL, opacity: amount ? 0.2 + 0.75 * t : 0.12 });
					break;
				}
			}
		}
		return result;
	});

	protected readonly hoveredFaction = computed(() => this.factions.getEntity(this.hovered()?.shape.sector.owner));

	private drag: { x: number; y: number; view: ViewBox; moved: boolean } | undefined;

	constructor() {
		const destroyRef = inject(DestroyRef);
		effect(() => {
			const element = this.container().nativeElement;
			let first = true;
			const observer = new ResizeObserver(([entry]) => {
				const { width, height } = entry.contentRect;
				if (width > 0 && height > 0) {
					this.size.set({ width, height });
					if (first) {
						// fit the view to the real size of the map
						first = false;
						const id = this.selected();
						if (id) {
							this.focus(id);
						} else {
							this.reset();
						}
					}
				}
			});
			observer.observe(element);
			destroyRef.onDestroy(() => observer.disconnect());
		});

		effect(() => {
			const id = this.sector();
			untracked(() => (id ? this.focus(id) : this.selected.set(undefined)));
		});
	}

	protected labelLines(sector: Sector, shape: SectorShape): string[] {
		const single = shape.cluster.sectors.length === 1;
		if (!single && !this.showSectorLabels()) {
			return [];
		}
		const lines = wrap(sector.name);
		if (this.mode() === 'sunlight' && sector.sunlight != null) {
			lines.push(`☀ ${Math.round(sector.sunlight * 100)}%`);
		}
		return lines;
	}

	/** Cluster names for multi sector clusters when zoomed out too far to show the sector names. */
	protected readonly clusterLabels = computed(() => {
		if (this.showSectorLabels() || !this.showLabels()) {
			return [];
		}
		const seen = new Set<string>();
		const result: { x: number; y: number; lines: string[] }[] = [];
		for (const shape of this.layout.shapes) {
			if (shape.cluster.sectors.length > 1 && !seen.has(shape.cluster.id)) {
				seen.add(shape.cluster.id);
				result.push({ x: shape.cluster.x / 1000, y: -shape.cluster.z / 1000, lines: wrap(shape.cluster.name) });
			}
		}
		return result;
	});

	protected setMode(value: string) {
		this.mode.set(value as ColorMode);
	}

	protected toggleVersion(id: number) {
		this.versions.update((versions) => {
			const next = new Set(versions);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			try {
				localStorage.setItem(VERSIONS_KEY, JSON.stringify([...next]));
			} catch {
				// not persisted
			}
			return next;
		});
	}

	private sectorByName(name: string): Sector | undefined {
		return this.sectorList.find((x) => x.name.toLowerCase() === name.trim().toLowerCase());
	}

	protected setRouteFrom(name: string) {
		this.routeFrom.set(this.sectorByName(name)?.id);
	}

	protected setRouteTo(name: string) {
		this.routeTo.set(this.sectorByName(name)?.id);
	}

	protected sectorName(id: string | undefined) {
		return id ? (this.sectors.getEntity(id)?.name ?? id) : '';
	}

	protected setRouteShip(id: string) {
		this.routeShip.set(id);
		const ship = id ? this.ships.getEntity(id) : undefined;
		if (ship) {
			const stats = this.shipStats.maxStats(ship);
			this.travelSpeed.set(Math.round(stats.travel));
			const fastest = this.shipStats
				.engines(ship)
				.reduce((best, x) => ((x.thrust?.forward ?? 0) * (x.travel?.thrust ?? 0) > (best?.thrust?.forward ?? 0) * (best?.travel?.thrust ?? 0) ? x : best), undefined);
			this.travelCharge.set(fastest?.travel?.charge ?? this.travelCharge());
		}
	}

	protected find(name: string) {
		this.search.set(name);
		const sector = this.sectorList.find((x) => x.name.toLowerCase() === name.trim().toLowerCase());
		if (sector) {
			this.router.navigate([], { queryParams: { sector: sector.id }, replaceUrl: true });
		}
	}

	protected clearSelection() {
		this.search.set('');
		this.router.navigate([], { queryParams: {}, replaceUrl: true });
	}

	private focus(id: string) {
		const shape = this.layout.shapes.find((x) => x.sector.id === id);
		this.selected.set(shape ? id : undefined);
		if (shape) {
			this.search.set(shape.sector.name);
			const w = CLUSTER_RADIUS * 14;
			const h = (w * this.size().height) / this.size().width;
			this.view.set({ x: shape.x - w / 2, y: shape.y - h / 2, w });
		}
	}

	private home(): ViewBox {
		const { x, y, w, h } = this.layout.bounds;
		const size = untracked(() => this.size?.() ?? { width: 1000, height: 700 });
		// fit the whole galaxy, centered
		const fitW = Math.max(w, (h * size.width) / size.height);
		const fitH = (fitW * size.height) / size.width;
		return { x: x - (fitW - w) / 2, y: y - (fitH - h) / 2, w: fitW };
	}

	protected reset() {
		this.view.set(this.home());
	}

	protected zoom(factor: number, clientX?: number, clientY?: number) {
		const rect = this.container().nativeElement.getBoundingClientRect();
		const px = clientX == null ? 0.5 : (clientX - rect.left) / rect.width;
		const py = clientY == null ? 0.5 : (clientY - rect.top) / rect.height;
		this.view.update((view) => {
			const h = (view.w * rect.height) / rect.width;
			const w = Math.min(Math.max(view.w * factor, CLUSTER_RADIUS * 4), this.layout.bounds.w * 3);
			const nh = (w * rect.height) / rect.width;
			return { x: view.x + (view.w - w) * px, y: view.y + (h - nh) * py, w };
		});
	}

	protected onWheel(event: WheelEvent) {
		event.preventDefault();
		this.zoom(Math.exp(event.deltaY * 0.0015), event.clientX, event.clientY);
	}

	protected onPointerDown(event: PointerEvent) {
		if (event.button !== 0) {
			return;
		}
		this.drag = { x: event.clientX, y: event.clientY, view: this.view(), moved: false };
	}

	protected onPointerMove(event: PointerEvent, shape?: SectorShape) {
		const rect = this.container().nativeElement.getBoundingClientRect();
		if (this.drag) {
			const dx = event.clientX - this.drag.x;
			const dy = event.clientY - this.drag.y;
			if (!this.drag.moved && Math.hypot(dx, dy) > 4) {
				this.drag.moved = true;
				(event.currentTarget as Element).setPointerCapture?.(event.pointerId);
			}
			if (this.drag.moved) {
				const scale = this.scale();
				this.view.set({ x: this.drag.view.x - dx / scale, y: this.drag.view.y - dy / scale, w: this.drag.view.w });
				this.hovered.set(undefined);
				return;
			}
		}
		if (shape) {
			this.hovered.set({ shape, x: event.clientX - rect.left, y: event.clientY - rect.top });
		} else if (!(event.target as Element).closest('[data-sector]')) {
			this.hovered.set(undefined);
		}
	}

	protected onPointerUp(event: PointerEvent) {
		const drag = this.drag;
		this.drag = undefined;
		if (drag?.moved) {
			return;
		}
		// a click without dragging: open the sector under the pointer
		const target = (event.target as Element).closest('[data-sector]');
		const id = target?.getAttribute('data-sector');
		if (id) {
			this.router.navigate(['/sectors', id]);
		}
	}

	protected resourceAmount(sector: Sector) {
		return this.resourceAmounts().get(sector.id) ?? 0;
	}

	/** Keeps the tooltip inside the map. */
	protected tooltipTransform(x: number, y: number) {
		const size = this.size();
		const dx = x > size.width - 290 ? 'calc(-100% - 2rem)' : '0';
		const dy = y > size.height - 220 ? 'calc(-100% - 2rem)' : '0';
		return `translate(${dx}, ${dy})`;
	}

	protected wareName(id: string) {
		return this.wares.getEntity(id)?.name ?? id;
	}

	protected resourceNames(sector: Sector) {
		return [...new Set(sector.resources.map((r) => this.wareName(r.ware)))].join(', ');
	}
}
