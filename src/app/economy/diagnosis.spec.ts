import { describe, expect, it } from 'vitest';
import { Diagnoses } from './diagnosis';

describe('Diagnoses', () => {
	it('reads the market from the price index', () => {
		expect(Diagnoses.market(105)).toBe('tight');
		expect(Diagnoses.market(104.9)).toBe('calm');
		expect(Diagnoses.market(95.1)).toBe('calm');
		expect(Diagnoses.market(95)).toBe('glut');
		expect(Diagnoses.market(undefined)).toBe('calm');
	});

	it('grades the market by the distance of the price index from 100', () => {
		expect(Diagnoses.marketSeverity(102)).toBeUndefined();
		expect(Diagnoses.marketSeverity(105)).toBe('moderate');
		expect(Diagnoses.marketSeverity(115)).toBe('moderate');
		expect(Diagnoses.marketSeverity(115.1)).toBe('severe');
		expect(Diagnoses.marketSeverity(85)).toBe('moderate');
		expect(Diagnoses.marketSeverity(84.9)).toBe('severe');
		expect(Diagnoses.marketSeverity(undefined)).toBeUndefined();
	});

	it('grades a balance: slight under 10%, moderate to 30%, severe above', () => {
		expect(Diagnoses.balanceSeverity(-0.05)).toBe('slight');
		expect(Diagnoses.balanceSeverity(0.0999)).toBe('slight');
		expect(Diagnoses.balanceSeverity(-0.1)).toBe('moderate');
		expect(Diagnoses.balanceSeverity(0.3)).toBe('moderate');
		expect(Diagnoses.balanceSeverity(-0.31)).toBe('severe');
		expect(Diagnoses.balanceSeverity(1)).toBe('severe');
	});

	it('combines a short capacity with the market', () => {
		expect(Diagnoses.of(-0.24, 120, false)).toEqual({ kind: 'short', severity: 'moderate', marketOnly: false });
		expect(Diagnoses.of(-0.5, 100, false)).toEqual({ kind: 'covered', severity: 'severe', marketOnly: false });
		expect(Diagnoses.of(-0.05, 80, false)).toEqual({ kind: 'covered', severity: 'slight', marketOnly: false });
		expect(Diagnoses.of(-0.5, undefined, false).kind).toBe('covered');
	});

	it('combines a surplus capacity with the market', () => {
		expect(Diagnoses.of(0.4, 110, false)).toEqual({ kind: 'starved', severity: 'severe', marketOnly: false });
		expect(Diagnoses.of(0.2, 100, false)).toEqual({ kind: 'surplus', severity: 'moderate', marketOnly: false });
		expect(Diagnoses.of(0.2, 80, false).kind).toBe('surplus');
	});

	it('calls a balance within 2% balanced and lets the market speak', () => {
		expect(Diagnoses.of(0.02, 100, false)).toEqual({ kind: 'balanced', severity: undefined, marketOnly: false });
		expect(Diagnoses.of(-0.02, 100, false).kind).toBe('balanced');
		expect(Diagnoses.of(-0.021, 100, false).kind).toBe('covered');
		expect(Diagnoses.of(0, 130, false)).toEqual({ kind: 'tight', severity: 'severe', marketOnly: false });
		expect(Diagnoses.of(0, 90, false)).toEqual({ kind: 'glut', severity: 'moderate', marketOnly: false });
	});

	it('judges market-only wares by the market, whatever the capacity says', () => {
		expect(Diagnoses.of(-1, 110, true)).toEqual({ kind: 'tight', severity: 'moderate', marketOnly: true });
		expect(Diagnoses.of(1, 70, true)).toEqual({ kind: 'glut', severity: 'severe', marketOnly: true });
		expect(Diagnoses.of(0.5, 100, true)).toEqual({ kind: 'balanced', severity: undefined, marketOnly: true });
		expect(Diagnoses.of(0.5, undefined, true).kind).toBe('balanced');
	});

	it('ranks by kind, then the more severe first', () => {
		const order = [
			Diagnoses.of(-0.5, 120, false),
			Diagnoses.of(-0.05, 120, false),
			Diagnoses.of(0.5, 120, false),
			Diagnoses.of(0, 120, false),
			Diagnoses.of(-0.5, 100, false),
			Diagnoses.of(0, 100, false),
			Diagnoses.of(0, 90, false),
			Diagnoses.of(0.5, 100, false),
		].map((x) => Diagnoses.rank(x));
		expect(order).toEqual([...order].sort((a, b) => a - b));
		expect(new Set(order).size).toBe(order.length);
	});
});
