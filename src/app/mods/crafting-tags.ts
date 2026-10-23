import type { CraftingItem, CraftingTag } from '../shared/services/model/equipment-mod';

/** The kinds of crafting items players tell apart, from the game's ware tags. */
export class CraftingTags {
	/** The kind of an item, its most telling tag first; general crafting materials have none. */
	static label(item: CraftingItem): string {
		const tag = CraftingTags.ORDER.find((x) => item.tags.includes(x));
		return tag ? CraftingTags.labels()[tag] : $localize`:crafting item kind:Crafting material`;
	}

	private static readonly ORDER: readonly CraftingTag[] = [
		'primarymodpart',
		'equipmentmodpart',
		'personalupgrade',
		'bribe',
		'gift',
		'missiononly',
	];

	private static labels(): Record<CraftingTag, string> {
		return {
			primarymodpart: $localize`:crafting item kind:Primary mod part`,
			equipmentmodpart: $localize`:crafting item kind:Mod part`,
			personalupgrade: $localize`:crafting item kind:Spacesuit equipment`,
			bribe: $localize`:crafting item kind:Bribe`,
			gift: $localize`:crafting item kind:Gift`,
			missiononly: $localize`:crafting item kind:Mission item`,
		};
	}
}
