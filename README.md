# X4: Foundations Utilities & Database

[www.x4-game.com](http://www.x4-game.com)

A free, ad-free web app for **X4: Foundations** and its DLCs (Split Vendetta, Cradle of Humanity, Tides of Avarice,
Kingdom End, Timelines, Hyperion Pack, Envoy Pack). It has a game database, planning tools and a savegame reader,
and runs entirely in the browser.

## Features

### Tools

- **Station Calculator**: plan a station's modules and see its production and consumption balance, workforce and
  building costs. Share a plan as a link, or open one of your own stations from a loaded save.
- **Galaxy Map**: the clusters and sectors of the universe, with stations, resources, heat maps and trade routes. A
  loaded save adds your own assets and what you have discovered.

### Database

- **Items**: wares, production chains, station modules, ships, equipment and equipment mods.
- **World**: races, factions, sectors, terraforming and diplomacy (agent actions, events, gifts and ranks).
- **Progress**: research and game starts.

### Economy (needs a loaded save)

- **Trade Routes**: profitable routes for your traders from the stations in your save.
- **Supply & Demand**: where wares are bought and sold, and the best offers.
- **Station Suggestions**: sectors where a new station would do well.

### My Save

- **Savegames**: drop an `.xml.gz` or `.xml` save to load it. Saves are parsed in a web worker and stay in your
  browser; nothing is uploaded. On Windows they are in `Documents\Egosoft\X4\<id>\save\` (sometimes under
  `OneDrive\Documents\...`).
- **Empire**: your ships, stations, fleets and their orders, with the production balance of your stations.
- **Blueprints**: which blueprints you own, and where to buy or earn the rest.
- **Event Log**: your save's logbook, with losses and other events.

### Languages

The interface and game texts are available in English, Čeština, Deutsch, Español, Français, Italiano, 日本語, 한국어,
Polski, Português (Brasil), Türkçe, 简体中文 and 繁體中文.

### Data for language models

The production build also publishes an [`llms.txt`](https://llmstxt.org), markdown pages for ships, equipment, wares,
modules, sectors and factions, and JSON exports of the game data.

## Development

Built with [Angular](https://angular.dev) 22, TypeScript, [Tailwind CSS](https://tailwindcss.com) 4 and
[Lucide](https://lucide.dev) icons. Requires Node.js 22.22+, 24.15+ or 26+.

```bash
npm install
npm start          # dev server on http://localhost:4200
npm test           # unit tests (Vitest)
npm run lint       # ESLint
npm run build      # production build into dist/x4-new, then the LLM export
npm run llm        # only the LLM export (llms.txt, markdown and JSON) into the build output
```

### Project layout

| Path                            | Contents                                                              |
| ------------------------------- | --------------------------------------------------------------------- |
| `src/app/<feature>`             | one folder per page or tool (station, map, ship, trade, savegame, …)  |
| `src/app/shared/services/data`  | the game data as TypeScript: wares, modules, ships, sectors, …        |
| `src/app/shared/components`     | shared UI: data grid, searchable select, tabs, modal, …               |
| `src/assets/i18n/<lang>`        | translated game texts, one JSON file per data file                    |
| `src/locale`                    | translated interface texts (`ng extract-i18n` writes `messages.json`) |
| `scripts/llm`                   | the `llms.txt`, markdown and JSON export                              |
| `scripts/check-*.mts`           | dev checks of the save reader: `npx -y tsx scripts/check-savegame.mts <save.xml.gz>` |

### Translations

Interface texts are marked with `i18n` attributes and `$localize`. Run `npx ng extract-i18n` to regenerate
`src/locale/messages.json`, then add the new texts to each `messages.<lang>.json`.

## Contributing

Issues and pull requests are welcome. Please run `npm test` and `npm run lint` before opening a pull request.

## Support

If you'd like to support development, you can [buy me a coffee](https://www.buymeacoffee.com/crissian) or
[become a patron](https://www.patreon.com/crissianx).

## License

[MIT](LICENSE) © 2019-2026 Cristian Odea

X4: Foundations is a trademark of Egosoft. This project is not affiliated with or endorsed by Egosoft.
