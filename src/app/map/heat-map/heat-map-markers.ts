import type { SectorShape } from '../galaxy-layout';

/** A ★ on a sector with a short label, such as its rank. */
export interface HeatMapMarker {
	sector: string;
	label: string;
}

/** A drawn marker: the star's points and where its label goes. */
export interface HeatMapMarkerShape extends HeatMapMarker {
	points: string;
	x: number;
	y: number;
	size: number;
}

/** The ★ markers of the heat map. */
export class HeatMapMarkers {
	/** The drawn markers of the sectors on the map; markers of other sectors are left out. */
	static shapes(
		markers: readonly HeatMapMarker[],
		shapeById: ReadonlyMap<string, SectorShape>
	): HeatMapMarkerShape[] {
		return markers.flatMap((marker) => {
			const shape = shapeById.get(marker.sector);
			if (!shape) {
				return [];
			}
			const size = shape.r * 1.1;
			return [{ ...marker, points: HeatMapMarkers.star(shape.x, shape.y, size), x: shape.x, y: shape.y, size }];
		});
	}

	/** The points of a five-pointed star around (x, y), pointing up. */
	static star(x: number, y: number, radius: number): string {
		return Array.from({ length: 10 }, (_, i) => {
			const r = i % 2 ? radius * 0.45 : radius;
			const angle = -Math.PI / 2 + (i * Math.PI) / 5;
			return `${(x + r * Math.cos(angle)).toFixed(1)},${(y + r * Math.sin(angle)).toFixed(1)}`;
		}).join(' ');
	}
}
