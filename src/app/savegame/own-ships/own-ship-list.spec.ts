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
	const ship = (id: string, macro: string, code: string, name?: string, engine?: string): SaveShip => ({
		id: `[${id}]`,
		code,
		macro,
		sector: 'a',
		...(name ? { name } : {}),
		...(engine ? { engine, engines: 1 } : {}),
	});

	it('sorts named ships by name first, then the others by model and code', () => {
		const list = OwnShipList.build(
			[
				ship('0x1', 'scout', 'BBB-2'),
				ship('0x2', 'hauler', 'ZZZ-9'),
				ship('0x3', 'scout', 'AAA-1'),
				ship('0x4', 'scout', 'X', 'Zed'),
				ship('0x5', 'hauler', 'Y', 'Alpha'),
			],
			lookups
		);
		expect(list.map((x) => x.label)).toEqual(['Alpha', 'Zed', 'ZZZ-9', 'AAA-1', 'BBB-2']);
		expect(list[0]).toEqual({
			key: 'own-0x5',
			label: 'Alpha',
			model: models['hauler'],
			sector: 'a',
			sectorName: 'A',
			travel: { speed: 3000, charge: 10 },
		});
	});

	it('takes the travel speed from the installed engine, else the model', () => {
		const [fast, plain] = OwnShipList.build(
			[ship('0x1', 'scout', 'A', 'A', 'fast'), ship('0x2', 'scout', 'B', 'B', 'unknown')],
			lookups
		);
		expect(fast.travel).toEqual({ speed: 9000, charge: 4 });
		expect(plain.travel).toEqual({ speed: 5000, charge: 2 });
	});

	it('resolves game text names and falls back to the code for unknown ones', () => {
		const list = OwnShipList.build(
			[ship('0x1', 'scout', 'AAA-1', '{20101,22504}'), ship('0x2', 'scout', 'BBB-2', '{1,2}')],
			lookups
		);
		expect(list.map((x) => x.label)).toEqual(['Raven Prototype', 'BBB-2']);
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
