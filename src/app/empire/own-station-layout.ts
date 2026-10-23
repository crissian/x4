import type { Params } from '@angular/router';
import type { StationFlowCalculator, StationFlowInput } from '../economy/station-flow-calculator';
import type { SaveOwnStation, SaveStationModule } from '../savegame/empire/save-empire-model';
import type { SaveStation } from '../savegame/map/save-map-model';
import type { ModuleRow } from '../station/components/station-calculator.model';
import { PlayerHeadquarters } from '../station/player-headquarters';
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
	/** the player headquarters, which needs extra workers (`PlayerHeadquarters`) */
	hq: boolean;
	/** query params of the station calculator link */
	calculator: Params;
	/** what the station's hourly flows are calculated from */
	flows: StationFlowInput;
}

/** Builds the calculator layout of a player station from the empire data and the map data's station. */
export class OwnStationLayouts {
	/**
	 * @param station the map data's station: its macro, and its workers by race from the save's `workforces`, which
	 *   only stations with habitats have
	 */
	static of(
		own: SaveOwnStation,
		station: Pick<SaveStation, 'macro' | 'workforce'>,
		calculator: StationFlowCalculator
	): OwnStationLayout {
		const workforce = station.workforce;
		const hq = PlayerHeadquarters.is(station.macro);
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
			hq,
			calculator: StationLayoutLink.params(rows, sunlight, workers, hq),
			flows: {
				macro: station.macro,
				modules: built.map((x) => x.macro),
				moduleCounts: built.map((x) => x.count),
				workforce: workforce ? { ...workforce } : undefined,
				sector: own.sector,
			},
		};
	}
}
