import { describe, expect, it } from 'vitest';
import { BlueprintProgress } from './blueprint-progress';
import { BlueprintTesting as T } from './blueprint-testing';

describe('BlueprintProgress', () => {
	const items = [
		{ ...T.item('weapon_b', []), name: 'B' },
		{ ...T.item('weapon_a', []), name: 'A' },
		{ ...T.item('weapon_c', []), name: 'C' },
		{ ...T.item('shield_a', []), category: 'equipment-shields' },
	];
	const owned = new Set(['weapon_c', 'paintmod_0001', 'mod_weapon_01']);

	it('counts owned and total per category, in category order, with the missing ones by name', () => {
		const result = BlueprintProgress.build(items, owned);
		expect(result.categories.map((x) => [x.category.id, x.owned, x.total])).toEqual([
			['equipment-weapons', 1, 3],
			['equipment-shields', 0, 1],
		]);
		expect(result.categories[0].missing.map((x) => x.id)).toEqual(['weapon_a', 'weapon_b']);
		expect(result.owned).toBe(1);
		expect(result.total).toBe(4);
	});

	it('counts owned blueprints the catalog does not track as other', () => {
		expect(BlueprintProgress.build(items, owned).other).toBe(2);
	});
});
