import type { EntityPages } from './entity-pages';
import type { JsonExport } from './json-export';
import { Markdown } from './markdown';
import { Site } from './site';

/** The site map for language models (https://llmstxt.org): what the site is and where its data can be read. */
export class LlmsTxt {
	static build(pages: EntityPages<{ id: string; name: string }>[], json: JsonExport): string {
		return new Markdown()
			.h1('X4 Foundations game data (x4-game.com)')
			.p(
				'> Database and planners for the space game X4: Foundations and its DLCs (Split Vendetta, Cradle of Humanity, ' +
					'Tides of Avarice, Kingdom End and later), extracted from the game files.'
			)
			.p(
				'The web app needs JavaScript. The same data is published as static markdown pages and JSON files, listed below. ' +
					'Ids are the game ids and join the files (a ship `race` holds a race id, a production input `ware` holds a ware id). ' +
					'Prices are in credits, distances in meters, sector positions in km, times in seconds unless a label says otherwise.'
			)
			.h2('Markdown pages')
			.list(
				pages.map(
					(page) =>
						`${Markdown.link(page.title, Site.md(page.kind))}: ${page.summary} One page per entity under ${Site.url}/md/${page.kind}/<id>.md`
				)
			)
			.h2('JSON data')
			.list([
				`${Markdown.link('index.json', Site.data('index'))}: every file below with its item count`,
				...json.datasets.map(
					(dataset) => `${Markdown.link(`${dataset.file}.json`, Site.data(dataset.file))}: ${dataset.summary}`
				),
			])
			.h2('Interactive tools (browser only)')
			.list([
				`${Markdown.link('Station calculator', Site.page('station-calculator'))}: plan station modules and their production balance`,
				`${Markdown.link('Production chains', Site.page('production-chains'))}: the inputs behind any ware`,
				`${Markdown.link('Map', Site.page('map'))}: the universe map with sectors, resources and stations`,
				`${Markdown.link('Savegames', Site.page('saves'))}: reads a save file in the browser for empire, trade, supply and demand views`,
			])
			.toString();
	}
}
