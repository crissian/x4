import type { Equipment, Ship, StationModule } from '../shared/services/model/model';
import { BlueprintCategories } from './blueprint-categories';
import type { BlueprintItem, BlueprintKind } from './blueprint-model';
import { BlueprintPrice } from './blueprint-price';

/** Every blueprint the player can own: the station modules, ships and equipment of the game data. */
export class BlueprintCatalog {
	/**
	 * @param notForPlayer ids the player can never own (`BlueprintRules.notForPlayer`)
	 * @returns the items by kind, then by name; software is left out
	 */
	static build(
		modules: readonly StationModule[],
		ships: readonly Ship[],
		equipment: readonly Equipment[],
		notForPlayer: readonly string[]
	): BlueprintItem[] {
		const excluded = new Set(notForPlayer);
		const items = [
			...modules.map((x) => BlueprintCatalog.item(x, 'module', BlueprintCategories.module(x.type))),
			...ships.map((x) => BlueprintCatalog.item(x, 'ship', BlueprintCategories.ship(x.size))),
			...equipment.map((x) => BlueprintCatalog.item(x, 'equipment', BlueprintCategories.equipment(x.type))),
		];
		const kinds: BlueprintKind[] = ['module', 'ship', 'equipment'];
		return items
			.filter((x): x is BlueprintItem => !!x && !excluded.has(x.id))
			.sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.name.localeCompare(b.name));
	}

	private static item(
		source: StationModule | Ship | Equipment,
		kind: BlueprintKind,
		category: string | undefined
	): BlueprintItem | undefined {
		if (!category) {
			return undefined;
		}
		return {
			id: source.id,
			name: source.name,
			kind,
			category,
			price: BlueprintPrice.of(source.price, kind),
			owners: source.owners,
			license: source.license,
		};
	}
}
