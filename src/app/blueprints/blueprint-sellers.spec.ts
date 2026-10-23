import { describe, expect, it } from 'vitest';
import type { Faction } from '../shared/services/model/model';
import { BlueprintSellers } from './blueprint-sellers';

describe('BlueprintSellers', () => {
	const licence = { type: 'militaryship', name: 'Military Ship Licence', price: 0, minRelation: 0.1 };
	const argon = { id: 'argon', name: 'Argon', licenses: [licence] } as Faction;
	const teladi = { id: 'teladi', name: 'Teladi' } as Faction;
	const kaori = { id: 'kaori', name: 'Quettanauts' } as Faction;
	const factions = new Map([argon, teladi, kaori].map((x) => [x.id, x]));
	const lookup = (id: string) => factions.get(id);

	it('drops the factions that sell no blueprints', () => {
		const sellers = BlueprintSellers.of([argon, kaori], undefined, lookup, ['kaori']);
		expect(sellers.map((x) => x.faction.id)).toEqual(['argon']);
	});

	it("attaches the faction's licence of the item's type", () => {
		const sellers = BlueprintSellers.of([{ id: 'argon' } as Faction, teladi], 'militaryship', lookup, []);
		expect(sellers).toEqual([
			{ faction: argon, license: licence },
			{ faction: teladi, license: undefined },
		]);
	});

	it('returns none without owners', () => {
		expect(BlueprintSellers.of(undefined, 'x', lookup, [])).toEqual([]);
	});
});
