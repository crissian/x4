import { describe, expect, it } from 'vitest';
import { MapSaveTesting } from './map-save-testing';
import type { MapSaveStation } from './save/map-save-layer';
import { StationMarkers } from './station-marker';

describe('StationMarkers', () => {
	const shape = {} as MapSaveStation['shape'];
	const placed = (type: MapSaveStation['type'], product?: string): MapSaveStation => ({
		station: MapSaveTesting.station({ product }),
		name: 'Station',
		type,
		faction: undefined,
		player: false,
		known: true,
		shape,
		x: 0,
		y: 0,
	});

	it('gives factories their product and its ware image', () => {
		const marker = StationMarkers.fromSave(placed('factory', 'energycells'));
		expect(marker.product).toBe('energycells');
		expect(marker.productIcon).toBe('assets/images/wares/energycells.webp');
	});

	it('keeps the type icon when the product has no image or the station is no factory', () => {
		expect(StationMarkers.fromSave(placed('factory', 'nosuchware')).productIcon).toBeUndefined();
		expect(StationMarkers.fromSave(placed('factory')).product).toBeUndefined();
		expect(StationMarkers.fromSave(placed('wharf', 'energycells')).product).toBeUndefined();
	});
});
