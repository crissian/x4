import { Sector } from '../shared/services/model/model';
import { GATE_TIME, HIGHWAY_TIME, formatDuration, travelTimes } from './route-planner';

function sector(id: string, gates: Sector['gates'], highwayLinks: Sector['highwayLinks'] = []): Sector {
	return { id, version: 0, cluster: id, name: id, x: 0, z: 0, resources: [], gates, highways: highwayLinks.map((x) => x.sector), highwayLinks };
}

describe('route planner', () => {
	// a - b - c by gates (b's gates 100 km apart), a - c also by a superhighway
	const a = sector('a', [{ sector: 'b', type: 'gate', x: 10, z: 0 }]);
	const b = sector('b', [
		{ sector: 'a', type: 'gate', x: -50, z: 0 },
		{ sector: 'c', type: 'gate', x: 50, z: 0 },
	]);
	const c = sector('c', [{ sector: 'b', type: 'gate', x: 0, z: 10 }]);

	it('adds flight times and gate jumps', () => {
		const times = travelTimes([a, b, c], 'a', { speed: 1000, charge: 0 });
		// 10 km + gate + 50 km + 50 km + gate + 10 km at 1 km/s
		expect(times.time.get('c')).toBeCloseTo(120 + 2 * GATE_TIME);
		const route = times.route('c');
		expect(route.steps.map((x) => x.sector.id)).toEqual(['a', 'b', 'c']);
		expect(route.jumps).toBe(2);
		expect(route.distance).toBeCloseTo(120);
	});

	it('takes a superhighway when faster', () => {
		const ah = sector('a', a.gates, [{ sector: 'c', x: 0, z: 1 }]);
		const ch = sector('c', c.gates, [{ sector: 'a', x: 0, z: 1 }]);
		const route = travelTimes([ah, b, ch], 'a', { speed: 1000, charge: 0 }).route('c');
		expect(route.steps.map((x) => x.type)).toEqual(['start', 'highway']);
		expect(route.time).toBeCloseTo(2 + HIGHWAY_TIME);
	});

	it('returns nothing for unreachable sectors', () => {
		expect(travelTimes([a, c], 'a', { speed: 1000, charge: 0 }).route('c')).toBeUndefined();
	});

	it('formats durations', () => {
		expect(formatDuration(42)).toBe('42s');
		expect(formatDuration(125)).toBe('2m 5s');
		expect(formatDuration(3720)).toBe('1h 2m');
	});
});
