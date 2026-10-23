# Map save extras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hatch contested sectors, dim unknown sector names, and explain contested / undiscovered / player presence in
the map legend and sector tooltip.

**Architecture:** A new `MapSaveSectors` service derives per-sector save status from `MapSaveLayer`; the canvas,
labels layer, tooltip and legend read it. No store, panel, extractor or schema change.

**Tech Stack:** Angular (signals, standalone components, `templateUrl`), Vitest via `ng test`, Tailwind.

**Spec:** `docs/superpowers/specs/2026-10-23-map-save-extras-design.md` (Owner decisions: no stations badge; unknown
sectors dimmed, names kept).

## Global Constraints

- Classes only, `templateUrl` + `.html`, state classes bound in templates, files < ~300 lines.
- Don't touch `map-store.ts`, `map/panels/*`, `map/mining*`, `map-save-layer.ts`.
- All UI text i18n; translations for every new id in all 12 `messages.<lang>.json`.
- Without a save the map looks exactly as before.

## Review Focus

- "Discovered only" on: unknown sectors are not drawn, legend must not show the "Not discovered" swatch.
- Selected contested sector: yellow selection stroke still wins over the red outline.
- Sector with player stations but no ships: tooltip shows stations, no badge.
- Hatch must not steal pointer events (hover / click on contested sectors keeps working).
- Cluster labels (zoomed out) of multi-sector systems are never dimmed.

---

### Task 1: `MapSaveSectors` service

**Files:** Create `src/app/map/save/map-save-sectors.ts`, `.spec.ts`; modify `src/app/map/map-providers.ts`.

**Interfaces — Produces:** `@Injectable() class MapSaveSectors { unknown: Signal<ReadonlySet<string>>; contested:
Signal<ReadonlySet<string>>; presence: Signal<ReadonlyMap<string, SectorPresence>> }`,
`interface SectorPresence { ships: PlayerShipCount | undefined; stations: number }`.

- [ ] Tests (using `MapSaveTesting`): sets for unknown / contested; presence for ships only, stations only, both; all
      empty without a save.
- [ ] Implement, add to `MAP_PROVIDERS`, run tests, commit.

### Task 2: Canvas hatch + dimmed labels

**Files:** `canvas/map-canvas.component.ts/.html`, `canvas/map-layers.ts`, `canvas/map-labels-layer.html`,
`canvas/map-save-markers.spec.ts`.

- [ ] Test: contested sector has a `polygon[fill="url(#map-contested)"]` with `pointer-events="none"`, solid stroke
      (no dasharray); unknown sector's label has `opacity="0.5"`.
- [ ] Pattern `<pattern id="map-contested" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` sized
      `store.fontSize() * 0.6`; hatch polygon after the fill polygon; drop the dash. Labels get `dim: boolean`.
- [ ] Run tests, commit.

### Task 3: Tooltip info

**Files:** create `canvas/map-save-sector-info.ts/.html` (`app-map-save-sector-info`, input `sector: string`);
modify `canvas/map-popups.ts`, `canvas/map-tooltip.html`.

- [ ] Test: hovering a contested unknown sector with ships + stations shows "Contested", "Not discovered",
      "Your ships: 6 (XS 1, S 2, XL 3)", "Your stations: 1"; nothing without a save.
- [ ] Implement (rendered only when `store.saveActive()`), run tests, commit.

### Task 4: Legend section

**Files:** create `canvas/map-save-legend.ts/.html` (`app-map-save-legend`); modify `canvas/map-legend.component.ts/.html`.

- [ ] Test: legend contains "From your save" section with Contested / Not discovered / Your ships / Your station
      only with a save; "Not discovered" absent while `discoveredOnly` is on.
- [ ] Implement, run tests, commit.

### Task 5: i18n + verification

- [ ] `npx ng extract-i18n`, add translations to 12 locale files, commit.
- [ ] `npx ng test --watch=false`, `npx ng build`.
