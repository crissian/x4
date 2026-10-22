import { describe, expect, it } from 'vitest';
import { SectorDetailComponent, SectorTab } from './sector-detail.component';

describe('SectorDetailComponent.pickTab', () => {
	const all: SectorTab[] = ['stations', 'connections', 'resources', 'system'];
	const pick = SectorDetailComponent.pickTab;

	it('opens Stations when the sector has stations, or while they load', () => {
		expect(pick(undefined, all, 4)).toBe('stations');
		expect(pick(undefined, all, null)).toBe('stations');
	});

	it('opens Connections when the sector has no stations', () => {
		expect(pick(undefined, all, 0)).toBe('connections');
	});

	it('keeps the tab from the URL, unless the page has no such tab', () => {
		expect(pick('resources', all, 4)).toBe('resources');
		expect(pick('stations', all, 0)).toBe('stations');
		expect(pick('system', ['stations', 'connections', 'resources'], 0)).toBe('connections');
		expect(pick('bogus', all, 2)).toBe('stations');
	});
});
