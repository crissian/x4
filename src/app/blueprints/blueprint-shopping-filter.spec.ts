import { describe, expect, it } from 'vitest';
import type { ShoppingList } from './blueprint-model';
import { BlueprintShoppingFilter } from './blueprint-shopping-filter';
import { BlueprintTesting as T } from './blueprint-testing';

describe('BlueprintShoppingFilter', () => {
	const both = T.item('both', [T.ARGON, T.TELADI], undefined, 100);
	const argon = T.item('argon', [T.ARGON], undefined, 50);
	const buy = [both, argon].map((item) => ({ item, sellers: T.sellers(item) }));
	const list: ShoppingList = {
		buy,
		reputation: [{ item: argon, sellers: T.sellers(argon).map((x) => ({ ...x, current: 0, pending: false })) }],
		unsold: [{ item: T.item('unsold', [], undefined, 10), reason: 'research' }],
	};
	const ids = (entries: { item: { id: string } }[]) => entries.map((x) => x.item.id);

	it('keeps everything without filters', () => {
		expect(BlueprintShoppingFilter.apply(list, { faction: '', affordable: false, money: 0 })).toEqual(list);
	});

	it("keeps what a faction sells, that faction's seller first", () => {
		const result = BlueprintShoppingFilter.apply(list, { faction: 'teladi', affordable: false, money: 0 });
		expect(ids(result.buy)).toEqual(['both']);
		expect(result.buy[0].sellers.map((x) => x.faction.id)).toEqual(['teladi', 'argon']);
		expect(result.reputation).toEqual([]);
		expect(result.unsold).toBe(list.unsold);
	});

	it('keeps what the money in the save pays for, when asked', () => {
		const result = BlueprintShoppingFilter.apply(list, { faction: '', affordable: true, money: 99 });
		expect(ids(result.buy)).toEqual(['argon']);
		expect(ids(result.reputation)).toEqual(['argon']);
		expect(ids(result.unsold)).toEqual(['unsold']);
	});

	it('totals the items of each faction by name, and every item once overall', () => {
		expect(BlueprintShoppingFilter.factions(buy).map((x) => [x.faction.id, x.count, x.total])).toEqual([
			['argon', 2, 150],
			['teladi', 1, 100],
		]);
		expect(BlueprintShoppingFilter.summary(buy)).toEqual({ count: 2, total: 150 });
	});
});
