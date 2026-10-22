import { describe, expect, it } from 'vitest';
import { MarkedHeatMapComponent } from './marked-heat-map.component';
import { OneSidedHeatColors } from './one-sided-heat-colors';

describe('OneSidedHeatColors', () => {
	it('is grey at zero and green in eight square-root steps up to the scale end', () => {
		expect(OneSidedHeatColors.step(0, 100)).toBe(0);
		expect(OneSidedHeatColors.step(-5, 100)).toBe(0);
		expect(OneSidedHeatColors.step(0.01, 100)).toBe(1);
		expect(OneSidedHeatColors.step(25, 100)).toBe(4);
		expect(OneSidedHeatColors.step(100, 100)).toBe(8);
		expect(OneSidedHeatColors.step(1000, 100)).toBe(8);
		const legend = OneSidedHeatColors.legend();
		expect(legend.length).toBe(9);
		expect(new Set(legend).size).toBe(9);
	});

	it('caps the scale at the 95th percentile', () => {
		const values = [...Array.from({ length: 99 }, (_, i) => i + 1), 10000];
		expect(OneSidedHeatColors.scale(values)).toBe(95);
	});
});

describe('MarkedHeatMapComponent', () => {
	it('draws a five-pointed star pointing up', () => {
		const points = MarkedHeatMapComponent.star(0, 0, 10).split(' ');
		expect(points.length).toBe(10);
		expect(points[0]).toBe('0.0,-10.0');
	});
});
