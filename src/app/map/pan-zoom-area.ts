import { DestroyRef, ElementRef, WritableSignal, afterNextRender, inject, signal } from '@angular/core';
import { PanZoom, PanZoomLimits, ViewBox, ViewSize } from './pan-zoom';

/**
 * A pannable, zoomable SVG map area: a `PanZoom` (its own, or one owned elsewhere such as by a store), follows
 * the size of the element with a resize observer, fits the view once the element first has a size, and forwards
 * the wheel, pointer and zoom button events. Create it in an injection context, such as a field initialiser.
 */
export class PanZoomArea {
	/** The zoom factor of the zoom in button. */
	static readonly ZOOM_IN = 0.7;
	/** The zoom factor of the zoom out button. */
	static readonly ZOOM_OUT = 1.4;

	readonly panZoom: PanZoom;
	readonly size: WritableSignal<ViewSize>;
	readonly view: WritableSignal<ViewBox>;

	/**
	 * @param element the map element, sized by the page
	 * @param panZoom the pan and zoom state to drive, or the zoom and pan limits of a new one owned by this area
	 * @param fit fits the view, called once the element first has a size
	 */
	constructor(
		private readonly element: () => ElementRef<HTMLElement>,
		panZoom: PanZoom | (() => PanZoomLimits),
		fit: () => void
	) {
		this.panZoom =
			panZoom instanceof PanZoom
				? panZoom
				: new PanZoom(
						signal<ViewBox>({ x: 0, y: 0, w: 1 }),
						signal<ViewSize>({ width: 600, height: 400 }),
						panZoom
					);
		this.size = this.panZoom.size;
		this.view = this.panZoom.view;
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

	/** Zooms on the centre by `factor`; below 1 zooms in. */
	zoom(factor: number) {
		this.panZoom.zoom(this.native(), factor);
	}

	zoomIn() {
		this.zoom(PanZoomArea.ZOOM_IN);
	}

	zoomOut() {
		this.zoom(PanZoomArea.ZOOM_OUT);
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

	/** Ends the drag; true for a click, when the pointer went down and up without moving the view. */
	pointerUp(event: PointerEvent): boolean {
		return this.panZoom.end(event);
	}

	/** The pointer position relative to the element. */
	offset(event: MouseEvent): { x: number; y: number } {
		const rect = this.native().getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	private native(): HTMLElement {
		return this.element().nativeElement;
	}
}
