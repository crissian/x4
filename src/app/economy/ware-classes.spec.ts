import { describe, expect, it } from 'vitest';
import { EconomyTesting } from './economy-testing';
import { ShipService } from '../shared/services/ship.service';
import { WareClasses } from './ware-classes';
import { TradeRouteTesting } from '../trade/trade-route-testing';

describe('WareClasses', () => {
	const ware = (id: string) => EconomyTesting.wares.getEntity(id)!;

	it('tells mined wares from made ones', () => {
		for (const id of ['ore', 'silicon', 'ice', 'nividium', 'hydrogen', 'helium', 'methane', 'rawscrap']) {
			expect(WareClasses.isMined(ware(id)), id).toBe(true);
		}
		for (const id of ['energycells', 'refinedmetals', 'hullparts', 'foodrations', 'microchips']) {
			expect(WareClasses.isMined(ware(id)), id).toBe(false);
		}
	});

	it('treats a ware with no production in a mined group as mined, and a made one in it as not', () => {
		expect(WareClasses.isMined({ group: { id: 'minerals' } as never, production: [] })).toBe(true);
		const inputs = [{ wares: [{ ware: 'ore' }] }] as never;
		expect(WareClasses.isMined({ group: { id: 'minerals' } as never, production: inputs })).toBe(false);
		expect(WareClasses.isMined({ group: { id: 'hightech' } as never, production: [] })).toBe(true);
	});

	it('splits the building materials into those only building uses and those factories use too', () => {
		const { only, partly } = WareClasses.buildingMaterials(
			new ShipService().getEntities(),
			EconomyTesting.modules.getEntities(),
			EconomyTesting.wares.getEntities()
		);
		expect([...only].sort()).toEqual(['claytronics', 'computronicsubstrate', 'siliconcarbide']);
		for (const id of ['hullparts', 'advancedcomposites', 'metallicmicrolattice', 'plasmaconductors']) {
			expect(partly.has(id), id).toBe(true);
			expect(only.has(id), id).toBe(false);
		}
		expect(partly.has('foodrations')).toBe(false);
	});

	it('matches the building materials precomputed by the extractor', () => {
		const { only, partly } = WareClasses.buildingMaterials(
			new ShipService().getEntities(),
			EconomyTesting.modules.getEntities(),
			EconomyTesting.wares.getEntities()
		);
		expect([...only]).toEqual([...WareClasses.GAME_BUILDING.only]);
		expect([...partly]).toEqual([...WareClasses.GAME_BUILDING.partly]);
	});

	it('works out the building materials from the recipes', () => {
		const recipe = (...wares: string[]) => ({ production: [{ wares: wares.map((ware) => ({ ware })) }] });
		const used = WareClasses.buildingMaterials(
			[
				recipe('a', 'b'),
				{ race: { id: 'xenon' }, ...recipe('x') },
				{ race: { id: 'khaak' }, ...recipe('k') },
				{},
			],
			[recipe('c', 'in'), {}],
			[recipe('in'), {}]
		);
		expect(used.only).toEqual(new Set(['a', 'b', 'c']));
		expect(used.partly).toEqual(new Set(['in']));
	});
});

describe('Economy classes', () => {
	const ore = EconomyTesting.price('ore');
	const clay = EconomyTesting.price('claytronics');
	const food = EconomyTesting.price('foodrations');

	function rows() {
		const sell = (ware: string, price: number) => [TradeRouteTesting.sell(ware, price, 100)];
		return EconomyTesting.economy(
			[
				EconomyTesting.station('A', 'a', {}, sell('ore', ore * 1.1)),
				EconomyTesting.station('B', 'a', {}, sell('claytronics', clay * 0.9)),
				EconomyTesting.station('C', 'a', {}, sell('foodrations', food * 1.3)),
			],
			WareClasses.buildingMaterials([], EconomyTesting.modules.getEntities(), EconomyTesting.wares.getEntities())
		).rows();
	}

	it('marks mined and building wares and diagnoses them from the market alone', () => {
		const find = (id: string) => rows().find((x) => x.ware === id)!;
		expect(find('ore')).toMatchObject({
			mined: true,
			marketBased: true,
			value: 0,
			diagnosis: { kind: 'tight', severity: 'moderate', marketOnly: true },
		});
		expect(find('claytronics')).toMatchObject({
			mined: false,
			building: true,
			marketBased: true,
			diagnosis: { kind: 'glut', severity: 'moderate', marketOnly: true },
		});
		// net 0 and a high price: a tight market, but not a shortage
		expect(find('foodrations')).toMatchObject({
			marketBased: false,
			diagnosis: { kind: 'tight', severity: 'severe', marketOnly: false },
		});
	});

	it('keeps the capacity diagnosis for a ware that factories use as well, and marks it', () => {
		const hull = EconomyTesting.price('hullparts');
		const result = EconomyTesting.economy(
			[EconomyTesting.station('A', 'a', {}, [TradeRouteTesting.sell('hullparts', hull * 1.3, 100)])],
			WareClasses.buildingMaterials([], EconomyTesting.modules.getEntities(), EconomyTesting.wares.getEntities())
		)
			.rows()
			.find((x) => x.ware === 'hullparts')!;
		expect(result).toMatchObject({ building: false, partlyBuilding: true, marketBased: false });
		expect(result.diagnosis.marketOnly).toBe(false);
	});
});
