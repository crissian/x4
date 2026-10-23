# Wharf and shipyard finder: design

Feature #2 of the parallel batch (blueprint tracker, ship seller finder, mining buyers, map extras, loadout thrusters and missiles).
Repo: D:\Work\x4 (Angular 22, branch `dev`). Builds on the savegame map, trade routes and relations work (`2026-10-22-*.md`).

## Intent

A player wants a ship and asks: **who sells it near me, and will they sell it to me?** The ship page already lists the factions that sell it ("Sold by", `app-sellers`). This adds the stations: every wharf or shipyard that can build the ship, nearest first from a sector the player picks, with jumps, travel time and whether the player's reputation (and, with a save, licence) is enough.

## Goals

- A **"Where to buy" card** on `/ships/:id`, under the existing "Sold by" card.
- One row per selling station: station (type, name or code), owner, sector (linked), jumps, travel time, and a **reputation status**:
  - with a save: "OK", "needs +10 rep (you have +4, 6 missing)", "needs licence ceremony", or "enemy: won't dock";
  - without a save: only the requirement ("needs +10 rep"), as `app-sellers` shows today.
- **From sector:** a datalist input (Signal Forms), remembered in local storage. Without it, rows sort by owner and sector name and show no time.
- **Station source:** the active save's stations when one is loaded, else the stations the game creates at the start. A line says which.

## Non-goals (v1)

- Equipment and module sellers (equipment docks). The rule and the card are ship-only; generalising is a follow-up.
- Stock or build queue: the save doesn't say whether a shipyard has the materials; the game builds on order.
- Changing the map's existing "Where to buy" panel (`MapStations.sellers`). It keeps its size rule; see Decisions.
- Player location from the save (not extracted today; adding it means another savegame extractor edit).

## Data sources (verified)

**Which stations build which ship size.** The station's build module decides, through `<builder classes>` in its macro (`E:\Temp\X4\Unpacked\assets\structures\buildmodule\macros\*`, plus the DLC copies):

| Module id (lowercase, no `_macro`) | Builds |
|---|---|
| `buildmodule_*_ships_s` | S |
| `buildmodule_*_ships_m` | M |
| `buildmodule_*_ships_m_dockarea_01` (the module every NPC wharf uses) | S, M |
| `buildmodule_*_ships_l` | L |
| `buildmodule_*_ships_xl` | XL |
| `buildmodule_xen_ships_xl` | L, XL |
| `buildmodule_*_equip_*`, `_carrier`, `_resupplier`, `_stations_` | no ships |

Construction plans (`libraries/constructionplans.xml` and DLCs): every faction wharf has only the M dock-area module (S+M), and every shipyard has L and XL, **except** `ali_shipyard` (Alliance, XL only, `libraries/stationgroups.xml` `shipyard_ali`) and `spl_shipyard_warforge` (god station `shipyard_split_warforge_01`, XL only).

**Which faction sells it.** `libraries/wares.xml`, ship ware `<owner faction>` and `<restriction licence>`, already in `ships-data.ts` as `owners: Faction[]` and `license: string`. A station sells the ship when it can build the size **and** its owner is one of the ship's `owners`. Player-owned stations never sell. Licences and `minrelation` come from `libraries/factions.xml`, already in `factions-data.ts` as `Faction.licenses[]` (`type`, `minRelation`).

**Stations without a save:** `shared/services/data/god-stations-data.ts` (`GodStations`, `GodStation` in `model/universe.ts`): `id`, `type` ('shipyard' | 'wharf' | ...), `owner`, `sector`, `version`, `x`, `z`. 22 shipyards and 26 wharfs. **No modules**, so the size comes from `type` plus the two XL-only ids above. Lazy-imported like `sector-stations.component.ts` does, so the ship chunk doesn't grow.

**Stations with a save:** `SaveMap.stations[]` (`savegame/map/save-map-model.ts`): `code`, `macro`, `owner`, `sector`, `known`, `state`, `name`/`basename`/`nameIndex`, and **`modules: string[]`** (module ids). So build modules are available and the size check is exact. `StationTypes.of()` already classifies shipyard and wharf from the same module ids. Sectors: `SaveMap.sectors[]`.

**Reputation:** `save.data['relations']` is `SaveRelations = Record<factionId, number>` (−1..1, relation plus booster, missing = 0), from `RelationsExtractor`. Reputation points via `Loadouts.relationToReputation`. Enemy: relation ≤ −0.01 (same rule as trade routes).

**Licences (new, small):** the relation isn't enough in game. Military and capital ship licences have a `precursor` ceremony (`factions.xml`: `militaryship minrelation="0.01" precursor="ceremonyfriend"`), and the save records what the player holds, under the player faction:

```
<faction id="player"> ... <licences>
  <licence type="militaryship" factions="argon teladi"/>
```

(checked in `E:\Temp\X4\saves\mine\save_001.xml.gz`). A new `LicencesExtractor` stores `SaveLicences = Record<licenceType, factionId[]>` under key `licences`.

**Travel:** `RoutePlanner.travelTimes(sectors, from, { speed, charge })` (`map/route-planner.ts`) gives `time` per sector and `route(to).jumps`. One call per from-sector change; no `TravelCache` needed. `RoutePlanner.formatDuration` for display. Sectors: `SectorService` entities without a save; the save's sector ids (as `TradeRoutesStore.sectors` does) with one.

**Sellers API consumed as-is:** `ShipStatsService.sellers(owners, license): LicenseRequirement[]` (`{ faction, license?: License }`, `License.minRelation`). The blueprint tracker generalises it; I only call it, so a rename is a one-line fix at merge.

## Design

New folder `src/app/ship/sellers/` (all files well under 300 lines):

