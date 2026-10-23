import type { Equipment, Faction, License, Ship, StationModule } from '../shared/services/model/model';
import type { BlueprintItem, BlueprintSeller } from './blueprint-model';
import { BlueprintSellers } from './blueprint-sellers';

/** Test fixtures: Argon and Teladi sell with licences, Kaori sells nothing. */
export class BlueprintTesting {
	static licence(type: string, minRelation?: number): License {
		return { type, name: `${type} licence`, price: 0, minRelation };
	}

	static readonly ARGON = {
		id: 'argon',
		name: 'Argon Federation',
		licenses: [BlueprintTesting.licence('military', 0.1), BlueprintTesting.licence('station', 0.01)],
	} as Faction;
	static readonly TELADI = {
		id: 'teladi',
		name: 'Teladi Company',
		licenses: [BlueprintTesting.licence('military', 0.32)],
	} as Faction;
	static readonly KAORI = { id: 'kaori', name: 'Quettanauts' } as Faction;
	static readonly FACTIONS = [BlueprintTesting.ARGON, BlueprintTesting.TELADI, BlueprintTesting.KAORI];

	static item(id: string, owners: Faction[], license?: string, price = 100): BlueprintItem {
		return { id, name: id, kind: 'equipment', category: 'equipment-weapons', price, owners, license };
	}

	static sellers(item: BlueprintItem): BlueprintSeller[] {
		return BlueprintSellers.of(
			item.owners,
			item.license,
			(id) => BlueprintTesting.FACTIONS.find((x) => x.id === id),
			['kaori']
		);
	}

	static module(id: string, type: string, owners: Faction[] = []): StationModule {
		return { id, name: id, type, owners, price: { min: 1, max: 3, avg: 2 } } as StationModule;
	}

	static ship(id: string, size: string): Ship {
		return { id, name: id, size, price: { min: 1, max: 3, avg: 2 } } as Ship;
	}

	static equipment(id: string, type: string): Equipment {
		return { id, name: id, type, price: { min: 1, max: 3, avg: 2 } } as Equipment;
	}
}
