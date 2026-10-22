import { EnumLabels } from '../core/enum-labels';
import { ModuleTypes } from '../shared/services/data/module-types-data';

/** A module of a save station, with how many the station has and its type when the site data knows it. */
export interface StationModuleLine {
	id: string;
	count: number;
	name: string;
	/** module page id, when the site data has the module */
	link?: string;
	type?: ModuleTypes;
}

export interface StationModuleGroup {
	id: string;
	label: string;
	/** modules in the group, counting each one `count` times */
	total: number;
	modules: StationModuleLine[];
}

/** Groups the modules of a station by kind, in a fixed order; empty groups are left out. */
export class StationModuleGroups {
	/** The groups in display order, with the module types they hold; `other` takes the rest. */
	private static readonly KINDS: { id: string; label: () => string; types: ModuleTypes[] }[] = [
		{ id: 'production', label: () => EnumLabels.label(ModuleTypes.production), types: [ModuleTypes.production] },
		{
			id: 'processing',
			label: () => EnumLabels.label(ModuleTypes.processingmodule),
			types: [ModuleTypes.processingmodule, ModuleTypes.recycling],
		},
		{ id: 'storage', label: () => EnumLabels.label(ModuleTypes.storage), types: [ModuleTypes.storage] },
		{ id: 'habitat', label: () => EnumLabels.label(ModuleTypes.habitation), types: [ModuleTypes.habitation] },
		{ id: 'docks', label: () => $localize`Docks and piers`, types: [ModuleTypes.dockarea, ModuleTypes.pier] },
		{ id: 'defence', label: () => EnumLabels.label(ModuleTypes.defencemodule), types: [ModuleTypes.defencemodule] },
		{
			id: 'connection',
			label: () => EnumLabels.label(ModuleTypes.connectionmodule),
			types: [ModuleTypes.connectionmodule],
		},
		{ id: 'other', label: () => $localize`Other`, types: [] },
	];

	static group(modules: readonly StationModuleLine[]): StationModuleGroup[] {
		return StationModuleGroups.KINDS.flatMap((kind) => {
			const lines = modules.filter((x) => StationModuleGroups.kindOf(x.type) === kind.id);
			return lines.length
				? [
						{
							id: kind.id,
							label: kind.label(),
							total: lines.reduce((sum, x) => sum + x.count, 0),
							modules: lines,
						},
					]
				: [];
		});
	}

	private static kindOf(type: ModuleTypes | undefined): string {
		return StationModuleGroups.KINDS.find((x) => type && x.types.includes(type))?.id ?? 'other';
	}
}
