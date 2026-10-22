import { Component, ElementRef, computed, effect, inject, input, untracked, viewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { AppDialog } from '../../shared/components/modal/dialog';
import { FactionService } from '../../shared/services/faction.service';
import { MapLink, SectorShape } from '../galaxy-layout';
import { MapZoomButtonsComponent } from '../map-zoom-buttons.component';
import { MapGeometry } from '../map-geometry';
import { PanZoom, PanZoomLimits, Rect } from '../pan-zoom';
import { PanZoomArea } from '../pan-zoom-area';
import { MAP_SHAPES, MapSaveLayer } from '../save/map-save-layer';
import { StationMarkers } from '../station-marker';
import { RouteMapDialogComponent, RouteMapDialogData } from './route-map-dialog.component';

/** A path sector with the colour of its owner. */
export interface RouteMapSector {
	shape: SectorShape;
	color: string;
	/** drawn with a red outline */
	warn: boolean;
}

/** What the map draws for a path: its sectors, the line through them and the dimmed sectors around it. */
export interface RouteMapRoute {
	sectors: RouteMapSector[];
	/** The polyline points through the sector centres. */
	points: string;
	start: SectorShape;
	end: SectorShape;
	/** The path hexes plus one hex radius. */
	box: Rect;
	/** The sectors near the path, drawn dimmed for context, and the links between the drawn sectors. */
	context: SectorShape[];
	links: MapLink[];
}

/**
 * A zoomable map of a route through the galaxy: the path sectors in their owner colours, a line through them,
 * start and end markers, and the sectors around them dimmed. The owners come from the active save when it has
 * map data, else from the game start.
 */
@Component({
	selector: 'app-route-map',
	imports: [MapZoomButtonsComponent],
	templateUrl: './route-map.component.html',
	providers: [MapGeometry, MapSaveLayer, { provide: MAP_SHAPES, useFactory: () => inject(MapGeometry).shapeById }],
})
export class RouteMapComponent {
	/** The pixels the zoom buttons cover at the right edge. */
	private static readonly BUTTONS_WIDTH = 56;

	/** Sector ids in travel order; empty draws nothing. Unknown ids are skipped. */
	readonly path = input.required<readonly string[]>();
	/** Fills its container, as in the enlarged dialog, instead of a fixed size. */
	readonly fill = input(false);
	/** Ids of the path sectors to outline in red, such as where the ware is illegal. */
	readonly warnSectors = input<readonly string[]>([]);

	private readonly geometry = inject(MapGeometry);
	private readonly layer = inject(MapSaveLayer);
	private readonly factions = inject(FactionService);
	private readonly dialog = inject(Dialog);
	private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');

	protected readonly surface = new PanZoomArea(
		this.area,
		() => this.limits(),
		() => this.reset()
	);
	readonly size = this.surface.size;
	readonly view = this.surface.view;
	readonly panZoom = this.surface.panZoom;
	readonly fontSize = this.surface.fontSize;

	private readonly shapes = computed(() =>
		this.path().flatMap((id) => {
			const shape = this.geometry.shapeById.get(id);
			return shape ? [shape] : [];
		})
	);

	readonly route = computed<RouteMapRoute | undefined>(() => {
		const shapes = this.shapes();
		if (!shapes.length) {
			return undefined;
		}
		const box = RouteMapComponent.box(shapes, 1);
		const near = RouteMapComponent.grow(box, Math.max(...shapes.map((x) => x.r)) * 2);
		const ids = new Set(shapes.map((x) => x.sector.id));
		const warn = new Set(this.warnSectors());
		const context = this.geometry.layout.shapes.filter(
			(x) => !ids.has(x.sector.id) && RouteMapComponent.inside(x, near)
		);
		const drawn = new Set([...ids, ...context.map((x) => x.sector.id)]);
		return {
			sectors: shapes.map((shape) => ({ shape, color: this.ownerColor(shape), warn: warn.has(shape.sector.id) })),
			points: shapes.map((x) => `${x.x},${x.y}`).join(' '),
			start: shapes[0],
			end: shapes[shapes.length - 1],
			box,
			context,
			links: this.geometry.layout.links.filter((x) => drawn.has(x.from.sector.id) && drawn.has(x.to.sector.id)),
		};
	});

	constructor() {
		// a new path refits the view; a new owner colour (another save) keeps it
		effect(() => {
			this.shapes();
			untracked(() => this.reset());
		});
	}

	/** The bounding box of the hexes, grown by `margin` hex radii. */
	static box(shapes: readonly SectorShape[], margin = 0): Rect {
		const left = Math.min(...shapes.map((x) => x.x - x.r * (1 + margin)));
		const right = Math.max(...shapes.map((x) => x.x + x.r * (1 + margin)));
		const top = Math.min(...shapes.map((x) => x.y - x.r * (Math.sqrt(3) / 2 + margin)));
		const bottom = Math.max(...shapes.map((x) => x.y + x.r * (Math.sqrt(3) / 2 + margin)));
		return { x: left, y: top, w: right - left, h: bottom - top };
	}

	private static grow(box: Rect, by: number): Rect {
		return { x: box.x - by, y: box.y - by, w: box.w + by * 2, h: box.h + by * 2 };
	}

	/** Whether the hex overlaps the box. */
	private static inside(shape: SectorShape, box: Rect): boolean {
		return (
			shape.x + shape.r >= box.x &&
			shape.x - shape.r <= box.x + box.w &&
			shape.y + shape.r >= box.y &&
			shape.y - shape.r <= box.y + box.h
		);
	}

	/** Fits the path's hexes plus one hex radius of margin into the view. */
	reset() {
		const route = this.route();
		if (route) {
			this.view.set(PanZoom.fit(route.box, this.size(), 0.15, RouteMapComponent.BUTTONS_WIDTH));
		}
	}

	/** Opens the map enlarged in a dialog. */
	expand() {
		AppDialog.open(this.dialog, RouteMapDialogComponent, {
			data: { path: this.path(), warnSectors: this.warnSectors() } satisfies RouteMapDialogData,
			size: 'xl',
		});
	}

	zoom(factor: number) {
		this.surface.zoom(factor);
	}

	/** Colour of the sector owner, in the active save or at game start. */
	private ownerColor(shape: SectorShape): string {
		const owner = this.layer.active() ? this.layer.sectors().get(shape.sector.id)?.owner : shape.sector.owner;
		return this.factions.getEntity(owner ?? '')?.color ?? StationMarkers.NEUTRAL;
	}

	private limits(): PanZoomLimits {
		const route = this.route();
		const r = Math.min(...(route?.sectors.map((x) => x.shape.r) ?? [1]));
		const box = route?.box;
		return {
			minWidth: r / 3,
			maxWidth: Math.max(box?.w ?? 0, box?.h ?? 0, r) * 3,
			bounds: box,
			pinch: true,
		};
	}
}
