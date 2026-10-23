import { describe, expect, it } from 'vitest';
import { MapBuyOptions } from './map-buy-options';

describe('MapBuyOptions', () => {
	it('lists the ships by size, then the equipment by type, each by name, with the kind as detail', () => {
		const options = MapBuyOptions.build(
			[
				{ id: 'l_b', name: 'Behemoth', size: 'Large' },
				{ id: 's_n', name: 'Nova', size: 'Small' },
				{ id: 'l_a', name: 'Atlas', size: 'Large' },
			],
			[
				{ id: 'shield', name: 'Shield Mk1', type: 'Shields' },
				{ id: 'engine', name: 'Engine Mk1', type: 'Engines' },
				{ id: 'other', name: 'Gadget' },
			]
		);
		expect(options.map((x) => [x.id, x.name, x.group, x.detail])).toEqual([
			['ship:s_n', 'Nova', 'Ships, Small', 'ship, Small'],
			['ship:l_a', 'Atlas', 'Ships, Large', 'ship, Large'],
			['ship:l_b', 'Behemoth', 'Ships, Large', 'ship, Large'],
			['equipment:engine', 'Engine Mk1', 'Engines', 'Engines'],
			['equipment:other', 'Gadget', 'equipment', 'equipment'],
			['equipment:shield', 'Shield Mk1', 'Shields', 'Shields'],
		]);
	});
});
