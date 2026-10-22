import { GameTextRef } from '../../core/game-text-ref';
import type { StationTypeId } from '../../shared/services/constants';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import type { SaveStation } from './save-map-model';

export type { StationTypeId };

export interface StationModuleInfo {
	/** `ModuleTypes` value, e.g. 'Build Module', 'Defense Module', 'Production', 'Processing' */
	type: string;
	macro: string;
	/** ware ids */
	product: string[];
}

export class StationTypes {
	/**
	 * `{20102,x}` base names of the defence platforms and stations (page 20102 entries whose English name is a
	 * defence platform or station). Ids rather than text: runtime texts may be translated.
	 */
	private static readonly DEFENCE_BASENAMES = new Set([
		1041, 1101, 1201, 1301, 1401, 1601, 1701, 1801, 1901, 2201, 6001, 6101, 6201, 6301, 6401, 6501, 6701,
	]);

	/** `modules` looks a (lowercase) module id up. */
	constructor(private readonly modules: (id: string) => StationModuleInfo | undefined) {}

	/** The module ids of a station, lowercased: the one place that normalises them. */
	static moduleIds(station: SaveStation): string[] {
		return station.modules.map((id) => id.toLowerCase());
	}

	static isProducing(info: StationModuleInfo | undefined): boolean {
		return info?.type === ModuleTypes.production || info?.type === ModuleTypes.processingmodule;
	}

	/** Station type from its macro and modules. A wreck is never a seller, so it is always 'other'. */
	of(station: SaveStation): StationTypeId {
		if (station.state === 'wreck') {
			return 'other';
		}
		if (station.macro.includes('piratebase')) {
			return 'piratebase';
		}
		if (station.macro.includes('tradestation')) {
			return 'tradestation';
		}
		const ids = StationTypes.moduleIds(station);
		if (ids.some((id) => /^buildmodule_.*_ships_x?l(_|$)/.test(id))) {
			return 'shipyard';
		}
		if (ids.some((id) => /^buildmodule_.*_ships_[ms](_|$)/.test(id))) {
			return 'wharf';
		}
		if (ids.some((id) => /^buildmodule_.*_equip/.test(id))) {
			return 'equipmentdock';
		}
		const infos = ids.map((id) => this.modules(id));
		const producing = infos.some(StationTypes.isProducing);
		if (
			!producing &&
			(infos.some((i) => i?.type === ModuleTypes.defencemodule) ||
				StationTypes.isDefenceBasename(station.basename))
		) {
			return 'defence';
		}
		return producing ? 'factory' : 'other';
	}

	private static isDefenceBasename(basename: string | undefined): boolean {
		const ref = GameTextRef.parse(basename ?? '');
		return ref?.page === 20102 && StationTypes.DEFENCE_BASENAMES.has(ref.id);
	}
}
