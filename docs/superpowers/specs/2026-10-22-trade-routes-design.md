# Trade routes from the savegame: design

Issue: crissian/x4#117 ("Sector Optimization and Trade Route Analysis"), part 3 of 4: "optimized trade routes".
Repo: D:\Work\x4 (Angular 22). Builds on the savegame map work (`docs/superpowers/specs/2026-10-22-savegame-map-design.md`).

## Intent

A player loads a save and wants to know where the money is: which ware to buy where and sell where, and how much it pays for the time it takes. The save holds the live economy of the whole galaxy at save time: every station's buy and sell offers, with price and amount. That includes about 1,000 stations the player hasn't discovered. The page uses all of it, so the tool knows more than the player does in game, and that is intended.

This is the first of three follow-ups the owner approved, in this order: trade routes, then supply and demand analysis, then station suggestions. Each one ships on its own.

## Goals

- A **Trade routes page** that ranks single buy-here, sell-there trades across the **whole galaxy**. Location is only a filter.
- For each route:
  - ware
  - seller station (code, owner, sector) and buy price
  - buyer station (code, owner, sector) and sell price
  - margin per unit
  - units per trip
  - profit per trip
  - jumps
  - travel time
  - **profit per minute** (the default sort)
- **Layout B** (the owner's pick): filters on top; a sortable table and a map side by side below them. The map draws the selected route. On phones the map stacks under the table.
- **Filters:**
  - ship
  - near sector, with max jumps
  - ware
  - hide hostile factions
  - include player-only offers
- **Prices are dated:** a visible note says prices are as of save time, and shows the save's name and game time.

## Non-goals (v1)

- Multi-stop chains, round trips and return legs. One buy and one sell per route.
- Filtering by what the player could see in game. The owner ruled: use everything in the save. There are no trade-visibility timers.
- Live sync with the running game, and predicting price changes.
- Supply and demand analysis and station suggestions. Those are separate specs.

## Anti-goals

- Presenting routes as guaranteed profit. In tests, about 27% of prices changed between two saves 161 s of game time apart, and the biggest swings were on thin offers. Ranking and wording must reflect that.
- Growing the initial bundle. Everything loads with the page's lazy chunk.
- A page that freezes while computing.

## Data

### Already stored per save (`SaveMap`, schema 3)

- `stations[]`, each with `code`, `owner`, `sector`, position (`zone`, `x`, `z`), `known`, `state`, and `offers[]`.
  - Each offer has `ware`, `sell`, `price` (Cr), `amount` and `playerOnly`.
- `sectors[]`.

### New: player relations (schema 4)

- **Source in the save:**

  ```
  <faction id="player"><relations>
    <relation faction="split" relation="-0.032"/>
    <booster faction="argon" relation="0.02454" time="..."/>
  </relations>
  ```

- **Stored as** `SaveMap.relations: Record<factionId, number>`: the relation plus any booster, clamped to −1..1. A faction that isn't listed is 0 (neutral).
- Bump `SAVEGAME_SCHEMA_VERSION` to 4. Saves with a kept file re-extract through the existing upgrade path. Without a kept file they show the existing "reload this save" note.
- Extend `savegame/extractors` with the same streaming `ElementStack` approach, plus fixture specs.

### Hostile

- **Rule:** the player's relation to the station owner is ≤ −0.01, which is reputation ≤ −10, "enemy" in game (see `Loadouts.relationToReputation`). Enemy stations don't trade with the player, so "Hide hostile factions" (on by default) removes routes where either station is an enemy.
- **Effect in the owner's save:** Split and Terran (−0.032) count as enemies. Several of the most lucrative raw routes in that save involve them, which is exactly what the filter is for.

### Static data used

- **Wares:** `volume` and `transport` (container, solid, liquid, and so on).
- **Ships:** `cargo[]` (`max`, `types`); travel speed and drive charge from `ShipStatsService.maxStats`, as the map route panel does.

## Calculation (my calls, adjustable by the builder where marked)

- **Candidate pairs:** for each ware, every seller offer × every buyer offer at another station, where the buyer's price is above the seller's price. Skip:
  - stations in `state` `construction` or `wreck`
  - offers with `amount` 0
  - player-only offers, unless that filter is on (it is on by default; such routes are marked)
- **Units per trip:** `min(seller amount, buyer amount, floor(ship capacity for the ware's transport / ware volume))`.
  - Capacity is the sum of the ship's `cargo.max` over the cargo entries whose `types` include the ware's transport. Zero capacity means the route is excluded for that ship.
  - **Custom ship:** cargo volume, cargo types, speed and charge are entered by hand. The default is 3,000 m³ container at 3,000 m/s with a 5 s charge, matching the map route panel's defaults where they overlap.
- **Travel time:**
  - Use `RoutePlanner.travelTimes` from the seller's sector, computed once per distinct seller sector and cached while the ship's speed and charge stay the same. That covers centre-to-centre time and jumps.
  - Add a fixed **dock overhead of 60 s per station (120 s per trip)**. This keeps same-sector trades from showing an infinite profit per minute, and means short trips aren't overrated. It's my call; the builder can tune it as a named constant.
  - Station positions are ignored in v1, and in-sector distance is centre based.
- **Near sector filter:** when set, routes whose seller is more than N jumps from that sector are dropped. The empty leg from the near sector to the seller is added to the trip time that profit per minute uses, and is shown as its own column ("to start"). The "Jumps" column always counts seller → buyer only. Without a near sector, there is no empty leg.
- **Offer direction:** `SaveOffer.sell === true` means the station sells the ware, so the player buys it there at `price`. `sell === false` means the station buys it, and `amount` is its demand. `price` is a flat per-unit price for the whole amount.
- **Pairs and the count:** keep every pair that has a positive margin; don't collapse them. A station that has two offers for the same ware and direction (this happens) contributes both. "Total count" means the pairs left after the filters. With about 10,800 offers spread over about 100 wares, that is a few hundred thousand pairs at most. If measurement shows otherwise, prune to the best 5 buyers per seller offer. My call.
- **Hostile edge cases:**
  - Player-owned stations are never hostile.
  - Factions missing from the relations list count as 0 (neutral). Xenon and Kha'ak appear in the list at −1, so the normal rule hides them.
  - If a save's map data has no `relations` (an older save that hasn't been re-read), the hostile filter does nothing and the page shows the existing "reload this save" note.
