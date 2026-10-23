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
		expect(of({ equipmentClass: 'Weapon', weapon: weapon({ repair: true }) })).toBeUndefined();
		expect(of({ equipmentClass: 'Turret', weapon: weapon() })).toBeUndefined();
		expect(of({ equipmentClass: 'Engine', type: 'Engines' })).toBe('engine');
		expect(of({ equipmentClass: 'Engine', type: 'Thrusters' })).toBeUndefined();
		expect(of({ equipmentClass: 'Shield Generator' })).toBe('shield');
		expect(of({ equipmentClass: 'Missile' })).toBeUndefined();
	});

	it('leaves out the weapon mods whose main stat the weapon lacks', () => {
		const mods = [
			ModTesting.mod('damage'),
			ModTesting.mod('beam', { effect: { stat: 'beamlength', min: 1.05, max: 1.1 } }),
			ModTesting.mod('charge', { effect: { stat: 'chargetime', min: 0.8, max: 0.95 } }),
			ModTesting.mod('mining', { effect: { stat: 'mining', min: 5, max: 6 } }),
			ModTesting.mod('shield', { slot: 'shield', effect: { stat: 'capacity', min: 1.05, max: 1.2 } }),
		];
		const ids = (id: string, data: WeaponData) =>
			ModSlots.forEquipment(mods, ModTesting.equipment(id, { equipmentClass: 'Weapon', weapon: data })).map(
				(x) => x.id
			);

		expect(ids('weapon_gen_s_laser_01_mk1', weapon())).toEqual(['damage']);
		expect(ids('weapon_gen_s_beam_01_mk1', weapon({ beam: true }))).toEqual(['damage', 'beam']);
		expect(ids('weapon_gen_s_charge_01_mk1', weapon({ chargeTime: 2 }))).toEqual(['damage', 'charge']);
		expect(ids('weapon_gen_s_mining_01_mk1', weapon())).toEqual(['damage', 'mining']);
	});
});
