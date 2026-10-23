import { describe, expect, it } from 'vitest';
import type { ModStat } from '../shared/services/model/equipment-mod';
import { ModEffects } from './mod-effects';

describe('ModEffects', () => {
	const stat = (kind: ModStat['kind'], lowerIsBetter = false): ModStat => ({
		id: 'x',
		slot: 'weapon',
		kind,
		lowerIsBetter,
		name: 'Weapon Damage',
		description: '',
	});

	it('shows factors as the signed change from 1 with two decimals, as the game does', () => {
		expect(ModEffects.range(stat('factor'), { min: 1.05, max: 1.2 })).toBe('+5.00% to +20.00%');
		expect(ModEffects.range(stat('factor'), { min: 1.048, max: 1.216 })).toBe('+4.80% to +21.60%');
		expect(ModEffects.range(stat('add'), { min: 1, max: 4 })).toBe('+1 to +4');
	});

	it('orders the range as the game does: max first only for a lower-is-better stat with min below max', () => {
		expect(ModEffects.range(stat('factor'), { min: 0.95, max: 0.8 })).toBe('-5.00% to -20.00%');
		expect(ModEffects.range(stat('factor', true), { min: 0.8, max: 0.95 })).toBe('-5.00% to -20.00%');
		expect(ModEffects.range(stat('factor', true), { min: 0.95, max: 0.8 })).toBe('-5.00% to -20.00%');
		expect(ModEffects.text(stat('factor'), { stat: 'damage', min: 1.15, max: 1.15 })).toBe(
			'Weapon Damage +15.00% to +15.00%'
		);
	});

	it('shows no values for the fraction stats, whose base value is not in the game data', () => {
		expect(ModEffects.range(stat('fraction'), { min: 0.6, max: 0.9 })).toBe('');
		expect(ModEffects.text(stat('fraction'), { stat: 'regiondamage', min: 0.6, max: 0.9 })).toBe('Weapon Damage');
		expect(ModEffects.tone(stat('fraction', true), { min: -0.45, max: -0.3 })).toBe('none');
		expect(ModEffects.best(stat('fraction'), { min: 0.6, max: 0.9 })).toBe(0);
	});

	it('tells helping, hurting and mixed effects apart by the better direction of the stat', () => {
		expect(ModEffects.tone(stat('factor'), { min: 1.05, max: 1.2 })).toBe('good');
		expect(ModEffects.tone(stat('factor'), { min: 0.684, max: 0.736 })).toBe('bad');
		expect(ModEffects.tone(stat('factor'), { min: 0.682, max: 2 })).toBe('mixed');
		expect(ModEffects.tone(stat('factor', true), { min: 0.833, max: 0.953 })).toBe('good');
	});

	it('rates the best roll in the better direction', () => {
		expect(ModEffects.best(stat('factor'), { min: 1.05, max: 1.2 })).toBeCloseTo(0.2);
		expect(ModEffects.best(stat('factor', true), { min: 0.8, max: 0.95 })).toBeCloseTo(0.2);
	});

	it('words the bonus as the game does, with its chances of each number of properties', () => {
		expect(ModEffects.bonus({ max: 1 })).toBe('Up to 1 more property');
		expect(ModEffects.bonus({ max: 3 })).toBe('Up to 3 more properties');
		expect(ModEffects.bonusChances({ max: 2, chance: 1 })).toEqual([
			{ count: 1, chance: 0 },
			{ count: 2, chance: 1 },
		]);
		const half = ModEffects.bonusChances({ max: 3, chance: 0.5 }).map((x) => x.chance);
		expect(half).toEqual([0.25, 0.125, 0.125]);
		expect(ModEffects.bonusTooltip({ max: 1, chance: 1 })).toBe(
			'Probabilities for additional properties:\n+1 Properties: 100%'
		);
	});
});
