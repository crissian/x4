# Trade Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/trade-routes` page that ranks buy-here, sell-there trades across the whole galaxy from the active save's offers. Filters sit on top, and a sortable table sits beside a map of the selected route.

**Architecture:**
- **Relations extractor:** a new streaming extractor stores the player's faction relations next to the existing `map` data (schema 4).
- **Calculation:** pure classes under `src/app/trade/` pair the offers, size the cargo, time the trip with the existing `RoutePlanner`, and rank.
- **Page:** a lazy page component with a small store (Signal Forms filters synced to URL query params), `app-data-grid` for the table, and a generic route map component built from the sector map's pieces.

**Tech Stack:** Angular 22 (signals, Signal Forms, `$localize` with 12 locales), vitest, Tailwind, `@lucide/angular`.

**Spec:** `docs/superpowers/specs/2026-10-22-trade-routes-design.md`

## Global Constraints

- **Classes:** classes only. No module-level functions; helpers are static methods. No exported `create*` factories.
- **Templates:** use `templateUrl` with `.html`. No markup or CSS class strings in `.ts`. No object-form `[class]` keys containing spaces.
- **Files:** stay under about 300 lines. Prefer generic, reusable small pieces.
- **Forms:** Signal Forms `[formField]` for every control.
- **i18n:** every UI text in all 12 `src/locale/messages.<lang>.json`, with proper translations. Run `npx ng extract-i18n`; the key sets must match `messages.json`.
- **Style:** no new dependencies. Tabs, single quotes, LF.
- **Bundle:** the initial bundle (273.23 kB at the start) must not grow by more than 0.3 kB. Everything new loads lazily. Don't use `NgTemplateOutlet` in lazy code; it was hoisted into main before.
- **Git:** work on branch `feature/trade-routes` from `dev`. **No commits unless the owner asks**; the per-task "commit" steps below are checkpoints for the review package only when the owner has allowed commits.
- **Processes:** never kill processes by image name (`taskkill /IM`, `Stop-Process -Name`, `pkill`). Record the PIDs you start and kill only those. Use your own `--user-data-dir` for headless Chrome. Leave port 4301 alone and use 4302 for a server.
- **Spec constants:**
  - `DOCK_SECONDS = 60` per station, so 120 per trip
  - `MAX_ROWS = 200`
  - `THIN_SHARE = 0.1` of a full hold
  - `HOSTILE_RELATION = -0.01` (a relation at or below it is hostile)
  - Custom ship default: 3,000 m³ container, 3,000 m/s, 5 s charge
  - Performance: the first computation must take under 500 ms on the 9.00 save
- **Test saves:**
  - `E:\Temp\X4\saves\mine\save_001.xml.gz`
  - `C:\Users\criss\OneDrive\Documents\Egosoft\X4\94277680\save\save_005.xml.gz`
  - `E:\Temp\X4\saves\halfdan\save_004.xml.gz`

## Review Focus

1. **A ship that can't carry the ware's transport type.** A liquid ware with a container-only ship gives no route, not a route with 0 units. Tested in Task 2.
2. **A buyer sector that can't be reached.** Missing from the static sector data (mods or unknown DLC), or with no path. The route is skipped and nothing throws. Tested in Task 2.
3. **The same station on both sides.** A trade station that sells and buys the same ware never pairs with itself. Tested in Task 2.
4. **A ware missing from the static data** (a modded ware). Its offers are skipped. Tested in Task 2.
5. **A bad or stale URL.** An unknown ship, sector, ware or route key falls back to the defaults or no selection, without throwing. The same goes for a save without `relations` (schema 3 data). Tested in Task 5.

---

### Task 1: Player relations from the save (schema 4)

