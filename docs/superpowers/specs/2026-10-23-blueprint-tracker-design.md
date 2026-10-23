# Blueprint tracker: design

Repo: D:\Work\x4 (Angular 22), with a small generator change in D:\Work\x4-extractor. Builds on the savegame loading work (`2026-10-22-savegame-loading-design.md`) and reuses the relations data from the trade routes work (`2026-10-22-trade-routes-design.md`).

## Intent and why

A player with a save loaded wants two answers: "how much of the game's blueprints do I own?" and "what can I buy next, from whom, and for how much?" In game, the answers are spread over every faction representative's shop. Each shop only lists its own faction's wares and hides some of them until you hold a licence. This page puts all of it in one place, using the player's real blueprints, licences and relations from the save.

## Goals

- **Owned vs. missing:** progress per category.
  - Station modules: production, habitats, storage, docks and piers, defence, build modules (shipyard, wharf, equipment), connections, other.
  - Ships, split by size.
  - Equipment: weapons, turrets, shields, engines, thrusters, missiles, drones, countermeasures.
  - Each category shows owned / total, a progress bar, and an expandable list of what's missing.
- **Shopping list:** every missing blueprint gets one of three statuses.
  - **Buy now:** a selling faction's representative would sell it today. Grouped by faction, with a total per faction and the player's money from the save.
  - **Need more reputation:** sold, but the player lacks the licence. Shows the licence and the reputation it needs next to the player's current reputation with that faction.
  - **Not sold anywhere:** tagged with the reason: research, story or mission, terraforming, game start, or unknown.
- Every number says where it comes from: blueprints, licences, reputation and money come from the save (as of save time); prices and sellers come from the game data.

## Non-goals

- An "only my blueprints" toggle in the station calculator, and production-chain gap analysis (owner ruled these out).
- Paint mods, ship mods (`mod_*`), and deployables (satellites, probes, beacons, mines, laser towers). The catalog doesn't have them. Owned ones are counted in one "other blueprints in your save" line.
- Telling the player where the faction representative is. Their HQ location is a possible follow-up.

## Data sources (with evidence)

### Player blueprints in the save (confirmed, high confidence)

I checked two real saves: `E:\Temp\X4\saves\halfdan\save_004.xml.gz` (412 blueprints) and `…\Egosoft\X4\94277680\save\save_005.xml.gz`.

```
<component class="player" macro="character_player_…_macro" owner="player" …>
  … <blueprints>
      <blueprint ware="module_arg_stor_solid_m_01"/>
      <blueprint ware="ship_arg_s_fighter_01_a"/> …
    </blueprints>
```

- **Where it sits:** under the player character component, inside whatever ship or station the player is in. That puts it at depth 22 in one save and a different depth in the other, so the depth isn't fixed. Each save has exactly one `<blueprints>` element, and no `<blueprint>` appears anywhere else. The only attribute is `ware`, and its ids match our `Modules`, `Ships` and `Equipment` ids exactly (for example `module_gen_prod_energycells_01`).
- **What the halfdan save holds:**

  | Prefix | Count |
  |---|---|
  | `module` | 105 |
  | `weapon` | 73 |
  | `shield` | 52 |
  | `mod` | 46 |
  | `engine` | 37 |
  | `turret` | 36 |
  | `ship` | 32 |
  | `thruster` | 16 |
  | `paintmod` | 8 |
  | deployables and the rest | a few |

### Player licences in the save (confirmed, high confidence)

The game decides what a representative sells with `HasLicence("player", tradelicence, faction)`. The save stores exactly that:

```
<faction id="player"> … <licences>
  <licence type="militaryship" factions="argon teladi pioneers …"/>
  <licence type="station_gen_basic" factions="alliance antigone argon … kaori"/> …
```

Reading the licences beats guessing from reputation. Licences with a `precursor` (for example `capitalship` needs `ceremonyally`) are only granted at a ceremony, so reputation alone can overstate what the player can buy.

### Reputation (existing)

