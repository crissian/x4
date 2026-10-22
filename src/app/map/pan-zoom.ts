import { Signal, WritableSignal, computed } from '@angular/core';

/** Visible area in map units; the height follows from the width and the aspect ratio of the element. */
export interface ViewBox {
	x: number;
	y: number;
	w: number;
}

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface ViewSize {
	width: number;
	height: number;
}

export interface PanZoomLimits {
	minWidth: number;
	maxWidth: number;
	/** Keeps the centre of the view inside this area, so it never drifts out of reach. */
	bounds?: Rect;
	/** Two pointers zoom and pan the view. */
	pinch?: boolean;
}

interface Drag {
	x: number;
	y: number;
	view: ViewBox;
	moved: boolean;
}

interface Pinch {
	distance: number;
	x: number;
	y: number;
	view: ViewBox;
}

/**
 * Pan and zoom of an SVG view over the view and size signals of its owner: drag to pan, wheel or pinch to zoom
 * on the pointer, and zoom buttons on the centre.
 */
export class PanZoom {
	/** Screen pixels per map unit. */
	readonly scale: Signal<number> = computed(() => this.size().width / this.view().w);
	readonly viewBox: Signal<string> = computed(() => {
		const view = this.view();
		const size = this.size();
		return `${view.x} ${view.y} ${view.w} ${(view.w * size.height) / size.width}`;
	});

	private drag: Drag | undefined;
	private pinch: Pinch | undefined;
	private readonly pointers = new Map<number, { x: number; y: number }>();

	constructor(
		readonly view: WritableSignal<ViewBox>,
		readonly size: WritableSignal<ViewSize>,
		private readonly limits: () => PanZoomLimits
	) {}

	/** The view showing all of `area`, centred, with a margin as a share of its size. */
	static fit(area: Rect, size: ViewSize, margin = 0): ViewBox {
		const w = area.w * (1 + margin * 2);
		const h = area.h * (1 + margin * 2);
		const fitW = Math.max(w, (h * size.width) / size.height);
		const fitH = (fitW * size.height) / size.width;
		return { x: area.x + area.w / 2 - fitW / 2, y: area.y + area.h / 2 - fitH / 2, w: fitW };
	}

	/** CSS transform keeping a popup at (x, y) inside a view of the given size. */
	static keepInside(x: number, y: number, size: ViewSize): string {
		const dx = x > size.width - 290 ? 'calc(-100% - 2rem)' : '0';
		const dy = y > size.height - 220 ? 'calc(-100% - 2rem)' : '0';
		return `translate(${dx}, ${dy})`;
	}

	/** Zooms by `factor` (below 1 zooms in) on a point of `element`, by default its centre. */
	zoom(element: Element, factor: number, clientX?: number, clientY?: number) {
		const rect = element.getBoundingClientRect();
		const px = clientX == null ? 0.5 : (clientX - rect.left) / rect.width;
		const py = clientY == null ? 0.5 : (clientY - rect.top) / rect.height;
		const { minWidth, maxWidth } = this.limits();
		this.view.update((view) => {
			const h = (view.w * rect.height) / rect.width;
			const w = Math.min(Math.max(view.w * factor, minWidth), maxWidth);
			const nh = (w * rect.height) / rect.width;
			return this.clamp({ x: view.x + (view.w - w) * px, y: view.y + (h - nh) * py, w });
		});
	}

	wheel(element: Element, event: WheelEvent) {
		event.preventDefault();
		this.zoom(element, Math.exp(event.deltaY * 0.0015), event.clientX, event.clientY);
	}

	/** Starts a drag, or a pinch on the second pointer. */
	start(event: PointerEvent) {
		if (this.limits().pinch) {
			this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			if (this.pointers.size === 2) {
				this.drag = undefined;
				this.pinch = { ...this.pinchState(), view: this.view() };
				return;
			}
		}
		this.drag = { x: event.clientX, y: event.clientY, view: this.view(), moved: false };
	}

	/** Pans or pinches; true while the view moves, so the owner can skip hover effects. */
	move(element: Element, event: PointerEvent): boolean {
		if (this.pinch && this.pointers.has(event.pointerId)) {
			this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			this.pinchTo(element);
			return true;
		}
		const drag = this.drag;
		if (!drag) {
			return false;
		}
		const dx = event.clientX - drag.x;
		const dy = event.clientY - drag.y;
		if (!drag.moved && Math.hypot(dx, dy) > 4) {
			drag.moved = true;
			element.setPointerCapture?.(event.pointerId);
		}
		if (drag.moved) {
			const scale = this.scale();
			this.view.set(this.clamp({ x: drag.view.x - dx / scale, y: drag.view.y - dy / scale, w: drag.view.w }));
		}
		return drag.moved;
	}

	/** Ends the drag; true when the pointer went down and up without moving the view: a click. */
	end(event: PointerEvent): boolean {
		const pinched = !!this.pinch;
		this.pointers.delete(event.pointerId);
		if (this.pointers.size < 2) {
			this.pinch = undefined;
		}
		const click = !!this.drag && !this.drag.moved && !pinched;
		this.drag = undefined;
		return click;
	}

	/** Midpoint and distance of the two pinching pointers. */
	private pinchState() {
		const [a, b] = [...this.pointers.values()];
		return { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	}

	/** The pinch start point stays under the midpoint of the pointers, scaled by their distance. */
	private pinchTo(element: Element) {
		const pinch = this.pinch;
		if (!pinch || this.pointers.size < 2) {
			return;
		}
		const now = this.pinchState();
		const rect = element.getBoundingClientRect();
		const { minWidth, maxWidth } = this.limits();
		const start = pinch.view;
		const w = Math.min(Math.max((start.w * pinch.distance) / now.distance, minWidth), maxWidth);
		const ratio = rect.height / rect.width;
		const mx = start.x + ((pinch.x - rect.left) / rect.width) * start.w;
		const my = start.y + ((pinch.y - rect.top) / rect.height) * start.w * ratio;
		this.view.set(
			this.clamp({
				x: mx - ((now.x - rect.left) / rect.width) * w,
				y: my - ((now.y - rect.top) / rect.height) * w * ratio,
				w,
			})
		);
	}

	private clamp(view: ViewBox): ViewBox {
		const bounds = this.limits().bounds;
		if (!bounds) {
			return view;
		}
		const size = this.size();
		const h = (view.w * size.height) / size.width;
		const cx = Math.min(Math.max(view.x + view.w / 2, bounds.x), bounds.x + bounds.w);
		const cy = Math.min(Math.max(view.y + h / 2, bounds.y), bounds.y + bounds.h);
		return { x: cx - view.w / 2, y: cy - h / 2, w: view.w };
	}
}
