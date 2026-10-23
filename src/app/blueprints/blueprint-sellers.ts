import type { BlueprintGift } from '../shared/services/data/blueprint-rules-data';
import type { Faction } from '../shared/services/model/model';
import type { BlueprintItem, BlueprintSeller } from './blueprint-model';

/** What decides who sells a blueprint, from `BlueprintRules` and the save. */
export interface SellerRules {
	/** looks up the full faction, with its licences */
	faction: (id: string) => Faction | undefined;
	/** ids of the factions that sell no blueprints */
	noSale: readonly string[];
	/** ids of the blueprints without owners, which every faction representative sells */
	soldByAll: ReadonlySet<string>;
	/** ids of the factions selling blueprints, for saves that don't say which factions have a representative */
	sellingFactions: readonly string[];
	/** ids of the factions with a representative in the save; unknown for older saves */
	representatives?: ReadonlySet<string>;
}

/**
 * The factions whose representatives sell a blueprint: its owners, or every representative for a blueprint without
 * owners. Left out are the factions that sell no blueprints, those without a representative in the save and those
 * lacking the licence the item asks for (any licence when it asks for none; the Xenon have none).
 */
export class BlueprintSellers {
	static of(item: Pick<BlueprintItem, 'id' | 'owners' | 'license'>, rules: SellerRules): BlueprintSeller[] {
		const owners = item.owners?.length
			? item.owners
			: rules.soldByAll.has(item.id)
				? BlueprintSellers.everyone(rules)
				: [];
		const type = item.license;
		return owners
			.filter((owner) => !rules.noSale.includes(owner.id))
			.filter((owner) => !rules.representatives || rules.representatives.has(owner.id))
			.map((owner) => rules.faction(owner.id) ?? owner)
			.filter((x) => (type ? x.licenses?.some((l) => l.type === type) : !!x.licenses?.length))
			.map((x) => ({ faction: x, license: type ? x.licenses?.find((l) => l.type === type) : undefined }));
	}

	/** The faction that gifts a blueprint at a reputation ceremony, with that ceremony's licence; undefined for none. */
	static gift(
		gift: BlueprintGift | undefined,
		faction: (id: string) => Faction | undefined
	): BlueprintSeller | undefined {
		const giver = gift && faction(gift.faction);
		if (!giver) {
			return undefined;
		}
		const type = `ceremony${gift.ceremony}`;
		return { faction: giver, license: giver.licenses?.find((l) => l.type === type), gift: true };
	}

	private static everyone(rules: SellerRules): Faction[] {
		const ids = rules.representatives ? [...rules.representatives] : rules.sellingFactions;
		return ids
			.map((id) => rules.faction(id))
			.filter((x): x is Faction => !!x)
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}
