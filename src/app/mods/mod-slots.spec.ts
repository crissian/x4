import { describe, expect, it } from 'vitest';
import type { WeaponData } from '../shared/services/model/equipment';
import { ModSlots } from './mod-slots';
import { ModTesting } from './mod-testing';

describe('ModSlots', () => {
	const weapon = (values: Partial<WeaponData> = {}): WeaponData => ({
		damage: 100,
		amount: 1,
		speed: 1000,
		lifetime: 2,
		range: 2000,
		...values,
	});

	it('finds the slot of the mods a piece of equipment takes', () => {
		const of = (values: Parameters<typeof ModTesting.equipment>[1]) =>
			ModSlots.ofEquipment(ModTesting.equipment('x', values));
		expect(of({ equipmentClass: 'Weapon', weapon: weapon() })).toBe('weapon');
		expect(of({ equipmentClass: 'Weapon', weapon: weapon({ repair: true }) })).toBe('weapon');
		expect(of({ equipmentClass: 'Engine', type: 'Engines' })).toBe('engine');
		expect(of({ equipmentClass: 'Engine', type: 'Thrusters' })).toBeUndefined();
		expect(of({ equipmentClass: 'Shield Generator' })).toBe('shield');
		expect(of({ equipmentClass: 'Missile' })).toBeUndefined();
	});

	it('lists every mod of the slot, with nothing narrowed by the weapon', () => {
		const mods = [
			ModTesting.mod('damage'),
			ModTesting.mod('beam', { effect: { stat: 'beamlength', min: 1.05, max: 1.1 } }),
			ModTesting.mod('shield', { slot: 'shield', effect: { stat: 'capacity', min: 1.05, max: 1.2 } }),
		];
		const laser = ModTesting.equipment('weapon_gen_s_laser_01_mk1', { equipmentClass: 'Weapon', weapon: weapon() });
		expect(ModSlots.forEquipment(mods, laser).map((x) => x.id)).toEqual(['damage', 'beam']);
	});
});
