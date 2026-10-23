import { describe, expect, it } from 'vitest';
import type { Sector, SectorResource } from '../../shared/services/model/model';
import { TradeRouteTesting } from '../../trade/trade-route-testing';
import type { MiningTrip } from '../mining';
import { MinersNeeded } from './miners-needed';

// 1000 units per full hold, 900 s per trip: 4000 units per hour
const trip: MiningTrip = { units: 1000, tripTime: 900, tripValue: 50_000, perHour: 200_000 };

function field(ware: string, count: number, yieldAmount: number, respawnDelay: number): SectorResource {
	return { ware, size: 'small', yield: 'verylow', speed: 'slow', count, yieldAmount, respawnDelay, radius: 30_000 };
}

describe('MinersNeeded', () => {
	it('rounds the miners and holds up', () => {
		const estimate = MinersNeeded.estimate(trip, 10_000, 84_000, 1000);
		expect(estimate.perMiner).toBe(4000);
		expect(estimate.capacityMiners).toBe(3);
		expect(estimate.holdsNow).toBe(84);
		expect(estimate.hoursNowOneMiner).toBe(21);
		expect(estimate.outpaces).toBe(false);
	});

	it('has no capacity line when the modules use none of the ware', () => {
		const estimate = MinersNeeded.estimate(trip, 0, 500, 1000);
		expect(estimate.capacityMiners).toBeUndefined();
		expect(estimate.holdsNow).toBe(1);
	});

	it('sums the regrowth of the fields and flags miners outpacing it', () => {
		const sector: Sector = {
			...TradeRouteTesting.sector('a', []),
			resources: [field('nividium', 1, 500, 90), field('nividium', 2, 300, 60), field('ore', 4, 1_000_000, 120)],
		};
		// 500 * 60 / 90 + 2 * 300 * 60 / 60
		const regrowth = MinersNeeded.regrowth(sector, 'nividium');
		expect(regrowth).toBeCloseTo(933.33, 1);
		expect(MinersNeeded.estimate(trip, 1000, 1000, 1000, regrowth).outpaces).toBe(true);
		expect(MinersNeeded.estimate(trip, 1000, 1000, 1000, 2_000_000).outpaces).toBe(false);
	});
});