- **Custom ship:** one cargo type (a select) plus a volume, speed and charge. My call.
- **Route key:** station codes are unique within a save in practice. If a code repeats, the first match wins. My call.
- **Profit per minute** = profit per trip / total minutes. The table is sorted by it, descending.
- **Thin offers:** a route whose units are below 10% of a full hold gets a "thin" marker. The marker is shown, not filtered.
- **Table length:** after sorting, the table renders the top 200 routes, and a note gives the total count.
- **Illegal wares:** routes whose ware is listed as illegal (`ware.illegal`) for the buyer's or seller's sector owner get a marker. They're not filtered.
- **Performance target:** the first computation finishes in under 500 ms for the owner's 9.00 save (about 10,800 offers, about 200 seller sectors), and filter changes update without visible lag. If measurement misses that, move the pair computation to a web worker as a follow-up. Don't do that up front.

## UI

- **Route:** `/trade-routes`, lazy (`loadComponent`). Add a nav link in the header (the header already collapses into a menu button when links don't fit).
- **Without an active save:** the page shows a short explanation and a link to `/saves`.
- **Filters:** use Signal Forms (`[formField]`), as the map route panel does. Filter state is kept in the URL query params, so a view can be shared and survives a reload.
  - **Ship select:** reuse the cargo ships, grouped or labelled with size and capacity, plus "Custom".
  - **Near sector:** a datalist input like the route panel's, plus max jumps.
  - **Ware:** a datalist or select.
  - **Checkboxes:** "Hide hostile factions" and "Include player-only offers".
- **Table:** reuse `app-data-grid` where it fits, with sortable columns. Ware, station and sector cells link to their pages. Owner names and colours follow the rest of the app.
  - Station display names use `StationNamer` and `SiteNamingTables`, as the sector page does.
  - Selecting a row selects the route: it's highlighted and drawn on the map, and recorded in the URL as `?route=<sellerCode>~<buyerCode>~<ware>`. Keyboard accessible.
- **Map:** a generic **route map** component reusing the sector map pieces (`MapGeometry`, `pan-zoom`, hex shapes).
  - It shows the sectors along the path with the path drawn and the seller and buyer sectors marked, zoomed to fit the route.
  - Pan and zoom work as on the sector mini map, and an expand button opens a modal (`AppDialog`, xl), as on the sector page.
  - Below the map: the route's step list (sector names with gate, accelerator or highway, from `RoutePlanner.route()`), the time, and the seller's stock and buyer's demand.
- **Notes:** the price note sits above the table: "Prices as of save time (<save name>, <game time>). Prices change quickly in game; large offers are more reliable."
- **i18n:** every text goes into all 12 locales.

## Constraints (owner rules, binding)

- Classes only: no module-level functions; helpers are static methods. No exported `create*` factories.
- Templates go in `.html` via `templateUrl`. No markup or CSS class strings in `.ts`. No object-form `[class]` keys containing spaces.
- Files stay under about 300 lines; build from generic, reusable small pieces.
- Signal Forms for controls.
- No new dependencies. Tabs, single quotes, LF.
- The initial bundle must not grow by more than 0.3 kB. `NgTemplateOutlet` in lazy code has been hoisted into main before, so avoid it.
- No commits without the owner's request.
- Never kill processes by image name. Kill only the PIDs you start, and leave port 4301 alone.

## Testing

- **Pure calculation class:** this is what makes the routes findable, so test it.
  - pairing
  - the units cap (stock, demand, hold, transport type mismatch)
  - travel time caching
  - the near sector filter with the empty leg
  - the hostile rule (the −0.01 boundary)
  - player-only and illegal markers
  - the sort
- **Relations extractor:** relation plus booster, clamped, using fixtures.
- **Component specs:**
  - the empty state without a save
  - filters round-trip through the URL
  - selecting a row updates the map input
- **Check script:** extend `scripts/check-savegame.mts`, or add a sibling, to print the top 10 routes for a save and the computation time. Run it on the owner's saves:
  - `E:\Temp\X4\saves\mine\save_001.xml.gz`
  - `C:\Users\criss\OneDrive\Documents\Egosoft\X4\94277680\save\save_005.xml.gz`
  - `E:\Temp\X4\saves\halfdan\save_004.xml.gz`
- **Visual check:** one headless Chrome pass at 1280 and 375 px with a save loaded, with screenshots.

## Left to the builder

- Exact column order and widths, and which columns hide on phones.
- How the route map shows sectors off the path: dimmed context hexes or only the path.
- Whether the cached per-sector travel times live in a small class or in the page store.
