import { describe, expect, it } from 'vitest';
import type { ShipListItem } from '../../shared/services/model/model';
import type { SaveShip } from '../map/save-map-model';
import { OwnShipList, OwnShipLookups } from './own-ship-list';

describe('OwnShipList', () => {
	const models: Record<string, ShipListItem> = {
		hauler: { id: 'hauler', name: 'Hauler', travel: { speed: 3000, charge: 10 } } as ShipListItem,
		scout: { id: 'scout', name: 'Scout', travel: { speed: 5000, charge: 2 } } as ShipListItem,
	};
	const lookups: OwnShipLookups = {
		model: (id) => models[id],
		travel: (ship) => (ship.engine === 'fast' ? { speed: 9000, charge: 4 } : undefined),
		sectorName: (id) => id.toUpperCase(),
		text: (ref) => (ref === '{20101,22504}' ? 'Raven Prototype' : undefined),
	};
	const ship = (id: string, macro: string, code: string, name?: string, engine?: string, sector = 'a'): SaveShip => ({
		id: `[${id}]`,
		code,
		macro,
		sector,
		...(name ? { name } : {}),
		...(engine ? { engine, engines: 1 } : {}),
	});

	it('sorts named ships by name first, then the others by model and sector', () => {
		const list = OwnShipList.build(
			[
				ship('0x1', 'scout', 'BBB-2', undefined, undefined, 'b'),
				ship('0x2', 'hauler', 'ZZZ-9'),
				ship('0x3', 'scout', 'AAA-1'),
				ship('0x4', 'scout', 'X', 'Zed'),
				ship('0x5', 'hauler', 'Y', 'Alpha'),
			],
			lookups
		);
		expect(list.map((x) => [x.label, x.sectorName])).toEqual([
			['Alpha', 'A'],
			['Zed', 'A'],
			['Hauler', 'A'],
			['Scout', 'A'],
			['Scout', 'B'],
		]);
		expect(list[0]).toEqual({
			key: 'own-0x5',
			label: 'Alpha',
			named: true,
			count: 1,
			keys: ['own-0x5'],
			model: models['hauler'],
			sector: 'a',
			sectorName: 'A',
			travel: { speed: 3000, charge: 10 },
		});
	});

	it('merges unnamed ships of one model in one sector with the same travel speed', () => {
		const list = OwnShipList.build(
			[
				ship('0x1', 'scout', 'AAA-1'),
				ship('0x2', 'scout', 'BBB-2'),
				ship('0x3', 'scout', 'CCC-3', undefined, 'fast'),
				ship('0x4', 'scout', 'DDD-4', undefined, undefined, 'b'),
				ship('0x5', 'scout', 'EEE-5', 'Named'),
				ship('0x6', 'scout', 'FFF-6'),
			],
			lookups
		);
		expect(list.map((x) => [x.label, x.sectorName, x.travel?.speed, x.keys])).toEqual([
			['Named', 'A', 5000, ['own-0x5']],
			['Scout', 'A', 5000, ['own-0x1', 'own-0x2', 'own-0x6']],
			['Scout', 'A', 9000, ['own-0x3']],
			['Scout', 'B', 5000, ['own-0x4']],
		]);
		expect(list[1].count).toBe(3);
		expect(list[1].key).toBe('own-0x1');
	});

	it('takes the travel speed from the installed engine, else the model', () => {
		const [fast, plain] = OwnShipList.build(
			[ship('0x1', 'scout', 'A', 'A', 'fast'), ship('0x2', 'scout', 'B', 'B', 'unknown')],
			lookups
		);
		expect(fast.travel).toEqual({ speed: 9000, charge: 4 });
		expect(plain.travel).toEqual({ speed: 5000, charge: 2 });
	});

	it('resolves game text names and falls back to the model name for unknown ones', () => {
		const list = OwnShipList.build(
			[ship('0x1', 'scout', 'AAA-1', '{20101,22504}'), ship('0x2', 'scout', 'BBB-2', '{1,2}')],
			lookups
		);
		expect(list.map((x) => [x.label, x.named])).toEqual([
			['Raven Prototype', true],
			['Scout', false],
		]);
	});

	it('leaves out ships of unknown models', () => {
		expect(OwnShipList.build([ship('0x1', 'modded', 'A')], lookups)).toEqual([]);
	});

	it('tells own ship keys apart from ship ids', () => {
		expect(OwnShipList.isKey('own-0x48a13')).toBe(true);
		expect(OwnShipList.isKey('own-')).toBe(false);
		expect(OwnShipList.isKey('ship_arg_s_scout_01_a')).toBe(false);
	});
});
