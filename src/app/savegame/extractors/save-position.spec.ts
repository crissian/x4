import { SavePosition } from './save-position';

describe('save position', () => {
	it('keeps a position relative to a predefined zone, in km', () => {
		const zone = { ...SavePosition.zone('Zone002_Cluster_01_Sector001_macro'), isDefault: true, x: 5000, z: 7000 };
		expect(SavePosition.place(zone, 1240, -360)).toEqual({ zone: 'zone002_cluster_01_sector001', x: 1.2, z: -0.4 });
	});

	it('adds the offset of a zone that is not predefined', () => {
		const zone = { ...SavePosition.zone('tempzone'), x: 5000, z: 7000 };
		expect(SavePosition.place(zone, 1240, -360)).toEqual({ x: 6.2, z: 6.6 });
		expect(SavePosition.place(undefined, 1240, -360)).toEqual({ x: 1.2, z: -0.4 });
	});

	it('reads missing or invalid numbers as 0', () => {
		expect(SavePosition.num('12.5')).toBe(12.5);
		expect(SavePosition.num(undefined)).toBe(0);
		expect(SavePosition.num('x')).toBe(0);
	});
});
