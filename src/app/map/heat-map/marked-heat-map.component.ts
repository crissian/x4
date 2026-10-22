import { Component, ElementRef, computed, inject, input, output, viewChild } from '@angular/core';
import { MapGeometry } from '../map-geometry';
import { MapZoomButtonsComponent } from '../map-zoom-buttons.component';
import { PanZoom, PanZoomLimits } from '../pan-zoom';
import { PanZoomArea } from '../pan-zoom-area';
import { HeatColors } from './heat-colors';
import type { HeatMapCell } from './heat-map.component';
import { OneSidedHeatColors } from './one-sided-heat-colors';

/** A ★ on a sector with a short label, such as its rank. */
export interface HeatMapMarker {
	sector: string;
	label: string;
}

/** A drawn marker: the star's points and where its label goes. */
interface MarkerShape {
	sector: string;
	label: string;
	points: string;
	x: number;
	y: number;
	size: number;
}

/**
 * A zoomable galaxy map of values that are never negative, grey at zero to green (`OneSidedHeatColors`), with ★
 * markers on chosen sectors. Otherwise as `HeatMapComponent`: idle sectors, an outlined area, the centre, titles
 * and a click on a sector.
 */
@Component({
	selector: 'app-marked-heat-map',
	imports: [MapZoomButtonsComponent],
	templateUrl: './marked-heat-map.component.html',
	styleUrl: './heat-map.component.css',
	providers: [MapGeometry],
})
export class MarkedHeatMapComponent {
	/** The pixels the zoom buttons cover at the right edge. */
	private static readonly BUTTONS_WIDTH = 56;

	/** Value per sector id, 0 or more; sectors that are missing are dimmed. */
	readonly values = input.required<ReadonlyMap<string, number>>();
	/** Sectors where nothing happens, drawn in a darker grey. */
	readonly idle = input<ReadonlySet<string>>(new Set());
	/** The sectors of an area to outline; the others are dimmed. Empty: no area. */
	readonly outline = input<ReadonlySet<string>>(new Set());
	/** The sector to outline, such as the centre of a scope. */
	readonly centre = input<string>();
	/** Sectors marked with a ★ and a label. */
	readonly markers = input<readonly HeatMapMarker[]>([]);
	/** The title of a sector, already translated. */
	readonly format = input<(sectorId: string, name: string, value: number) => string>(
		(_, name, value) => `${name}: ${value}`
	);
	readonly lowLabel = input.required<string>();
	readonly highLabel = input.required<string>();
	readonly mapLabel = input.required<string>();
	readonly sectorClick = output<string>();

	private readonly geometry = inject(MapGeometry);
	private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');

	protected readonly surface = new PanZoomArea(
		this.area,
		() => this.limits(),
		() => this.reset()
	);
	readonly view = this.surface.view;
	readonly panZoom = this.surface.panZoom;
	protected readonly swatches = OneSidedHeatColors.legend();

	readonly max = computed(() => {
		const idle = this.idle();
		return OneSidedHeatColors.scale([...this.values()].filter(([id]) => !idle.has(id)).map(([, x]) => x));
	});
	readonly cells = computed<HeatMapCell[]>(() => {
		const values = this.values();
		const max = this.max();
		const idle = this.idle();
		const area = this.outline();
		const format = this.format();
		return this.geometry.layout.shapes
			.map((shape): HeatMapCell => {
				const id = shape.sector.id;
				const value = values.get(id);
				const inArea = area.has(id);
				const outside = !!area.size && !inArea;
				const color = idle.has(id) ? HeatColors.IDLE : OneSidedHeatColors.fill(value ?? 0, max);
				return value === undefined
					? { shape, color, title: shape.sector.name, inArea, outside }
					: { shape, value, color, title: format(id, shape.sector.name, value), inArea, outside };
			})
			.sort((a, b) => Number(a.inArea) - Number(b.inArea));
	});
	readonly centreShape = computed(() => {
		const id = this.centre();
		return id ? this.geometry.shapeById.get(id) : undefined;
	});
	readonly markerShapes = computed<MarkerShape[]>(() =>
		this.markers().flatMap((marker) => {
			const shape = this.geometry.shapeById.get(marker.sector);
			if (!shape) {
				return [];
			}
			const size = shape.r * 1.1;
			return [
				{
					...marker,
					points: MarkedHeatMapComponent.star(shape.x, shape.y, size),
					x: shape.x,
					y: shape.y,
					size,
				},
			];
		})
	);

	/** The points of a five-pointed star around (x, y), pointing up. */
	static star(x: number, y: number, radius: number): string {
		return Array.from({ length: 10 }, (_, i) => {
			const r = i % 2 ? radius * 0.45 : radius;
			const angle = -Math.PI / 2 + (i * Math.PI) / 5;
			return `${(x + r * Math.cos(angle)).toFixed(1)},${(y + r * Math.sin(angle)).toFixed(1)}`;
		}).join(' ');
	}

	reset() {
		this.view.set(
			PanZoom.fit(this.geometry.layout.bounds, this.surface.size(), 0.05, MarkedHeatMapComponent.BUTTONS_WIDTH)
		);
	}

	zoom(factor: number) {
		this.surface.zoom(factor);
	}

	/** Ends a drag; a click on a sector with a value, or its marker, picks it. */
	protected up(event: PointerEvent) {
		const click = this.panZoom.end(event);
		const id = click ? (event.target as Element).closest?.('[data-sector]')?.getAttribute('data-sector') : null;
		if (id) {
			this.sectorClick.emit(id);
		}
	}

	protected pick(event: Event, id: string) {
		event.preventDefault();
		this.sectorClick.emit(id);
	}

	private limits(): PanZoomLimits {
		const bounds = this.geometry.layout.bounds;
		const r = Math.min(...this.geometry.layout.shapes.map((x) => x.r));
		return { minWidth: r * 2, maxWidth: Math.max(bounds.w, bounds.h) * 1.5, bounds, pinch: true };
	}
}
