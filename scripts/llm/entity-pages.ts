import type { Faction, Price, Production } from '../../src/app/shared/services/model/model';
import { GameData } from './game-data';
import { Markdown } from './markdown';
import { Site } from './site';

/** The markdown pages of one kind of entity: an index listing them all and a page for each. */
export abstract class EntityPages<T extends { id: string; name: string }> {
	/** Path segment of the pages, the same as the web app route (`ships`, `wares`, ...). */
	abstract readonly kind: string;
	abstract readonly title: string;
	/** One line for llms.txt saying what the pages hold. */
	abstract readonly summary: string;

	abstract entities(): T[];

	abstract page(entity: T): string;

	abstract index(): string;

	protected link(entity: { id: string; name: string }, kind = this.kind): string {
		return Site.link(kind, entity);
	}

	protected header(entity: T): Markdown {
		return new Markdown()
			.h1(entity.name || entity.id)
			.p(`${this.title.replace(/s$/, '')} \`${entity.id}\` in X4: Foundations.`)
			.p(GameData.description(this.kind, entity.id));
	}

	protected static price(price: Price | undefined): string | undefined {
		return (
			price && `${Markdown.num(price.avg, 0)} Cr (${Markdown.num(price.min, 0)} - ${Markdown.num(price.max, 0)})`
		);
	}

	protected static owners(owners: Faction[] | undefined): string | undefined {
		return owners?.length ? owners.map((faction) => Site.link('factions', faction)).join(', ') : undefined;
	}

	/** The license type to buy from a selling faction; its name differs per faction (see the faction pages). */
	protected static license(type: string | undefined): string | undefined {
		return type && `\`${type}\` (the selling faction's license of that type)`;
	}

	/** One line per production method: what goes in for how much comes out. */
	protected static production(production: Production[] | undefined): string[] {
		return (production ?? []).map((method) => {
			const inputs = method.wares.length
				? method.wares
						.map((input) => {
							const ware = GameData.ware(input.ware);
							return `${Markdown.num(input.amount)} ${ware ? Site.link('wares', ware) : input.ware}`;
						})
						.join(', ')
				: 'nothing';
			return `${method.name} (\`${method.method}\`): ${Markdown.num(method.amount)} per ${Markdown.num(method.time)} s from ${inputs}`;
		});
	}

	/** Slot counts grouped by size, e.g. "2 Medium, 4 Small". */
	protected static slots(slots: { size: string }[] | undefined): string | undefined {
		if (!slots?.length) {
			return undefined;
		}
		const counts = new Map<string, number>();
		for (const slot of slots) {
			counts.set(slot.size, (counts.get(slot.size) ?? 0) + 1);
		}
		return [...counts].map(([size, count]) => `${count} ${size}`).join(', ');
	}
}
