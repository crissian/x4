import { EquipmentService } from './equipment.service';
import { Loadout, Loadouts } from './loadout';
import { LoadoutMissiles } from './loadout-missiles';
import { ShipPerformance } from './ship-performance';
import { ShipService } from './ship.service';

describe('LoadoutMissiles', () => {
	const equipment = new EquipmentService();
	const ships = new ShipService();
	const all = equipment.getEntities();
	const get = (id: string) => equipment.getEntity(id);
	const tracking = get('weapon_gen_s_guided_02_mk1')!.launcher!;

	it('lists the missiles a launcher accepts', () => {
		const ids = LoadoutMissiles.compatible(tracking, all).map((x) => x.id);

		expect(ids).toEqual(
			expect.arrayContaining([
				'missile_gen_s_guided_01_mk1',
				'missile_gen_s_swarm_01_mk1',
				'missile_gen_s_heatseeker_01_mk1',
				'missile_gen_s_emp_01_mk1',
			])
		);
		expect(ids).not.toContain('missile_gen_s_dumbfire_01_mk1');
		expect(ids).not.toContain('missile_gen_m_guided_01_mk1');
	});

	it('falls back to the default missile for an unknown or incompatible choice', () => {
		expect(LoadoutMissiles.effective(tracking, 'missile_gen_s_swarm_01_mk1', get)?.id).toBe('missile_gen_s_swarm_01_mk1');
		expect(LoadoutMissiles.effective(tracking, 'missile_gen_s_dumbfire_01_mk1', get)?.id).toBe('missile_gen_s_guided_01_mk1');
		expect(LoadoutMissiles.effective(tracking, 'nope', get)?.id).toBe('missile_gen_s_guided_01_mk1');
		expect(LoadoutMissiles.effective(tracking, '', get)?.id).toBe('missile_gen_s_guided_01_mk1');
	});

	it('counts every missile of a swarm', () => {
		const stats = LoadoutMissiles.stats(get('missile_gen_s_swarm_01_mk1')!.missile!);
		expect(stats.volley).toBe(210 * 8);
		expect(stats.burstDps).toBeCloseTo((210 * 8) / 8);
	});

	it('accounts for magazine reloads', () => {
		// 8 rockets at 4 per second = 2 s firing, then 9 s reload
		const missile = get('missile_gen_s_dumbfire_01_mk1')!.missile!;
		const stats = LoadoutMissiles.stats(missile);
		expect(stats.burstDps).toBeCloseTo(600 * 4);
		expect(stats.sustainedDps).toBeCloseTo(600 * 4 * (2 / 11));
		expect(ShipPerformance.missileDps(missile)).toBeCloseTo(stats.sustainedDps);
	});

	it('totals the missiles of a loadout', () => {
		const ship = ships.getEntity('ship_arg_s_fighter_01_a')!;
		const groups = Loadouts.slotGroups(ship, all);
		const group = groups.find((x) => LoadoutMissiles.isLauncherGroup(x))!;
		const loadout: Loadout = { [group.key]: 'weapon_gen_s_guided_02_mk1', [LoadoutMissiles.key(group)]: 'missile_gen_s_swarm_01_mk1' };
		const totals = LoadoutMissiles.totals(ship, groups, loadout, get);

		const swarm = LoadoutMissiles.stats(get('missile_gen_s_swarm_01_mk1')!.missile!);
		expect(totals.launchers).toBe(1);
		expect(totals.dps).toBeCloseTo(swarm.sustainedDps);
		expect(totals.volley).toBe(210 * 8);
		expect(totals.storage).toBe(2);
		expect(totals.secondsToEmpty).toBeCloseTo(2 / swarm.sustainedRate);
	});

	it('reports nothing without a launcher', () => {
		const ship = ships.getEntity('ship_arg_s_fighter_01_a')!;
		const totals = LoadoutMissiles.totals(ship, Loadouts.slotGroups(ship, all), {}, get);
		expect(totals.launchers).toBe(0);
		expect(totals.secondsToEmpty).toBe(0);
	});
});
