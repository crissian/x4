# Blueprint Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/blueprints` page showing owned vs. missing blueprints per category and a shopping list (buy now / need more reputation / not sold) from the active save.

**Architecture:** A new extractor writer emits `blueprint-rules-data.ts` (tags, no-sale factions, unlock sources). Pure static classes in `src/app/blueprints/` build the catalog, progress and shopping list; a page-scoped `BlueprintsStore` wires them to the active save and keeps the filters (signal form) in the URL. Small components render it.

**Tech Stack:** Angular 22 (signals, Signal Forms, vitest), C# .NET 7 extractor.

**Spec:** `docs/superpowers/specs/2026-10-23-blueprint-tracker-design.md` (Owner decisions override; the save extractors and schema bump are already on dev).

## Global Constraints

- Classes, no exported functions or factories; files < ~300 lines.
- `templateUrl` + `.html`; visual state classes in templates; no inline templates.
- Controls via `form()` + `[formField]`.
- All UI text through `i18n` / `$localize`; translations in all 12 locale files.
- Save data read as `this.save()?.data?.['blueprints'] as SaveBlueprints | undefined` (and `licences`, `relations`).
- Don't edit `ShipStatsService.sellers()` or `EquipmentWriter.cs`; Program.cs: only register the writer.
- Prices: modules `price.max`, ships/equipment `10 × price.avg`, labelled "game price"; save values labelled "as of save time".

## Review Focus

- Item with a licence the selling faction doesn't list in `licenses` → still "need reputation", needed reputation shown as unknown ("?"), no crash.
- Save without `licences`/`relations` keys (older data) → treated as empty, page still renders.
- Item sold only by Kaori → "not sold", never "buy".
- Search text with different case → matches case-insensitively.
- Unknown `category` query param → ignored (all categories).

---

### Task 1: Extractor — BlueprintRulesWriter

**Files:**
- Create: `X4Extractor/Writers/BlueprintRulesWriter.cs` (reader logic + writer; `BlueprintRules` record, `BlueprintRulesReader`, `BlueprintRulesWriter : EntityWriter<BlueprintRules>`)
- Modify: `X4Extractor/Program.cs` (one call in `Main`, one small `WriteBlueprintRules()` method passing `LoadWares().Wares`)

- [ ] `notForPlayer`: module/ship/equipment wares tagged `noplayerblueprint`, or module/ship tagged `noblueprint`. `missionOnly`: tagged `missiononly`. Sorted ids.
- [ ] `noSaleFactions`: `<faction tags="… noblueprintsale …">` in `libraries/factions.xml` and `extensions/*/libraries/factions.xml`.
- [ ] `unlockedBy`: literal `ware.X` ids in `add_blueprints wares=` and `macro.X` (mapped to the ware whose component ref is X) in `add_blueprints macros=`, in `md/*.xml` and `extensions/*/md/*.xml`; file name → `research` (`story_research_*`), `terraforming`, `gamestart` (`setup_gamestarts`), else `story`. On conflicts priority research > terraforming > story > gamestart.
- [ ] Output: `export type BlueprintUnlock = …; export const BlueprintRules = { notForPlayer: [...] as string[], missionOnly, noSaleFactions, unlockedBy: {...} as Record<string, BlueprintUnlock> };`
- [ ] `dotnet build`, run, copy `blueprint-rules-data.ts` (LF) to the web app; commit both repos.

### Task 2: Model, categories, price, sellers

**Files:** Create `src/app/blueprints/blueprint-model.ts`, `blueprint-categories.ts`, `blueprint-price.ts`, `blueprint-sellers.ts`, `blueprint-price.spec.ts`, `blueprint-sellers.spec.ts`

**Produces:**
- `BlueprintKind = 'module' | 'ship' | 'equipment'`; `BlueprintItem { id; name; kind; category: string; price: number; owners?: Faction[]; license?: string }`
- `BlueprintCategories.ALL: BlueprintCategory[]` (`{ id, kind, label }`), `BlueprintCategories.module(type)`, `.ship(size)`, `.equipment(type)` → category id or undefined (software).
- `BlueprintPrice.of(price: Price | undefined, kind: BlueprintKind): number`
- `BlueprintSellers.of(owners, license, faction: (id) => Faction | undefined, noSale: readonly string[]): BlueprintSeller[]`

- [ ] Tests: module → max; ship/equipment → avg × 10; missing price → 0. Sellers drop `kaori`, attach the faction's `License` of the type.

### Task 3: Catalog, progress, shopping list

**Files:** Create `blueprint-catalog.ts`, `blueprint-progress.ts`, `blueprint-shopping-list.ts`, `blueprint-testing.ts`, specs.

**Produces:**
- `BlueprintCatalog.build(modules, ships, equipment, notForPlayer): BlueprintItem[]`
- `BlueprintProgress.build(items, owned: ReadonlySet<string>): BlueprintProgressResult` (`categories: CategoryProgress[]` with owned/total/missing, `other`, `owned`, `total`)
- `BlueprintShoppingList.build({ items, owned, licences, relations, sellers: (item) => BlueprintSeller[], missionOnly, unlockedBy }): ShoppingList` (`buy`, `rep`, `unsold`, `groups: FactionGroup[]`, `total`)

- [ ] Tests per spec: licence held → buy; no licence → buy; missing licence → rep sorted by gap, `pending` when relation ≥ minRelation; Kaori-only → unsold; missionOnly/unlockedBy reasons; grand total counts a multi-seller item once, each faction total counts all its items; progress counts, notForPlayer excluded, other count.

### Task 4: Store, query, components, route, nav, i18n

**Files:** Create `blueprint-query.ts`, `blueprints-store.ts`, `components/{blueprints-page,blueprint-progress,blueprint-shopping-list,blueprint-filters,blueprint-item-link}.component.{ts,html}`, `components/blueprints-page.component.spec.ts`. Modify `app.routes.ts`, `header.component.ts`, `src/locale/messages*.json`.

- [ ] Store: `status: 'no-save' | 'loading' | 'reload-needed' | 'ready'`, `progress`, `shopping`, form model `{ tab, category, search, hideComplete }` in URL params `tab`, `category`, `q`, `complete=hide`.
- [ ] Page spec: no-save, reload-needed, ready, filters round-trip through the URL.
- [ ] `npx ng extract-i18n`, translate new ids in 12 files.
- [ ] `npx ng test --watch=false`, `npx ng build`; commit.
