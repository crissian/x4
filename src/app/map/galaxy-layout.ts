import { Cluster, Sector } from '../shared/services/model/model';

/** Map units are thousands of km; the game places systems on a flat-top hex grid of radius 10,000 km. */
export const CLUSTER_RADIUS = 10;

export interface Point {
	x: number;
	y: number;
}

export interface SectorShape extends Point {
	sector: Sector;
	cluster: Cluster;
	/** Hex radius. */
	r: number;
	points: string;
}

export interface MapLink {
	from: SectorShape;
	to: SectorShape;
	type: 'gate' | 'accelerator' | 'highway';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export class GalaxyLayout {
	private constructor(
		readonly shapes: SectorShape[],
		readonly links: MapLink[],
		readonly bounds: { x: number; y: number; w: number; h: number }
	) {}

	/** Map position of a point inside a sector (km); game positions are within roughly ±500 km of the center. */
	static markerPosition(shape: SectorShape, x: number, z: number): Point {
		const scale = (shape.r * 0.7) / 500;
		const clamp = (v: number) => Math.max(-shape.r * 0.7, Math.min(shape.r * 0.7, v));
		return { x: shape.x + clamp(x * scale), y: shape.y + clamp(-z * scale) };
	}

	static hexPoints(x: number, y: number, r: number): string {
		const result: string[] = [];
		for (let i = 0; i < 6; i++) {
			const angle = (Math.PI / 3) * i;
			result.push(`${(x + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`);
		}
		return result.join(' ');
	}

	private static polar(angle: number, distance: number): Point {
		const radians = (angle * Math.PI) / 180;
		return { x: Math.cos(radians) * distance, y: Math.sin(radians) * distance };
	}

	private static permutations<T>(items: T[]): T[][] {
		if (items.length <= 1) {
			return [items];
		}
		return items.flatMap((item, i) =>
			GalaxyLayout.permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest])
		);
	}

	/**
	 * Candidate arrangements of sub-hexes (radius R/2) inside a cluster hex: two neighbouring
	 * hexes for two sectors, three mutually touching hexes for three sectors.
	 */
	private static slotSets(count: number): Point[][] {
		const r = CLUSTER_RADIUS / 2;
		if (count === 2) {
			const d = (Math.sqrt(3) / 2) * r;
			return [30, 90, 150].map((a) => [GalaxyLayout.polar(a, d), GalaxyLayout.polar(a + 180, d)]);
		}
		if (count === 3) {
			return [0, 60].map((a) => [
				GalaxyLayout.polar(a, r),
				GalaxyLayout.polar(a + 120, r),
				GalaxyLayout.polar(a + 240, r),
			]);
		}
		// fallback for larger clusters: a ring
		const d = CLUSTER_RADIUS * 0.55;
		return [Array.from({ length: count }, (_, i) => GalaxyLayout.polar((360 / count) * i, d))];
	}

	/** Places the sectors of a cluster on sub-hexes, matching their in-game positions as closely as possible. */
	private static placeSectors(cluster: Cluster, sectors: Sector[]): SectorShape[] {
		const cx = cluster.x / 1000;
		const cy = -cluster.z / 1000;

		if (sectors.length === 1) {
			const r = CLUSTER_RADIUS * 0.97;
			return [{ sector: sectors[0], cluster, x: cx, y: cy, r, points: GalaxyLayout.hexPoints(cx, cy, r) }];
		}

		// directions of the sectors around their centroid, in map orientation
		const mx = sectors.reduce((a, s) => a + s.x, 0) / sectors.length;
		const mz = sectors.reduce((a, s) => a + s.z, 0) / sectors.length;
		const directions = sectors.map((s) => {
			const x = s.x - mx;
			const y = -(s.z - mz);
			const length = Math.hypot(x, y) || 1;
			return { x: x / length, y: y / length };
		});

		let best: Point[] = [];
		let bestScore = -Infinity;
		for (const slots of GalaxyLayout.slotSets(sectors.length)) {
			for (const order of GalaxyLayout.permutations(slots)) {
				const score = order.reduce((a, slot, i) => {
					const length = Math.hypot(slot.x, slot.y) || 1;
					return a + (slot.x * directions[i].x + slot.y * directions[i].y) / length;
				}, 0);
				if (score > bestScore) {
					bestScore = score;
					best = order;
				}
			}
		}

		const r = (CLUSTER_RADIUS / 2) * 0.94;
		return sectors.map((sector, i) => {
			const x = cx + best[i].x;
			const y = cy + best[i].y;
			return { sector, cluster, x, y, r, points: GalaxyLayout.hexPoints(x, y, r) };
		});
	}

	/** Line between two hexes, trimmed so that it starts and ends near their borders. */
	private static link(from: SectorShape, to: SectorShape, type: MapLink['type']): MapLink {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const length = Math.hypot(dx, dy) || 1;
		const trim = type === 'highway' ? 0.45 : 0.7;
		return {
			from,
			to,
			type,
			x1: from.x + (dx / length) * from.r * trim,
			y1: from.y + (dy / length) * from.r * trim,
			x2: to.x - (dx / length) * to.r * trim,
			y2: to.y - (dy / length) * to.r * trim,
		};
	}

	static of(clusters: Cluster[], getSector: (id: string) => Sector | undefined): GalaxyLayout {
		const shapes = clusters.flatMap((c) =>
			GalaxyLayout.placeSectors(
				c,
				c.sectors.map(getSector).filter((s): s is Sector => !!s)
			)
		);
		const byId = new Map(shapes.map((s) => [s.sector.id, s]));

		const links: MapLink[] = [];
		for (const shape of shapes) {
			for (const gate of shape.sector.gates) {
				const other = byId.get(gate.sector);
				if (other && shape.sector.id < other.sector.id) {
					links.push(GalaxyLayout.link(shape, other, gate.type));
				}
			}
			for (const id of shape.sector.highways) {
				const other = byId.get(id);
				if (other && shape.sector.id < other.sector.id) {
					links.push(GalaxyLayout.link(shape, other, 'highway'));
				}
			}
		}

		const xs = shapes.map((s) => s.x);
		const ys = shapes.map((s) => s.y);
		const margin = CLUSTER_RADIUS * 1.5;
		const x = Math.min(...xs) - margin;
		const y = Math.min(...ys) - margin;
		const w = Math.max(...xs) + margin - x;
		const h = Math.max(...ys) + margin - y;
		return new GalaxyLayout(shapes, links, { x, y, w, h });
	}
}
