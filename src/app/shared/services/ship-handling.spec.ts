import { EquipmentService } from './equipment.service';
import { Loadouts } from './loadout';
import { ShipHandling } from './ship-handling';
import { ShipService } from './ship.service';

describe('ShipHandling', () => {
	const equipment = new EquipmentService();
	const ships = new ShipService();
	const nova = ships.getEntity('ship_arg_s_fighter_01_a')!;

	it('divides thruster force and torque by the ship drag', () => {
		const handling = ShipHandling.handling(nova, equipment.getEntity('thruster_gen_s_combat_01_mk1'));

		// Nova Vanguard with S Combat Thrusters Mk1: 352 / 4, 173.3 / 2.42, 173.3 / 2.96, 228 / 2.4
		expect(handling.strafeH).toBeCloseTo(88);
		expect(handling.strafeV).toBeCloseTo(88);
		expect(handling.pitch).toBeCloseTo(71.6, 1);
		expect(handling.yaw).toBeCloseTo(58.5, 1);
		expect(handling.roll).toBeCloseTo(95);
		expect(handling.pitchResponse).toBeCloseTo(1.229 / 2.42);
		expect(handling.strafeResponse).toBeCloseTo(6 / 4);
	});

	it('gives zeros without a thruster', () => {
		const handling = ShipHandling.handling(nova, undefined);
		expect(Object.values(handling).every((x) => x === 0)).toBe(true);
	});

	it('maps the ship thruster size to the connection tag', () => {
		expect(ShipHandling.sizeTag(nova)).toBe('small');
	});

	it('finds thrusters for every ship size', () => {
		const all = equipment.getEntities();
		for (const size of ['Small', 'Medium', 'Large', 'Extra Large']) {
			const ship = ships.getEntities().find((x) => x.thruster === size)!;
			const group = Loadouts.slotGroups(ship, all).find((x) => x.kind === 'thrusters');
			expect(group?.options.length, size).toBeGreaterThan(0);
		}
	});
});
