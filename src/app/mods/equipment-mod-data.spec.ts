import { describe, expect, it } from 'vitest';
import { EquipmentModData } from '../shared/services/data/equipment-mods-data';

describe('EquipmentModData', () => {
	const stats = new Set(EquipmentModData.stats.map((x) => x.id));
	const items = new Set(EquipmentModData.items.map((x) => x.id));

	it('names every stat the mods change', () => {
		const used = EquipmentModData.mods.flatMap((x) => [x.effect, ...(x.bonus?.effects ?? [])]).map((x) => x.stat);
		expect(used.filter((x) => !stats.has(x))).toEqual([]);
	});

	it('knows every ingredient of the recipes as a crafting item', () => {
		const ingredients = [...EquipmentModData.mods, ...EquipmentModData.items]
			.flatMap((x) => x.ingredients ?? [])
			.map((x) => x.ware);
		expect(ingredients.filter((x) => !items.has(x))).toEqual([]);
	});

	it('has mods of every slot and quality', () => {
		const slots = new Set(EquipmentModData.mods.map((x) => x.slot));
		const qualities = new Set(EquipmentModData.mods.map((x) => x.quality));
		expect([...slots].sort()).toEqual(['engine', 'shield', 'ship', 'weapon']);
		expect([...qualities].sort()).toEqual([1, 2, 3]);
	});
});
