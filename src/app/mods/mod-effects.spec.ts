import { describe, expect, it } from 'vitest';
import type { ModBonus, ModStat } from '../shared/services/model/equipment-mod';
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

	it('shows factor ranges as signed percentages, lowest first', () => {
		expect(ModEffects.range(stat('factor'), { min: 1.05, max: 1.2 })).toBe('+5% to +20%');
		expect(ModEffects.range(stat('factor'), { min: 0.95, max: 0.8 })).toBe('-20% to -5%');
		expect(ModEffects.range(stat('factor'), { min: 1.048, max: 1.216 })).toBe('+4.8% to +21.6%');
	});

	it('shows added units and fractions in their own form', () => {
		expect(ModEffects.range(stat('add'), { min: 1, max: 4 })).toBe('+1 to +4');
		expect(ModEffects.range(stat('fraction'), { min: 0.6, max: 0.9 })).toBe('60% to 90%');
		expect(ModEffects.range(stat('fraction'), { min: -0.45, max: -0.3 })).toBe('-45% to -30%');
	});

	it('shows one value when the range has no spread', () => {
		expect(ModEffects.range(stat('factor'), { min: 1.15, max: 1.15 })).toBe('+15%');
		expect(ModEffects.text(stat('factor'), { stat: 'damage', min: 1.15, max: 1.15 })).toBe('Weapon Damage +15%');
	});

	it('tells helping, hurting and mixed effects apart by the better direction of the stat', () => {
		expect(ModEffects.tone(stat('factor'), { min: 1.05, max: 1.2 })).toBe('good');
		expect(ModEffects.tone(stat('factor'), { min: 0.684, max: 0.736 })).toBe('bad');
		expect(ModEffects.tone(stat('factor'), { min: 0.682, max: 2 })).toBe('mixed');
		expect(ModEffects.tone(stat('factor', true), { min: 0.833, max: 0.953 })).toBe('good');
		expect(ModEffects.tone(stat('fraction', true), { min: -0.45, max: -0.3 })).toBe('good');
	});

	it('rates the best roll in the better direction', () => {
		expect(ModEffects.best(stat('factor'), { min: 1.05, max: 1.2 })).toBeCloseTo(0.2);
		expect(ModEffects.best(stat('factor', true), { min: 0.8, max: 0.95 })).toBeCloseTo(0.2);
	});

	it('describes how many bonus effects roll', () => {
		const one: ModBonus = { chance: 1, max: 1, effects: [{ stat: 'cooling', min: 0.7, max: 0.75 }] };
		const two: ModBonus = { ...one, max: 2, effects: [...one.effects, { stat: 'reload', min: 0.7, max: 2 }] };
		expect(ModEffects.bonus(one)).toBe('Plus:');
		expect(ModEffects.bonus(two)).toBe('Plus up to 2 of:');
		expect(ModEffects.bonus({ ...two, max: 5 })).toBe('Plus up to 2 of:');
		expect(ModEffects.bonus({ ...two, chance: 0.5 })).toBe('50% chance of up to 2 of:');
	});

	it('gives the share of the picks only when the weights differ and not every effect rolls', () => {
		const bonus: ModBonus = {
			chance: 1,
			max: 1,
			effects: [
				{ stat: 'reload', min: 1, max: 2, weight: 1 },
				{ stat: 'mining', min: 1, max: 2, weight: 3 },
			],
		};
		expect(ModEffects.odds(bonus, bonus.effects[1])).toBeCloseTo(0.75);
		expect(ModEffects.odds({ ...bonus, max: 2 }, bonus.effects[1])).toBeUndefined();
		const even = { ...bonus, effects: bonus.effects.map((x) => ({ ...x, weight: 1 })) };
		expect(ModEffects.odds(even, even.effects[0])).toBeUndefined();
	});
});
