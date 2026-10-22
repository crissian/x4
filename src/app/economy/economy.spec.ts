import { describe, expect, it } from 'vitest';
import { TradeRouteTesting } from '../trade/trade-route-testing';
import type { WareEconomy } from './economy-model';
import { EconomyTesting } from './economy-testing';

const FOOD = 'foodrations';
const ENERGY = 'energycells';

/** a: plant (15000 cells/h), teladi; b: half-lit plant (7500), argon; c: player hull parts; x: a wreck. */
function economy() {
	const plant = { modules: [EconomyTesting.ENERGY, EconomyTesting.HABITAT], workforce: { argon: 90 } };
	return EconomyTesting.economy([
		EconomyTesting.station('A', 'a', { ...plant, owner: 'teladi' }, [
			TradeRouteTesting.sell(ENERGY, 12, 1000),
			TradeRouteTesting.sell(FOOD, EconomyTesting.price(FOOD) * 1.5, 100),
			TradeRouteTesting.buy(FOOD, 99, 40, true),
		]),
		EconomyTesting.station('B', 'b', { ...plant, owner: 'argon' }, [TradeRouteTesting.sell(ENERGY, 20, 3000)]),
		EconomyTesting.station('C', 'c', { modules: [EconomyTesting.HULL_PARTS], owner: 'player' }, [
			TradeRouteTesting.buy(ENERGY, 18, 500),
			TradeRouteTesting.buy(ENERGY, 17, 50),
		]),
		EconomyTesting.station('X', 'x', { modules: [EconomyTesting.ENERGY], state: 'wreck' }),
	]);
}

function row(rows: WareEconomy[], ware: string) {
	const found = rows.find((x) => x.ware === ware);
	if (!found) {
		throw new Error(`no row for ${ware}`);
	}
	return found;
}

describe('economy', () => {
	it('sums the flows of the galaxy', () => {
		const energy = row(economy().rows(), ENERGY);
		expect(energy.produced).toBeCloseTo(15000 + 7500);
		expect(energy.consumed).toBeCloseTo(320);
		expect(energy.net).toBeCloseTo(22180);
		expect(energy.value).toBeCloseTo(22180 * EconomyTesting.price(ENERGY));
		expect(energy.producers).toBe(2);
		expect(energy.consumers).toBe(1);
	});

	it('sums the flows of a faction and of the sectors near a centre', () => {
		const model = economy();
		expect(row(model.rows({ faction: 'argon' }), ENERGY).produced).toBeCloseTo(7500);
		const near = row(model.rows({ centre: 'a', jumps: 1 }), ENERGY);
		expect(near.produced).toBeCloseTo(22500);
		expect(near.consumers).toBe(0);
		expect(row(model.rows({ centre: 'a', jumps: 0 }), ENERGY).produced).toBeCloseTo(15000);
		expect(row(model.rows({ centre: 'a', jumps: 2 }), ENERGY).consumed).toBeCloseTo(320);
		expect(model.rows({ centre: 'unknown' })).toEqual([]);
		expect(row(model.rows({ includePlayer: false }), ENERGY).consumed).toBe(0);
	});

	it('works out the market columns', () => {
		const energy = row(economy().rows(), ENERGY);
		expect(energy.stock).toBe(4000);
		expect(energy.wanted).toBe(550);
		expect(energy.lowestSell).toBe(12);
		expect(energy.highestBuy).toBe(18);
		// (1000 * 12 + 3000 * 20) / 4000 = 18 Cr on an average of 16
		expect(energy.priceIndex).toBeCloseTo((18 / EconomyTesting.price(ENERGY)) * 100);
	});

	it('leaves player-only offers out of the market', () => {
		const food = row(economy().rows(), FOOD);
		expect(food.wanted).toBe(0);
		expect(food.highestBuy).toBeUndefined();
	});

	it('diagnoses a dear shortage', () => {
		const food = row(economy().rows(), FOOD);
		expect(food.net).toBeLessThan(0);
		expect(food.priceIndex).toBeCloseTo(150);
		expect(food.balance).toBeLessThan(-0.02);
		expect(food.diagnosis).toMatchObject({ kind: 'short', marketOnly: false });
	});

	it('sums the net of the sectors within some jumps', () => {
		const model = economy();
		const at = (jumps: number, scope = {}) => model.neighbourhood(ENERGY, jumps, scope);
		expect(at(0).get('a')).toBeCloseTo(15000);
		expect(at(0).get('c')).toBeCloseTo(-320);
		expect(at(1).get('a')).toBeCloseTo(22500);
		expect(at(1).get('b')).toBeCloseTo(22180);
		expect(at(1).get('c')).toBeCloseTo(7180);
		expect(at(2).get('c')).toBeCloseTo(22180);
		expect(at(3).get('x')).toBe(0);
		expect(at(1, { includePlayer: false }).get('c')).toBeCloseTo(7500);
		expect(at(1, { faction: 'argon' }).get('a')).toBeCloseTo(7500);
		expect(at(1)).toBe(at(1));
	});

	it('gives produced, consumed and net per sector, cached', () => {
		const model = economy();
		const balances = model.balances(ENERGY, 1);
		for (const [id, x] of balances) {
			expect(x.net).toBeCloseTo(x.produced - x.consumed);
			expect(x.net).toBeCloseTo(model.neighbourhood(ENERGY, 1).get(id)!);
		}
		expect(balances.get('c')).toMatchObject({ net: expect.closeTo(7180) });
		expect(balances.get('x')).toEqual({ produced: 0, consumed: 0, net: 0 });
		expect(model.balances(ENERGY, 1)).toBe(balances);
	});

	it('finds the sector that adds the most within some jumps, with its distance', () => {
		const model = economy();
		const top = (id: string, jumps: number) => model.topContributor(ENERGY, id, jumps);
		expect(top('c', 0)).toMatchObject({ sector: 'c', jumps: 0, net: expect.closeTo(-320) });
		expect(top('c', 1)).toMatchObject({ sector: 'b', jumps: 1, net: expect.closeTo(7500) });
		expect(top('c', 2)).toMatchObject({ sector: 'a', jumps: 2, net: expect.closeTo(15000) });
		expect(top('a', 3)).toMatchObject({ sector: 'a', jumps: 0 });
		expect(top('x', 3)).toBeUndefined();
		expect(model.topContributor(ENERGY, 'c', 2, { faction: 'argon' })).toMatchObject({ sector: 'b' });
	});

	it('lists the stations making or using a ware', () => {
		const model = economy();
		expect(
			model
				.wareStations(ENERGY)
				.map((x) => x.station.code)
				.sort()
		).toEqual(['A', 'B', 'C']);
		expect(model.wareStations(ENERGY, { faction: 'teladi' }).map((x) => x.station.code)).toEqual(['A']);
	});
});
