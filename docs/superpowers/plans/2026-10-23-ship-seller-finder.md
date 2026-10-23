# Ship seller finder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A "Where to buy" card on `/ships/:id` listing every wharf or shipyard that builds the ship, nearest first from a chosen sector, with jumps, travel time and the player's standing.

**Architecture:** Pure static classes in `src/app/ship/sellers/` decide which stations build a size (`ShipBuildClasses`), which stations sell the ship (`ShipSellerStations`) and whether the player can buy (`SellerStanding`). A component-provided store (`ShipSellerFinder`) joins them with the active save, the lazily loaded game start stations, `RoutePlanner.travelTimes` and a persisted signal form; `ShipSellersNearComponent` renders it.

**Tech Stack:** Angular 22 (signals, Signal Forms), Vitest via `ng test`.

**Spec:** `docs/superpowers/specs/2026-10-23-ship-seller-finder-design.md` (Owner decisions section overrides: licences from the existing `LicencesExtractor`, ships only, fixed speed).

## Global Constraints

- No extractor work, no schema bump; `SaveLicences` comes from `savegame/map/save-map-model.ts`, save key `licences`.
- Consume `ShipStatsService.sellers(owners, license)` unchanged.
- Fixed travel: 3,000 m/s, 5 s charge.
- Classes only (no exported functions), files < ~300 lines, `templateUrl`, Signal Forms `[formField]`, i18n in all 12 locales.
- God stations and naming tables are lazy-imported (ship chunk must not grow).

## Review Focus

- Ship with no station-owning seller (Buccaneers, Trinity, XS drones): empty state, not a crash. → Task 2 / Task 5 test.
- From sector text that matches no sector (typo, other casing): rows still listed, sorted by name, no times. → Task 4 test.
- Save without a `licences` key (older save): standing by reputation only, never "ceremony". → Task 3 test.
- Unreachable station sector (not linked): listed last with "-" time. → Task 4 test.
- Licence types without a ceremony (basic `generaluseship`, minrelation −0.01): never "ceremony" just because the save lacks it. → Task 3 test.

---

### Task 1: ShipBuildClasses

**Files:** Create `src/app/ship/sellers/ship-build-classes.ts` (+ `.spec.ts`)

**Interfaces — Produces:** `ShipBuildClasses.ofModule(id: string): Size[]`, `ShipBuildClasses.ofGameStart(station: GodStation): Size[]`, `ShipBuildClasses.ofSave(station: SaveStation): Size[]` (union over modules).

- [ ] Tests: `buildmodule_gen_ships_s` → [small]; `_m` → [medium]; `buildmodule_arg_ships_m_dockarea_01` → [small, medium]; `_l` → [large]; `_xl` → [extralarge]; `buildmodule_xen_ships_xl` → [large, extralarge]; `buildmodule_gen_equip_l`, `buildmodule_gen_carrier` → []; game start wharf → S,M; shipyard → L,XL; `shipyard_alliance`, `shipyard_split_warforge_01` → XL; equipment dock → [].
- [ ] Implement with regex `^buildmodule_([a-z]+)_ships_(s|m|l|xl)(_dockarea_\d+)?$`.
- [ ] Commit.

### Task 2: ShipSellerStations

**Files:** Create `src/app/ship/sellers/ship-seller-stations.ts` (+ spec)

**Interfaces — Produces:** `interface SellerStation { id; type: 'shipyard' | 'wharf'; owner; sector; known; save?: SaveStation }`; `ShipSellerStations.fromGameStart(ship: Ship, stations: GodStation[]): SellerStation[]`; `ShipSellerStations.fromSave(ship: Ship, map: SaveMap): SellerStation[]`. Save type: 'shipyard' when it can build L/XL, else 'wharf'.

- [ ] Tests: owner filter; size filter (M ship skips shipyard, L ship skips wharf); Alliance shipyard skipped for an L ship; player / wreck / construction skipped; no owners → [].
- [ ] Implement, commit.

### Task 3: SellerStanding

**Files:** Create `src/app/ship/sellers/seller-standing.ts` (+ spec)

**Interfaces — Produces:** `type StandingStatus = 'ok' | 'reputation' | 'ceremony' | 'enemy' | 'unknown'`; `interface Standing { status; needed?: number; have?: number; missing?: number }` (reputation points); `SellerStanding.of(requirement: LicenseRequirement, relations?: SaveRelations, licences?: SaveLicences): Standing`.

Rules: no relations → unknown (with `needed` when minRelation set). relation ≤ −0.01 → enemy. relation < minRelation → reputation (needed/have/missing). Licences present, minRelation > 0 (the licences with a ceremony precursor in factions.xml: 0.01 / 0.1) and faction not in `licences[type]` → ceremony. Else ok.

- [ ] Tests: −0.01 enemy boundary, −0.009 ok for basic; exactly minRelation ok; missing points (+10 needed, +4 have, 6 missing); ceremony absent/present; no save; save without licences; basic licence (−0.01) not held → ok.
- [ ] Implement, commit.

### Task 4: ShipSellerFinder

**Files:** Create `src/app/ship/sellers/ship-seller-finder.ts` (+ spec)

**Interfaces — Consumes:** Tasks 1–3, `RoutePlanner`, `LazyValue`, `StationNamer`, `LocalStorage.persistedSignal`, `ShipStatsService.sellers`. **Produces:** `@Injectable()` with `ship = signal<Ship | undefined>`, `form` (field `from`), `fromSave`, `sectors`, `rows(): SellerRow[] | null`, `reachable`, constants `SPEED = 3000`, `CHARGE = 5`. `SellerRow { id, type: StationTypeInfo, name, faction?: Faction, sector?: Sector, sectorId, known, jumps?, time?, standing: Standing, requirement: LicenseRequirement }`.

- [ ] Tests (TestBed, mocked `SavegameStore.active`): game start rows for Behemoth (owners incl. argon) include `shipyard_argon_01`; with `from` = 'Argon Prime' rows sort by time with jumps 0 first; unknown from text → sorted by owner then sector name, no time; save rows use relations + licences.
- [ ] Implement, commit.

### Task 5: ShipSellersNearComponent + ship page card + i18n

**Files:** Create `src/app/ship/sellers/ship-sellers-near.component.ts/.html` (+ spec); modify `ship-detail.component.html/.ts`; locales.

- [ ] Tests: no save shows "needs +N rep" requirement text; empty state "No station sells it"; datalist input bound.
- [ ] Implement, add card under the speed/sold-by grid, `ng extract-i18n`, translate new ids in 12 locales, commit.

### Task 6: Verify

- [ ] `npx ng test --watch=false`, `npx ng build`; check save sanity on `mine/save_001` via a node script against the save map JSON if feasible.
