import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideExpand, LucideZoomIn, LucideZoomOut } from '@lucide/angular';
import { CLUSTER_RADIUS, SectorShape } from '../galaxy-layout';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { PanZoom } from '../pan-zoom';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapSaveSectors } from '../save/map-save-sectors';
import { MapLegendComponent } from './map-legend.component';
import { MapLabelsLayer, MapLinksLayer, MapMarkersLayer } from './map-layers';
import { MapMenuComponent, MapTooltipComponent } from './map-popups';
import { MapSaveMarkers } from './map-save-markers';
import { StationTooltipComponent } from './station-tooltip';

/** The galaxy map: sectors, layers and overlays, with drag to pan and wheel to zoom. */
@Component({
	selector: 'app-map-canvas',
	imports: [
		LucideZoomIn,
		LucideZoomOut,
		LucideExpand,
		MapLinksLayer,
		MapMarkersLayer,
		MapSaveMarkers,
		StationTooltipComponent,
		MapLabelsLayer,
		MapLegendComponent,
		MapTooltipComponent,
		MapMenuComponent,
	],
	templateUrl: './map-canvas.component.html',
	host: {
		'(wheel)': 'onWheel($event)',
		'(pointerdown)': 'onPointerDown($event)',
		'(pointermove)': 'onPointerMove($event)',
		'(pointerup)': 'onPointerUp($event)',
		'(pointerleave)': 'store.hovered.set(undefined)',
		'(contextmenu)': 'onContextMenu($event)',
	},
})
export class MapCanvasComponent {
	/** Narrowest view in map units: one sector hex fills it, so its stations stand apart. */
	static readonly MIN_VIEW_WIDTH = CLUSTER_RADIUS / 2;

	protected readonly store = inject(MapStore);
	protected readonly save = inject(MapSaveLayer);
	protected readonly saveSectors = inject(MapSaveSectors);
	protected readonly stations = inject(MapStations);
	private readonly router = inject(Router);
	private readonly element: HTMLElement = inject(ElementRef).nativeElement;

	private readonly panZoom = new PanZoom(this.store.view, this.store.size, () => ({
		minWidth: MapCanvasComponent.MIN_VIEW_WIDTH,
		maxWidth: this.store.layout.bounds.w * 3,
	}));

	constructor() {
		const destroyRef = inject(DestroyRef);
		afterNextRender(() => {
			let first = true;
			const observer = new ResizeObserver(([entry]) => {
				const { width, height } = entry.contentRect;
				if (width > 0 && height > 0) {
					this.store.size.set({ width, height });
					if (first) {
						// fit the view to the real size of the map
						first = false;
						const id = this.store.selected();
						if (id) {
							this.store.focus(id);
						} else {
							this.store.resetView();
						}
					}
				}
			});
			observer.observe(this.element);
			destroyRef.onDestroy(() => observer.disconnect());
		});
	}

	protected zoom(factor: number) {
		this.panZoom.zoom(this.element, factor);
	}

	protected onWheel(event: WheelEvent) {
		this.panZoom.wheel(this.element, event);
	}

	protected onPointerDown(event: PointerEvent) {
		if (event.button !== 0) {
			return;
		}
		this.store.menu.set(undefined);
		this.panZoom.start(event);
	}

	protected onPointerMove(event: PointerEvent, shape?: SectorShape) {
		if (this.panZoom.move(this.element, event)) {
			this.store.hovered.set(undefined);
			return;
		}
		const rect = this.element.getBoundingClientRect();
		if (shape) {
			this.store.hovered.set({ shape, x: event.clientX - rect.left, y: event.clientY - rect.top });
		} else if (!(event.target as Element).closest('[data-sector]')) {
			this.store.hovered.set(undefined);
		}
	}

	protected onPointerUp(event: PointerEvent) {
		if (!this.panZoom.end(event) || event.button !== 0) {
			return;
		}
		// a click without dragging: open the sector under the pointer
		const id = (event.target as Element).closest('[data-sector]')?.getAttribute('data-sector');
		if (id) {
			this.router.navigate(['/sectors', id]);
		}
	}

	protected onContextMenu(event: MouseEvent) {
		const id = (event.target as Element).closest('[data-sector]')?.getAttribute('data-sector');
		const sector = id ? this.store.shapeById.get(id)?.sector : undefined;
		if (!sector) {
			this.store.menu.set(undefined);
			return;
		}
		event.preventDefault();
		const rect = this.element.getBoundingClientRect();
		this.store.hovered.set(undefined);
		this.store.menu.set({ sector, x: event.clientX - rect.left, y: event.clientY - rect.top });
	}
}
