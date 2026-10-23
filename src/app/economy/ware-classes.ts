import { BuildingMaterials as GameBuildingMaterials } from '../shared/services/data/building-materials-data';
import type { Ware } from '../shared/services/model/model';

/** What a ware is for the supply and demand calculation. */
export interface WareClass {
	/** mined or collected: the stations' mining is not counted */
	mined: boolean;
	/** used only to build ships and station modules, which is not counted */
	building: boolean;
	/** used to build ships and station modules and also consumed by factories: the real demand is higher */
	partlyBuilding: boolean;
}

/** The wares that ships and station modules are built from. */
export interface BuildingMaterials {
	/** no factory uses them as an input: the capacity says nothing about them */
	only: ReadonlySet<string>;
	/** factories use them too, so the capacity counts that part of the demand */
	partly: ReadonlySet<string>;
}

interface Recipes {
	production?: readonly { wares: readonly { ware: string }[] }[];
}

/** What a ship or a station module needs to be built. */
interface BuildCost extends Recipes {
	race?: { id: string };
}

/** Tells the wares apart whose supply or demand the station flows can't tell. */
export class WareClasses {
	/** Ware groups that are mined or collected. */
	static readonly MINED_GROUPS: readonly string[] = ['gases', 'ice', 'minerals'];

	/** A ware that is mined or collected: it has no production at all, or is in a mined ware group. */
	static isMined(ware: Pick<Ware, 'group' | 'production'>): boolean {
		const inputs = (ware.production ?? []).some((x) => x.wares.length > 0);
		if (inputs) {
			return false;
		}
		return (ware.production ?? []).length === 0 || WareClasses.MINED_GROUPS.includes(ware.group?.id ?? '');
	}

	/** Races whose ships the player can't build, so their materials say nothing. */
	static readonly UNBUILDABLE_RACES: readonly string[] = ['xenon', 'khaak'];

	static readonly NO_BUILDING: BuildingMaterials = { only: new Set(), partly: new Set() };
	/** The building materials of the game data, worked out by the extractor like `buildingMaterials`. */
	static readonly GAME_BUILDING: BuildingMaterials = {
		only: new Set(GameBuildingMaterials.only),
		partly: new Set(GameBuildingMaterials.partly),
	};

	/**
	 * The wares that ships and station modules are built from: `only` those that no ware's production uses as an
	 * input, `partly` those that factories consume as well (their inputs are counted by the capacity already).
	 * Xenon and Kha'ak ships are left out.
	 */
	static buildingMaterials(
		ships: readonly BuildCost[],
		modules: readonly BuildCost[],
		wares: readonly Recipes[]
	): BuildingMaterials {
		const inputs = new Set<string>();
		for (const ware of wares) {
			for (const production of ware.production ?? []) {
				production.wares.forEach((x) => inputs.add(x.ware));
			}
		}
		const only = new Set<string>();
		const partly = new Set<string>();
		const buildable = ships.filter((x) => !WareClasses.UNBUILDABLE_RACES.includes(x.race?.id ?? ''));
		for (const item of [...buildable, ...modules]) {
			for (const production of item.production ?? []) {
				production.wares.forEach((x) => (inputs.has(x.ware) ? partly : only).add(x.ware));
			}
		}
		return { only, partly };
	}
}
