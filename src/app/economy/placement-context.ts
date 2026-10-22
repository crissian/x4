import type { SaveMap, SaveRelations } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import type { WareService } from '../shared/services/ware.service';
import { TradeRules } from '../trade/trade-route-model';
import type { Economy } from './economy';
import type { PlacementOptions } from './placement-model';
import { PlacementRecipes } from './placement-recipes';
import { WareClasses } from './ware-classes';

/** A sector as the placement sees it. */
export interface PlacementSector {
	/** the owner in the save, else at game start */
	owner?: string;
	/** 1 = 100% */
	sunlight: number;
	security?: number;
	/** the wares that can be mined there */
	resources: ReadonlySet<string>;
}

/** A sector within reach and its distance. */
export interface PlacementRing {
	sector: string;
	jumps: number;
}

/**
 * What the placement scoring reads from a save: the economy's own sector balances, the sectors (owner, sunlight,
 * security, resources), the player relations and the ware prices. Caches the reach of each sector and the own net
 * per sector of each ware.
 */
export class PlacementContext {
	readonly recipes: PlacementRecipes;
	private readonly sectorInfo = new Map<string, PlacementSector>();
	private readonly rings = new Map<string, PlacementRing[]>();
	private readonly nets = new Map<string, ReadonlyMap<string, number>>();

	constructor(
		readonly economy: Economy,
		private readonly wares: WareService,
		recipes: PlacementRecipes,
		sectors: readonly Sector[],
		map: SaveMap,
		private readonly relations: SaveRelations | undefined,
		private readonly building: ReadonlySet<string> = new Set()
	) {
		this.recipes = recipes;
		const owners = new Map(map.sectors.map((x) => [x.id, x.owner]));
		for (const sector of sectors) {
			if (!owners.has(sector.id)) {
				continue;
			}
			this.sectorInfo.set(sector.id, {
				owner: owners.get(sector.id) || sector.owner,
				sunlight: sector.sunlight ?? 1,
				security: sector.security,
				resources: new Set((sector.resources ?? []).map((x) => x.ware)),
			});
		}
	}

	/** Ids of the sectors of the save that have a known place in the gate network. */
	sectors(): string[] {
		return this.economy.graph.sectors();
	}

	sector(id: string): PlacementSector | undefined {
		return this.sectorInfo.get(id);
	}

	price(ware: string): number {
		return this.wares.getEntity(ware)?.price.avg ?? 0;
	}

	mined(ware: string): boolean {
		const entity = this.wares.getEntity(ware);
		return !!entity && WareClasses.isMined(entity);
	}

	isBuilding(ware: string): boolean {
		return this.building.has(ware);
	}

	/** The wares a factory can be suggested for: made by a production module, not mined and with a price. */
	candidates(): string[] {
		return this.wares
			.getEntities()
			.filter((x) => !WareClasses.isMined(x) && x.price.avg > 0 && !!this.recipes.recipe(x.id))
			.map((x) => x.id);
	}

	/** Owned by a faction whose relation to the player is hostile, the rule of the trade routes. */
	hostile(sector: string): boolean {
		const owner = this.sector(sector)?.owner;
		return (
			!!owner &&
			owner !== 'player' &&
			this.relations != null &&
			(this.relations[owner] ?? 0) <= TradeRules.HOSTILE_RELATION
		);
	}

	/** The ware is illegal for the sector's owner. */
	illegal(ware: string, sector: string): boolean {
		const owner = this.sector(sector)?.owner;
		return !!owner && !!this.wares.getEntity(ware)?.illegal?.some((x) => x.id === owner);
	}

	/** A factory of the ware can't be suggested there. */
	excluded(ware: string, sector: string, options: PlacementOptions): boolean {
		return !this.sector(sector) || (options.hideHostile && this.hostile(sector)) || this.illegal(ware, sector);
	}

	/** The sectors within `jumps` of a sector, itself first, then by distance. */
	reach(sector: string, jumps: number): readonly PlacementRing[] {
		const key = `${sector}|${jumps}`;
		let result = this.rings.get(key);
		if (!result) {
			result = [];
			const seen = new Set<string>();
			for (let distance = 0; distance <= jumps; distance++) {
				for (const id of this.economy.graph.within(sector, distance)) {
					if (!seen.has(id)) {
						seen.add(id);
						result.push({ sector: id, jumps: distance });
					}
				}
			}
			this.rings.set(key, result);
		}
		return result;
	}

	/** Each sector's own net per hour of a ware (its stations only). */
	localNet(ware: string, includePlayer: boolean): ReadonlyMap<string, number> {
		const key = `${ware}|${includePlayer}`;
		let result = this.nets.get(key);
		if (!result) {
			const balances = this.economy.balances(ware, 0, { includePlayer });
			result = new Map([...balances].filter(([, x]) => x.net !== 0).map(([id, x]) => [id, x.net]));
			this.nets.set(key, result);
		}
		return result;
	}

	/** Each sector's own production per hour of a ware, to tell an input that is made nearby. */
	localProduced(ware: string, includePlayer: boolean): ReadonlyMap<string, number> {
		const key = `+${ware}|${includePlayer}`;
		let result = this.nets.get(key);
		if (!result) {
			const balances = this.economy.balances(ware, 0, { includePlayer });
			result = new Map([...balances].filter(([, x]) => x.produced > 0).map(([id, x]) => [id, x.produced]));
			this.nets.set(key, result);
		}
		return result;
	}
}
