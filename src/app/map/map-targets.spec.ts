import { describe, expect, it } from 'vitest';
import { MapTargets } from './map-targets';

describe('MapTargets', () => {
	it('finds the sector id on the target or its closest ancestor', () => {
		const group = document.createElement('div');
		group.setAttribute('data-sector', 'cluster_01_sector001');
		const child = document.createElement('span');
		group.appendChild(child);
		const event = new Event('click');
		Object.defineProperty(event, 'target', { value: child });
		expect(MapTargets.sectorId(event)).toBe('cluster_01_sector001');
	});

	it('is undefined outside a sector or without a target', () => {
		const event = new Event('click');
		Object.defineProperty(event, 'target', { value: document.createElement('div') });
		expect(MapTargets.sectorId(event)).toBeUndefined();
		expect(MapTargets.sectorId(new Event('click'))).toBeUndefined();
	});
});
