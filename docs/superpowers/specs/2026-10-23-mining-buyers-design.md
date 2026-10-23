# Mining with real buyers and miners needed: design

Repo: D:\Work\x4 (Angular 22), branch `dev`. Builds on the trade routes work (`2026-10-22-trade-routes-design.md`) and the supply and demand work (`src/app/economy`).

## Intent

The map's Mining tab tells a player where a resource is richest and, given a home sector, what one miner earns per hour at the ware's static min, avg or max price. With a save loaded, the tool knows much more: which stations actually buy the ore, silicon or ice right now, at what price and how much, and how much their modules eat per hour. The tab should use that to answer two questions: "where do I mine X, and who do I sell it to?" and "how many of my miners keep this refinery fed?"

## Goals

- **With a save loaded**, the Mining tab ranks **mining sector → buyer station** pairs by credits per hour for the chosen miner. The ranking accounts for the buyer's price, the travel time from the mining sector to the buyer, and how much the buyer wants (the units per trip are capped by the buy-offer amount).
- Selecting a row shows a **Miners needed** box for that buyer and the chosen miner, with two numbers kept visibly separate:
  - **Built capacity:** the station's consumption per hour at full supply → "3 × Kopis (M) keep it full".
  - **Market now:** the buy-offer amount at save time → "wants 84,000 now = 21 full holds".
- **Without a save**, the tab behaves exactly as it does today.
- A **sector regrowth** hint warns when the miners needed exceed what the mining sector's fields regrow per hour.

## Non-goals

- A new page. Everything stays inside the existing Mining panel.
- Modelling mining speed. The "Minutes to fill hold" input stays the user's estimate.
- Multi-buyer runs, partial sales, or predicting price changes.
- Player-owned mining fleets from the save (the save stores only per-sector ship counts by size).

## Data sources

| Need | Source | Fields |
|---|---|---|
| Buy offers | `SavegameStore.active().data['map']` as `SaveMap` (`savegame/map/save-map-model.ts`) | `stations[]`: `code`, `owner`, `sector`, `state`, `known`, `offers[]` with `ware`, `sell === false`, `price` (Cr per unit, flat for the whole amount), `amount` (units wanted), `playerOnly` |
| Hostile owners | `data['relations']` as `SaveRelations` | `TradeRouteFinder.isHostile(owner, relations)` (≤ −0.01) |
| Station names | `StationNamer` + `SiteNamingTables`, loaded lazily as `TradeRoutesStore` does | |
| Trip time | `TravelCache` (`trade/travel-cache.ts`) over `RoutePlanner.travelTimes` | `from(miningSector).time.get(buyerSector)`, `route(a, b).jumps` |
| Miner hold, speed, charge | `Mining.minerCapacity`, `ShipStatsService.maxStats(miner).travel`, `TravelDrives.fastest(...).travel.charge` | |
| Built consumption | `StationFlowCalculator.flows(station)` (`economy/station-flow-calculator.ts`) | `StationFlow.consumed` per hour for the ware, at full input supply, scaled by the real workforce |
| Field regrowth | `Sector.resources[]` (`sectors-data.ts`, from `libraries/regionyields.xml`) | `ware`, `count`, `yieldAmount` (units held by one field), `respawnDelay` (minutes until a depleted field recovers) |

`SaveTradeIndex` is **not** used: it keeps only `known` stations and pre-resolves names. The trade routes page settled on "use every station in the save", and this feature follows it, so it reads `SaveMap.stations` directly.

## Calculation

- **Buyers:** stations with no `state` (not construction or wreck), not hostile, with a buy offer for the ware where `amount > 0`. Player-only offers are skipped (mined wares rarely have them). If a station has two buy offers for the ware, the higher price is used.
- **Mining sectors:** the save's sectors with a resource field of the ware, as today (`MapStore.resourceAmounts`).
- **Units per trip:** `min(floor(minerCapacity / ware.volume), offer.amount)`. Rows where the offer is below one full hold get the "thin" marker, like trade routes.
- **Trip:** `Mining.miningTrip(travel, capacity, ware, offer.price, fillMinutes)`, with `travel` = the one-way time from the mining sector to the buyer's sector from `TravelCache`. The miner shuttles between field and buyer, so the existing `2 × travel + fill + dock` model holds. Same-sector buyers get `travel = 0`; the 60 s dock time keeps them finite. `miningTrip` gains an optional `units` cap parameter (default: full hold), the only change to `mining.ts`.
- **Ranking:** credits per hour. The table shows one row per mining sector with its **best buyer**, top 25 rows, as today. The selected row expands to the top 5 buyers for that sector.
- **Home sector:** the existing "Home sector (where you sell)" field becomes a filter with a save: when set, only buyers in that sector or within 2 jumps of it are used (`NEAR_JUMPS = 2`, a named constant).
- **Miners needed (built capacity):** `perMiner = units × 3600 / tripTime` (units per hour of one miner). `miners = ceil(consumed / perMiner)`. Source label: "Built capacity: modules at full supply". It's hidden when the station consumes none of the ware (a trading station, for example), and then only "market now" is shown.
- **Market now:** `holds = ceil(amount / unitsPerFullHold)`, plus "one miner clears it in ~X h" (`holds × tripTime`). Source label: "Market now, at save time (<game time>)".
- **Sector regrowth:** `Σ count × yieldAmount × 60 / respawnDelay` units per hour for the ware in the mining sector. If `miners × perMiner` exceeds it, a warning is shown: "may outpace the fields' regrowth (≈N/h)". It's labelled approximate. With the current data the cap only bites for nividium and raw scrap (for example 500 units / 90 min per nividium field). Large ore fields regrow about 500,000 units per hour.

