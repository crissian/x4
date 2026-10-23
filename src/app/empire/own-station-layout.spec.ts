import { describe, expect, it } from 'vitest';
import { EconomyTesting } from '../economy/economy-testing';
import { StationFlowCalculator } from '../economy/station-flow-calculator';
import { StationLayoutLink } from '../station/station-layout-link';
import { OwnStationLayouts } from './own-station-layout';

describe('OwnStationLayouts', () => {
	const calculator = new StationFlowCalculator(EconomyTesting.wares, EconomyTesting.modules, EconomyTesting.SECTORS);
	const own = {
		id: '[0x1]',
		code: 'AAA-1',
		sector: 'b',
		money: 0,
		modules: [
			{ macro: EconomyTesting.ENERGY, count: 3 },
			{ macro: 'landmarks_player_hq_01_research', count: 1 },
			{ macro: EconomyTesting.HABITAT, count: 1 },
		],
		building: 2,
	};

	it('turns the built modules into calculator rows and lists the modules the site does not know', () => {
		const layout = OwnStationLayouts.of(
			own,
			{ macro: 'station_gen_factory_base_01', workforce: { argon: 300, teladi: 20 } },
			calculator
		);
		const energy = EconomyTesting.modules.getEntities().find((x) => x.macro === `${EconomyTesting.ENERGY}_macro`)!;
		const habitat = EconomyTesting.modules
			.getEntities()
			.find((x) => x.macro === `${EconomyTesting.HABITAT}_macro`)!;
		expect(layout.rows).toEqual([
			{ moduleId: energy.id, count: 3 },
			{ moduleId: habitat.id, count: 1 },
		]);
		expect(layout.unknown).toEqual([{ macro: 'landmarks_player_hq_01_research', count: 1 }]);
		expect(layout.building).toBe(2);
		expect(layout.workforce).toBe(320);
		// sector b has half the sunlight
		expect(layout.sunlight).toBe(50);
		expect(layout.calculator).toEqual(StationLayoutLink.params(layout.rows, 50, 320));
		expect(layout.hq).toBe(false);
		expect(layout.flows).toEqual({
			macro: 'station_gen_factory_base_01',
			modules: [EconomyTesting.ENERGY, 'landmarks_player_hq_01_research', EconomyTesting.HABITAT],
			moduleCounts: [3, 1, 1],
			workforce: { argon: 300, teladi: 20 },
			sector: 'b',
		});
	});

	it('gives a station without workforce no workers', () => {
		const layout = OwnStationLayouts.of(
			{ ...own, modules: undefined, building: undefined },
			{ macro: 'station_gen_factory_base_01' },
			calculator
		);
		expect(layout).toMatchObject({ rows: [], unknown: [], building: 0, workforce: 0 });
		expect(layout.calculator['wf']).toBe(0);
	});

	it('marks the player headquarters for the calculator', () => {
		const layout = OwnStationLayouts.of(own, { macro: 'station_pla_headquarters_base_01' }, calculator);
		expect(layout.hq).toBe(true);
		expect(layout.calculator['hq']).toBe(1);
	});
});
