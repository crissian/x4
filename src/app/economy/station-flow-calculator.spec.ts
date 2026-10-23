import { describe, expect, it } from 'vitest';
import { EconomyTesting } from './economy-testing';
import { StationFlowCalculator } from './station-flow-calculator';

function calculator() {
	return new StationFlowCalculator(EconomyTesting.wares, EconomyTesting.modules, EconomyTesting.SECTORS);
}

function flow(flows: { ware: string; produced: number; consumed: number }[], ware: string) {
	return flows.find((x) => x.ware === ware);
}

describe('station flows', () => {
	it('adds the workforce bonus of the staffing and the sunlight to energy cells', () => {
		// two plants need 180 workers; 90 of them make half of the 43% bonus: 175 + floor(37.6) = 212 per minute
		const station = EconomyTesting.station('S', 'b', {
			modules: [EconomyTesting.ENERGY, EconomyTesting.HABITAT],
			moduleCounts: [2, 1],
			workforce: { argon: 90 },
		});
		const energy = flow(calculator().flows(station), 'energycells');
		// half the sunlight in sector b
		expect(energy?.produced).toBeCloseTo(2 * 212 * 60 * 0.5);
		expect(energy?.consumed).toBe(0);
	});

	it('counts the extra workers the player headquarters needs, as the calculator does', () => {
		const modules = [EconomyTesting.ENERGY, EconomyTesting.HABITAT];
		const factory = EconomyTesting.station('S', 'a', { modules, workforce: { argon: 90 } });
		const hq = { ...factory, macro: 'station_pla_headquarters_base_01' };
		const energy = (station: typeof factory) => flow(calculator().flows(station), 'energycells')?.produced ?? 0;
		expect(energy(factory)).toBe(250 * 60);
		expect(energy(hq)).toBeLessThan(energy(factory));
	});

	it('gives the full bonus to a fully staffed plant and none to an empty one', () => {
		const modules = [EconomyTesting.ENERGY, EconomyTesting.HABITAT];
		const full = EconomyTesting.station('S', 'a', { modules, workforce: { argon: 90 } });
		const empty = EconomyTesting.station('E', 'a', { modules });
		expect(flow(calculator().flows(full), 'energycells')?.produced).toBe(250 * 60);
		expect(flow(calculator().flows(empty), 'energycells')?.produced).toBe(175 * 60);
	});

	it('feeds the actual workers of habitats, not their capacity', () => {
		const station = EconomyTesting.station('S', 'a', {
			modules: [EconomyTesting.HABITAT],
			workforce: { argon: 100 },
		});
		const flows = calculator().flows(station);
		// 450 food rations and 270 medical supplies per 200 workers
		expect(flow(flows, 'foodrations')?.consumed).toBeCloseTo(225);
		expect(flow(flows, 'medicalsupplies')?.consumed).toBeCloseTo(135);
		expect(flow(flows, 'foodrations')?.produced).toBe(0);
	});

	it('ignores workers of a race without needs', () => {
		const station = EconomyTesting.station('S', 'a', { modules: [], workforce: { unknown: 50 } });
		expect(calculator().flows(station)).toEqual([]);
	});

	it('uses what production modules need without a bonus', () => {
		const station = EconomyTesting.station('S', 'a', { modules: [EconomyTesting.HULL_PARTS], moduleCounts: [2] });
		const flows = calculator().flows(station);
		expect(flow(flows, 'hullparts')?.produced).toBeCloseTo(2 * 1176);
		expect(flow(flows, 'energycells')?.consumed).toBeCloseTo(2 * 320);
		expect(flow(flows, 'refinedmetals')?.consumed).toBeCloseTo(2 * 1120);
	});

	it('leaves out construction sites and wrecks', () => {
		const modules = [EconomyTesting.ENERGY];
		const stations = [
			EconomyTesting.station('OK', 'a', { modules }),
			EconomyTesting.station('C', 'a', { modules, state: 'construction' }),
			EconomyTesting.station('W', 'a', { modules, state: 'wreck' }),
		];
		expect(
			calculator()
				.all(stations)
				.map((x) => x.station.code)
		).toEqual(['OK']);
	});
});
