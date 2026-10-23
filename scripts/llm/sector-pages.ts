import type { Sector } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

export class SectorPages extends EntityPages<Sector> {
	readonly kind = 'sectors';
	readonly title = 'Sectors';
	readonly summary =
		'Every sector: owner at game start, sunlight, mineable resources, gate and highway connections, shipyards/wharfs/equipment docks/trade stations.';

	entities(): Sector[] {
		return GameData.sectors;
	}

	page(sector: Sector): string {
		const cluster = GameData.cluster(sector.cluster);
		const owner = sector.owner ? GameData.faction(sector.owner) : undefined;
		const stations = GameData.stations.filter((station) => station.sector === sector.id);
		return this.header(sector)
			.facts([
				['Cluster (star system)', cluster?.name],
				['Owner at game start', owner ? Site.link('factions', owner) : sector.owner],
				['Sunlight (solar output, 1 = 100%)', sector.sunlight],
				['Economy', sector.economy],
				['Security', sector.security],
				['Suns', cluster?.suns.join(', ')],
				[
					'Planets',
					cluster?.planets
						.map((planet) => planet.name ?? planet.class)
						.filter(Boolean)
						.join(', '),
				],
			])
			.tableSection(
				'Resources',
				['Ware', 'Areas', 'Size', 'Yield', 'Amount per area', 'Recovers after (min)'],
				sector.resources.map((resource) => [
					GameData.name(resource.ware),
					resource.count,
					resource.size,
					resource.yield,
					resource.yieldAmount,
					resource.respawnDelay,
				])
			)
			.section('Connections', [
				...sector.gates.map(
					(gate) => `${gate.type === 'gate' ? 'Jump gate' : 'Accelerator'} to ${this.sector(gate.sector)}`
				),
				...sector.highways.map((id) => `Superhighway to ${this.sector(id)}`),
			])
			.section(
				'Stations at game start',
				stations.map(
					(station) =>
						`${SectorPages.stationTypes[station.type] ?? station.type} (${GameData.name(station.owner)})`
				)
			)
			.p(Site.source(this.kind, sector.id))
			.toString();
	}

	index(): string {
		return new Markdown()
			.h1('X4: Foundations sectors')
			.table(
				['Sector', 'Owner at start', 'Sunlight', 'Resources', 'Connected to'],
				[...this.entities()]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((sector) => [
						this.link(sector),
						GameData.name(sector.owner),
						Markdown.num(sector.sunlight),
						[...new Set(sector.resources.map((resource) => GameData.name(resource.ware)))].join(', '),
						[...sector.gates.map((gate) => gate.sector), ...sector.highways]
							.map((id) => GameData.name(id))
							.join(', '),
					])
			)
			.toString();
	}

	private static readonly stationTypes: Record<string, string> = {
		shipyard: 'Shipyard',
		wharf: 'Wharf',
		equipmentdock: 'Equipment dock',
		tradestation: 'Trading station',
		defence: 'Defence platform',
		piratebase: 'Pirate base',
	};

	private sector(id: string): string {
		const sector = GameData.sector(id);
		return sector ? this.link(sector) : id;
	}
}
