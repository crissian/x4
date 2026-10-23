import { describe, expect, it } from 'vitest';
import type { SaveLicences, SaveRelations } from '../savegame/map/save-map-model';
import type { BlueprintItem } from './blueprint-model';
import { BlueprintSellers } from './blueprint-sellers';
import { BlueprintShoppingList } from './blueprint-shopping-list';
import { BlueprintTesting as T } from './blueprint-testing';

describe('BlueprintShoppingList', () => {
	const build = (
		items: BlueprintItem[],
		options: {
			owned?: string[];
			licences?: SaveLicences;
			relations?: SaveRelations;
			missionOnly?: string[];
			unlockedBy?: Record<string, 'research' | 'story' | 'ceremony'>;
		} = {}
	) =>
		BlueprintShoppingList.build({
			items,
			owned: new Set(options.owned ?? []),
			licences: options.licences ?? {},
			relations: options.relations ?? {},
			sellers: (x) => T.sellers(x),
			missionOnly: options.missionOnly ?? [],
			unlockedBy: options.unlockedBy ?? {},
			gift: () => undefined,
		});

	it('skips owned blueprints', () => {
		const list = build([T.item('a', [T.ARGON])], { owned: ['a'] });
		expect(list.buy).toEqual([]);
		expect(list.reputation).toEqual([]);
		expect(list.unsold).toEqual([]);
	});

	it('can buy an item without a licence, or from a faction whose licence the player holds', () => {
		const list = build([T.item('free', [T.ARGON]), T.item('mil', [T.ARGON, T.TELADI], 'military')], {
			licences: { military: ['teladi'] },
		});
		expect(list.buy.map((x) => [x.item.id, x.sellers.map((s) => s.faction.id)])).toEqual([
			['free', ['argon']],
			['mil', ['teladi']],
		]);
	});

	it('needs reputation when no seller granted the licence, the smallest gap first', () => {
		// reputation 10 with Argon (relation 0.01) where 20 is needed; 25 with Teladi (0.32) where 25 is needed
		const list = build([T.item('mil', [T.ARGON, T.TELADI], 'military')], {
			relations: { argon: 0.01, teladi: 0.32 },
		});
		expect(list.buy).toEqual([]);
		const [entry] = list.reputation;
		expect(entry.sellers.map((x) => [x.faction.id, x.needed, x.current, x.gap, x.pending])).toEqual([
			['teladi', 25, 25, 0, true],
			['argon', 20, 10, 10, false],
		]);
	});

	it('needs an unknown reputation when the faction lists no such licence', () => {
		const list = build([T.item('x', [T.ARGON], 'unknownlicence')]);
		expect(list.reputation[0].sellers[0]).toMatchObject({ needed: undefined, gap: undefined, pending: false });
	});

	it('lists mission-only items and items only no-sale factions own as not sold, with the reason', () => {
		const list = build(
			[
				T.item('kaori_only', [T.KAORI]),
				T.item('research', []),
				T.item('casino', [T.ARGON]),
				T.item('event', [T.ARGON]),
			],
			{ missionOnly: ['casino', 'event'], unlockedBy: { research: 'research', event: 'research' } }
		);
		expect(list.buy).toEqual([]);
		expect(list.unsold.map((x) => [x.item.id, x.reason])).toEqual([
			['casino', 'story'],
			['event', 'research'],
			['kaori_only', 'unknown'],
			['research', 'research'],
		]);
	});

	it('needs the ceremony reputation for a gift no one sells, until the player has had that ceremony', () => {
		// Argon gifts 'span' at its friend ceremony (relation 0.01, reputation 10); the player is at 7 (relation 0.005)
		const argon = { ...T.ARGON, licenses: [T.licence('ceremonyfriend', 0.01)] };
		const gift = (x: BlueprintItem) =>
			BlueprintSellers.gift(x.id === 'span' ? { faction: 'argon', ceremony: 'friend' } : undefined, () => argon);
		const input = (licences: SaveLicences) => ({
			items: [T.item('span', [T.KAORI])],
			owned: new Set<string>(),
			licences,
			relations: { argon: 0.005 },
			sellers: (x: BlueprintItem) => T.sellers(x),
			missionOnly: [],
			unlockedBy: { span: 'ceremony' as const },
			gift,
		});
		const [entry] = BlueprintShoppingList.build(input({})).reputation;
		const seller = entry.sellers[0];
		expect([entry.item.id, seller.faction.id, seller.gift, seller.needed, seller.gap]).toEqual([
			'span',
			'argon',
			true,
			10,
			3,
		]);
		const had = BlueprintShoppingList.build(input({ ceremonyfriend: ['argon'] }));
		expect(had.reputation).toEqual([]);
		expect(had.unsold.map((x) => [x.item.id, x.reason])).toEqual([['span', 'ceremony']]);
	});
});
