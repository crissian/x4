import { Component, ElementRef, computed, inject, input, output, viewChild } from '@angular/core';
import { SectorShape } from '../galaxy-layout';
import { MapGeometry } from '../map-geometry';
import { MapZoomButtonsComponent } from '../map-zoom-buttons.component';
import { PanZoom, PanZoomLimits } from '../pan-zoom';
import { PanZoomArea } from '../pan-zoom-area';
import { HeatColors } from './heat-colors';

/** A sector hex of the heat map. */
export interface HeatMapCell {
	shape: SectorShape;
	/** undefined for a sector without a value: drawn dimmed and not clickable */
	value?: number;
	color: string;
	title: string;
	/** inside the area */
	inArea: boolean;
	/** outside the area, when there is one */
	outside: boolean;
}

/**
 * A zoomable galaxy map that fills every sector by a value on a scale that is symmetric around zero: red below,
 * grey at zero, green above. Click a sector, or press Enter on it, to pick it. Each sector has a title with its
 * name and value, and the picked centre is outlined.
 */
@Component({
	selector: 'app-heat-map',
	imports: [MapZoomButtonsComponent],
	templateUrl: './heat-map.component.html',
	styleUrl: './heat-map.component.css',
	providers: [MapGeometry],
})
export class HeatMapComponent {
	/** The pixels the zoom buttons cover at the right edge. */
	private static readonly BUTTONS_WIDTH = 56;

	/** Value per sector id; sectors that are missing are dimmed. */
	readonly values = input.required<ReadonlyMap<string, number>>();
	/** The end of the colour scale, the value that gets the strongest colour; defaults to the 95th percentile of the absolute values of the sectors that aren't idle. */
	readonly scale = input<number>();
	/** Sectors where nothing happens, drawn in a darker grey whatever their value. */
	readonly idle = input<ReadonlySet<string>>(new Set());
	/** The sectors of an area to outline, such as the jumps around the centre; the others are dimmed. Empty: no area. */
	readonly outline = input<ReadonlySet<string>>(new Set());
	/** The sector to outline, such as the centre of a scope. */
	readonly centre = input<string>();
	/** The title of a sector, already translated; defaults to its name and value. */
	readonly format = input<(sectorId: string, name: string, value: number) => string>(
		(_, name, value) => `${name}: ${value}`
	);
	/** The legend label of the lowest values, already translated. */
	readonly lowLabel = input.required<string>();
	/** The legend label of the highest values, already translated. */
	readonly highLabel = input.required<string>();
	readonly mapLabel = input.required<string>();
	/** Fills its container instead of a fixed size. */
	readonly fill = input(false);
	/** A sector was clicked, or Enter was pressed on it. */
	readonly sectorClick = output<string>();

	private readonly geometry = inject(MapGeometry);
	private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');

	protected readonly surface = new PanZoomArea(
		this.area,
		() => this.limits(),
		() => this.reset()
	);
	readonly size = this.surface.size;
	readonly view = this.surface.view;
	readonly panZoom = this.surface.panZoom;
	protected readonly swatches = HeatColors.legend();

	/** The largest absolute value, the end of the colour scale. */
	readonly max = computed(() => {
		const idle = this.idle();
		return this.scale() ?? HeatColors.scale([...this.values()].filter(([id]) => !idle.has(id)).map(([, x]) => x));
	});
	readonly cells = computed<HeatMapCell[]>(() => {
		const values = this.values();
		const max = this.max();
		const idle = this.idle();
		const area = this.outline();
		const format = this.format();
		const cells = this.geometry.layout.shapes.map((shape): HeatMapCell => {
			const id = shape.sector.id;
			const value = values.get(id);
			const inArea = area.has(id);
			const outside = !!area.size && !inArea;
			return value === undefined
				? { shape, color: HeatColors.fill(0, max), title: shape.sector.name, inArea, outside }
				: {
						shape,
						value,
						color: idle.has(id) ? HeatColors.IDLE : HeatColors.fill(value, max),
						title: format(id, shape.sector.name, value),
						inArea,
						outside,
					};
		});
		// the outlined sectors are drawn last, so no neighbour covers their outline
		return cells.sort((a, b) => Number(a.inArea) - Number(b.inArea));
	});
	readonly centreShape = computed(() => {
		const id = this.centre();
		return id ? this.geometry.shapeById.get(id) : undefined;
	});

	/** Fits the whole galaxy in the view. */
	reset() {
		this.view.set(PanZoom.fit(this.geometry.layout.bounds, this.size(), 0.05, HeatMapComponent.BUTTONS_WIDTH));
	}

	zoom(factor: number) {
		this.surface.zoom(factor);
	}

	/** Ends a drag; a click on a sector with a value picks it. */
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
