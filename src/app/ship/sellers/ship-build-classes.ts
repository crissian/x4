import type { SaveStation } from '../../savegame/map/save-map-model';
import { Size } from '../../shared/services/data/size-data';
import type { GodStation } from '../../shared/services/model/model';

/**
 * The ship sizes a station can build, from its build modules (`<builder classes>` in the build module macros):
 * the one place this rule lives.
 */
export class ShipBuildClasses {
	private static readonly ORDER = [Size.small, Size.medium, Size.large, Size.extralarge];
	private static readonly BY_SUFFIX: Record<string, Size> = {
		s: Size.small,
		m: Size.medium,
		l: Size.large,
		xl: Size.extralarge,
	};
	/** Game start shipyards whose construction plan has only the XL build module (`ali_shipyard`, `spl_shipyard_warforge`). */
	private static readonly XL_ONLY = new Set(['shipyard_alliance', 'shipyard_split_warforge_01']);

	/** Sizes built by a module id (lowercase, without `_macro`); none for equipment, carrier and station modules. */
	static ofModule(id: string): Size[] {
		const match = /^buildmodule_([a-z]+)_ships_(s|m|l|xl)(_dockarea_\d+)?$/.exec(id.toLowerCase());
		if (!match) {
			return [];
		}
		const [, race, size, dockArea] = match;
		if (dockArea) {
			// the dock area module every NPC wharf uses builds S and M
			return [Size.small, Size.medium];
		}
		if (race === 'xen' && size === 'xl') {
			return [Size.large, Size.extralarge];
		}
		return [ShipBuildClasses.BY_SUFFIX[size]];
	}

	/** Sizes built by a save station: those of all its modules. */
	static ofSave(station: SaveStation): Size[] {
		const sizes = new Set(station.modules.flatMap((id) => ShipBuildClasses.ofModule(id)));
		return ShipBuildClasses.ORDER.filter((x) => sizes.has(x));
	}

	/** Sizes built by a game start station, which has no module list: wharfs build S and M, shipyards L and XL. */
	static ofGameStart(station: GodStation): Size[] {
		if (station.type === 'wharf') {
			return [Size.small, Size.medium];
		}
		if (station.type === 'shipyard') {
			return ShipBuildClasses.XL_ONLY.has(station.id) ? [Size.extralarge] : [Size.large, Size.extralarge];
		}
		return [];
	}
}
