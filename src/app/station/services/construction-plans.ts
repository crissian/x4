import * as convert from 'xml-js';
import { Layout, ModuleConfig } from '../../shared/services/module-config';
import { ModuleService } from '../../shared/services/module.service';

interface EntryAttribute {
	macro: string;
}

interface Entry {
	_attributes: EntryAttribute;
}

interface PlanAttribute {
	name: string;
}

interface Plan {
	_attributes: PlanAttribute;
	entry: Entry | Entry[];
}

interface PlanList {
	plan: Plan | Plan[];
}

interface ConstructionPlan {
	plans: PlanList;
}

/** The player headquarters is a landmark module; the calculator models it with the Headquarters setting. */
export const PLAYER_HQ_MACRO = 'landmarks_player_hq_01_research_macro';

export interface ImportResult {
	error: string | null;
	layouts: string[];
}

export function compareNames(a: string, b: string): number {
	return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
}

function toArray<T>(value: T | T[]): T[] {
	if (value == null) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

function toLayouts(result: ConstructionPlan, moduleService: Pick<ModuleService, 'getModulesByMacro'>): Layout[] {
	const layouts: Layout[] = [];

	for (const plan of toArray(result.plans.plan)) {
		const entries = toArray(plan.entry);
		if (entries.length === 0) {
			continue;
		}

		const modules: ModuleConfig[] = [];
		let isHeadquarters = false;
		for (const item of entries) {
			const macro = item._attributes.macro;
			if (macro?.toLowerCase() === PLAYER_HQ_MACRO) {
				isHeadquarters = true;
				continue;
			}

			const [module] = moduleService.getModulesByMacro(macro);
			if (module) {
				const existing = modules.find((x) => x.moduleId === module.id);
				if (!existing) {
					modules.push({ moduleId: module.id, count: 1 });
				} else {
					existing.count++;
				}
			}
		}

		const layout: Layout = { name: plan._attributes?.name || 'Imported Plan', config: modules };
		if (isHeadquarters) {
			layout.isHeadquarters = true;
		}
		layouts.push(layout);
	}

	return layouts;
}

/**
 * Imports the plans of an X4 `constructionplans.xml` file, or a single plan exported to the `constructionplan`
 * folder, into the saved layouts. The returned layout names are sorted alphabetically.
 */
export function importConstructionPlans(
	xml: string,
	moduleService: Pick<ModuleService, 'getModulesByMacro'>,
	saveLayout: (layout: Layout) => void
): ImportResult {
	let layouts: string[] = [];
	let error: string | null = null;

	try {
		const result = convert.xml2js(xml, { compact: true }) as ConstructionPlan;
		layouts = toLayouts(result, moduleService).map((layout) => {
			saveLayout(layout);
			return layout.name;
		});
		layouts.sort(compareNames);
	} catch {
		error = 'Failed to import layouts';
	}

	return { error, layouts };
}