`RelationsExtractor` (key `relations`) gives `SaveRelations = Record<factionId, number>`: relation plus booster, clamped to −1..1, and a missing faction counts as 0. It's shown as in-game reputation with `Loadouts.relationToReputation`. A licence's requirement is `License.minRelation` in `factions-data.ts`.

### Blueprint price (confirmed from the game's UI code, high confidence)

The source is `ui/addons/ego_detailmonitor/menu_trader_blueprintsorlicences.lua`, read from `08.cat`/`08.dat` of the installed game, `initData()`:

- **Equipment:** `locprice = avgprice * 10`
- **Ships and modules:** `locprice = avgprice * 10`, then for modules `if tag == "module" then locprice = maxprice end`

So:

- **Ship and equipment blueprints:** 10 × `price.avg`. For example, the Argon Discoverer (`ship_arg_s_fighter_01_a`, average 131,970 Cr) costs 1,319,700 Cr.
- **Module blueprints:** `price.max`.

The price doesn't depend on the faction or the reputation, so buying from a different faction never changes the cost.

### Who sells what (game rules from the same Lua file and `md/npc_factionrepresentative.xml`)

- A representative lists wares whose **owner** is its faction, excluding wares tagged `noplayerblueprint` or `missiononly`. Modules and ships must also not be tagged `noblueprint`.
- Factions tagged `noblueprintsale` sell no blueprints. Today that is only Kaori, which owns 84 equipment, 12 ship and 9 module wares in our data, so it must be excluded.
- The licence needed is the ware's `restriction licence`, which is our `license`. Three modules and about 50 equipment items have none; they count as "no licence needed".
- **Existing data:** `owners` and `license` on modules, ships and equipment; `licenses[]` per faction; `ShipStatsService.sellers(owners, license)`.
- **Missing from the data:** the tags. In our catalog, 62 items are `noplayerblueprint`, 33 `noblueprint` and 8 `missiononly` (for example the casino welfare module and the Terran `weapon_ter_s_plasma_01_mk1`). There is also no faction `noblueprintsale` flag and no unlock source.

### New generated data: `blueprint-rules-data.ts` (extractor)

A new extractor class `BlueprintRulesWriter` (its own file), registered with one line in `Program.cs`. It writes:

```ts
export const BlueprintRules = {
  /** noblueprint / noplayerblueprint: the player can never own these, so they are left out of the totals */
  notForPlayer: ['engine_kha_m_combat_01_mk1', …],
  /** missiononly: never sold */
  missionOnly: ['module_gen_welfare_casino_01', …],
  noSaleFactions: ['kaori'],
  /** where unsold blueprints come from: scanned from literal <add_blueprints wares="ware.X"> in md/ and extensions/*/md */
  unlockedBy: { engine_xen_m_virtual_01_mk1: 'research', … },
};
```

- **Tags:** taken from `LoadWares()`, including tags added by extension diffs.
- **Factions:** `noblueprintsale` is read straight from `factions.xml` plus the extension copies, so the shared `Faction` class doesn't change.
- **`unlockedBy` values, from the md file name:**
  - `story_research_*` → `research`
  - `terraforming` → `terraforming`
  - `setup_gamestarts` → `gamestart`
  - `story_*`, `*_subscription` and `diplomacy` → `story`
  - anything else → `story`
- `add_blueprints` calls that use variables (`$BlueprintWare`) are ignored.

## Design

### Save extraction (worker, plain classes)

- **`BlueprintsExtractor`** (key `blueprints`) returns `string[]`, the ware ids.
  - On opening a `component` whose `class="player"`, it records that depth `d`.
  - It collects `blueprint@ware` where `path.length === d + 2` and `path[d] === 'blueprints'`.
  - It is done when `</blueprints>` closes.
- **`PlayerLicencesExtractor`** (key `licences`) returns `Record<licenceType, factionId[]>` from `<faction id="player"><licences>`, using the same path checks as `RelationsExtractor`.
- **Registration:** both are added to the extractor list in `read-savegame.ts`.
- **Schema:** bump `SAVEGAME_SCHEMA_VERSION` (4 → 5). Kept files re-extract through the existing path; others get "reload this save".
- **Model:** add `SaveBlueprints` and `SaveLicences` types in a new `savegame/map/save-player-model.ts`.

