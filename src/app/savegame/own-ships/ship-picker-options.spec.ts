import { describe, expect, it } from 'vitest';
import type { ShipListItem } from '../../shared/services/model/model';
import type { OwnShip } from './own-ship-list';
import { ShipPickerOptions } from './ship-picker-options';

describe('ShipPickerOptions', () => {
	const own = (key: string, label: string, size: string): OwnShip => ({
		key,
		label,
		named: true,
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

	it('lists the models under one header', () => {
		const options = ShipPickerOptions.models([{ id: 'ship_a', name: 'Mercury' }], () => 'Medium');
		expect(options).toEqual([{ id: 'ship_a', name: 'Mercury', group: 'Ship models', detail: 'Medium' }]);
	});
});