- **`ShipBuildClasses`** (static class): `ofModule(id): Size[]` from the table above; `ofGameStart(station: GodStation): Size[]` (wharf → S, M; shipyard → L, XL; the two XL-only ids → XL). The one place the rule lives.
- **`ShipSellerStations`** (static class, pure): `fromGameStart(ship, stations)` and `fromSave(ship, map)` → `SellerStation[]` (`id`, `type`, `owner`, `sector`, `known`, `name?`). Skips player stations, `wreck` and `construction`.
- **`SellerStanding`** (static class, pure): `of(requirement: LicenseRequirement, relations?, licences?)` → `{ status: 'ok' | 'reputation' | 'ceremony' | 'enemy' | 'unknown', needed?, have?, missing? }`. `reputation` when relation < `minRelation`; `ceremony` when the reputation is met but the save holds no such licence from that faction; `unknown` without a save; `licences` missing (older save) falls back to reputation only.
- **`ShipSellerFinder`** (`@Injectable()`, provided by the card component): input ship signal; reads `SavegameStore.active()`, picks the source, lazily loads `GodStations` and, for save names, `StationNamer` (as `sector-stations` does); holds `form(model)` with `from` (persisted with `LocalStorage.persistedSignal`); computes rows sorted by time (unreachable last), then name. Speed and charge are fixed constants (3,000 m/s, 5 s, the map route panel's defaults), stated in a caption.
- **`ShipSellersNearComponent`** (`app-ship-sellers-near`, `templateUrl`): from-sector datalist bound with `[formField]`, a table with a status badge (`app-tone-dot` + text), source line, empty state "No station sells it" (ships owned only by station-less factions such as Buccaneers or Trinity).
- **`LicencesExtractor`** in `savegame/extractors/` (same streaming pattern as `RelationsExtractor`, `path.length` checks under `faction id="player"`), type in a new `savegame/map/save-licences.ts` to keep `save-map-model.ts` untouched.

**Placement:** the ship detail page, a full-width card below "Sold by". It's where the question is asked, it needs no new route or nav link, and the map already has a basic "Where to buy". No map changes.

## Files touched

New:
- `src/app/ship/sellers/ship-build-classes.ts` (+ `.spec.ts`)
- `src/app/ship/sellers/ship-seller-stations.ts` (+ spec)
- `src/app/ship/sellers/seller-standing.ts` (+ spec)
- `src/app/ship/sellers/ship-seller-finder.ts` (+ spec)
- `src/app/ship/sellers/ship-sellers-near.component.ts` / `.html` (+ spec)
- `src/app/savegame/extractors/licences-extractor.ts` (+ spec)
- `src/app/savegame/map/save-licences.ts`

Modified (small):
- `src/app/ship/components/ship-detail.component.html` (one card) and `.ts` (one import)
- `src/app/savegame/read-savegame.ts` (one extractor in the list)
- `src/app/savegame/savegame-model.ts` (`SAVEGAME_SCHEMA_VERSION` 4 → 5; **merge hotspot**: if another feature also bumps it, the merged value is one bump above `dev`, not two)
- `src/locale/messages.*.json` (all 12; new ids only)

Not touched: `sellers.component.*`, `ship-stats.service.ts`, `app.routes.ts`, header nav, `map/*`, `map-extractor.ts`, the extractor repo.

## Tests

- `ShipBuildClasses`: S, M, dock-area (S+M), L, XL, `xen_ships_xl` (L+XL), equipment module (none); game-start wharf, shipyard, Alliance and Warforge (XL only).
- `ShipSellerStations`: owner filter, size filter, player / wreck / construction skipped, both sources on small fixtures (`savegame/testdata/map-fixture.ts` style).
- `SellerStanding`: −0.01 enemy boundary, exactly `minRelation`, missing points, ceremony (licence absent / present), no save, older save without licences.
- `LicencesExtractor`: player faction only, space-separated factions, other factions' `<licences>` ignored.
- Component: no save shows requirements only; picking a from sector sorts by time and shows jumps; empty state.
- Check run on the owner's save (`E:\Temp\X4\saves\mine\save_001.xml.gz`): Behemoth and a wharf ship list plausible stations; Argon military ships show "OK" (player holds `militaryship` from Argon).

## Decisions I made

- **Size rule in a web-side static class**, not new extractor fields: save stations already carry module ids, and only two game-start shipyards differ from the type rule. Follow-up if wanted: extractor resolves each god station's construction plan.
- **Licences extracted** (one new extractor) so "can I buy it now" is true to the game; reputation alone over-promises for military and capital ships.
- **Fixed travel speed** (3,000 m/s, 5 s charge) instead of a ship picker; jumps are the main signal.
- **From sector remembered locally**, not taken from the save (no player location extracted).
- Equipment docks and equipment items are out of v1; the map's own panel stays as is (it treats XS as wharf and ignores the XL-only shipyards; a later change can reuse `ShipBuildClasses`).
- Undiscovered save stations are listed with an "Undiscovered" note, not hidden (as the map does).

## Open questions for the owner

1. Extract player licences now (schema bump to 5, one new extractor), or ship v1 with the reputation check only and add licences later?
2. Should the finder also cover equipment (equipment docks, `/equipment/:id`) in v1, or ships only?
3. Travel time at a fixed 3,000 m/s, or add a "my ship" select (as the map route panel has) to time it with the player's own ship?

## Owner decisions (2026-10-23)

- Licences: yes. Use the `LicencesExtractor` already on dev (key `licences`, `SaveLicences` in `savegame/map/save-map-model.ts`); don't add another extractor or bump the schema.
- Ships only in v1 (no equipment docks).
- Travel time at a fixed speed in v1.
