import { describe, expect, it } from 'vitest';
import type { OwnShip } from '../../savegame/own-ships/own-ship-list';
import type { ShipListItem, Ware } from '../../shared/services/model/model';
import { Mining } from '../mining';
import { MinerPicker } from './miner-picker';

const ore = { id: 'ore', name: 'Ore', volume: 10, transport: 'Solid' } as Ware;
const hydrogen = { id: 'hydrogen', name: 'Hydrogen', volume: 6, transport: 'Liquid' } as Ware;

function model(id: string, purpose: string, hold: number, type: string, size = 'Medium'): ShipListItem {
	return {
		id,
		name: id,
		size,
		purpose,
		cargo: [{ max: hold, types: [{ id: type, name: type }] }],
		travel: { speed: 3000, charge: 10 },
	} as unknown as ShipListItem;
}

const solidM = model('solid_m', 'Mine', 5000, 'solid');
const solidL = model('solid_l', 'Mine', 20000, 'solid', 'Large');
const gasM = model('gas_m', 'Mine', 6000, 'liquid');
const trader = model('trader', 'Trade', 9000, 'solid');

function own(key: string, ship: ShipListItem, named = false): OwnShip {
	return {
		key,
		label: named ? `Named ${key}` : ship.name,
		named,
		count: 1,
		keys: [key],
		model: ship,
		sector: 'a',
		sectorName: 'Ore Belt',
		travel: { speed: 4200, charge: 8 },
	} as OwnShip;
}

describe('MinerPicker', () => {
	const ships = [own('own-1', solidM), own('own-2', gasM), own('own-3', trader), own('own-4', solidL, true)];

	it('offers the own ships that mine the ware, largest hold first', () => {
		const own = (ware: Ware) => Mining.minersAmong(ships, ware, (x) => x.model).map((x) => x.key);
		expect(own(ore)).toEqual(['own-4', 'own-1']);
		expect(own(hydrogen)).toEqual(['own-2']);
	});

	it('lists the own miners by size, then the models, with hold and sector to search', () => {
		const options = MinerPicker.options(
			Mining.minersAmong(ships, ore, (x) => x.model),
			[solidL, solidM],
			ore
		);
		expect(options.map((x) => [x.id, x.group, x.detail])).toEqual([
			['own-1', 'Your ships, Medium', '5,000 m³ · Ore Belt'],
			['own-4', 'Your ships, Large', 'solid_l, 20,000 m³ · Ore Belt'],
			['solid_l', 'Ship models', 'Large, 20,000 m³'],
			['solid_m', 'Ship models', 'Medium, 5,000 m³'],
		]);
	});

	it('finds an own miner as its model with its name and engines, or a model', () => {
		const miner = MinerPicker.find('own-4', ships, [solidM]);
		expect(miner?.id).toBe('solid_l');
		expect(miner?.name).toBe('Named own-4');
		expect(miner?.travel?.speed).toBe(4200);
		expect(miner?.own?.key).toBe('own-4');
		expect(MinerPicker.find('solid_m', ships, [solidM])).toBe(solidM);
		expect(MinerPicker.find('own-9', ships, [solidM])).toBeUndefined();
	});
});