### Calculation (pure classes in `src/app/blueprints/`)

- **`BlueprintCatalog`:** every trackable item from the `Modules`, `Ships` and `Equipment` services.
  - Excludes `BlueprintRules.notForPlayer` and the equipment type `software`.
  - Maps each item to a category id and computes its price (`BlueprintPrice.of(item, kind)`, where kind is module or other).
- **`BlueprintCategories`:** static mapping of module types, ship sizes and equipment types to category ids and labels ($localize).
- **`BlueprintSellers`:** generalises `ShipStatsService.sellers()`.
  - Static `of(owners, license, factions)` drops `noSaleFactions` and returns `{ faction, license }[]`.
  - `ShipStatsService.sellers()` is left untouched, so there's no shared-file edit. The builder may make it delegate later.
- **`BlueprintShoppingList`:** input is the catalog, the owned set, licences, relations and factions. Each missing item gets:
  - `buy`, with the sellers that qualify: the item has no licence, or `licences[license]` includes that faction.
  - `rep`: sellers exist but none qualify. Every seller is listed with the needed and current reputation, sorted by the smallest gap. A flag marks "reputation already high enough, licence pending (ceremony or a visit)".
  - `unsold`: `missionOnly`, or no seller left. The reason comes from `unlockedBy`, else `missionOnly` gives `story`, else `unknown`.
- **"Buy now" groups:** one group per faction, holding the items that faction would sell now. An item sold by several factions appears under each, and each faction's total is what buying all of its items there would cost. A separate grand total counts each blueprint once, since the price doesn't depend on the faction.
- **`BlueprintProgress`:** owned and total per category, plus the "other blueprints in your save" count (owned ids not in the catalog).
- **`BlueprintsStore`** (injectable, page-scoped):
  - reads `SavegameStore.active`
  - exposes `status: 'no-save' | 'reload-needed' | 'ready'`, plus progress and the shopping list
  - `reload-needed` when the save data has no `blueprints` key

### UI

- **Route:** `/blueprints`, lazy `loadComponent` in `app.routes.ts`. The title is "Blueprints".
- **Nav:** one link added to the existing Economy group in `header.component.ts`, which is experimental and is where the savegame-driven pages live. Icon: `LucideScrollText`.
- **Without a save:** a short explanation and "Load a savegame" (`/saves`), as the trade routes page does. With an outdated save: "Reload this save to read its blueprints".
- **Components**, all with `templateUrl` and their own `.html`, each under 300 lines:
  - `blueprints-page.component`: header with the save name and game time ("as of save time"), the empty and reload states, and two tabs (Progress and Shopping list) using `shared/components/tabs`.
  - `blueprint-progress.component`: a card per category group (modules, ships, equipment), with a row per category showing `app-progress-bar`, the owned/total count, and a disclosure listing the missing items, each linked to its detail page.
  - `blueprint-shopping-list.component`: three sections.
    - Buy now: a faction card per faction with its items, prices and total, plus the grand total next to "Money in save: X Cr".
    - Need more reputation: a table with item, licence, seller, needed reputation and your reputation.
    - Not sold: a table with item, category and reason.
  - `blueprint-filters.component`: Signal Forms (`form()` + `[formField]`) for a category select, a text search and "hide owned categories at 100%". The filters are kept in the URL query params.
  - `blueprint-item-link.component`: a generic small piece, the item's icon and name linked to `/modules|ships|equipment/:id`.
- Tables use `app-data-grid` where it fits. Faction names link to `/factions/:id`, as `app-sellers` does.
- **i18n:** every text uses `i18n` or `$localize`, with translations in all 12 `messages.<lang>.json`.

## Files touched

**New (web):**

- `src/app/savegame/extractors/blueprints-extractor.ts` and `.spec.ts`
- `src/app/savegame/extractors/player-licences-extractor.ts` and `.spec.ts`
- `src/app/savegame/map/save-player-model.ts`
- `src/app/blueprints/`:
  - `blueprint-catalog.ts`, `blueprint-categories.ts`, `blueprint-price.ts`, `blueprint-sellers.ts`, `blueprint-shopping-list.ts`, `blueprint-progress.ts`, `blueprints-store.ts`
  - specs for the pure classes
  - `blueprint-testing.ts` (fixtures)
