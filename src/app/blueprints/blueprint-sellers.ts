import type { BlueprintGift } from '../shared/services/data/blueprint-rules-data';
import type { Faction } from '../shared/services/model/model';
import type { BlueprintSeller } from './blueprint-model';

/**
 * The factions whose representatives sell a blueprint: its owners, except those that sell no blueprints and, when the
 * save says which factions have a representative, those without one.
 */
export class BlueprintSellers {
	/**
	 * @param faction looks up the full faction (with its licences) of an owner
	 * @param noSale ids of the factions that sell no blueprints
	 * @param representatives ids of the factions with a representative in the save; unknown for older saves
	 */
	static of(
		owners: readonly Faction[] | undefined,
		license: string | undefined,
		faction: (id: string) => Faction | undefined,
		noSale: readonly string[],
		representatives?: ReadonlySet<string>
	): BlueprintSeller[] {
		return (owners ?? [])
			.filter((owner) => !noSale.includes(owner.id) && (!representatives || representatives.has(owner.id)))
			.map((owner) => faction(owner.id) ?? owner)
			.map((x) => ({ faction: x, license: license ? x.licenses?.find((l) => l.type === license) : undefined }));
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
}
