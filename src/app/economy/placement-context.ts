import type { SaveMap, SaveRelations } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import type { WareService } from '../shared/services/ware.service';
import { TradeRouteFinder } from '../trade/trade-route-finder';
import type { Economy } from './economy';
import { MarketSettlement } from './market-settlement';
import type { PlacementOptions } from './placement-model';
import type { SectorBalance } from './sector-balance';
import type { SectorRing } from './sector-graph';
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

/** Which stations the nets of the placement count. */
export type PlacementScope = Pick<PlacementOptions, 'includePlayer' | 'hideHostile'>;

/**
 * What the placement scoring reads from a save: the economy's own sector balances, the sectors (owner, sunlight,
 * security, resources), the player relations and the ware prices. Caches the reach of each sector, and the own net
 * and the shortage left after the existing supply per sector of each ware.
 */
export class PlacementContext {
	readonly recipes: PlacementRecipes;
	/** The highest sunlight of the save's sectors (1 = 100%), where a factory needing energy cells costs least; 1 without any. */
	readonly bestSunlight: number;
	private readonly sectorInfo = new Map<string, PlacementSector>();
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
		this.bestSunlight = Math.max(0, ...[...this.sectorInfo.values()].map((x) => x.sunlight)) || 1;
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
		return !!owner && TradeRouteFinder.isHostile(owner, this.relations);
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
	reach(sector: string, jumps: number): readonly SectorRing[] {
		return this.economy.graph.rings(sector, jumps);
	}

	/**
	 * Each sector's own net per hour of a ware (its stations only). With `hideHostile`, the stations of factions
	 * hostile to the player are left out, as supply and as demand: they don't trade with the player.
	 */
	localNet(ware: string, scope: PlacementScope): ReadonlyMap<string, number> {
		return this.cached(`${ware}`, scope, () => {
			const own = [...this.own(ware, scope)].filter(([, x]) => x.net !== 0);
			return new Map(own.map(([id, x]) => [id, x.net]));
		});
	}

	/**
	 * The shortage per hour left in each sector of a ware once the existing surpluses supplied the short sectors
	 * nearest to them, see `MarketSettlement`; positive values, only the sectors still short. Cached like `localNet`.
	 */
	residual(ware: string, scope: PlacementScope, maxJumps = MarketSettlement.MAX_JUMPS): ReadonlyMap<string, number> {
		return this.cached(`~${ware}|${maxJumps}`, scope, () =>
			MarketSettlement.shortages(this.settled(ware, scope, maxJumps))
		);
	}

	/**
	 * Each sector's net per hour of a ware after the settlement (`MarketSettlement.settled`): the surplus left, or
	 * the shortage left as a negative number. The stations count as in `localNet`; cached the same way.
	 */
	settled(ware: string, scope: PlacementScope, maxJumps = MarketSettlement.MAX_JUMPS): ReadonlyMap<string, number> {
		return this.cached(`=${ware}|${maxJumps}`, scope, () =>
			MarketSettlement.settled(this.localNet(ware, scope), (sector, jumps) => this.reach(sector, jumps), maxJumps)
		);
	}

	/** Each sector's own production per hour of a ware, to tell an input that is made nearby; stations as `localNet`. */
	localProduced(ware: string, scope: PlacementScope): ReadonlyMap<string, number> {
		return this.cached(`+${ware}`, scope, () => {
			const own = [...this.own(ware, scope)].filter(([, x]) => x.produced > 0);
			return new Map(own.map(([id, x]) => [id, x.produced]));
		});
	}

	private cached(
		key: string,
		scope: PlacementScope,
		make: () => ReadonlyMap<string, number>
	): ReadonlyMap<string, number> {
		const full = `${key}|${scope.includePlayer}|${scope.hideHostile}`;
		let result = this.nets.get(full);
		if (!result) {
			result = make();
			this.nets.set(full, result);
		}
		return result;
	}

	/** Produced, consumed and net per sector of the stations that count. */
	private own(ware: string, scope: PlacementScope): Map<string, SectorBalance> {
		const result = new Map<string, SectorBalance>();
		for (const x of this.economy.wareStations(ware, { includePlayer: scope.includePlayer })) {
			if (scope.hideHostile && TradeRouteFinder.isHostile(x.station.owner, this.relations)) {
				continue;
			}
			const sum = result.get(x.station.sector) ?? { produced: 0, consumed: 0, net: 0 };
			sum.produced += x.produced;
			sum.consumed += x.consumed;
			sum.net = sum.produced - sum.consumed;
			result.set(x.station.sector, sum);
		}
		return result;
	}
}