- `src/app/blueprints/components/`: the five components above (`.ts` and `.html`), plus `blueprints-page.component.spec.ts`
- `src/app/shared/services/data/blueprint-rules-data.ts` (generated)

**New (extractor):** `X4Extractor/Writers/BlueprintRulesWriter.cs`

**Modified (keep minimal):**

- `src/app/savegame/read-savegame.ts`: two entries in the extractor list.
- `src/app/savegame/savegame-model.ts`: the schema version. **Merge note:** other features may also bump it, so after merging, the version must be one higher than the last released value, once.
- `src/app/app.routes.ts`: one route.
- `src/app/header.component.ts`: one link and one icon import.
- `src/locale/messages*.json`: new ids.
- `X4Extractor/Program.cs`: one `Write…()` call.

## Tests

- **`BlueprintsExtractor` spec:**
  - reads blueprints under `component class="player"` at two different depths
  - ignores a `<blueprints>` under a non-player component
  - returns an empty list when there are none
  - is done after `</blueprints>`
- **`PlayerLicencesExtractor` spec:** splits `factions`, ignores other factions' `<licences>`, handles an empty element.
- **`BlueprintPrice`:** module → `max`; ship and equipment → `avg × 10`.
- **`BlueprintShoppingList`:**
  - licence held → buy
  - no licence needed → buy
  - licence missing → rep, with the gap sort and the pending flag at reputation ≥ minRelation
  - Kaori-only items → unsold
  - `missionOnly` and `unlockedBy` reasons
  - the grand total counts a multi-seller item once
- **`BlueprintProgress`:** category counts, `notForPlayer` excluded, the "other" count.
- **Page spec:** the no-save, reload-needed and ready states, and filters round-tripping through the URL.
- **Read check:** the extractor run on `halfdan/save_004.xml.gz` returns 412 ids; a one-off with `scripts/check-savegame.mts` if handy.

## Decisions I made

1. **Purchasability comes from the save's actual licences, not from reputation thresholds.** It's what the game checks. Reputation is shown as context for the "need more reputation" group.
2. **Price is 10 × average for ships and equipment, and the max price for modules**, per the game's Lua. It's labelled "game price".
3. **The game's rules ship as a new generated data file** (`blueprint-rules-data.ts`) from a new extractor writer. The shared ware, ship, module and faction writers stay untouched, which avoids conflicts with the loadout feature (#5).
4. **"Not sold" reasons are scanned from literal `add_blueprints` calls in md.** Anything not found is shown as "Unknown source" rather than guessed.
5. **Paint mods, ship mods and deployables aren't tracked**, only counted. Software is excluded.
6. **The page goes under the Economy nav group**, alongside the other savegame-driven pages.
7. **An item sold by several factions is listed under each one.** The grand total counts it once.

## Open questions for the owner

1. Should the "Buy now" totals per faction stay as they are (each faction's total includes items other factions also sell)? Or should each item be assigned to one faction, the one with the most items to buy, so that the faction totals add up to the grand total?
2. Do you want deployables (satellites, probes, beacons, mines, laser towers) tracked too? That means adding them to the extractor's equipment output, which touches the same writer as the loadout feature (#5).

## Owner decisions (2026-10-23)

- Faction totals: each faction's total counts everything it sells; add one overall total that counts each item once.
- Deployables: not in v1 (would touch the equipment writer shared with the loadout feature).
- Already built on dev before the feature branches: `LicencesExtractor` (key `licences`, `SaveLicences = Record<type, factionId[]>`) and `BlueprintsExtractor` (key `blueprints`, `SaveBlueprints = string[]`) in `savegame/extractors/`, types in `savegame/map/save-map-model.ts`, both registered in `read-savegame.ts`, schema version 5. Use them; don't add `save-player-model.ts` or bump the schema again.
