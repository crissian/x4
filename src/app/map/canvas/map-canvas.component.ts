import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideExpand, LucideZoomIn, LucideZoomOut } from '@lucide/angular';
import { CLUSTER_RADIUS, SectorShape } from '../galaxy-layout';
import { MapStore, ViewBox } from '../map-store';
import { MapLegendComponent } from './map-legend.component';
import { MapLabelsLayer, MapLinksLayer, MapMarkersLayer } from './map-layers';
import { MapMenuComponent, MapTooltipComponent } from './map-popups';

/** The galaxy map: sectors, layers and overlays, with drag to pan and wheel to zoom. */
@Component({
	selector: 'app-map-canvas',
	imports: [
		LucideZoomIn,
		LucideZoomOut,
		LucideExpand,
		MapLinksLayer,
		MapMarkersLayer,
		MapLabelsLayer,
		MapLegendComponent,
		MapTooltipComponent,
		MapMenuComponent,
	],
	templateUrl: './map-canvas.component.html',
	host: {
		class: 'relative block h-[calc(100vh-10rem)] min-h-[420px] touch-none overflow-hidden rounded-b-lg bg-[#05080f] select-none',
		'(wheel)': 'onWheel($event)',
		'(pointerdown)': 'onPointerDown($event)',
		'(pointermove)': 'onPointerMove($event)',
		'(pointerup)': 'onPointerUp($event)',
		'(pointerleave)': 'store.hovered.set(undefined)',
		'(contextmenu)': 'onContextMenu($event)',
	},
})
export class MapCanvasComponent {
	protected readonly store = inject(MapStore);
	private readonly router = inject(Router);
	private readonly element: HTMLElement = inject(ElementRef).nativeElement;

	private drag: { x: number; y: number; view: ViewBox; moved: boolean } | undefined;

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

	protected zoom(factor: number, clientX?: number, clientY?: number) {
		const rect = this.element.getBoundingClientRect();
		const px = clientX == null ? 0.5 : (clientX - rect.left) / rect.width;
		const py = clientY == null ? 0.5 : (clientY - rect.top) / rect.height;
		const bounds = this.store.layout.bounds;
		this.store.view.update((view) => {
			const h = (view.w * rect.height) / rect.width;
			const w = Math.min(Math.max(view.w * factor, CLUSTER_RADIUS * 4), bounds.w * 3);
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
		this.store.menu.set(undefined);
		this.drag = { x: event.clientX, y: event.clientY, view: this.store.view(), moved: false };
	}

	protected onPointerMove(event: PointerEvent, shape?: SectorShape) {
		const rect = this.element.getBoundingClientRect();
		if (this.drag) {
			const dx = event.clientX - this.drag.x;
			const dy = event.clientY - this.drag.y;
			if (!this.drag.moved && Math.hypot(dx, dy) > 4) {
				this.drag.moved = true;
				this.element.setPointerCapture?.(event.pointerId);
			}
			if (this.drag.moved) {
				const scale = this.store.scale();
				this.store.view.set({
					x: this.drag.view.x - dx / scale,
					y: this.drag.view.y - dy / scale,
					w: this.drag.view.w,
				});
				this.store.hovered.set(undefined);
				return;
			}
		}
		if (shape) {
			this.store.hovered.set({ shape, x: event.clientX - rect.left, y: event.clientY - rect.top });
		} else if (!(event.target as Element).closest('[data-sector]')) {
			this.store.hovered.set(undefined);
		}
	}

	protected onPointerUp(event: PointerEvent) {
		const drag = this.drag;
		this.drag = undefined;
		if (event.button !== 0 || !drag || drag.moved) {
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
