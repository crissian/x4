import type { SaveMap } from '../savegame/map/save-map-model';
import type { Sector } from '../shared/services/model/model';
import type { ModuleService } from '../shared/services/module.service';
import type { WareService } from '../shared/services/ware.service';
import type { EconomyScope, StationFlows, WareEconomy, WareStationFlow } from './economy-model';
import { EconomyScopes } from './economy-scope';
import type { SectorBalance } from './sector-balance';
import { SectorGraph } from './sector-graph';
import { StationFlowCalculator } from './station-flow-calculator';
import { WareClasses, type BuildingMaterials, type WareClass } from './ware-classes';
import { WareEconomies } from './ware-economy';

/** The economy of one save: station flows computed once, then summed for any scope. */
export class Economy {
	readonly graph: SectorGraph;
	readonly stations: StationFlows[];
	private byWare?: Map<string, WareStationFlow[]>;
	private readonly balanced = new Map<string, Map<string, SectorBalance>>();

	constructor(
		map: SaveMap,
		private readonly wares: WareService,
		modules: ModuleService,
		sectors: readonly Sector[],
		/** wares needed to build ships and station modules, see `WareClasses.buildingMaterials` */
		private readonly building: BuildingMaterials = WareClasses.NO_BUILDING
	) {
		const known = new Set(map.sectors.map((x) => x.id));
		const inSave = sectors.filter((x) => known.has(x.id));
		this.graph = new SectorGraph(inSave);
		this.stations = new StationFlowCalculator(wares, modules, sectors).all(map.stations);
	}

	/** The stations of a scope. */
	stationsIn(scope: EconomyScope): StationFlows[] {
		return EconomyScopes.stations(this.stations, scope, this.graph);
	}

	/** One row per ware for a scope. */
	rows(scope: EconomyScope = {}): WareEconomy[] {
		return WareEconomies.rows(
			this.stationsIn(scope),
			(ware) => this.wares.getEntity(ware)?.price.avg,
			(ware) => this.classOf(ware)
		);
	}

	/** The stations making or using a ware in a scope, with their hourly flows. */
	wareStations(ware: string, scope: EconomyScope = {}): WareStationFlow[] {
		const stations = new Set(this.stationsIn(scope).map((x) => x.station));
		return (this.stationsByWare().get(ware) ?? []).filter((x) => stations.has(x.station));
	}

	/**
	 * Produced, consumed and net per hour of a ware per sector, summed over the sectors within `jumps` jumps of it
	 * (itself included). Only the faction and player parts of the scope apply. Cached per ware, jumps and those.
	 */
	balances(ware: string, jumps: number, scope: EconomyScope = {}): ReadonlyMap<string, SectorBalance> {
		const key = this.key(ware, jumps, scope);
		let result = this.balanced.get(key);
		if (!result) {
			const stations = new Set(
				this.stationsIn({ faction: scope.faction, includePlayer: scope.includePlayer }).map((x) => x.station)
			);
			const own = new Map<string, SectorBalance>();
			for (const x of (this.stationsByWare().get(ware) ?? []).filter((y) => stations.has(y.station))) {
				const sum = own.get(x.station.sector) ?? { produced: 0, consumed: 0, net: 0 };
				sum.produced += x.produced;
				sum.consumed += x.consumed;
				sum.net += x.produced - x.consumed;
				own.set(x.station.sector, sum);
			}
			result = new Map(this.graph.sectors().map((id) => [id, { produced: 0, consumed: 0, net: 0 }]));
			// links are two-way, so a sector's flows reach the sectors that reach it
			for (const [sector, value] of own) {
				for (const near of this.graph.within(sector, jumps)) {
					const sum = result.get(near) ?? { produced: 0, consumed: 0, net: 0 };
					sum.produced += value.produced;
					sum.consumed += value.consumed;
					sum.net += value.net;
					result.set(near, sum);
				}
			}
			this.balanced.set(key, result);
		}
		return result;
	}

	/**
	 * The sector within `jumps` jumps of `sector` whose own stations add the most (by absolute net) to its balance,
	 * with its distance in jumps; undefined when nothing is made or used there. Ties go to the nearer sector.
	 */
	topContributor(
		ware: string,
		sector: string,
		jumps: number,
		scope: EconomyScope = {}
	): { sector: string; jumps: number; net: number } | undefined {
		const own = this.balances(ware, 0, scope);
		let top: { sector: string; jumps: number; net: number } | undefined;
		// nearest first, so a tie keeps the nearer sector
		for (const ring of this.graph.rings(sector, jumps)) {
			const net = own.get(ring.sector)?.net ?? 0;
			if (net && (!top || Math.abs(net) > Math.abs(top.net))) {
				top = { sector: ring.sector, jumps: ring.jumps, net };
			}
		}
		return top;
	}

	private key(ware: string, jumps: number, scope: EconomyScope): string {
		return `${ware}|${jumps}|${scope.faction ?? ''}|${scope.includePlayer !== false}`;
	}

	private classOf(ware: string): WareClass {
		const entity = this.wares.getEntity(ware);
		return {
			mined: !!entity && WareClasses.isMined(entity),
			building: this.building.only.has(ware),
			partlyBuilding: this.building.partly.has(ware),
		};
	}

	private stationsByWare(): Map<string, WareStationFlow[]> {
		if (!this.byWare) {
			this.byWare = new Map();
			for (const { station, flows } of this.stations) {
				for (const flow of flows) {
					const list = this.byWare.get(flow.ware) ?? [];
					list.push({ station, produced: flow.produced, consumed: flow.consumed });
					this.byWare.set(flow.ware, list);
				}
			}
		}
		return this.byWare;
	}
}
