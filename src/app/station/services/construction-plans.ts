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

export interface ImportResult {
	error: string | null;
	layouts: string[];
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
		for (const item of entries) {
			const [module] = moduleService.getModulesByMacro(item._attributes.macro);
			if (module) {
				const existing = modules.find((x) => x.moduleId === module.id);
				if (!existing) {
					modules.push({ moduleId: module.id, count: 1 });
				} else {
					existing.count++;
				}
			}
		}

		layouts.push({ name: plan._attributes?.name || 'Imported Plan', config: modules });
	}

	return layouts;
}

/**
 * Imports the plans of an X4 `constructionplans.xml` file into the saved layouts.
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
	} catch {
		error = 'Failed to import layouts';
	}

	return { error, layouts };
}
