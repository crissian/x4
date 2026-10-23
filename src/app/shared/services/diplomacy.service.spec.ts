import { describe, expect, it } from 'vitest';
import { DiplomacyService } from './diplomacy.service';

describe('DiplomacyService', () => {
	const service = new DiplomacyService();

	it('finds the highest experience level at or below a value', () => {
		const levels = [
			{ value: 0, name: 'A' },
			{ value: 10, name: 'B' },
			{ value: 20, name: 'C' },
		];
		expect(DiplomacyService.level(levels, 0)?.name).toBe('A');
		expect(DiplomacyService.level(levels, 19)?.name).toBe('B');
		expect(DiplomacyService.level(levels, 20)?.name).toBe('C');
		expect(DiplomacyService.level(levels, -1)).toBeUndefined();
	});

	it('lists the gift wares of an action by its gift tags', () => {
		const action = service.getEntity('negotiate_ceasefire')!;
		const wares = service.giftWares(action);
		expect(wares.length).toBe(service.catalog.wareTags['bribe'].length);
		expect(service.giftWares({ ...action, cost: { ...action.cost, giftTags: undefined } })).toEqual([]);
	});

	it('lists the actions that exclude a faction by its tags', () => {
		const xenon = service.excluding('xenon').map((x) => x.id);
		expect(xenon).toContain('negotiate_ceasefire');
		expect(xenon).not.toContain('cultivate_influence');
		expect(service.excluding('argon')).toEqual([]);
	});

	it('lists the gifts of a faction', () => {
		const gift = service.catalog.gifts[0];
		expect(service.giftsFor(gift.factions[0])).toContain(gift);
		expect(service.giftsFor('nobody')).toEqual([]);
	});
});
