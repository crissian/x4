import { describe, expect, it } from 'vitest';
import type { Faction } from '../shared/services/model/model';
import { BlueprintSellers, type SellerRules } from './blueprint-sellers';

describe('BlueprintSellers', () => {
	const licence = { type: 'militaryship', name: 'Military Ship Licence', price: 0, minRelation: 0.1 };
	const general = { type: 'generaluseship', name: 'General Use Ship Licence', price: 0, minRelation: -0.01 };
	const argon = { id: 'argon', name: 'Argon', licenses: [licence, general] } as Faction;
	const teladi = { id: 'teladi', name: 'Teladi', licenses: [general] } as Faction;
	const kaori = { id: 'kaori', name: 'Quettanauts', licenses: [general] } as Faction;
	const xenon = { id: 'xenon', name: 'Xenon', licenses: [] as Faction['licenses'] } as Faction;
	const factions = new Map([argon, teladi, kaori, xenon].map((x) => [x.id, x]));
	const rules = (more: Partial<SellerRules> = {}): SellerRules => ({
		faction: (id) => factions.get(id),
		noSale: [],
		soldByAll: new Set(),
		sellingFactions: [],
		...more,
	});
	const item = (owners: Faction[] | undefined, license?: string, id = 'x') => ({ id, owners, license });
	const ids = (sellers: { faction: Faction }[]) => sellers.map((x) => x.faction.id);

	it('drops the factions that sell no blueprints', () => {
		expect(ids(BlueprintSellers.of(item([argon, kaori]), rules({ noSale: ['kaori'] })))).toEqual(['argon']);
	});

	it('drops the factions without a representative in the save', () => {
		const sellers = BlueprintSellers.of(item([argon, teladi]), rules({ representatives: new Set(['teladi']) }));
		expect(ids(sellers)).toEqual(['teladi']);
	});

	it("keeps the owners holding the item's licence, with that licence", () => {
		const sellers = BlueprintSellers.of(item([{ id: 'argon' } as Faction, teladi], 'militaryship'), rules());
		expect(sellers).toEqual([{ faction: argon, license: licence }]);
	});

	it('drops owners without any licence, like the Xenon', () => {
		expect(ids(BlueprintSellers.of(item([xenon, teladi]), rules()))).toEqual(['teladi']);
	});

	it('has every representative sell a blueprint without owners, else the selling factions', () => {
		const free = (more: Partial<SellerRules>) =>
			ids(
				BlueprintSellers.of(
					item([], undefined, 'thruster'),
					rules({ soldByAll: new Set(['thruster']), ...more })
				)
			);
		expect(free({ sellingFactions: ['teladi', 'argon', 'xenon'] })).toEqual(['argon', 'teladi']);
		expect(free({ representatives: new Set(['teladi', 'kaori']), noSale: ['kaori'] })).toEqual(['teladi']);
	});

	it('returns none without owners otherwise', () => {
		expect(BlueprintSellers.of(item(undefined, 'x'), rules({ sellingFactions: ['argon'] }))).toEqual([]);
	});
});
