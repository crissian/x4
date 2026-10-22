import { describe, expect, it } from 'vitest';
import { Diagnoses } from '../economy/diagnosis';
import type { WareEconomy } from '../economy/economy-model';
import { SupplyDemandDiagnosis } from './supply-demand-diagnosis';

describe('SupplyDemandDiagnosis', () => {
	function row(balance: number, priceIndex: number | undefined, extra: Partial<WareEconomy> = {}): WareEconomy {
		const marketOnly = extra.marketBased ?? false;
		return {
			ware: 'x',
			produced: 0,
			consumed: 0,
			net: 0,
			balance,
			value: -16200000,
			producers: 0,
			consumers: 0,
			stock: 0,
			wanted: 0,
			priceIndex,
			mined: false,
			building: false,
			partlyBuilding: false,
			marketBased: marketOnly,
			diagnosis: Diagnoses.of(balance, priceIndex, marketOnly),
			...extra,
		};
	}

	it('words a diagnosis with its severity', () => {
		expect(SupplyDemandDiagnosis.label(Diagnoses.of(-0.24, 120, false))).toBe('Short · moderate');
		expect(SupplyDemandDiagnosis.label(Diagnoses.of(0.5, 120, false))).toBe('Starved · severe');
		expect(SupplyDemandDiagnosis.label(Diagnoses.of(0, 100, false))).toBe('Balanced');
	});

	it('marks the market-only diagnoses', () => {
		expect(SupplyDemandDiagnosis.label(Diagnoses.of(0, 130, true))).toBe('Tight market · severe (market only)');
		expect(SupplyDemandDiagnosis.label(Diagnoses.of(0, 100, true))).toBe('Calm (market only)');
	});

	it('explains why the capacity is not used for mined and building wares', () => {
		expect(SupplyDemandDiagnosis.explanation(row(0, 110, { mined: true, marketBased: true }))).toContain('Mining');
		expect(SupplyDemandDiagnosis.explanation(row(0, 110, { building: true, marketBased: true }))).toContain(
			'Ship and station building'
		);
		expect(SupplyDemandDiagnosis.explanation(row(-0.4, 130))).toBe('Not enough is built and prices are high');
	});

	it('colours the dot by kind and shades it by severity', () => {
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(-0.5, 120, false))).toEqual({ tone: 'red', level: 3 });
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(-0.05, 120, false))).toEqual({ tone: 'red', level: 1 });
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(0.2, 120, false))).toEqual({ tone: 'orange', level: 2 });
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(0, 120, false)).tone).toBe('amber');
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(0.2, 100, false)).tone).toBe('green');
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(0, 80, false)).tone).toBe('teal');
		expect(SupplyDemandDiagnosis.dot(Diagnoses.of(0, 100, false)).tone).toBe('grey');
	});

	it('says how much is unmet or unused', () => {
		expect(SupplyDemandDiagnosis.balance(-0.24)).toBe('-24% of demand unmet');
		expect(SupplyDemandDiagnosis.balance(0.18)).toBe('+18% of output unused');
		expect(SupplyDemandDiagnosis.balance(0.001)).toBe('balanced');
	});

	it('sums a ware up in one line', () => {
		expect(SupplyDemandDiagnosis.summary(row(-0.24, 120))).toBe(
			'Short · moderate — -24% of demand unmet, -16.2M Cr/h'
		);
		expect(SupplyDemandDiagnosis.summary(row(0, 118, { marketBased: true, mined: true }))).toBe(
			'Tight market · severe (market only) — price index 118%'
		);
	});
});
