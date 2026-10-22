import { Sector } from '../shared/services/model/model';

/**
 * Travel times between sectors. Every sector holds points (its center, gates and superhighway
 * entries, positions in km); flying between two points of a sector takes the travel drive charge
 * plus distance / travel speed, jumping through a gate, accelerator or superhighway takes a fixed
 * time. Ships start and end at the sector center.
 */

/** Seconds spent in a jump gate or accelerator transition. */
export const GATE_TIME = 10;
/** Seconds spent riding a superhighway between two sectors. */
export const HIGHWAY_TIME = 40;

export interface RouteOptions {
	/** Travel drive speed in m/s. */
	speed: number;
	/** Seconds to engage the travel drive for each in-sector flight. */
	charge: number;
}

export type StepType = 'start' | 'gate' | 'accelerator' | 'highway';

export interface RouteStep {
	sector: Sector;
	/** How the sector was entered. */
	type: StepType;
	/** Seconds from the start when the sector is entered (or left, for the destination: arrival). */
	time: number;
}

export interface Route {
	steps: RouteStep[];
	/** Seconds from center to center. */
	time: number;
	/** Gate and accelerator jumps plus superhighways taken. */
	jumps: number;
	/** Kilometers flown inside sectors. */
	distance: number;
}

interface Node {
	sector: Sector;
	x: number;
	z: number;
	edges: { to: number; time: number; type?: StepType; distance: number }[];
}

export interface TravelTimes {
	/** Seconds to reach the center of each reachable sector. */
	time: Map<string, number>;
	route(to: string): Route | undefined;
}

export class RoutePlanner {
	/** Shortest travel times from the center of `from` to every reachable sector. */
	static travelTimes(sectors: readonly Sector[], from: string, options: RouteOptions): TravelTimes {
		const nodes: Node[] = [];
		const center = new Map<string, number>();
		const gateNode = new Map<string, number>();
		const ids = new Set(sectors.map((x) => x.id));

		for (const sector of sectors) {
			const points: number[] = [];
			const add = (x: number, z: number) => {
				nodes.push({ sector, x, z, edges: [] });
				points.push(nodes.length - 1);
				return nodes.length - 1;
			};
			center.set(sector.id, add(0, 0));
			for (const gate of sector.gates ?? []) {
				if (ids.has(gate.sector)) {
					gateNode.set(`${sector.id}>${gate.sector}:${gate.type}`, add(gate.x ?? 0, gate.z ?? 0));
				}
			}
			for (const link of sector.highwayLinks ?? []) {
				if (ids.has(link.sector)) {
					gateNode.set(`${sector.id}>${link.sector}:highway`, add(link.x, link.z));
				}
			}
			// flights inside the sector
			for (const a of points) {
				for (const b of points) {
					if (a !== b) {
						const distance = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].z - nodes[b].z);
						const time = options.charge + (distance * 1000) / Math.max(1, options.speed);
						nodes[a].edges.push({ to: b, time, distance });
					}
				}
			}
		}

		// transitions between sectors: a link and the matching link on the other side
		for (const [key, node] of gateNode) {
			const [a, rest] = key.split('>');
			const [b, type] = rest.split(':') as [string, StepType];
			const target = gateNode.get(`${b}>${a}:${type}`);
			if (target != null) {
				nodes[node].edges.push({ to: target, time: type === 'highway' ? HIGHWAY_TIME : GATE_TIME, type, distance: 0 });
			}
		}

		const dist = new Array<number>(nodes.length).fill(Infinity);
		const prev = new Array<number>(nodes.length).fill(-1);
		const prevType = new Array<StepType | undefined>(nodes.length);
		const done = new Array<boolean>(nodes.length).fill(false);
		const start = center.get(from);
		if (start != null) {
			dist[start] = 0;
			// a few thousand nodes: a linear scan for the closest node is fast enough
			for (;;) {
				let current = -1;
				for (let i = 0; i < nodes.length; i++) {
					if (!done[i] && dist[i] < Infinity && (current < 0 || dist[i] < dist[current])) {
						current = i;
					}
				}
				if (current < 0) {
					break;
				}
				done[current] = true;
				for (const edge of nodes[current].edges) {
					const time = dist[current] + edge.time;
					if (time < dist[edge.to]) {
						dist[edge.to] = time;
						prev[edge.to] = current;
						prevType[edge.to] = edge.type;
					}
				}
			}
		}

		const time = new Map<string, number>();
		for (const [id, node] of center) {
			if (dist[node] < Infinity) {
				time.set(id, dist[node]);
			}
		}

		return {
			time,
			route(to: string): Route | undefined {
				const end = center.get(to);
				if (end == null || dist[end] === Infinity) {
					return undefined;
				}
				const path: number[] = [];
				for (let node = end; node >= 0; node = prev[node]) {
					path.unshift(node);
				}
				const steps: RouteStep[] = [{ sector: nodes[path[0]].sector, type: 'start', time: 0 }];
				let distance = 0;
				for (let i = 1; i < path.length; i++) {
					const type = prevType[path[i]];
					if (type) {
						steps.push({ sector: nodes[path[i]].sector, type, time: dist[path[i]] });
					} else {
						distance += Math.hypot(nodes[path[i]].x - nodes[path[i - 1]].x, nodes[path[i]].z - nodes[path[i - 1]].z);
					}
				}
				return { steps, time: dist[end], jumps: steps.length - 1, distance };
			},
		};
	}

	static formatDuration(seconds: number): string {
		const total = Math.round(seconds);
		const h = Math.floor(total / 3600);
		const m = Math.floor((total % 3600) / 60);
		const s = total % 60;
		return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`;
	}
}