## Design

- **`MiningBuyers`** (new, `map/mining/mining-buyers.ts`, a pure static class, no Angular). `rank(input, cache): MiningPair[]`. The input holds the stations, relations, ware, mining sector ids, miner hold, fill minutes and near filter. It returns pairs sorted by Cr/h. It also has `bestPerSector(pairs)` and `buyersFor(pairs, sector, limit)`.
- **`MinersNeeded`** (new, `map/mining/miners-needed.ts`, a static class). `estimate(trip, consumedPerHour, offerAmount, fullHold, regrowthPerHour)` returns `{ perMiner, capacityMiners?, holdsNow, hoursNowOneMiner, regrowth?, outpaces }`. `regrowth(sector, ware)` is a static helper.
- **`MiningBuyersStore`** (new, `map/mining/mining-buyers-store.ts`, `@Injectable()` provided by `MapMiningPanelComponent`'s `providers`). It injects `MapStore` (reads `miningWare`, `miner`, `minerSpeed`, `miningModel`, `routeFrom`, `resourceAmounts`) and `SavegameStore`. It holds:
  - `LazyValue` loading the station namer, `StationFlowCalculator` and `MiningBuyers` in their own chunk, only when a save with map data is active, so the map's chunk doesn't grow by the economy code.
  - A `TravelCache` keyed by the miner's speed and charge (equality-guarded `computed`, as in `TradeRoutesStore`).
  - `rows`, `selectedSector` (signal), `buyers` (top 5 for it), `selectedBuyer` (a signal form select), `needed`.
  - Station consumption computed on demand for the selected buyer only (`calculator.flows(station)`), not for the whole galaxy.
- **UI (`map-mining-panel.component.html`)**, branching on `buyers.active()`:
  - Without a save: unchanged.
  - With a save: the "Sell price" select is hidden (the price comes from the offer). The home sector placeholder reads "Sell near (optional)...". Table columns: Sector | Best buyer (name, owner, buyer sector, jumps; "thin" badge) | Cr/unit | Trip | Cr/h. A row is a button (keyboard accessible) and selecting it expands the buyer list beneath: radio-like rows of station, price, wanted and Cr/h.
  - A **Miners needed** card under the list holds three labelled lines (built capacity, market now, regrowth warning) and the dated price note "Prices as of save time; they change within minutes in game."
  - New small presentational component **`MinersNeededComponent`** (`map/mining/miners-needed.component.{ts,html}`) with an `estimate` input, to keep the panel template under about 150 lines.

## Files touched

**New:**

- `src/app/map/mining/mining-buyers.ts` + `.spec.ts`
- `src/app/map/mining/miners-needed.ts` + `.spec.ts`
- `src/app/map/mining/mining-buyers-store.ts` + `.spec.ts`
- `src/app/map/mining/miners-needed.component.ts` + `.html`

**Modified (minimal):**

- `src/app/map/mining.ts`: an optional `units` parameter on `miningTrip` (backward compatible).
- `src/app/map/panels/map-mining-panel.component.ts`: `providers: [MiningBuyersStore]`, inject it, imports.
- `src/app/map/panels/map-mining-panel.component.html`: the save branch.
- `src/locale/messages.*.json` (12 files): about 15 new strings.
- **`src/app/map/map-store.ts`: no changes.** Everything is read through existing public signals. If the builder finds `resourceAmounts` or `miningModel` insufficient, the only allowed change is to make an existing private computed public. The map extras feature owns all other map-store edits.

Untouched: the savegame code, the trade code (only imported: `TravelCache`, `TradeRouteFinder.isHostile`, `TradeRules`) and the economy code (only imported: `StationFlowCalculator`).

## Tests

- `MiningBuyers`:
  - skips construction, wreck, hostile, zero-amount and sell offers
  - units capped by offer amount and hold, with the thin marker
  - same-sector travel 0
  - the near filter at 2 jumps
  - the best buyer per sector
  - sorting by Cr/h
- `MinersNeeded`:
  - the ceil maths
  - no capacity line when consumption is 0
  - the regrowth sum and the `outpaces` flag (nividium fixture)
- `Mining.miningTrip` with a `units` cap (extends `mining.spec.ts`).
- `MiningBuyersStore`, with `map-save-testing.ts` fixtures:
  - inactive without a save (the panel falls back)
  - rows appear with a save
  - selecting a sector lists its buyers
- Component spec:
  - without a save, the price select is shown
  - with a save, it's hidden and the miners needed card renders both labelled sources

## Decisions I made

- Every station in the save, not just known ones, matching the trade routes ruling. Hostile stations are always hidden, with no toggle in this small panel.
- One row per mining sector (best buyer), expanding to its top 5 buyers, rather than a flat pair list. This keeps the existing table shape and panel width.
- Miner travel uses the miner's own fastest drive charge, not the route tab's charge field.
- Consumption is computed per selected station, lazily, rather than building the whole `Economy`.
- Regrowth is a warning, not a cap on the ranking.

## Open questions for the owner

1. With a save, should the "Home sector" field filter **buyers** to within 2 jumps ("where you sell", my default), or filter **mining sectors** near it ("where I mine")?
2. Should unknown (undiscovered) buyer stations be included, as on Trade routes, or limited to stations the player knows, as on the ware page's "Stations in your save" tab?

## Owner decisions (2026-10-23)

- Home sector filters buyers within 2 jumps (where you sell).
- Only stations the player knows; no undiscovered buyers.
