# Savegame on the universe map — design

Date: 2026-10-22 · Issue: crissian/x4#117 · Status: draft · Builds on: `2026-10-22-savegame-loading-design.md`

## Intent

Savegame loading (the previous piece) lets a player keep saves in the browser and pick an active one. It shows only
the save's header. This piece is the first one that uses the save: when a save is active, the existing universe map
(`/map`) shows **that game's universe** instead of the game-start state — every station where it really is, under
the name the game shows, who owns each sector now, what the player has discovered, and the player's own stations and
ships. It is the base the later trade, economy and fleet pieces read from.

It also does two clean-ups the final review of the previous piece asked for before saves get heavier: the save list
must not read every save's full data, and visitors who never loaded a save must not open the save storage.

## Goals

- With a save active, the map shows all stations of that save at their exact in-sector position (100% of stations
  in both test saves; no "approximate" placement).
- Station names are the names the game shows, in the site's current language (built on screen from game text, not
  stored as finished strings). A station the player renamed shows the exact text from the save.
- Sector owners and the contested flag come from the save.
- Undiscovered sectors and stations are dimmed; a "Discovered only" switch hides them like the in-game map.
- Player stations stand out; player ships appear as a count per sector.
- With no save active, the map is exactly as today.
- Saves already stored are upgraded automatically from their kept file (no re-upload).
- The save list reads only light summaries; the save storage is not opened for visitors who never stored a save.

## Non-goals

- Trade offers, economy, blueprints, fleet details, exploration items (later pieces).
- Individual player-ship markers or ship names on the map (count badges only).
- Station details beyond the tooltip (no station page, no module list).
- Changing the map for people without a save.

## Anti-goals

- Wrong positions or made-up names presented as the game's. Where the naming rule is a guess (see below), the result
  must still be a plausible game-style name, never an internal id.
- A sluggish map: panning and zooming with ~1,600 stations and the save layer on must feel as smooth as today.
- Baking one language into stored data.

## Constraints

