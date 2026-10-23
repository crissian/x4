import { describe, expect, it } from 'vitest';
import type { SaveFleetShip } from '../savegame/empire/save-empire-model';
import type { ShipListItem } from '../shared/services/model/model';
import { EmpireShipLookups, EmpireShips } from './empire-ships';

describe('EmpireShips', () => {
	const models: Record<string, ShipListItem> = {
		carrier: { id: 'carrier', name: 'Colossus', size: 'Extra Large', purpose: 'Fight' } as ShipListItem,
		fighter: { id: 'fighter', name: 'Elite', size: 'Small', purpose: 'Fight' } as ShipListItem,
		trader: { id: 'trader', name: 'Mercury', size: 'Medium', purpose: 'Trade' } as ShipListItem,
	};
	const lookups: EmpireShipLookups = {
		model: (id) => models[id],
		sectorName: (id) => id.toUpperCase(),
		text: (ref) => (ref === '{1,2}' ? 'Story Ship' : undefined),
		stationName: (id) => (id === '[st]' ? 'My Factory' : undefined),
		orderName: (id) => ({ ProtectStation: 'Protect Station', TradeRoutine: 'AutoTrade' })[id],
		assignmentName: (id) => (id === 'interception' ? 'Interception' : undefined),
	};
	const ship = (id: string, macro: string, extra: Partial<SaveFleetShip> = {}): SaveFleetShip => ({
		id,
		code: `${id.toUpperCase()}-001`,
		macro,
		sector: 'a',
		...extra,
	});

	it('lists each commander followed by its subordinates, depth first, with the fleet name', () => {
		const rows = EmpireShips.build(
			[
				ship('w2', 'fighter', { name: 'Wing B', commander: 'c', assignment: 'interception' }),
				ship('solo', 'trader', { name: 'Alone', defaultOrder: 'TradeRoutine' }),
				ship('c', 'carrier', { name: 'Big', fleet: 'Home Fleet', defaultOrder: 'Wait', order: 'ProtectStation' }),
				ship('w1', 'fighter', { name: 'Wing A', commander: 'c' }),
				ship('w3', 'fighter', { name: 'Wingman', commander: 'w1' }),
			],
			lookups
		);
		expect(rows.map((x) => [x.label, x.depth, x.fleet, x.subordinates, x.commander])).toEqual([
			['Alone', 0, '', 0, undefined],
			['Big', 0, 'Home Fleet', 3, undefined],
			['Wing A', 1, 'Home Fleet', 1, 'Big'],
			['Wingman', 2, 'Home Fleet', 0, 'Wing A'],
			['Wing B', 1, 'Home Fleet', 0, 'Big'],
		]);
		expect(rows[1]).toMatchObject({
			modelName: 'Colossus',
			size: 'Extra Large',
			purpose: 'Fight',
			sectorName: 'A',
			order: 'Protect Station',
			orderId: 'ProtectStation',
			defaultOrder: 'Wait',
		});
		expect(rows[0]).toMatchObject({ order: 'AutoTrade', orderId: 'TradeRoutine', defaultOrder: undefined });
		expect(rows[4]).toMatchObject({ assignment: 'Interception', assignmentId: 'interception' });
	});

	it('names a fleet without a fleet name after its commander, and a station fleet after the station', () => {
		const rows = EmpireShips.build(
			[
				ship('c', 'carrier', { name: 'Big' }),
				ship('w', 'fighter', { commander: 'c' }),
				ship('t', 'trader', { name: 'Hauler', commander: '[st]' }),
			],
			lookups
		);
		expect(rows.map((x) => [x.label, x.fleet, x.commander, x.commanderId])).toEqual([
			['Big', 'Big', undefined, undefined],
			['Elite', 'Big', 'Big', 'c'],
			['Hauler', 'My Factory', 'My Factory', '[st]'],
		]);
	});

	it('resolves game text names, keeps unknown models and lists ships commanding each other in a loop', () => {
		const rows = EmpireShips.build(
			[
				ship('s', 'modded', { name: '{1,2}' }),
				ship('x', 'fighter', { commander: 'y' }),
				ship('y', 'fighter', { commander: 'x' }),
			],
			lookups
		);
		expect(rows.map((x) => [x.label, x.code])).toEqual([
			['Story Ship', 'S-001'],
			['Elite', 'X-001'],
			['Elite', 'Y-001'],
		]);
		expect(rows[0]).toMatchObject({ modelName: 'modded', size: '', model: undefined });
	});

	it('names an unnamed ship after its model, the way the game does, and an unknown model by its code', () => {
		const rows = EmpireShips.build([ship('t', 'trader'), ship('m', 'modded')], lookups);
		expect(rows.map((x) => x.label).sort()).toEqual(['M-001', 'Mercury']);
	});
});
