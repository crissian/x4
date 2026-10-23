import { EnumLabels } from '../core/enum-labels';
import { EquipmentType } from '../shared/services/data/equipment-type-data';
import { ModuleTypes } from '../shared/services/data/module-types-data';
import { Size } from '../shared/services/data/size-data';
import type { BlueprintCategory, BlueprintKind } from './blueprint-model';

/** The progress categories: module types, ship sizes and equipment types. */
export class BlueprintCategories {
	private static readonly MODULES: Record<string, string> = {
		[ModuleTypes.production]: 'production',
		[ModuleTypes.processingmodule]: 'production',
		[ModuleTypes.habitation]: 'habitation',
		[ModuleTypes.storage]: 'storage',
		[ModuleTypes.dockarea]: 'docks',
		[ModuleTypes.pier]: 'docks',
		[ModuleTypes.defencemodule]: 'defence',
		[ModuleTypes.buildmodule]: 'build',
		[ModuleTypes.connectionmodule]: 'connection',
	};
	/** enum key (used in ids, so in URLs) and value */
	private static readonly SIZES = Object.entries(Size);
	/** software is not a blueprint the representatives sell */
	private static readonly EQUIPMENT = (
		['weapons', 'turrets', 'shields', 'engines', 'thrusters', 'missiles', 'drones', 'countermeasures'] as const
	).map((key) => [key, EquipmentType[key]] as const);

	/** In display order. */
	static readonly ALL: readonly BlueprintCategory[] = [
		BlueprintCategories.category('module', 'production', $localize`:blueprint category:Production`),
		BlueprintCategories.category('module', 'habitation', $localize`:blueprint category:Habitats`),
		BlueprintCategories.category('module', 'storage', $localize`:blueprint category:Storage`),
		BlueprintCategories.category('module', 'docks', $localize`:blueprint category:Docks and piers`),
		BlueprintCategories.category('module', 'defence', $localize`:blueprint category:Defence`),
		BlueprintCategories.category('module', 'build', $localize`:blueprint category:Build modules`),
		BlueprintCategories.category('module', 'connection', $localize`:blueprint category:Connections`),
		BlueprintCategories.category('module', 'other', $localize`:blueprint category:Other modules`),
		...BlueprintCategories.SIZES.map(([key, x]) => BlueprintCategories.category('ship', key, EnumLabels.label(x))),
		...BlueprintCategories.EQUIPMENT.map(([key, x]) =>
			BlueprintCategories.category('equipment', key, EnumLabels.label(x))
		),
	];

	private static readonly BY_ID = new Map(BlueprintCategories.ALL.map((x) => [x.id, x]));

	/** `all` labels the filter of every category of the kind. */
	static readonly KINDS: readonly { kind: BlueprintKind; label: string; all: string }[] = [
		{
			kind: 'module',
			label: $localize`:blueprint kind:Station modules`,
			all: $localize`:blueprint kind:All station modules`,
		},
		{ kind: 'ship', label: $localize`:blueprint kind:Ships`, all: $localize`:blueprint kind:All ships` },
		{
			kind: 'equipment',
			label: $localize`:blueprint kind:Equipment`,
			all: $localize`:blueprint kind:All equipment`,
		},
	];

	static get(id: string): BlueprintCategory | undefined {
		return BlueprintCategories.BY_ID.get(id);
	}

	/** Whether a category filter is a category id or a kind (all its categories); empty is valid too. */
	static isFilter(filter: string): boolean {
		return (
			!filter || BlueprintCategories.BY_ID.has(filter) || BlueprintCategories.KINDS.some((x) => x.kind === filter)
		);
	}

	/** Whether a category passes a category filter: empty for all, a category id or a kind. */
	static includes(filter: string, category: string): boolean {
		return !filter || filter === category || BlueprintCategories.BY_ID.get(category)?.kind === filter;
	}

	static module(type: string): string {
		return `module-${BlueprintCategories.MODULES[type] ?? 'other'}`;
	}

	static ship(size: string): string | undefined {
		const key = BlueprintCategories.SIZES.find(([, x]) => x === size)?.[0];
		return key && `ship-${key}`;
	}

	/** undefined for software and unknown types */
	static equipment(type: string | undefined): string | undefined {
		const key = BlueprintCategories.EQUIPMENT.find(([, x]) => x === type)?.[0];
		return key && `equipment-${key}`;
	}

	private static category(kind: BlueprintKind, key: string, label: string): BlueprintCategory {
		return { id: `${kind}-${key}`, kind, label };
	}
}
