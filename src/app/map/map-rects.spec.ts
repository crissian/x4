import { describe, expect, it } from 'vitest';
import { MapRects } from './map-rects';

describe('MapRects', () => {
	const hex = { x: 10, y: 20, r: 4 };

	it('boxes one hex: its width is two radii and its height the distance between flat sides', () => {
		const box = MapRects.box([hex]);
		expect(box.x).toBe(6);
		expect(box.w).toBe(8);
		expect(box.y + box.h / 2).toBeCloseTo(20);
		expect(box.h).toBeCloseTo(4 * Math.sqrt(3));
	});

	it('boxes several hexes grown by a margin of hex radii', () => {
		const box = MapRects.box([hex, { x: 30, y: 20, r: 4 }], 1);
		expect(box.x).toBe(2);
		expect(box.w).toBe(36);
	});

	it('grows a box on every side', () => {
		expect(MapRects.grow({ x: 0, y: 0, w: 10, h: 5 }, 2)).toEqual({ x: -2, y: -2, w: 14, h: 9 });
	});

	it('tells whether a hex overlaps a box', () => {
		expect(MapRects.overlaps(hex, { x: 13, y: 0, w: 5, h: 50 })).toBe(true);
		expect(MapRects.overlaps(hex, { x: 15, y: 0, w: 5, h: 50 })).toBe(false);
	});
});
