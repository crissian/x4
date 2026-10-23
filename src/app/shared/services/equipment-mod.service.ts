import { Injectable } from '@angular/core';
import { EquipmentModData } from './data/equipment-mods-data';
import { EntityStore } from './entity.service';
import type { CraftingItem, EquipmentMod, ModStat, NamedId } from './model/equipment-mod';

/** The equipment mods, with the names of their stats, qualities, ware sources and research. */
@Injectable({ providedIn: 'root' })
export class EquipmentModService extends EntityStore<EquipmentMod> {
	readonly stats: readonly ModStat[] = EquipmentModData.stats;
	readonly qualities: readonly NamedId<number>[] = EquipmentModData.qualities;
	readonly sources: readonly NamedId<number>[] = EquipmentModData.sources;

	private readonly statById = new Map(EquipmentModData.stats.map((x) => [x.id, x]));
	private readonly qualityById = new Map(EquipmentModData.qualities.map((x) => [x.id, x.name]));
	private readonly sourceById = new Map(EquipmentModData.sources.map((x) => [x.id, x.name]));
	private readonly researchById = new Map(EquipmentModData.research.map((x) => [x.id, x.name]));

	constructor() {
		super(EquipmentModData.mods);
	}

	stat(id: string): ModStat | undefined {
		return this.statById.get(id);
	}

	quality(quality: number): string {
		return this.qualityById.get(quality) ?? String(quality);
	}

	source(id: number): string {
		return this.sourceById.get(id) ?? String(id);
	}

	research(id: string): string {
		return this.researchById.get(id) ?? id;
	}
}

/** The inventory items crafting takes or makes: mod parts, spacesuit items, bribes... */
@Injectable({ providedIn: 'root' })
export class CraftingItemService extends EntityStore<CraftingItem> {
	constructor() {
		super(EquipmentModData.items);
	}
}
