import { Injectable } from '@angular/core';
import { DiplomacyData } from './data/diplomacy-data';
import { EntityStore } from './entity.service';
import type { DiplomacyAction, DiplomacyCatalog, DiplomacyGift, DiplomacyLevel, DiplomacyName } from './model/diplomacy';

/** The agent actions of the diplomacy menu, with the names of their categories, agent types, risks and wares. */
@Injectable({ providedIn: 'root' })
export class DiplomacyService extends EntityStore<DiplomacyAction> {
	readonly catalog: DiplomacyCatalog = DiplomacyData;

	private readonly categoryById = DiplomacyService.byId(DiplomacyData.categories);
	private readonly agentTypeById = DiplomacyService.byId(DiplomacyData.agentTypes);
	private readonly riskById = DiplomacyService.byId(DiplomacyData.risks);
	private readonly wareById = new Map(DiplomacyData.wares.map((x) => [x.id, x.name]));

	constructor() {
		super(DiplomacyData.actions);
	}

	category(id: string): string {
		return this.categoryById.get(id)?.name ?? id;
	}

	agentType(id: string): DiplomacyName | undefined {
		return this.agentTypeById.get(id);
	}

	risk(id: string): DiplomacyName | undefined {
		return this.riskById.get(id);
	}

	ware(id: string): string {
		return this.wareById.get(id) ?? id;
	}

	/** The experience level an experience value has reached: the highest level starting at or below it. */
	experienceLevel(value: number): DiplomacyLevel | undefined {
		return DiplomacyService.level(DiplomacyData.experience, value);
	}

	/** The wares an action takes as its optional gift: those with one of its gift tags. */
	giftWares(action: DiplomacyAction): string[] {
		const tags = action.cost.giftTags ?? [];
		return [...new Set(tags.flatMap((tag) => DiplomacyData.wareTags[tag] ?? []))];
	}

	/** The gifts listed for a faction. */
	giftsFor(faction: string): DiplomacyGift[] {
		return DiplomacyData.gifts.filter((x) => x.factions.includes(faction));
	}

	/** The actions with a target that can't be a faction of the faction's tags. */
	excluding(faction: string): DiplomacyAction[] {
		const tags = Object.entries(DiplomacyData.factionTags)
			.filter(([, factions]) => factions.includes(faction))
			.map(([tag]) => tag);
		return tags.length
			? this.getEntities().filter((x) =>
					x.targets.some((t) => t.excludedFactionTags?.some((tag) => tags.includes(tag)))
				)
			: [];
	}

	static level(levels: readonly DiplomacyLevel[], value: number): DiplomacyLevel | undefined {
		return levels.filter((x) => x.value <= value).at(-1);
	}

	private static byId(names: readonly DiplomacyName[]): Map<string, DiplomacyName> {
		return new Map(names.map((x) => [x.id, x]));
	}
}