- Two repos, committed separately, both only when the user asks:
  - `D:\Work\x4-extractor` (C#, master): exports game data as TS files and per-language game text
    (`output/*-data.ts`, `output/i18n/<lang>.json`). Unpacked game data: `E:\Temp\X4\Unpacked`.
  - `D:\Work\x4` (Angular 22, branch `feature/savegame-loading`): data files copied to
    `src/app/shared/services/data/` (LF), game text to `src/assets/i18n/`, translated at load via `core/game-text.ts`.
- Code generic and reusable, small files (< ~300 lines). Signal Forms for controls. UI text i18n-marked with all 12
  locales. The savegame code and data stay lazy (map chunk / worker), not in the initial bundle.
- The save reader is the streaming scanner + extractors in a web worker from the previous piece
  (`core/xml/`, `savegame/extractors/`). New data comes from a new extractor; `SAVEGAME_SCHEMA_VERSION` goes to 2,
  which triggers the existing background re-extraction of stored saves.

## What the save holds (surveyed on the 9.00 and 7.10 test saves)

- Nesting: `universe > galaxy > cluster > sector > zone > station | ship_*`, each a
  `<component class=... macro=... code="ABC-123" owner=... knownto="player"? id="[0x..]">`, children inside
  `<connections><connection><component>`. Sector and owner of anything come from its ancestors.
- Sectors: `owner=` on every sector (incl. `ownerless`), optional `contested="1"`. Differs from the site's static
  owner in 12 sectors (early 9.00 save) and 30 (late 7.10 save, 8 of them player-owned).
- Discovery: `knownto="player"` on the component itself (clusters, sectors, zones, stations, ships). No other list.
  The `known`/`read` pair is the encyclopedia read flag, not discovery. Known sectors: 25/152 vs 126/144.
- Stations: 1,455 (9.00) and 1,625 (7.10, 31 player). `state="construction"|"wreck"` on a few. `buildstorage`
  siblings are build plots — ignore.
- Positions: `<offset><position x y z/>` in metres, relative to the zone. Zones never rotate, so sector position =
  zone position + station position (missing position = 0). Zone position: a tempzone has its own `<position>`; a
  predefined zone (`zoneNNN_…`, `tzonecluster…`) has `<offset default="1"/>` and its position is in the game's map
  files (`maps/xu_ep2_universe/sectors.xml` and each DLC's `*_sectors.xml`, 840 zones). The extractor already reads
  these (`Universe.cs`, `Sector.ZoneOffsets`) for gate positions. Coverage with that table: 100% in both saves;
  shipyard_argon_01 lands exactly on the site's known (-70.7, 81.1) km.
- Player ships: `class="ship_xs|s|m|l|xl" owner="player"`; 2 (9.00) and 832 (7.10, 466 docked in stations or
  carriers, still nested under their sector). Exclude ships under `universe/jobs` (queued respawns, no sector);
  ships on a highway belong to the highway's sector/cluster.

### How the game names stations (confirmed against names the game wrote into the 7.10 logbook)

- `name="..."` on the station replaces everything: a literal (player rename, e.g. "ANT Argon Raumdock") or a text
  reference `{page,id}`.
- NPC stations: **"<faction short name> <base name>"** (e.g. "ARG Argon Shipyard", "TEL Advanced Electronics
  Factory", "FRF Solar Power Plant"). Base name, first that exists:
  1. `basename="{20102,x}"` (construction plan name, e.g. Xenon Wharf, Paranid Defence Platform);
  2. `<production originalproduct="ware"/>` → that ware's factory name (`wares.xml` `factoryname`);
  3. the station macro's identification name (Factory, Trading Station, Asteroid…).
  Faction short name: `factions.xml` `shortname` (ARG, TEL…). No numeral on NPC names.
- Player stations: **"<sector name> <type> <roman nameindex>"** (e.g. "Heretic's End Shipyard I"). Type from the
  station's modules, first that applies: L/XL ship build modules → Shipyard; S/M only → Wharf; equipment build
  modules → Equipment Dock; scrap processing module → Scrap Processing Factory; production modules → the factory
  name of the ware group with the highest `priority` (`waregroups.xml`) among their products (e.g. High Tech Factory,
  Refined Goods Complex); defence modules only → Defence Platform; nothing yet → "<sector> Factory" without numeral.
- **Guesses (not confirmed in logs):** NPC factories with no name, basename or original product (~260 in the 7.10
  save) → faction short name + highest-priority product group factory name of their modules, else "Factory". A player
  station with a `basename` (the HQ) → its base name ("Headquarters").
- All pieces are game text (pages 20102, 20201, 20203, 20215, sector names), so names translate with the site.

## Approaches considered

- **A. Every station as a marker, detail by zoom (chosen by the user).** Zoomed out: small dots in owner colour,
  player stations larger with a ring, player ships as a per-sector count badge. Zoomed in: the existing letter
  markers with names; tooltip shows name, owner, type. Uses the exact positions; the cost is drawing ~1,600 markers
  without redrawing them on every pan.
- B. Sector summaries only (counts per sector, list in a side panel). Cheap to draw, but throws away the positions
  that the extractor work exists to provide.
- C. A separate "My universe" page. Rejected: the user wants existing pages augmented when a save is active.

## Design

### Extractor (`x4-extractor`)

- New data file: zone macro (lowercase, without `_macro`) → `{ sector, x, z }` in km, from the existing
  `Sector.Zones`/`ZoneOffsets` (base + all DLCs; covers `tzonecluster*`).
- Naming data, wherever it fits the existing data files best (builder's call), exported with game-text ids so names
  translate:
  - faction → short name;
  - ware → factory name (and ware group, if not already exported);
  - ware group → factory name and priority;
  - construction plan / `basename` text ids and station macro identification names that can appear on stations
    (page 20102), with the translator stripping `(...)` comments such as "Keepsafe(Scrapyard Station)";
  - build/processing/defence module classification, if not derivable from the existing modules data.
- All new text ids go into `output/i18n/<lang>.json` like other game text.

### Save extractor (web worker)

- A new `map` extractor alongside `info`. It keeps a component stack to know each element's cluster, sector and zone,
  skips `jobs` (and other subtrees with no universe placement), and records:
  - sectors: id, owner, contested, known;
  - stations: code, macro, owner, sector, position ingredients, known, state, and the naming ingredients (`name`,
    `basename`, `nameindex`, `originalproduct`, build/production/defence module macros and production wares);
  - player ships: per sector, a count by size class (XS…XL).
- Ids in the app's form (macro without `_macro`).
- Data is stored raw (ingredients, not finished names), so it survives site data updates and language changes;
  positions may be resolved either in the worker or on display (builder's call), but the result must be exact.
- Estimated size: ~200–320 KB of JSON per late save before compression.
- `SAVEGAME_SCHEMA_VERSION` = 2. Stored saves with a kept file are re-extracted in the background by the existing
  machinery; saves without a kept file show "reload needed".

### Storage clean-up

- The heavy `data` moves out of the summary records the list reads (e.g. its own object store, IndexedDB version 2
  with an upgrade that moves existing records). `list()` reads only summaries; `get(id)` / the active save reads
  data.
- The save storage is opened only when it is needed: a small local-storage flag records that saves exist; without
  it, the header and pages do not open IndexedDB or call `storage.estimate()` until the player visits `/saves` or
  loads a save. Behaviour is otherwise unchanged.

### Map with an active save

- Everything below applies only while a save is active and its map data is present; otherwise the map is as today.
  While the save's data is loading or being upgraded, the map shows today's map plus a small "loading save" note.
- **Sectors**: owner fill (owner colour mode) uses the save's owners; contested sectors are marked (e.g. a hatched or
  dashed outline — builder's call). The legend counts follow the save.
- **Discovery**: undiscovered sectors and stations are dimmed. A "Discovered only" switch (Signal Forms, remembered
  in local storage) hides them. Sector names of undiscovered sectors stay readable when dimmed.
- **Stations**: the save's stations replace the game-start stations layer.
  - Zoomed out: small dots in owner colour; player stations larger with a highlight ring.
  - Zoomed in: the existing letter markers (S/W/E/T/D/P) for the types the map already knows, plain markers for
    factories and others, and station names as labels at the closest zoom levels.
  - Hover tooltip: name, owner, type, code, under construction/wreck if so.
  - The existing station-type toggles and the "buy X" seller search in the stations panel work on the save's
    stations (type derived from the same rules as naming).
- **Player ships**: a count badge per sector (total, tooltip with the split by size).
- **Sector set** *(my call)*: while a save is active, the map shows the sectors present in the save (its game
  version and DLCs), and the game-version/DLC toggles are hidden. Gate links, the legend, the route planner and the
  mining panel use that same set. Without a save the toggles work as today.
- **Station types** *(my call)*: every station gets one type, decided from the same signals as naming, first that
  applies: pirate base macro → pirate base (P); trading station macro → trading station (T); L/XL ship build modules
  → shipyard (S); S/M only → wharf (W); equipment build modules → equipment dock (E); defence modules only (or a
  defence plan basename) → defence (D); anything else → factory/other. Two new toggles, "Factories" and "Other"
  (wrecks, landmarks, construction sites with no modules yet), both on by default; the existing six keep today's
  defaults.
- **"Buy X" seller search** *(my call)*: keeps today's rule (a faction's shipyards/wharfs/docks sell what that
  faction sells), applied to the save's stations. Player stations are not listed (what the player can build there
  depends on blueprints, a later piece).
- **"Discovered only" reach** *(my call)*: it affects the canvas only — undiscovered sectors, their stations,
  badges and gate links to them are hidden. Panels (route, mining, stations, seller search) still use all sectors;
  seller results in undiscovered sectors are marked as undiscovered.
- **Positions and scale** *(my call)*: position mapping reuses the map's in-sector helper (`markerPosition`, ±500 km
  → 70% of the hex radius) so save and no-save maps agree. Measured: 18 of 1,455 stations (9.00) and 5 of 1,625
  (7.10) lie beyond 500 km (max 872 / 1,222 km); they are drawn at the clamp edge along their true direction, and the
  tooltip shows their real distance from the sector centre.
- **Text references** *(my call)*: a station `name="{page,id}"` is translated through an exported page/id → text
  table covering the pages that appear in station names (20102 and any other page found in the test saves' station
  `name` attributes). If a reference cannot be resolved, the station falls back to the normal naming rules (never
  the raw reference).
- Performance: markers render without per-frame recomputation on pan/zoom (e.g. computed once per save/filter
  change; level-of-detail switch by zoom thresholds).

### Tests

- Extractor: zone table covers every zone of both test saves (dev script against the real saves).
- Save `map` extractor: a trimmed fixture from the real saves (one cluster with a tempzone station, a default-zone
  station, a player station, a docked player ship, a jobs ship, a contested sector).
- Naming: unit tests for each rule with the examples above (NPC basename / original product / macro; player shipyard,
  wharf, equipment dock, scrap, production by group priority, defence, empty; rename literal; text reference).
- Storage: upgrade from version 1 moves data; list does not read data; no IndexedDB open without the flag.
- Map: store tests for the save layer (owners, dimming, discovered-only, badges); browser check with both test saves.

## Left to the builder

- File and type names; how the naming tables are shaped in the data files.
- Whether positions resolve in the worker or on display.
- Zoom thresholds, marker sizes, contested styling, within the map's existing look.
- Where exactly the discovered-only switch sits (header of the map, legend, or stations panel).
