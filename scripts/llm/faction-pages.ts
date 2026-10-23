import type { Faction } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

export class FactionPages extends EntityPages<Faction> {
	readonly kind = 'factions';
	readonly title = 'Factions';
	readonly summary =
		'Every faction: race, licenses and the relation they need, sectors owned at game start, what they sell.';

	entities(): Faction[] {
		return GameData.factions;
	}

	page(faction: Faction): string {
		const sectors = GameData.sectors.filter((sector) => sector.owner === faction.id);
		const sells = (entities: { owners?: Faction[] }[]) =>
			entities.filter((entity) => entity.owners?.some((owner) => owner.id === faction.id)).length || undefined;
		return this.header(faction)
			.facts([
				['Short name', faction.shortName],
				['Race', faction.race?.name],
				['Ships sold', sells(GameData.ships)],
				['Equipment sold', sells(GameData.equipment)],
				['Station module blueprints sold', sells(GameData.modules)],
			])
			.tableSection(
				'Licenses',
				['License', 'Type', 'Price', 'Relation needed (-1 to 1)'],
				(faction.licenses ?? []).map((license) => [
					license.name,
					`\`${license.type}\``,
					license.price,
					license.minRelation,
				])
			)
			.section(
				'Sectors owned at game start',
				sectors.map((sector) => Site.link('sectors', sector))
			)
			.p(Site.source(this.kind, faction.id))
			.toString();
	}

	index(): string {
		return new Markdown()
			.h1('X4: Foundations factions')
			.table(
				['Faction', 'Race', 'Sectors at start'],
				this.entities().map((faction) => [
					this.link(faction),
					faction.race?.name,
					GameData.sectors.filter((sector) => sector.owner === faction.id).length,
				])
			)
			.toString();
	}
}
