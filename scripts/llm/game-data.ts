import { Clusters } from '../../src/app/shared/services/data/clusters-data';
import { Equipments } from '../../src/app/shared/services/data/equipment-data';
import { EquipmentDescriptions } from '../../src/app/shared/services/data/equipment-descriptions-data';
import { Factions } from '../../src/app/shared/services/data/factions-data';
import { GodStations } from '../../src/app/shared/services/data/god-stations-data';
import { ModuleDescriptions } from '../../src/app/shared/services/data/module-descriptions-data';
import { AllModules } from '../../src/app/shared/services/data/modules-data';
import { Races } from '../../src/app/shared/services/data/race-data';
import { SectorDescriptions } from '../../src/app/shared/services/data/sector-descriptions-data';
import { Sectors } from '../../src/app/shared/services/data/sectors-data';
import { ShipDescriptions } from '../../src/app/shared/services/data/ship-descriptions-data';
import { Ships } from '../../src/app/shared/services/data/ships-data';
import { WareDescriptions } from '../../src/app/shared/services/data/ware-descriptions-data';
import { WareGroups } from '../../src/app/shared/services/data/ware-groups-data';
import { AllWares } from '../../src/app/shared/services/data/wares-data';
import type {
	Cluster,
	Equipment,
	Faction,
	GodStation,
	Race,
	Sector,
	Ship,
	StationModule,
	Ware,
	WareGroup,
} from '../../src/app/shared/services/model/model';

/** The generated game data with the lookups the pages share. */
export class GameData {
	static readonly ships = Ships as unknown as Ship[];
	static readonly equipment = Equipments as unknown as Equipment[];
	static readonly wares = AllWares as unknown as Ware[];
	static readonly wareGroups = WareGroups.all as unknown as WareGroup[];
	static readonly modules = AllModules as unknown as StationModule[];
	static readonly sectors = Sectors.all as unknown as Sector[];
	static readonly clusters = Clusters.all as unknown as Cluster[];
	static readonly factions = Factions.all as unknown as Faction[];
	static readonly races = Races.all as unknown as Race[];
	static readonly stations = GodStations as unknown as GodStation[];

	static readonly descriptions: Record<string, Record<string, string>> = {
		ships: ShipDescriptions,
		equipment: EquipmentDescriptions,
		wares: WareDescriptions,
		modules: ModuleDescriptions,
		sectors: SectorDescriptions,
	};

	private static readonly names = new Map<string, string>(
		[GameData.wares, GameData.sectors, GameData.clusters, GameData.factions, GameData.ships, GameData.equipment]
			.flat()
			.map((entity) => [entity.id, entity.name] as const)
	);

	static name(id: string | undefined): string {
		return id ? (GameData.names.get(id) ?? id) : '';
	}

	/** The game's description text, without its placeholder for entities that have none. */
	static description(kind: string, id: string): string | undefined {
		const description = GameData.descriptions[kind]?.[id];
		return description === 'No information available' ? undefined : description;
	}

	static ware(id: string): Ware | undefined {
		return GameData.wares.find((ware) => ware.id === id);
	}

	static sector(id: string): Sector | undefined {
		return GameData.sectors.find((sector) => sector.id === id);
	}

	static cluster(id: string): Cluster | undefined {
		return GameData.clusters.find((cluster) => cluster.id === id);
	}

	static faction(id: string): Faction | undefined {
		return GameData.factions.find((faction) => faction.id === id);
	}
}
