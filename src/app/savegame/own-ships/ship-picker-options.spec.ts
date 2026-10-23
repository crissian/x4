import { describe, expect, it } from 'vitest';
import type { ShipListItem } from '../../shared/services/model/model';
import type { OwnShip } from './own-ship-list';
import { ShipPickerOptions } from './ship-picker-options';

describe('ShipPickerOptions', () => {
	const own = (key: string, label: string, size: string, count = 1): OwnShip => ({
		key,
		label,
		named: true,
		count,
		keys: [key],
		model: { id: `ship_${size}`, name: `Model ${size}`, size } as ShipListItem,
		sector: 'a',
		sectorName: 'Argon Prime',
	});

	it('groups the own ships by size, smallest first, keeping their order within a size', () => {
		const options = ShipPickerOptions.own(
			[
				own('own-1', 'Zed', 'Large'),
				own('own-2', 'Alpha', 'Small'),
				own('own-3', 'Beta', 'Large'),
				own('own-4', 'Gamma', 'Medium'),
			],
			(x) => `${x.model.name} · ${x.sectorName}`
		);
		expect(options.map((x) => [x.id, x.group])).toEqual([
			['own-2', 'Your ships, Small'],
			['own-4', 'Your ships, Medium'],
			['own-1', 'Your ships, Large'],
			['own-3', 'Your ships, Large'],
		]);
		expect(options[0]).toEqual({
			id: 'own-2',
			name: 'Alpha',
			group: 'Your ships, Small',
			detail: 'Model Small · Argon Prime',
		});
	});

	it('shows how many ships a merged entry stands for', () => {
		const [options] = ShipPickerOptions.own([own('own-1', 'Magnetar', 'Large', 5)], () => '');
		expect(options.name).toBe('Magnetar ×5');
	});

	it('lists the models under one header', () => {
		const options = ShipPickerOptions.models([{ id: 'ship_a', name: 'Mercury' }], () => 'Medium');
		expect(options).toEqual([{ id: 'ship_a', name: 'Mercury', group: 'Ship models', detail: 'Medium' }]);
	});

	it('describes own ships and models by model, hold, sector and size', () => {
		const ship = own('own-1', 'Alpha', 'Small');
		expect(ShipPickerOptions.ownDetail(ship)).toBe('Model Small · Argon Prime');
		expect(ShipPickerOptions.ownDetail(ship, 6000)).toBe('Model Small, 6,000 m³ · Argon Prime');
		const unnamed = { ...ship, named: false };
		expect(ShipPickerOptions.ownDetail(unnamed)).toBe('Argon Prime');
		expect(ShipPickerOptions.ownDetail(unnamed, 500)).toBe('500 m³ · Argon Prime');
		expect(ShipPickerOptions.modelDetail({ size: 'Medium' })).toBe('Medium');
		expect(ShipPickerOptions.modelDetail({ size: 'Medium' }, 6000)).toBe('Medium, 6,000 m³');
	});
});
