import { TestBed } from '@angular/core/testing';
import { ShipService } from './ship.service';
import { LOADOUT_PRESETS, ShipStatsService } from './ship-stats.service';

describe('ShipStatsService.matchingPreset', () => {
	const ship = new ShipService().getEntity('ship_arg_s_fighter_01_a')!;
	const stats = () => TestBed.inject(ShipStatsService);

	it('finds the preset of its own code', () => {
		for (const { id } of LOADOUT_PRESETS) {
			expect(stats().matchingPreset(ship, stats().encode(ship, stats().preset(ship, id)))).toBe(id);
		}
	});

	it('finds the preset of a code made before the thruster and missile slots', () => {
		const groups = stats().groups(ship);
		expect(groups.at(-1)?.kind).toBe('thrusters');
		const code = stats().encode(ship, stats().preset(ship, 'combat')).split('.').slice(0, groups.length - 1).join('.');
		expect(stats().matchingPreset(ship, code)).toBe('combat');
	});

	it('finds none for a custom loadout', () => {
		const loadout = stats().preset(ship, 'combat');
		const engines = stats().groups(ship).find((x) => x.kind === 'engines')!;
		const other = engines.options.find((x) => x.id !== loadout[engines.key])!;
		expect(stats().matchingPreset(ship, stats().encode(ship, { ...loadout, [engines.key]: other.id }))).toBeUndefined();
	});
});
