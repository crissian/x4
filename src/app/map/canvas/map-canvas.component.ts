import { Component, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SectorShape } from '../galaxy-layout';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { MapTargets } from '../map-targets';
import { MapZoomButtonsComponent } from '../map-zoom-buttons.component';
import { PanZoomArea } from '../pan-zoom-area';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapSaveSectors } from '../save/map-save-sectors';
import { MapLegendComponent } from './map-legend.component';
import { MapLabelsLayer, MapLinksLayer, MapMarkersLayer } from './map-layers';
import { MapMenuComponent, MapTooltipComponent } from './map-popups';
import { MapHostileMarkers } from './map-hostile-markers';
import { MapSaveMarkers } from './map-save-markers';
import { MapVaultsLayer } from './map-vaults-layer';
import { StationTooltipComponent } from './station-tooltip';

/** The galaxy map: sectors, layers and overlays, with drag to pan and wheel to zoom. */
@Component({
	selector: 'app-map-canvas',
	imports: [
		MapZoomButtonsComponent,
		MapLinksLayer,
		MapMarkersLayer,
		MapSaveMarkers,
		MapVaultsLayer,
		MapHostileMarkers,
		StationTooltipComponent,
		MapLabelsLayer,
		MapLegendComponent,
		MapTooltipComponent,
		MapMenuComponent,
	],
	templateUrl: './map-canvas.component.html',
	host: {
		'(wheel)': 'surface.wheel($event)',
		'(pointerdown)': 'onPointerDown($event)',
		'(pointermove)': 'onPointerMove($event)',
		'(pointerup)': 'onPointerUp($event)',
		'(pointerleave)': 'store.hovered.set(undefined)',
		'(contextmenu)': 'onContextMenu($event)',
	},
})
export class MapCanvasComponent {
	protected readonly store = inject(MapStore);
	protected readonly save = inject(MapSaveLayer);
	protected readonly saveSectors = inject(MapSaveSectors);
	protected readonly stations = inject(MapStations);
	private readonly router = inject(Router);
	private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

	protected readonly surface = new PanZoomArea(
		() => this.element,
		this.store.panZoom,
		// fit the view to the real size of the map
		() => {
			const id = this.store.selected();
			if (id) {
				this.store.focus(id);
			} else {
				this.store.resetView();
			}
		}
	);

	protected onPointerDown(event: PointerEvent) {
		if (event.button === 0) {
			this.store.menu.set(undefined);
		}
		this.surface.pointerDown(event);
	}

	protected onPointerMove(event: PointerEvent, shape?: SectorShape) {
		if (this.surface.pointerMove(event)) {
			this.store.hovered.set(undefined);
			return;
		}
		if (shape) {
			this.store.hovered.set({ shape, ...this.surface.offset(event) });
		} else if (!MapTargets.sectorId(event)) {
			this.store.hovered.set(undefined);
		}
	}

	protected onPointerUp(event: PointerEvent) {
		if (!this.surface.pointerUp(event) || event.button !== 0) {
			return;
		}
		// a click without dragging: open the sector under the pointer
		const id = MapTargets.sectorId(event);
		if (id) {
			this.router.navigate(['/sectors', id]);
		}
	}

	protected onContextMenu(event: MouseEvent) {
		const id = MapTargets.sectorId(event);
		const sector = id ? this.store.shapeById.get(id)?.sector : undefined;
		if (!sector) {
			this.store.menu.set(undefined);
			return;
		}
		event.preventDefault();
		this.store.hovered.set(undefined);
		this.store.menu.set({ sector, ...this.surface.offset(event) });
	}
}
