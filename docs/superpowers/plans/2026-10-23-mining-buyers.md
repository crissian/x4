# Mining with real buyers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** With a save loaded, the map's Mining panel ranks mining sector -> known buyer station pairs by Cr/h and shows how many miners keep the selected buyer fed.

**Architecture:** Pure static classes (`MiningBuyers`, `MinersNeeded`) under `src/app/map/mining/`, a panel-provided `MiningBuyersStore` that reads `MapStore` public signals and the active save, and a small `MinersNeededComponent`. `MapStore` is not changed.

**Tech Stack:** Angular 22 signals, Signal Forms, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-23-mining-buyers-design.md` (Owner decisions override: buyers within 2 jumps of the home sector; known stations only).

## Global Constraints

- No edits to `map-store.ts`, savegame, trade or economy code (imports only).
- Classes, not exported functions; templates in `.html`; controls via `[formField]`.
- UI text through `i18n`/`$localize`, translated in all 12 locale files.
- Built capacity and market now are labelled separately with their source.
- `NEAR_JUMPS = 2`; dock time 60 s; top 25 rows; top 5 buyers per sector.

## Review Focus

- Home sector unreachable from a buyer: buyer skipped, not ranked with travel 0.
- Ware without volume (0): no pairs, no division by zero.
- Miner with no hold for the ware: store returns no rows.
- Station with two buy offers for the ware: higher price kept.
- Selected sector no longer in the rows after a ware change: selection falls back to the first row.

---

### Task 1: `Mining.miningTrip` units cap

**Files:** Modify `src/app/map/mining.ts`; Test `src/app/map/mining.spec.ts`

- [ ] Test: `Mining.miningTrip(120, 10_000, ore, 50, 10, 60, 300)` gives `units` 300, `tripValue` 15,000, `tripTime` 900; without the cap still 1000.
- [ ] Add optional last parameter `maxUnits?: number`; `units = min(floor(capacity / volume), maxUnits ?? Infinity)`.
- [ ] Commit.

### Task 2: `MiningBuyers`

**Files:** Create `src/app/map/mining/mining-buyers.ts` + `.spec.ts`

**Interfaces (produces):**
```ts
interface MiningBuyersInput { stations: readonly SaveStation[]; relations?: SaveRelations; ware: Ware; sectors: ReadonlyMap<string, number> /* mining sector -> amount */; capacity: number; fillMinutes: number; near?: string }
interface MiningPair { sector: string; amount: number; station: SaveStation; price: number; wanted: number; jumps: number; thin: boolean; trip: MiningTrip }
class MiningBuyers { static NEAR_JUMPS = 2; rank(input, cache: TravelCache): MiningPair[]; bestPerSector(pairs): MiningPair[]; buyersFor(pairs, sector, limit): MiningPair[] }
```
- [ ] Tests: skips construction/wreck/hostile/unknown/zero-amount/sell/playerOnly offers; higher of two buy offers; units capped by offer amount and hold, thin when below one full hold; same-sector travel 0; near filter keeps buyers within 2 jumps of `near` only; best per sector; sorted by perHour.
- [ ] Implement; travel = `cache.from(sector)?.time.get(buyer.sector)`, unreachable pairs skipped.
- [ ] Commit.

### Task 3: `MinersNeeded`

**Files:** Create `src/app/map/mining/miners-needed.ts` + `.spec.ts`

**Interfaces:** `MinersNeeded.estimate(trip, consumedPerHour, offerAmount, fullHold, regrowthPerHour?): MinersEstimate` with `{ perMiner, capacityMiners?, holdsNow, hoursNowOneMiner, regrowth?, outpaces }`; `MinersNeeded.regrowth(sector: Sector, ware: string): number`.
- [ ] Tests: ceil maths; no `capacityMiners` when consumption is 0; regrowth for a nividium field (1 x 500 x 60 / 90 = 333.3/h) and `outpaces`.
- [ ] Implement. `perMiner` uses a full hold per trip (steady state).
- [ ] Commit.

### Task 4: `MiningBuyersStore`

**Files:** Create `src/app/map/mining/mining-buyers-store.ts` + `.spec.ts`

**Interfaces:** `active: Signal<boolean>`, `rows: Signal<MiningBuyerRow[]>`, `selectedSector: WritableSignal<string|undefined>`, `buyers: Signal<MiningBuyerRow[]>`, `buyerForm` (signal form `{ buyer: string }`), `selectedBuyer`, `needed: Signal<MinersEstimate|undefined>`, `gameTime`. Row = pair + `name`, `sectorName`, `buyerSectorName`.
- [ ] Tests (MapSaveTesting): inactive without a save; rows with a save; selecting a sector lists its buyers and `needed`.
- [ ] Implement: `LazyValue` loads `StationFlowCalculator` + `MiningBuyers`; names from `MapSaveLayer.stations()`; `TravelCache` keyed by miner speed + fastest drive charge.
- [ ] Commit.

### Task 5: UI

**Files:** Modify `map-mining-panel.component.{ts,html}`; Create `src/app/map/mining/miners-needed.component.{ts,html}` + panel spec.
- [ ] Spec: no save -> price select shown; with a save -> hidden and the card shows "Built capacity" and "Market now".
- [ ] Implement the save branch (table of best buyers, expandable buyer list as radios, card).
- [ ] i18n extract + 12 locale files. Commit.

### Task 6: Verify
- [ ] `npx ng test --watch=false`, `npx ng build`; update progress.
