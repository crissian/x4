import { Markdown } from './markdown';

/** Where the exported files live on the site; links are absolute so a page fetched on its own still resolves them. */
export class Site {
	static readonly url = 'https://x4-game.com';

	/** The web app page, e.g. `ships/ship_arg_l_destroyer_01_a`. */
	static page(path: string): string {
		return `${Site.url}/${path}`;
	}

	/** A markdown page, e.g. `ships/ship_arg_l_destroyer_01_a` for `/md/ships/ship_arg_l_destroyer_01_a.md`. */
	static md(path: string): string {
		return `${Site.url}/md/${path}.md`;
	}

	static data(file: string): string {
		return `${Site.url}/data/${file}.json`;
	}

	/** A markdown link to an entity page of a kind (`ships`, `wares`, ...). */
	static link(kind: string, entity: { id: string; name: string }): string {
		return Markdown.link(entity.name || entity.id, Site.md(`${kind}/${entity.id}`));
	}

	/** The closing line of an entity page pointing at the interactive page. */
	static source(kind: string, id: string): string {
		return `Interactive page: ${Site.page(`${kind}/${id}`)}`;
	}
}
