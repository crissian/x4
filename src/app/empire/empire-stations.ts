import type { SaveOwnStation } from '../savegame/empire/save-empire-model';
import type { SaveStation } from '../savegame/map/save-map-model';
import { StationTrade } from '../savegame/map/station-trade';
import type { EmpireShipRow, EmpireStationRow, EmpireSummary } from './empire-model';
import type { OwnStationLayout } from './own-station-layout';

/** What `EmpireStations.build` looks things up in. */
export interface EmpireStationLookups {
	sectorName(id: string): string;
	/** the station's name, e.g. from the naming tables */
	stationName(station: SaveStation): string;
	/** the ware ids a station module makes; empty for other modules */
	products(moduleId: string): readonly string[];
	wareName(id: string): string;
	/** the calculator layout of the station's built modules, with the workers of the map data */
	layout(own: SaveOwnStation, workforce: SaveStation['workforce']): OwnStationLayout;
}

/** Turns the player's stations of the save into the empire page's rows, and sums up the empire. */
export class EmpireStations {
	/** Size enum values, largest first, as the summary lists them. */
	static readonly SIZES = ['Extra Large', 'Large', 'Medium', 'Small'];

	/**
	 * The player's stations of the map data, by name, with the money and storage of the empire data (matched by
	 * code) and how many ships each commands.
	 */
	static build(
		stations: readonly SaveStation[],
		own: readonly SaveOwnStation[],
		ships: readonly EmpireShipRow[],
		lookups: EmpireStationLookups
	): EmpireStationRow[] {
		const byCode = new Map(own.map((x) => [x.code, x]));
		return stations
			.filter((x) => x.owner === 'player' && x.state !== 'wreck')
			.map((station) => {
				const extra = byCode.get(station.code);
				const name = lookups.stationName(station);
				const modules = StationTrade.modules(station);
				const products = [...new Set(modules.flatMap((x) => lookups.products(x.id)))];
				return {
					id: extra?.id ?? station.code,
					code: station.code,
					name,
					sector: station.sector,
					sectorName: lookups.sectorName(station.sector),
					state: station.state,
					modules: modules.reduce((sum, x) => sum + x.count, 0),
					products: products.map((x) => lookups.wareName(x)).sort((a, b) => a.localeCompare(b)),
					storage: Object.entries(extra?.storage ?? {})
						.map(([ware, amount]) => ({ ware, name: lookups.wareName(ware), amount }))
						.sort((a, b) => b.amount - a.amount),
					money: extra?.money ?? 0,
					ships: extra ? EmpireStations.commanded(extra.id, ships) : 0,
					layout: extra ? lookups.layout(extra, station.workforce) : undefined,
				};
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	static summary(
		money: number,
		ships: readonly EmpireShipRow[],
		stations: readonly EmpireStationRow[]
	): EmpireSummary {
		return {
			money,
			ships: ships.length,
			bySize: EmpireStations.SIZES.map((size) => ({ size, count: ships.filter((x) => x.size === size).length })),
			stations: stations.length,
			stationMoney: stations.reduce((sum, x) => sum + x.money, 0),
		};
	}

	/** The ships in the fleet of the station: those it commands, with their subordinates. */
	private static commanded(id: string, ships: readonly EmpireShipRow[]): number {
		return ships
			.filter((x) => x.depth === 0 && x.commanderId === id)
			.reduce((sum, x) => sum + 1 + x.subordinates, 0);
	}
}
