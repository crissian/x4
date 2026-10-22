import { DestroyRef, ElementRef, Signal, afterNextRender, computed, inject, signal } from '@angular/core';
import { PanZoom, PanZoomLimits, ViewBox, ViewSize } from './pan-zoom';

/**
 * A pannable, zoomable SVG map area: owns the view and size signals and the `PanZoom` over them, follows the
 * size of the element with a resize observer, fits the view once the element first has a size, and forwards
 * the wheel, pointer and zoom button events. Create it in an injection context, such as a field initialiser.
 */
export class PanZoomArea {
	/** Label size in screen pixels. */
	static readonly LABEL_PX = 11;

	readonly size = signal<ViewSize>({ width: 600, height: 400 });
	readonly view = signal<ViewBox>({ x: 0, y: 0, w: 1 });
	readonly panZoom = new PanZoom(this.view, this.size, () => this.limits());
	/** The label size in map units at the current zoom. */
	readonly fontSize = computed(() => PanZoomArea.LABEL_PX / this.panZoom.scale());

	/**
	 * @param element the map element, sized by the page
	 * @param limits the zoom and pan limits
	 * @param fit fits the view, called once the element first has a size
	 */
	constructor(
		private readonly element: Signal<ElementRef<HTMLElement>>,
		private readonly limits: () => PanZoomLimits,
		fit: () => void
	) {
		const destroyRef = inject(DestroyRef);
		afterNextRender(() => {
			let first = true;
			const observer = new ResizeObserver(([entry]) => {
				const { width, height } = entry.contentRect;
				if (width > 0 && height > 0) {
					this.size.set({ width, height });
					if (first) {
						first = false;
						fit();
					}
				}
			});
			observer.observe(this.native());
			destroyRef.onDestroy(() => observer.disconnect());
		});
	}

	zoom(factor: number) {
		this.panZoom.zoom(this.native(), factor);
	}

	wheel(event: WheelEvent) {
		this.panZoom.wheel(this.native(), event);
	}

	/** Starts a drag with the main button. */
	pointerDown(event: PointerEvent) {
		if (event.button === 0) {
			this.panZoom.start(event);
		}
	}

	/** Whether the view moved. */
	pointerMove(event: PointerEvent): boolean {
		return this.panZoom.move(this.native(), event);
	}

	pointerUp(event: PointerEvent) {
		this.panZoom.end(event);
	}

	private native(): HTMLElement {
		return this.element().nativeElement;
	}
}
