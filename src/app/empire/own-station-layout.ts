import type { Params } from '@angular/router';
import type { StationFlowCalculator, StationFlowInput } from '../economy/station-flow-calculator';
import type { SaveOwnStation, SaveStationModule } from '../savegame/empire/save-empire-model';
import type { ModuleRow } from '../station/components/station-calculator.model';
import { StationLayoutLink } from '../station/station-layout-link';

/** A player station of the save as the station calculator sees it: its built modules, workers and sunlight. */
export interface OwnStationLayout {
	/** the built modules the site knows, as calculator rows */
	rows: ModuleRow[];
	/** built modules the site doesn't know (e.g. the headquarters' own module), by macro id */
	unknown: SaveStationModule[];
	/** how many modules are still being built (not in `rows`) */
	building: number;
	/** the workers the save gives the station; 0 without workforce */
	workforce: number;
	/** of the station's sector, in percent */
	sunlight: number;
	/** query params of the station calculator link */
	calculator: Params;
	/** what the station's hourly flows are calculated from */
	flows: StationFlowInput;
}

/** Builds the calculator layout of a player station from the empire data and the map data's workforce. */
export class OwnStationLayouts {
	/**
	 * @param workforce workers by race of the station's `workforces` in the save; absent when the station has none
	 *   (the save only has it for stations with habitats)
	 */
	static of(
		own: SaveOwnStation,
		workforce: Readonly<Record<string, number>> | undefined,
		calculator: StationFlowCalculator
	): OwnStationLayout {
		const built = own.modules ?? [];
		const rows: ModuleRow[] = [];
		const unknown: SaveStationModule[] = [];
		for (const module of built) {
			const moduleId = calculator.moduleId(module.macro);
			if (moduleId) {
				rows.push({ moduleId, count: module.count });
			} else {
				unknown.push(module);
			}
		}
		const workers = Object.values(workforce ?? {}).reduce((sum, x) => sum + x, 0);
		const sunlight = calculator.sunlightOf(own.sector);
		return {
			rows,
			unknown,
			building: own.building ?? 0,
			workforce: workers,
			sunlight,
			calculator: StationLayoutLink.params(rows, sunlight, workers),
			flows: {
				modules: built.map((x) => x.macro),
				moduleCounts: built.map((x) => x.count),
				workforce: workforce ? { ...workforce } : undefined,
				sector: own.sector,
			},
		};
	}
}
