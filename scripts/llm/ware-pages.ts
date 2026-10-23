import type { Ware } from '../../src/app/shared/services/model/model';
import { EntityPages } from './entity-pages';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

export class WarePages extends EntityPages<Ware> {
	readonly kind = 'wares';
	readonly title = 'Wares';
	readonly summary =
		'Every trade ware: price range, volume, production recipes, which modules make it and what consumes it (production chains).';

	entities(): Ware[] {
		return GameData.wares;
	}

	page(ware: Ware): string {
		const madeBy = GameData.modules.filter((module) => module.product?.some((product) => product.id === ware.id));
		const usedBy = GameData.wares.filter((other) =>
			other.production?.some((method) => method.wares.some((input) => input.ware === ware.id))
		);
		const builds = (entities: { production?: { wares: { ware: string }[] }[] }[]) =>
			entities.filter((entity) =>
				entity.production?.some((method) => method.wares.some((input) => input.ware === ware.id))
			).length;
		return this.header(ware)
			.facts([
				['Group', ware.group?.name],
				['Transport (cargo type)', ware.transport],
				['Volume per unit (m³)', ware.volume],
				['Price', EntityPages.price(ware.price)],
				['Illegal for', EntityPages.owners(ware.illegal)],
				['Ships built from it', builds(GameData.ships) || undefined],
				['Station modules built from it', builds(GameData.modules) || undefined],
				['Equipment built from it', builds(GameData.equipment) || undefined],
			])
			.section('Production (per cycle)', EntityPages.production(ware.production))
			.section(
				'Produced by station modules',
				madeBy.map((module) => this.link(module, 'modules'))
			)
			.section(
				'Input for wares',
				usedBy.map((other) => this.link(other))
			)
			.p(Site.source(this.kind, ware.id))
			.toString();
	}

	index(): string {
		return new Markdown()
			.h1('X4: Foundations wares')
			.p('Prices are in credits per unit, volume in m³ per unit.')
			.table(
				['Ware', 'Group', 'Transport', 'Volume', 'Avg price', 'Min price', 'Max price'],
				[...this.entities()]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((ware) => [
						this.link(ware),
						ware.group?.name,
						ware.transport,
						ware.volume,
						Markdown.num(ware.price?.avg, 0),
						Markdown.num(ware.price?.min, 0),
						Markdown.num(ware.price?.max, 0),
					])
			)
			.toString();
	}
}