**Files:**
- Create: `src/app/savegame/extractors/relations-extractor.ts`, `src/app/savegame/extractors/relations-extractor.spec.ts`
- Modify:
  - `src/app/savegame/read-savegame.ts:47`: register the extractor after `MapExtractor`.
  - `src/app/savegame/savegame-model.ts:1`: `SAVEGAME_SCHEMA_VERSION = 4`.
  - `src/app/savegame/map/save-map-model.ts`: add `export type SaveRelations = Record<string, number>;`.
  - `scripts/check-savegame.mts`: print `relations: N factions, hostile: a, b, …` (relation ≤ −0.01).
  - The existing store or upgrade specs that assert version 3, if any hard-code it.

**Interfaces:**
- Produces: `data['relations']` is a `SaveRelations`, mapping faction id to relation in −1..1 (relation plus booster, clamped). The key is `'relations'`. A faction that isn't listed means 0.

- [ ] **Step 1: Write the failing tests** in `relations-extractor.spec.ts`. Feed XML through the same runner the other extractor specs use (see `map-extractor.spec.ts` for the helper). Tests:
  - `reads the player relations`: `<savegame><universe><factions><faction id="player"><relations><relation faction="split" relation="-0.032"/><relation faction="xenon" relation="-1"/></relations></faction></factions></universe></savegame>` → `{ split: -0.032, xenon: -1 }`.
  - `adds boosters and clamps`: a relation of `argon` 0.99 plus `<booster faction="argon" relation="0.02454" time="1"/>` gives `argon` 1. A booster alone, for `teladi` 0.02292, gives `teladi` 0.02292.
  - `ignores other factions' relations`: `<faction id="argon"><relations><relation faction="xenon" relation="-1"/></relations></faction>` adds nothing.
  - `returns an empty object when there is no player faction`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx ng test --watch=false --include src/app/savegame/extractors/relations-extractor.spec.ts`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `RelationsExtractor implements XmlExtractor<SaveRelations>`** with `key = 'relations'`.
  - Match the paths `savegame/universe/factions/faction/relations/relation|booster`, with the depth check first, the way `InfoExtractor` does it.
  - Track whether the open `faction` has `id="player"`. Finish once that faction closes.
- [ ] **Step 4: Run the tests and confirm they pass.** Also bump the version, and run the savegame store specs (`--include src/app/savegame`). Expected: PASS. The upgrade path (`savegame-store.ts:252`) re-extracts kept files from 3 to 4 with no code change; confirm with the existing upgrade spec.
- [ ] **Step 5: Run the check script.** Run `npx -y tsx scripts/check-savegame.mts` on the three test saves. Expected: `relations` is among the extractors listed. `save_005` shows `split -0.032` and `terran -0.032` as hostile, and `xenon -1`.
- [ ] **Step 6: Commit** (only if the owner allowed it). Message: `Extract player faction relations from savegames (#117)`.

---

### Task 2: Route calculation

**Files:**
- Create:
  - `src/app/trade/trade-route-model.ts`: types and constants
  - `src/app/trade/travel-cache.ts`: travel times per start sector
  - `src/app/trade/trade-route-finder.ts`: pairs, cargo, time, filters, sort
  - `src/app/trade/trade-route-finder.spec.ts`, `src/app/trade/travel-cache.spec.ts`

**Interfaces:**
- Consumes:
  - `SaveMap`, `SaveStation`, `SaveOffer` and `SaveRelations` (Task 1)
  - `RoutePlanner.travelTimes(sectors, from, { speed, charge })` and `TravelTimes.route(to)` (`src/app/map/route-planner.ts`)
  - `Sector` from `shared/services/model/model`
- Produces (exact):

```ts
// trade-route-model.ts
export class TradeRules {
	static readonly DOCK_SECONDS = 60;
	static readonly MAX_ROWS = 200;
	static readonly THIN_SHARE = 0.1;
	static readonly HOSTILE_RELATION = -0.01;
}
/** m³ per cargo type id ('container' | 'solid' | 'liquid' | 'condensate'), lower case */
export interface TradeShipSpec { capacity: Readonly<Record<string, number>>; speed: number; charge: number }
/** transport is the cargo type id in lower case; illegalIn holds faction ids */
export interface TradeWareInfo { volume: number; transport: string; illegalIn: readonly string[] }
export interface TradeFilters { near?: string; maxJumps?: number; ware?: string; hideHostile: boolean; playerOnly: boolean }
export interface TradeInput {
	map: SaveMap;
	relations?: SaveRelations;
	sectors: readonly Sector[];
	ware(id: string): TradeWareInfo | undefined;
	ship: TradeShipSpec;
	filters: TradeFilters;
}
export interface TradeRoute {
	/** `${seller.code}~${buyer.code}~${ware}` */
	key: string;
	ware: string;
	seller: SaveStation;
	buyer: SaveStation;
	/** Cr per unit paid at the seller, received at the buyer */
	buyPrice: number;
	sellPrice: number;
	margin: number;
	units: number;
	profit: number;
	/** seller → buyer */
	jumps: number;
	/** seconds seller → buyer, without docking */
	travelSeconds: number;
	/** seconds near sector → seller; 0 without a near sector */
	startSeconds: number;
	/** startSeconds + travelSeconds + 2 * DOCK_SECONDS */
	seconds: number;
	profitPerMinute: number;
	thin: boolean;
	playerOnly: boolean;
	illegal: boolean;
}
export interface TradeRouteResult { routes: TradeRoute[]; total: number }

// travel-cache.ts
export class TravelCache {
	constructor(sectors: readonly Sector[], options: RouteOptions);
	/** undefined when `from` is not a known sector */
	from(sector: string): TravelTimes | undefined;
	/** cached per from>to; undefined when unreachable */
	route(from: string, to: string): Route | undefined;
}

// trade-route-finder.ts
export class TradeRouteFinder {
	static find(input: TradeInput, cache?: TravelCache): TradeRouteResult;
	static capacityFor(ship: TradeShipSpec, ware: TradeWareInfo): number;
	static isHostile(owner: string, relations: SaveRelations | undefined): boolean;
}
```

- [ ] **Step 1: Write the failing tests.** The fixture is three sectors in a chain, `a` ↔ `b` ↔ `c`, with gates at (0, 0), plus sector `x` with no gates. Build them like `route-planner.spec.ts` does.
  - **Wares:**
    - `ec`: volume 6, container
    - `water`: volume 6, liquid
    - `spice`: volume 1, container, `illegalIn: ['argon']`
  - **Ship:** `{ capacity: { container: 3000 }, speed: 3000, charge: 5 }`.

  Tests in `trade-route-finder.spec.ts`:
  - `pairs a seller with a richer buyer`: S1 in `a` sells `ec` at 10 (amount 5000). B1 in `c` buys `ec` at 16 (amount 400).
    - Expect one route with margin 6, `units` 400 (demand cap), `profit` 2400 and `jumps` 2.
    - Expect `seconds === travelSeconds + 120` and `profitPerMinute === 2400 / (seconds / 60)`.
  - `caps units by the hold`: amounts 5000/5000 give `units` 500 (3000 / 6).
  - `skips wares the ship cannot carry`: a `water` route gives no routes (Review Focus 1).
  - `skips unprofitable and same-station pairs`: a buy price ≤ the sell price gives none. A station that both sells and buys `ec` doesn't pair with itself (Review Focus 3).
  - `skips unreachable and unknown sectors`: a buyer in `x`, and a buyer in sector `nope`, give none and don't throw (Review Focus 2).
  - `skips unknown wares`: offers for `modware` give none (Review Focus 4).
  - `skips construction sites, wrecks and empty offers`.
  - `hides hostile owners at -0.01 and below`:
    - relations `{ split: -0.01 }`: a split buyer is hidden.
    - `{ split: -0.0099 }`: it's kept.
    - player-owned stations are never hidden.
    - `hideHostile: false` keeps everything.
    - `relations: undefined` hides nothing.
  - `player-only offers follow the filter and are marked`: `playerOnly: false` drops them. `true` keeps them, with `route.playerOnly === true`.
  - `marks illegal wares`: a `spice` route whose buyer's sector is owned by `argon` in `map.sectors` is `illegal`.
  - `marks thin routes`: 200 units of a 500 hold (40%) is not thin; 40 of 500 (8%) is thin.
  - `near sector adds the empty leg and limits jumps`:
    - `near: 'c', maxJumps: 1`: a seller in `a` (2 jumps) is dropped, and a seller in `b` is kept with `startSeconds > 0`.
    - Without `near`, `startSeconds` is 0.
  - `filters by ware`.
  - `sorts by profit per minute and keeps the top 200`: 250 profitable pairs give `routes.length` 200 and `total` 250, sorted descending.

  Tests in `travel-cache.spec.ts`:
  - `reuses travel times per start sector`: spy on `RoutePlanner.travelTimes`; two `from('a')` calls run it once.
  - `returns undefined for unknown sectors`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx ng test --watch=false --include src/app/trade`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Group offers by ware into sellers and buyers once. Skip unknown wares and stations with a `state`.
  - For each seller offer, look up `TravelCache.from(seller.sector)` once, then loop over the buyers.
  - `jumps` and `travelSeconds` come from `cache.route(seller.sector, buyer.sector)`.
  - Same-sector trades: `jumps` 0, and `travelSeconds` is the `time` the travel times give for the sector itself (0 is fine).
  - `capacityFor` returns `ship.capacity[ware.transport] ?? 0`.
  - Sorting: partial sort is not required. Sort all routes and slice to `MAX_ROWS`; measure in Task 6.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `npx ng test --watch=false --include src/app/trade`. Expected: PASS.
- [ ] **Step 5: Commit** (only if allowed). Message: `Find trade routes from savegame offers (#117)`.

---

### Task 3: Ships for trading

**Files:**
- Create:
  - `src/app/shared/services/travel-drives.ts`: holds `fastestTravelEngine`, moved out of `MapStore` (`map/map-store.ts:396`) so the trade page doesn't import the map store.
  - `src/app/trade/trade-ships.ts`, `src/app/trade/trade-ships.spec.ts`
- Modify: `src/app/map/map-store.ts` to use `TravelDrives.fastest`, with no behaviour change.

**Interfaces:**
- Consumes: `Ship` (`cargo?: { max; types: { id }[] }[]`), `ShipStatsService.maxStats(ship).travel` and `.engines(ship)`, `Ware.transport` (`'Container' | 'Liquid' | 'Solid'`, so lowercase it), `Ware.volume`, `Ware.illegal?: Faction[]`.
- Produces:

```ts
export class TravelDrives {
	static fastest(stats: ShipStatsService, ship: Ship): Equipment | undefined; // same result as MapStore.fastestTravelEngine
}
export class TradeShips {
	static readonly CUSTOM: TradeShipSpec; // { capacity: { container: 3000 }, speed: 3000, charge: 5 }
	/** ships with cargo and a travel drive, by name */
	static list(ships: readonly Ship[], stats: ShipStatsService): Ship[];
	static spec(ship: Ship, stats: ShipStatsService): TradeShipSpec; // capacity summed per types[].id
	static custom(volume: number, type: string, speed: number, charge: number): TradeShipSpec;
	static wareInfo(ware: Ware): TradeWareInfo; // transport lower-cased, illegalIn = illegal ids
}
```

- [ ] **Step 1: Write the failing tests:**
  - `sums cargo per type`: a ship with cargo `[{ max: 2300, types: [container] }, { max: 500, types: [container, solid] }]` gives `{ container: 2800, solid: 500 }`.
  - `takes speed and charge from the fastest travel drive`.
  - `lists only ships with cargo and travel speed`.
  - `maps a ware to its transport id`: `'Container'` gives `'container'`, and `illegal: [loanshark]` gives `['loanshark']`.
- [ ] **Step 2: Run them and confirm they fail.**
- [ ] **Step 3: Implement.** Move `fastestTravelEngine` into `TravelDrives.fastest` and update `MapStore`. The map specs must still pass.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `npx ng test --watch=false --include src/app/trade --include src/app/map`. Expected: PASS.
- [ ] **Step 5: Commit** (only if allowed).

---

### Task 4: Route map component

**Files:**
- Create:
  - `src/app/map/route-map/route-map.component.{ts,html,spec.ts}`
  - `src/app/map/route-map/route-map-dialog.component.{ts,html}`
- Reuse: `MapGeometry` (`shapeById`, `layout.links`), `PanZoom`, `GalaxyLayout`, `AppDialog` (size `xl`). Follow `sector/components/sector-map.component.*` for the resize observer, pan, zoom, wheel and expand.

**Interfaces:**
- Produces:

```ts
@Component({ selector: 'app-route-map', providers: [MapGeometry] })
export class RouteMapComponent {
	/** sector ids in travel order; empty draws nothing */
	readonly path = input.required<readonly string[]>();
	readonly fill = input(false);
	reset(): void; // fits the path's hexes plus one hex radius of margin
	expand(): void; // opens RouteMapDialogComponent with the same path
}
```

- [ ] **Step 1: Write the failing tests** in `route-map.component.spec.ts`:
  - `draws a hex per path sector and a line through them`: `path` `['cluster_14_sector001', 'cluster_13_sector001']`, which are real ids. Expect 2 `polygon[data-path]` and one `polyline` with 2 points.
  - `marks the start and the end`: the elements `[data-end="start"]` and `[data-end="end"]` exist.
  - `draws nothing for an empty path` and `ignores unknown sector ids`.
  - `expand opens the dialog` (spy on `AppDialog.open`).
- [ ] **Step 2: Run them and confirm they fail.**
- [ ] **Step 3: Implement.**
  - Draw the sectors near the path (their bounding box plus a margin) dimmed, for context. Draw the path sectors in the owner colours, which come from the save sectors when there is a save (`MapSaveLayer.sectors()`), as the sector map does.
  - Draw the route line, and the start (seller) and end (buyer) markers.
  - Include zoom buttons, the expand button and keyboard-accessible controls. The labels are i18n.
  - Changing `path` refits the view.
- [ ] **Step 4: Run the tests and confirm they pass.**
- [ ] **Step 5: Commit** (only if allowed).

---

### Task 5: Trade routes page

**Files:**
- Create:
  - `src/app/trade/trade-routes-store.ts`: filters, URL sync and results
  - `src/app/trade/components/trade-routes-page.component.{ts,html,spec.ts}`
  - `src/app/trade/components/trade-route-details.component.{ts,html}`: route map, steps, stock and demand of the selected route
- Modify:
  - `src/app/app.routes.ts`: add `{ path: 'trade-routes', loadComponent: () => import('./trade/components/trade-routes-page.component') }`
  - `src/app/header.component.ts:50`: add the nav link `{ path: '/trade-routes', label: $localize\`Trade Routes\`, icon: LucideArrowLeftRight }` after Map
  - `src/locale/messages*.json`

**Interfaces:**
- Consumes:
  - `TradeRouteFinder`, `TravelCache` and `TradeRules` (Task 2)
  - `TradeShips` (Task 3)
  - `RouteMapComponent` (Task 4)
  - `SavegameStore.active()`: `data['map']` is a `SaveMap`, and `data['relations']` is a `SaveRelations` (or `undefined` for schema-3 data)
  - `StationNamer`, `SiteNamingTables` and `StationTypes`, as `sector-stations.component.ts` uses them for station names
  - `app-data-grid`: `data`, `columns`, `trackBy`, `clickable` and `(rowClick)`
- Produces, as URL query params:
  - `ship` (a ship id or `custom`)
  - `cargo`, `cargoType`, `speed`, `charge` (custom only)
  - `near` (sector id), `jumps`, `ware`
  - `hostile=1`, to show hostile stations (hiding them is the default)
  - `shady=0`, to exclude player-only offers (including them is the default)
  - `route` (a `TradeRoute.key`)

  Defaults are left out of the URL.

- [ ] **Step 1: Write the failing tests** in `trade-routes-page.component.spec.ts`. Use a `SavegameStore` stub with a tiny `SaveMap`, as the sector stations spec does.
  - `shows the empty state without a save`: the text includes "Load a savegame", plus a link to `/saves`.
  - `lists routes sorted by profit per minute`.
  - `reads filters from the URL`: `?ware=ec&near=…&jumps=1` set the form, and the table respects them.
  - `writes filters to the URL`: changing the ware updates `ware=`, and defaults are left out.
  - `selecting a row sets ?route= and passes the path to the route map`.
  - `ignores unknown query values` (Review Focus 5): `?ship=nope&near=nope&ware=nope&route=a~b~c` renders with the defaults and no selection.
  - `shows the reload note when the save has no relations` (Review Focus 5).
  - `shows the price note` with the save name and game time.
- [ ] **Step 2: Run them and confirm they fail.**
- [ ] **Step 3: Implement.**
  - **Store:** a model signal plus `form()` (Signal Forms), the same pattern as the `MapStore.routeModel`. URL sync uses `Router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true })`. The model initialises from `ActivatedRoute.snapshot.queryParamMap`.
    - `result` is a `computed` that calls `TradeRouteFinder.find`.
    - `TravelCache` is kept in a `computed` keyed on speed and charge, so filter changes reuse it.
    - The selected route comes from `?route=`, or the first row.
  - **Page layout:** layout B. Filters sit on top. Below them, the table (grid) and the details panel (`app-route-map` plus steps from `cache.route(...)`, stock and demand) sit side by side at `lg` and stack below that.
  - **Columns:**
    - Ware (link)
    - Buy at (station name, owner, sector link)
    - Sell at
    - Margin, Units, Profit/trip
    - Jumps
    - To start (only with near)
    - Time
    - Profit/min (the default sort, descending)
  - **Markers:** player-only, illegal and thin, with `title` text, all i18n.
  - **Price note:** "Prices as of save time ({{ saveName }}, {{ gameTime }}). Prices change quickly in game; large offers are more reliable."
  - **Count note:** "Showing the top 200 of {{ total }} routes."
- [ ] **Step 4: Run the tests and confirm they pass.** Then run `npx ng extract-i18n` and add translations for all 12 locales.
- [ ] **Step 5: Commit** (only if allowed).

---

### Task 6: Measure and verify

- [ ] **Step 1: Add the timing to the check script.** Extend `scripts/check-savegame.mts` to print the top 10 routes for `TradeShips.CUSTOM`, the total count, and the `TradeRouteFinder.find` time. The script needs static sectors and wares: import `sectors-data.ts` and `wares-data.ts` directly, as data modules. Run it on the three test saves. **Expected:** the find time is under 500 ms each. If not, prune to the best 5 buyers per seller offer (spec), and re-measure.
- [ ] **Step 2: Run the build checks.** Run `npx ng test --watch=false`, `npx ng lint` and `npx ng build` once each. **Expected:** all pass, and the initial bundle is ≤ 273.53 kB.
- [ ] **Step 3: Check the page in headless Chrome.** Use your own `--user-data-dir`, a server on port 4302, and kill only your own PIDs.
  - Load `save_005` on `/saves`, then open `/trade-routes`.
  - Take screenshots at 1280 px and 375 px: the default view, then a selected route with `near` set.
  - Save them to `C:\Users\criss\AppData\Local\Temp\claude\d--Work-x4-extractor\79f98f09-7cea-4e8e-843b-31efe91eabb7\scratchpad\shots\`.
  - Confirm that `scrollWidth` equals the viewport width at 375 px.
