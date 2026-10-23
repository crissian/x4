import { SectorShape } from './galaxy-layout';
import { Rect } from './pan-zoom';

/** The centre and radius of a sector hex. */
type Hex = Pick<SectorShape, 'x' | 'y' | 'r'>;

/** Rectangles around sector hexes, in map units. */
export class MapRects {
	/** The bounding box of the hexes, grown by `margin` hex radii. */
	static box(shapes: readonly Hex[], margin = 0): Rect {
		const left = Math.min(...shapes.map((x) => x.x - x.r * (1 + margin)));
		const right = Math.max(...shapes.map((x) => x.x + x.r * (1 + margin)));
		const top = Math.min(...shapes.map((x) => x.y - x.r * (Math.sqrt(3) / 2 + margin)));
		const bottom = Math.max(...shapes.map((x) => x.y + x.r * (Math.sqrt(3) / 2 + margin)));
		return { x: left, y: top, w: right - left, h: bottom - top };
	}

	/** The box grown by `by` on every side. */
	static grow(box: Rect, by: number): Rect {
		return { x: box.x - by, y: box.y - by, w: box.w + by * 2, h: box.h + by * 2 };
	}

	/** Whether the hex overlaps the box. */
	static overlaps(shape: Hex, box: Rect): boolean {
		return (
			shape.x + shape.r >= box.x &&
			shape.x - shape.r <= box.x + box.w &&
			shape.y + shape.r >= box.y &&
			shape.y - shape.r <= box.y + box.h
		);
	}
}
