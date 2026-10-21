import { EquipmentService } from './equipment.service';
import {
	bestLoadout,
	buildWares,
	fits,
	flightSpeeds,
	loadoutStats,
	relationToReputation,
	slotGroups,
	weaponStats,
} from './loadout';
import { ShipService } from './ship.service';

describe('loadout', () => {
	const equipment = new EquipmentService();
	const ships = new ShipService();
	const all = equipment.getEntities();
	const get = (id: string) => equipment.getEntity(id);

	it('matches equipment to slots by connection tags', () => {
		const fighter = ships.getEntity('ship_arg_s_fighter_01_a');
		const laser = get('weapon_gen_s_laser_01_mk1');
		const mLaser = get('weapon_gen_m_laser_01_mk1');

		expect(fits(laser, fighter.weapons[0])).toBe(true);
		expect(fits(mLaser, fighter.weapons[0])).toBe(false);
	});

	it('finds options for every slot group of common ships', () => {
		for (const id of ['ship_arg_s_fighter_01_a', 'ship_arg_m_trans_container_01_a', 'ship_arg_l_destroyer_01_a']) {
			const groups = slotGroups(ships.getEntity(id), all);
			expect(groups.some((g) => g.kind === 'engines')).toBe(true);
			expect(groups.some((g) => g.kind === 'shields')).toBe(true);
			expect(groups.every((g) => g.options.length > 0)).toBe(true);
		}
	});

	it('computes speed as thrust / drag', () => {
		const ship = ships.getEntity('ship_arg_s_fighter_01_a');
		const engine = get('engine_arg_s_allround_01_mk1');
		const speeds = flightSpeeds(ship, engine);

		const expected = (engine.thrust.forward * ship.engines.length) / ship.drag.forward;
		expect(speeds.speed).toBeCloseTo(expected);
		expect(speeds.boost).toBeCloseTo(expected * engine.boost.thrust);
		expect(speeds.travel).toBeCloseTo(expected * engine.travel.thrust);
		// sanity: a scout-class fighter flies a few hundred m/s
		expect(speeds.speed).toBeGreaterThan(100);
		expect(speeds.speed).toBeLessThan(1000);
	});

	it('computes projectile damage per second from the fire rate', () => {
		const stats = weaponStats({ damage: 55, amount: 1, speed: 5000, lifetime: 0.8, range: 4000, rate: 8 });
		expect(stats.burstDps).toBeCloseTo(440);
		expect(stats.sustainedDps).toBeCloseTo(440);
	});

	it('accounts for magazine reloads', () => {
		// 8 shots at 1 per 1.4 s = 11.2 s firing, then 7 s reload
		const stats = weaponStats({ damage: 380, amount: 1, speed: 5000, lifetime: 1, range: 5000, reload: 1.4, magazine: { size: 8, reload: 7 } });
		expect(stats.burstDps).toBeCloseTo(380 / 1.4);
		expect(stats.sustainedDps).toBeCloseTo((380 / 1.4) * (11.2 / 18.2));
	});

	it('treats beams as damage per second while firing', () => {
		const stats = weaponStats({ damage: 147, amount: 1, speed: 3e8, lifetime: 3, range: 5000, beam: true, reload: 5 });
		expect(stats.burstDps).toBeCloseTo(147);
		expect(stats.sustainedDps).toBeCloseTo(147 * (3 / 5));
	});

	it('reduces sustained damage when the weapon overheats', () => {
		const weapon = {
			damage: 100,
			amount: 1,
			speed: 1000,
			lifetime: 1,
			range: 1000,
			rate: 10,
			heat: { shot: 200, overheat: 10000, coolRate: 1000, coolDelay: 1, overheatCoolDelay: 2, reenable: 8000 },
		};
		const stats = weaponStats(weapon);
		// heats 2000 - 1000 = 1000 per second
		expect(stats.timeToOverheat).toBeCloseTo(10);
		// 2 s firing from 8000 to 10000, then 2 s delay + 2 s cooling
		expect(stats.sustainedDps).toBeCloseTo(1000 * (2 / 6));
	});

	it('totals a loadout and the wares to build it', () => {
		const ship = ships.getEntity('ship_arg_m_trans_container_01_a');
		const groups = slotGroups(ship, all);
		const loadout = bestLoadout(groups, (x) => x.price?.avg ?? 0);
		const stats = loadoutStats(ship, groups, loadout, get);

		expect(stats.speeds.speed).toBeGreaterThan(0);
		expect(stats.shield).toBeGreaterThan(0);
		expect(stats.equipmentPrice.avg).toBeGreaterThan(0);

		const wares = buildWares(ship, stats.counts, get);
		expect(wares.get('hullparts')).toBeGreaterThan(0);
		expect(wares.get('energycells')).toBeGreaterThan(0);
	});

	it('maps relations to the reputation shown in game', () => {
		expect(relationToReputation(0.1)).toBe(20);
		expect(relationToReputation(0.01)).toBe(10);
		expect(relationToReputation(-0.01)).toBe(-10);
		expect(relationToReputation(1)).toBe(30);
	});
});
