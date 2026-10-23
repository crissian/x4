import { Research } from '../shared/services/data/research-data';
import type { ResearchData } from './research-model';

/** The research projects unlocking a ware: a module, ship, equipment or mod blueprint. */
export class ResearchUnlocks {
	private static byWare?: Map<string, ResearchData[]>;

	/** The projects unlocking the ware, by sort order; empty when no research does. */
	static of(ware: string | undefined): readonly ResearchData[] {
		if (!ware) {
			return [];
		}
		ResearchUnlocks.byWare ??= ResearchUnlocks.index();
		return ResearchUnlocks.byWare.get(ware) ?? [];
	}

	private static index(): Map<string, ResearchData[]> {
		const result = new Map<string, ResearchData[]>();
		const projects = Object.values(Research).sort((a, b) => a.sortOrder - b.sortOrder);
		for (const project of projects) {
			for (const unlock of project.unlocks) {
				result.set(unlock.id, [...(result.get(unlock.id) ?? []), project]);
			}
		}
		return result;
	}
}
