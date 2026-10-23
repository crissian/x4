import { Signal, computed } from '@angular/core';
import { GameText } from '../../core/game-text';
import { LazyValue } from '../../core/lazy-value';

/** Kinds of entities with encyclopedia descriptions in their own lazily loaded data file. */
export type DescriptionKind = 'ships' | 'equipment' | 'modules' | 'wares' | 'sectors' | 'clusters' | 'crafting';

interface DescriptionFile {
	/** the texts file of the data file, fetched along with it */
	texts: string;
	load: () => Promise<Record<string, string>>;
}

/**
 * Encyclopedia descriptions by entity id. They are only shown on detail pages, so each kind is loaded
 * (and its texts translated) when a page asks for it, keeping them out of the lists and tools.
 */
export class Descriptions {
	private static readonly FILES: Record<DescriptionKind, DescriptionFile> = {
		ships: {
			texts: 'ship-descriptions',
			load: () => import('./data/ship-descriptions-data').then((x) => x.ShipDescriptions),
		},
		equipment: {
			texts: 'equipment-descriptions',
			load: () => import('./data/equipment-descriptions-data').then((x) => x.EquipmentDescriptions),
		},
		modules: {
			texts: 'module-descriptions',
			load: () => import('./data/module-descriptions-data').then((x) => x.ModuleDescriptions),
		},
		wares: {
			texts: 'ware-descriptions',
			load: () => import('./data/ware-descriptions-data').then((x) => x.WareDescriptions),
		},
		sectors: {
			texts: 'sector-descriptions',
			load: () => import('./data/sector-descriptions-data').then((x) => x.SectorDescriptions),
		},
		clusters: {
			texts: 'cluster-descriptions',
			load: () => import('./data/cluster-descriptions-data').then((x) => x.ClusterDescriptions),
		},
		crafting: {
			texts: 'crafting-descriptions',
			load: () => import('./data/crafting-descriptions-data').then((x) => x.CraftingDescriptions),
		},
	};

	/**
	 * The description of the entity `id` names; undefined while loading or when it has none.
	 * Call in an injection context, e.g. a component field.
	 */
	static of(kind: DescriptionKind, id: () => string | undefined): Signal<string | undefined> {
		const file = Descriptions.FILES[kind];
		const descriptions = new LazyValue(
			() => true,
			() => GameText.withTexts([file.texts], file.load)
		);
		return computed(() => {
			const key = id();
			return key ? descriptions.value()?.[key] : undefined;
		});
	}
}
