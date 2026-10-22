# Savegame on the Universe Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** With a save active, `/map` shows that game's stations at their exact position with the game's (translated) names, the save's sector owners and contested flags, discovery dimming with a "Discovered only" switch, player stations highlighted and player ships as per-sector counts.

**Architecture:** The C# extractor exports a zone-position table and the naming tables (with English text, so the site's existing game-text translation covers them). In the web app, a generic `ElementStack` lets a new `map` save extractor (web worker) record sectors, stations and player-ship counts as raw ingredients; schema 2 re-extracts stored saves. Pure functions resolve station type, name and position; a `MapSaveLayer` service turns the active save into map-ready items, and `MapStore` consumes it. The save storage moves heavy `data` into its own object store and opens lazily.

**Tech Stack:** C# (net7.0, Newtonsoft.Json) extractor; Angular 22 (signals, Signal Forms), Tailwind 4, vitest via `@angular/build:unit-test`, IndexedDB, module Web Worker.

**Spec:** `docs/superpowers/specs/2026-10-22-savegame-map-design.md` (builds on `2026-10-22-savegame-loading-design.md`)

## Global Constraints

- Two repos, **no commits** (the user commits on request, each repo separately): `D:\Work\x4-extractor` (master) and `D:\Work\x4` (branch `feature/savegame-loading`). Each task ends with a "ready to commit" checkpoint listing files.
- Code generic and reusable wherever it can be; every file **under 300 lines** (`src/app/map/map-store.ts` is 483 lines today: it must not grow — new map logic goes into new files, and Task 7 moves the stations section out of it).
- No new npm or NuGet dependencies.
- Controls bind with Signal Forms `[formField]`.
- All UI text `i18n`/`$localize`; run `npx ng extract-i18n` and add every new id to all 12 `src/locale/messages.<lang>.json` (key sets must match `messages.json`).
- Game names are stored as **English text** in data files and translated by `core/game-text.ts` (`translateGameText` walks `TEXT_KEYS`; runtime lookup is `gameText(english)`). Never store a translated or composed name in the save.
- Data files copied from `D:\Work\x4-extractor\X4Extractor\bin\Debug\net7.0\output\` to `D:\Work\x4\src\app\shared\services\data\` with CRLF stripped; `output/i18n/*.json` to `src/assets/i18n/`.
- Ids in the app: macro names lowercased without `_macro` (sector `cluster_01_sector001`, zone `zone004_cluster_409_sector001`).
- Positions in km; save/game files are metres. Zone position + station position = sector position (zones never rotate).
- Without an active save (or while its map data is missing) the map behaves exactly as today.
- Save code stays lazy (worker / map chunk / `/saves` chunk); the initial bundle must not grow by more than 1 kB.
- Tabs, single quotes, LF, match existing style. Test saves: `E:\Temp\X4\saves\mine\save_001.xml.gz` (9.00), `E:\Temp\X4\saves\halfdan\save_004.xml.gz` (7.10). Unpacked game data: `E:\Temp\X4\Unpacked`.
- Commands: one spec `npx ng test --watch=false --include=<path>`; all `npx ng test --watch=false`; `npx ng lint`; `npx ng build`; extractor `dotnet run --project X4Extractor` in `D:\Work\x4-extractor`; save check `npx -y tsx scripts/check-savegame.mts <files>`.

## Review Focus

1. A save sector, station owner, module, ware or text id the site data doesn't know (newer game, mod) must be skipped or fall back, never crash or show a raw id — naming test `falls back when tables lack the module, ware and text` (Task 5) and layer test `skips stations in sectors the site does not know` (Task 6).
2. A station in a tempzone with no `<position>` sits at the zone's position — extractor test `places a station without position at its zone` (Task 4).
3. Upgrading a browser that already holds v1 saves keeps them and moves their data — repository test `upgrades version 1 records and keeps them` (Task 3).
4. An active save that has no map data yet (updating, or reload needed) shows today's map plus a note — layer test `is inactive while the save has no map data` (Task 6).
5. A visitor without stored saves never opens IndexedDB — store test `does not open the repository without the saves flag` (Task 3).

---

### Task 1: Extractor — zone positions

**Files (D:\Work\x4-extractor):**
- Create: `X4Extractor/Writers/ZoneWriter.cs` (or a class in `Writers/UniverseWriter.cs` if that file stays < 300 lines)
- Modify: `X4Extractor/Program.cs` (`WriteUniverse`, ~:359-373)
- Web (D:\Work\x4): Create `src/app/shared/services/data/zones-data.ts` (copied output), `src/app/shared/services/model/universe.ts` (+ `Zone`)

**Interfaces:**
- Produces `zones-data.ts`: `export const Zones = { ...entities, all: [...] }` in the `JsonEntityWriter` keyed format, not translated; entity `Zone { id: string; sector: string; x: number; z: number }` — id = zone macro lowercased without `_macro` (covers `tzonecluster_*`), sector = sector id, x/z = zone offset in the sector in km rounded to 0.1 (same rounding as gates, `Universe.cs:216`).
- Source: `Sector.Zones` (macro → connection) + `Sector.ZoneOffsets` (connection → metres), base + all DLCs.

- [ ] **Step 1:** Implement `ZoneWriter : JsonEntityWriter<(Sector sector, string macro, double x, double z)>` with `Name => "Zones"`, `TranslatedExport => null`; call it from `WriteUniverse` writing file `zones`.
- [ ] **Step 2:** Run the extractor. Expected: `output/zones-data.ts` exists with ~840 entries; `zone004_cluster_409_sector001` and `tzonecluster_01_sector001shcon5_gatezone` present.
- [ ] **Step 3:** Copy to the web app (LF), add `Zone` to `universe.ts`. Verify coverage with a throwaway node/tsx script over both test saves: every `class="zone"` with `<offset default="1"/>` that contains a station resolves in `Zones` — expected 100% (787/787 and 777/777) and `shipyard_argon_01` ends at (-70.7, 81.1) km ±0.1.
- [ ] **Step 4:** Ready to commit (extractor: writer + Program.cs; web: zones-data.ts, universe.ts).

### Task 2: Extractor — naming tables

**Files (D:\Work\x4-extractor):** `Program.cs` (Faction class ~:1068, WareGroup ~:927, LoadMacros), `Writers/FactionWriter.cs`, `Writers/WareGroupWriter.cs`, Create `Writers/StationMacroWriter.cs`, `Writers/GameTextWriter.cs`.
**Files (D:\Work\x4):** copy `factions-data.ts`, `ware-groups-data.ts`, new `station-macros-data.ts`, `game-texts-data.ts`, `src/assets/i18n/*.json`; Modify `model/faction.ts` (+`shortName?: string`), `model/ware.ts` (`WareGroup` + `priority: number`), `core/game-text.ts` (`TEXT_KEYS` + `'shortName'`).

**Interfaces:**
- `Factions.<id>.shortName`: English short name from `factions.xml` `shortname` (e.g. argon → `ARG`, freesplit → `FRF`), translated through `TEXT_KEYS`.
- `WareGroups.<id>.priority`: `waregroups.xml` `priority` (hightech 11, shiptech 10).
- `station-macros-data.ts`: `export const StationMacros = { ...entities, all }`, entity `{ id: string; name: string }` — every station macro (`class="station"` macros, e.g. `station_gen_factory_base_01` → `Factory`, `station_arg_tradestation`, `station_gen_piratebase`, xenon/kha'ak landmarks) with its `identification name` in English; translated.
- `game-texts-data.ts`: `export const GameTexts: Record<string, { name: string }>` keyed `'page,id'` (e.g. `'20102,1441'` → `{ name: 'Xenon Wharf' }`) for all of pages 20102 and 20103 plus every page referenced by a station `name="{p,id}"` in the test saves; English with `(...)` comments stripped exactly like `Translator.Translate`; file ends with `translateGameText(GameTexts)`.
- Every new English text gets its translations into `output/i18n/<lang>.json` through the existing translator flow.

- [ ] **Step 1:** Add `ShortName` to Faction parsing/writer, `Priority` to WareGroup parsing/writer.
- [ ] **Step 2:** Add `StationMacroWriter` (from the loaded macro index, class `station`) and `GameTextWriter` (pages above); write both from `Main`.
- [ ] **Step 3:** Run the extractor. Expected: `Factions.argon.shortName === 'ARG'`, `WareGroups.hightech.priority === 11`, `StationMacros.station_gen_factory_base_01.name === 'Factory'`, `GameTexts['20102,1441'].name === 'Xenon Wharf'`, `GameTexts['20102,2011'].name === 'Headquarters'`, and `de.json` contains a translation for `ARG` or `Xenon Wharf`'s hash (check `Schiffswerft`/`Raumdock` texts appear).
- [ ] **Step 4:** Copy data + i18n into the web app; `npx ng build` and `npx ng test --watch=false` pass (existing data consumers unchanged).
- [ ] **Step 5:** Ready to commit (both repos).

### Task 3: Save storage — data store split and lazy opening

**Files:**
- Modify: `src/app/core/storage/indexed-db-store.ts`, `src/app/savegame/savegame-repository.ts`, `src/app/savegame/savegame-store.ts`, `src/app/savegame/components/savegames-page.component.ts`, `src/app/savegame/components/savegame-selector.component.ts`
- Tests: `savegame-repository.spec.ts`, `savegame-store.spec.ts`, Create `src/app/core/storage/indexed-db-store.spec.ts` only if fake IndexedDB is unavailable — otherwise test the upgrade through the repository with `MemoryKeyValueStore` doubles.

**Interfaces:**
- `openIndexedDb(name, version, stores, upgrade?: (db: IDBDatabase, tx: IDBTransaction, oldVersion: number) => void)` — `upgrade` runs inside `onupgradeneeded` after missing stores are created.
- `createSavegameRepository(summaries: KeyValueStore<SavegameListItem>, data: KeyValueStore<Record<string, unknown>>, files: KeyValueStore<Blob>, persistent: boolean)`; `list()` reads only `summaries`; `get(id)` returns summary + data (`data` `{}` when missing); `save` writes file, data, summary (rolls back data + file when the summary write fails); `remove` deletes all three.
- `openSavegameRepository()`: `x4-savegames` **version 2**, stores `saves`, `data`, `files`; upgrade from 1 moves each `saves` record's `data` into `data` and rewrites the record without it.
- `SavegameStore`: new `open(): void` (idempotent) — opens the repository and initializes. The constructor opens only when local storage flag `savegames` is `'1'` (via `core/services/local-storage.ts`). The flag is set to `'1'` after a refresh that lists ≥ 1 save and removed when the list is empty. `load()` calls `open()` itself. The saves page calls `open()` on init. Until opened, `saves()` is `[]`, `persistent()` and `storage()` are `null`.
- Selector: with no saves and the store not opened it shows the "Load save" link (unchanged look) without opening anything.

- [ ] **Step 1:** Write failing tests: repository `list does not read data` (data store spy has no calls), `get joins summary and data`, `upgrades version 1 records and keeps them` (unit-test the pure upgrade helper `moveSummaryData(record): { summary, data }`), `remove deletes summary, data and file`; store `does not open the repository without the saves flag`, `opens after open() and sets the flag when saves exist`, `clears the flag when the last save is removed`.
- [ ] **Step 2:** Run them — FAIL.
- [ ] **Step 3:** Implement as above; the repository factory token stays `SAVEGAME_REPOSITORY` (`() => Promise<SavegameRepository>`), now invoked lazily.
- [ ] **Step 4:** Run the savegame specs and the full suite — PASS. `npx ng build`: initial total not above 269.0 kB.
- [ ] **Step 5:** Ready to commit.

### Task 4: Generic element stack and the `map` save extractor

**Files:**
- Create: `src/app/core/xml/element-stack.ts` (+ spec)
- Create: `src/app/savegame/map/save-map-model.ts`, `src/app/savegame/extractors/map-extractor.ts` (+ spec), `src/app/savegame/testdata/map-fixture.ts`
- Modify: `src/app/savegame/read-savegame.ts` (register extractor), `savegame-model.ts` (`SAVEGAME_SCHEMA_VERSION = 2`), `scripts/check-savegame.mts` (print map counts)

**Interfaces:**
- ```ts
  /** Keeps a selected value for each open element the selector accepts; entries pop when their element closes. */
  export class ElementStack<T> {
  	constructor(select: (name: string, path: readonly string[], attrs: () => XmlAttributes) => T | undefined);
  	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void;
  	close(name: string, path: readonly string[]): void;
  	/** innermost first */
  	nearest(match: (value: T, depth: number) => boolean): { value: T; depth: number } | undefined;
  	readonly size: number;
  }
  ```
  `depth` = `path.length` at open.
- ```ts
  export interface SaveSector { id: string; owner: string; contested: boolean; known: boolean }
  export interface SaveStation {
  	code: string; macro: string; owner: string; sector: string;
  	/** predefined zone id; x/z are then relative to that zone, else relative to the sector */
  	zone?: string;
  	x: number; z: number; // km, rounded to 0.1
  	known: boolean;
  	state?: 'construction' | 'wreck';
  	name?: string; basename?: string; nameIndex?: number;
  	/** <production originalproduct> directly under the station */
  	product?: string;
  	/** distinct module ids from construction/sequence/entry@macro, lowercased without _macro */
  	modules: string[];
  }
  /** sector id -> player ship counts [xs, s, m, l, xl] */
  export type ShipCounts = Record<string, [number, number, number, number, number]>;
  export interface SaveMap { sectors: SaveSector[]; stations: SaveStation[]; playerShips: ShipCounts }
  ```
  `data.map: SaveMap`. Extractor `createMapExtractor(): XmlExtractor<SaveMap>`, key `'map'`, done only at end of input.
- Rules: a component counts only with a sector ancestor (excludes `universe/jobs` and highway-only ships); tempzone position (zone with `<offset><position>`) is added into the station x/z and `zone` is omitted; a zone with `<offset default="1"/>` sets `zone`; missing station position = 0; `knownto="player"` → known; `buildstorage` ignored; ships `class` `ship_xs|s|m|l|xl` with `owner="player"` counted in their sector (docked ones too); station `name`, `basename`, `nameindex`, `state` (`construction|wreck` only) copied.

- [ ] **Step 1:** Write `element-stack.spec.ts`: `tracks nested selected elements and pops on close`, `nearest returns the innermost match with its depth`, `ignores elements the selector rejects`.
- [ ] **Step 2:** Build `map-fixture.ts` (TS string constant, trimmed from the real saves, ~80 lines): one cluster, a contested known sector owned by `freesplit`, a tempzone station with position, a tempzone station without position, a default-zone station (`zone004_…`) with `<production originalproduct="energycells"/>` and two `construction/sequence/entry` modules (one repeated), a player station with `nameindex="2"` and a docked player `ship_s`, a player `ship_l` in space, a `buildstorage`, and a `universe/jobs` ship.
- [ ] **Step 3:** Write `map-extractor.spec.ts` tests on the fixture: `reads sector owner, contested and known`, `adds the tempzone position to the station`, `places a station without position at its zone`, `keeps the predefined zone id for default zones`, `reads naming ingredients and distinct modules`, `counts player ships per sector including docked ones`, `ignores build plots and job ships`, and one test feeding the fixture in 7-character chunks yielding the same result.
- [ ] **Step 4:** Run — FAIL. Implement. Run — PASS; full suite PASS.
- [ ] **Step 5:** `npx -y tsx scripts/check-savegame.mts` on both test saves: prints sector/station/player-ship counts (expected 152/1455/2 and 144/1625/832 ± build plots/job ships excluded per rules) and timing (must stay within 1.5× of the info-only timing: 2.0 s and 4.3 s today).
- [ ] **Step 6:** Ready to commit.

### Task 5: Station type and name rules (pure)

**Files:**
- Create: `src/app/core/format/roman.ts` (+ spec), `src/app/core/game-text-ref.ts` (+ spec)
- Create: `src/app/savegame/map/station-type.ts`, `src/app/savegame/map/station-name.ts` (+ specs)
- Modify: `src/app/shared/services/constants.ts` (`STATION_TYPES` + `factory` `F`, `other` `O`, both `$localize` labels)

**Interfaces:**
- `toRoman(n: number): string` (1 → `I`, 4 → `IV`, 15 → `XV`, ≤ 0 → `''`).
- `resolveTextRef(ref: string, texts: Record<string, { name: string }>): string | undefined` — `'{20102,1441}'` → `texts['20102,1441'].name` (already translated); anything not of that form → `undefined`.
- ```ts
  export type StationTypeId = (typeof STATION_TYPES)[number]['id']; // + 'factory' | 'other'
  export interface StationModuleInfo { type: string; macro: string; product: string[] } // from Modules by macro
  export function stationType(station: SaveStation, modules: (id: string) => StationModuleInfo | undefined): StationTypeId;
  ```
  First that applies: macro `station_gen_piratebase*`/`*piratebase*` → `piratebase`; macro `*tradestation*` → `tradestation`; a module `buildmodule_*_ships_l*`/`_xl*` → `shipyard`; only `_ships_m`/`_ships_s` build modules → `wharf`; `buildmodule_*_equip*` → `equipmentdock`; only defence modules, or `basename` resolving to a Defence Platform text → `defence`; any production/processing module → `factory`; else `other`.
- ```ts
  export interface NamingTables {
  	factionShort(owner: string): string | undefined;
  	sectorName(sector: string): string | undefined;
  	text(ref: string): string | undefined;          // resolveTextRef over GameTexts
  	macroName(macro: string): string | undefined;   // StationMacros
  	wareFactoryName(ware: string): string | undefined;
  	wareGroup(ware: string): { factoryName: string; priority: number } | undefined;
  	module(id: string): StationModuleInfo | undefined;
  }
  export function stationName(station: SaveStation, tables: NamingTables): string;
  ```
  Rules (spec "How the game names stations"): `name` literal or resolved ref wins (unresolved ref → continue); NPC = `short + ' ' + base` with base = `basename` text → `product` factory name → highest-priority group factory name of production-module products → `macroName` → `'Factory'` text; player = HQ `basename` text alone; else `sector + ' ' + type + ' ' + roman(nameIndex)`, type from build/scrap/production-group/defence modules (texts `20102,1071` shipyard, `1081` wharf, `1061` equipment dock, scrap → ware factory name of the scrap product or `20102,1091`, `1041` defence platform), no modules → `sector + ' ' + 'Factory'` without numeral. Pieces missing at the end → the station `code`.

- [ ] **Step 1:** Write specs with the spec's examples: roman; text ref; types for each rule; names: NPC basename (`XEN` + Xenon Wharf), NPC original product (`FRF Solar Power Plant`), NPC macro (`TEL` + Trading Station), NPC guess (`TEL Refined Goods Complex`), player shipyard `Heretic's End Shipyard I`, wharf, equipment dock, scrap, production by group priority (microchips + smartchips → High Tech Factory), defence `… Defence Platform II`, empty `Heretic's End Factory`, HQ `Headquarters`, literal rename `ANT Argon Raumdock`, text ref name, and `falls back when tables lack the module, ware and text` (result is never `{…}` nor a macro id).
- [ ] **Step 2:** Run — FAIL. Implement (tables are injected, no data imports in these files). Run — PASS.
- [ ] **Step 3:** Ready to commit.

### Task 6: Map save layer

**Files:**
- Modify: `src/app/map/galaxy-layout.ts` (move `markerPosition` here, exported; `map-store.ts` imports it)
- Create: `src/app/map/save/map-save-layer.ts` (+ spec), `src/app/map/save/naming-tables.ts` (builds `NamingTables` from the data files + `SectorService`/`FactionService`/`Modules`/`Wares`)

**Interfaces:**
- ```ts
  export interface MapSaveStation {
  	station: SaveStation; name: string; type: StationTypeId; faction: Faction | undefined;
  	player: boolean; known: boolean; shape: SectorShape; x: number; y: number;
  	/** km from the sector centre when beyond the 500 km drawing range, else undefined */
  	farKm?: number;
  }
  @Injectable() export class MapSaveLayer {
  	readonly active: Signal<boolean>;              // active save with data.map
  	readonly pending: Signal<boolean>;             // active save without map data yet
  	readonly sectorIds: Signal<ReadonlySet<string> | null>;
  	readonly sectors: Signal<ReadonlyMap<string, SaveSector>>;
  	readonly stations: Signal<MapSaveStation[]>;
  	readonly playerShips: Signal<ReadonlyMap<string, { total: number; bySize: number[] }>>;
  	readonly discoveredOnly: WritableSignal<boolean>; // persistedSignal('map-discovered-only', false)
  }
  ```
  Constructor takes `shapeById` via an injected `MAP_SHAPES` token or a `setShapes(map)` call from `MapStore` — implementer's choice, documented in the file. Position: `zone` → `Zones[zone]` + x/z; sectors not in `shapeById` skipped.

- [ ] **Step 1:** Write specs (with a fake `SavegameStore` exposing `active` signal): `is inactive while the save has no map data`, `resolves zone and tempzone positions`, `skips stations in sectors the site does not know`, `names and types stations through the tables`, `marks far stations with their distance`, `counts player ships per sector`, `discovered only defaults off and persists`.
- [ ] **Step 2:** Run — FAIL. Implement. Run — PASS; `map-store.spec.ts` still PASS after moving `markerPosition`.
- [ ] **Step 3:** Ready to commit.

### Task 7: MapStore uses the save layer

**Files:**
- Create: `src/app/map/map-stations.ts` — the stations section moved out of `map-store.ts` (`stationsModel`, `stationsForm`, `stations`, `stationMarkers`, `buyOptions`, `buyItem`, `sellers`), as `@Injectable() MapStations` provided next to `MapStore`
- Modify: `src/app/map/map-store.ts`, `src/app/map/map.component.ts` (providers), `src/app/map/panels/map-stations-panel.component.ts`, `src/app/map/canvas/map-legend.component.ts`, `src/app/map/canvas/map-layers.ts`, and tests `map-store.spec.ts` + new `map-stations.spec.ts`

**Interfaces / behaviour while `MapSaveLayer.active()`:**
- Sector set = `sectorIds()`; version toggles hidden; links, legend, route planner and mining use the same visible set.
- Owner fill and `ownerLegend` use `SaveSector.owner` (`player` and `ownerless` get colours from `Factions` if present, else `NEUTRAL`).
- `MapStations.stations` comes from `MapSaveLayer.stations` mapped to the existing marker shape plus `name`, `player`, `known`, `farKm`; `factory` and `other` toggles exist (default on) and are shown in the panel only with a save.
- `sellers` uses today's owner rule over save stations of the matching types, excluding `player`; results in unknown sectors carry `known: false`.
- `discoveredOnly()`: hides unknown sectors (shapes, labels, links touching them), their stations and badges; panels unaffected.
- Without a save everything equals today (existing `map-store.spec.ts` passes unchanged except imports).

- [ ] **Step 1:** Move the stations section into `MapStations` with no behaviour change; existing specs PASS; `map-store.ts` drops below 420 lines.
- [ ] **Step 2:** Write failing specs: `uses save owners for fills and legend`, `limits sectors to the save`, `lists save stations with factory and other toggles`, `sells only from non-player stations of the owner`, `discovered only hides unknown sectors, links and stations`, `without a save equals the game-start map`.
- [ ] **Step 3:** Implement; specs PASS; full suite PASS; every touched file < 300 lines except `map-store.ts` (< 420).
- [ ] **Step 4:** Ready to commit.

### Task 8: Rendering — markers by zoom, badges, tooltip, switch

**Files:**
- Create: `src/app/map/canvas/map-save-markers.ts` (`g[appMapSaveMarkers]`, dots ↔ letter markers by zoom, player ring, name labels at closest zoom), `src/app/map/canvas/map-count-badge.ts` (generic SVG count badge: `x`, `y`, `count`, `title` inputs)
- Modify: `map-canvas.component.html` (render save layer instead of station markers while active; contested sectors get a dashed outline; dimmed fill/opacity for unknown sectors), `map-popups.ts` (station tooltip: name, owner, type, code, construction/wreck, far distance), `map.component.html` ("Discovered only" checkbox with `[formField]` and the "Loading save…" note while `pending()`), locales

**Interfaces:** zoom thresholds use `MapStore.scale()`; detail when `scale() >= DETAIL_SCALE`, labels when `>= LABEL_SCALE` — constants in `map-save-markers.ts`, values chosen so all ~1,600 dots show zoomed out and letters show when one cluster fills about a third of the view. Marker lists are `computed` from layer + filters (no per-frame recomputation on pan).

- [ ] **Step 1:** Write component specs: `draws dots when zoomed out and letters when zoomed in`, `rings player stations`, `shows a ship badge per sector with the size split in its title`, `dims unknown sectors and outlines contested ones`.
- [ ] **Step 2:** Run — FAIL. Implement. Run — PASS. `npx ng extract-i18n`; translate new ids in all 12 locales; key sets match.
- [ ] **Step 3:** `npx ng lint`, `npx ng build` (map chunk grows, initial total ≤ 270.0 kB), full suite PASS.
- [ ] **Step 4:** Ready to commit.

### Task 9: Verification

- [ ] **Step 1:** Run the extractor fresh, re-copy data; `git status` in both repos shows only intended files; no CRLF (`git ls-files --eol -o --exclude-standard src`).
- [ ] **Step 2:** `npx -y tsx scripts/check-savegame.mts` on both saves: counts as Task 4, 100% stations positioned (no missing zone), timings recorded.
- [ ] **Step 3:** Browser (`npx ng serve` on a free port) with both saves: v1 saves upgrade and appear on the map without re-upload; owners differ from the no-save map where expected (e.g. cluster_31 player-owned in the 7.10 save); `shipyard_argon_01` sits where the no-save marker sits; names read in English and German (`ARG Argon Schiffswerft`-style); player stations ringed; ship badges; Discovered only hides 127 sectors in the 9.00 save; pan/zoom smooth; dark/light; 375 px.
- [ ] **Step 4:** Report file lists for both repos (ready to commit, separately).
