import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AbandonedShips } from '../../src/app/shared/services/data/abandoned-ships-data';
import { BlueprintRules } from '../../src/app/shared/services/data/blueprint-rules-data';
import { ClusterDescriptions } from '../../src/app/shared/services/data/cluster-descriptions-data';
import { DataVaults } from '../../src/app/shared/services/data/data-vaults-data';
import { DiplomacyData } from '../../src/app/shared/services/data/diplomacy-data';
import { EquipmentModData } from '../../src/app/shared/services/data/equipment-mods-data';
import { GameStarts } from '../../src/app/shared/services/data/game-starts-data';
import { Research } from '../../src/app/shared/services/data/research-data';
import { ResearchDescriptions } from '../../src/app/shared/services/data/research-descriptions-data';
import { ShipOrders } from '../../src/app/shared/services/data/ship-orders-data';
import { Terraforming } from '../../src/app/shared/services/data/terraforming-data';
import { Workers } from '../../src/app/shared/services/data/workers-data';
import { GameData } from './game-data';
import { Site } from './site';

interface Dataset {
	file: string;
	summary: string;
	data: unknown;
}

/**
 * Writes the game data as plain JSON under `data/`. Entities nested in other entities (the race of a ship, the
 * factions selling it, ...) become their id, so every file stands alone and ids join them.
 */
export class JsonExport {
	private readonly entities = new Set<object>(
		[
			GameData.ships,
			GameData.equipment,
			GameData.wares,
			GameData.wareGroups,
			GameData.modules,
			GameData.sectors,
			GameData.clusters,
			GameData.factions,
			GameData.races,
		].flat()
	);

	readonly datasets: Dataset[] = [
		JsonExport.described('ships', 'Ships with stats, slots, cargo, price, build cost and sellers.', GameData.ships),
		JsonExport.described(
			'equipment',
			'Weapons, turrets, missiles, shields, engines, thrusters, drones, software.',
			GameData.equipment
		),
		{ file: 'equipment-mods', summary: 'Equipment mods, their qualities and stat ranges.', data: EquipmentModData },
		JsonExport.described('wares', 'Trade wares with prices, volume and production recipes.', GameData.wares),
		{ file: 'ware-groups', summary: 'Ware groups and their production tier.', data: GameData.wareGroups },
		JsonExport.described(
			'modules',
			'Station modules with products, workforce, storage, price, build cost.',
			GameData.modules
		),
		{ file: 'workers', summary: 'Workforce per race and the wares it consumes.', data: Object.values(Workers) },
		JsonExport.described(
			'sectors',
			'Sectors with owner, sunlight, resources, gates and highways. Positions in km.',
			GameData.sectors
		),
		{
			file: 'clusters',
			summary: 'Star systems holding the sectors, with suns, planets and description.',
			data: GameData.clusters.map((cluster) => ({ ...cluster, description: ClusterDescriptions[cluster.id] })),
		},
		{
			file: 'stations',
			summary: 'Shipyards, wharfs, equipment docks, trade stations placed at game start.',
			data: GameData.stations,
		},
		{
			file: 'abandoned-ships',
			summary: 'Claimable ships placed in the universe at game start.',
			data: AbandonedShips,
		},
		{ file: 'data-vaults', summary: 'Data vault locations.', data: DataVaults },
		{ file: 'factions', summary: 'Factions with race, color and licenses.', data: GameData.factions },
		{ file: 'races', summary: 'Races.', data: GameData.races },
		{
			file: 'research',
			summary: 'HQ research with time, cost, prerequisites and unlocks.',
			data: Object.values(Research).map((item) => ({ ...item, description: ResearchDescriptions[item.id] })),
		},
		{
			file: 'blueprint-rules',
			summary: 'Which blueprints the player can own and which come as gifts.',
			data: BlueprintRules,
		},
		{ file: 'diplomacy', summary: 'Diplomacy agents, ranks, actions and events.', data: DiplomacyData },
		{ file: 'terraforming', summary: 'Terraforming stats, projects and planets.', data: Terraforming },
		{
			file: 'game-starts',
			summary: 'Game starts with their ships, money, relations and unlocks.',
			data: GameStarts.all,
		},
		{ file: 'ship-orders', summary: 'Ship orders.', data: ShipOrders.all },
	];

	write(out: string): void {
		mkdirSync(join(out, 'data'), { recursive: true });
		for (const dataset of this.datasets) {
			writeFileSync(join(out, 'data', `${dataset.file}.json`), JSON.stringify(this.items(dataset.data)));
		}
		const index = this.datasets.map((dataset) => ({
			file: Site.data(dataset.file),
			summary: dataset.summary,
			count: Array.isArray(dataset.data) ? dataset.data.length : undefined,
		}));
		writeFileSync(join(out, 'data', 'index.json'), JSON.stringify(index, null, '\t'));
	}

	private items(data: unknown): unknown {
		return Array.isArray(data) ? data.map((item) => this.normalize(item, true)) : this.normalize(data, true);
	}

	/** Adds the description of each entity, kept in a separate data file in the app. */
	private static described(file: string, summary: string, entities: { id: string }[]): Dataset {
		return {
			file,
			summary,
			data: entities.map((entity) => ({ ...entity, description: GameData.description(file, entity.id) })),
		};
	}

	/** An entity nested anywhere below an item becomes its id; the item itself is kept whole. */
	private normalize(value: unknown, item = false): unknown {
		if (Array.isArray(value)) {
			return value.map((child) => this.normalize(child));
		}
		if (value && typeof value === 'object') {
			if (!item && this.entities.has(value)) {
				return (value as { id: string }).id;
			}
			return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, this.normalize(child)]));
		}
		return value;
	}
}
