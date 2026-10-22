import { describe, expect, it } from 'vitest';
import { HeatColors } from './heat-colors';
import { HeatMapMarkers } from './heat-map-markers';
import { HeatPalettes } from './heat-palette';
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

describe('HeatPalettes', () => {
	it('colours by the diverging or the positive scale', () => {
		expect(HeatPalettes.of('diverging').legend()).toEqual(HeatColors.legend());
		expect(HeatPalettes.of('diverging').fill(-5, 10)).toBe(HeatColors.fill(-5, 10));
		expect(HeatPalettes.of('positive').legend()).toEqual(OneSidedHeatColors.legend());
		expect(HeatPalettes.of('positive').fill(5, 10)).toBe(OneSidedHeatColors.fill(5, 10));
	});
});

describe('HeatMapMarkers', () => {
	it('draws a five-pointed star pointing up', () => {
		const points = HeatMapMarkers.star(0, 0, 10).split(' ');
		expect(points.length).toBe(10);
		expect(points[0]).toBe('0.0,-10.0');
	});
});
