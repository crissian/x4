# Map extras from the savegame — design

Date: 2026-10-23 · Issue: crissian/x4#117 · Status: draft · Builds on: `2026-10-22-savegame-map-design.md`

## Intent

The savegame map already draws contested, undiscovered and player data, but only half-way: a contested sector is a
red dashed outline, an undiscovered one is dimmed, player ships are a blue count badge, and none of it is explained
anywhere. The legend says nothing, the sector tooltip says nothing. This piece makes those three save facts
readable at a glance and explains them in the legend and tooltip. It does not add new save parsing.

## Goals / non-goals

- Goals: contested sectors are clearly hatched; the player sees per sector how many ships and stations they own;
  undiscovered sectors are visibly "unknown"; the legend and the sector tooltip explain all three. The map
  without a save stays exactly as it is.
- Non-goals: new extractor fields or a schema bump; individual ship markers; fog-of-war for gates and stations
  beyond what "Discovered only" already does; changes to the colour modes, the store, or the side panels.

## Data sources (already parsed, no extractor change)

- `savegame/extractors/map-extractor.ts` → `SaveMap` (`savegame/map/save-map-model.ts`):
  - `sectors[]`: `{ id, owner, contested: contested="1", known: knownto="player" }`;
  - `playerShips`: sector id → `[xs, s, m, l, xl]` counts of `owner="player"` ships (docked ones included);
  - `stations[]` with `owner` (`'player'` for the player's stations) and `known`.
- `map/save/map-save-layer.ts` (`MapSaveLayer`) exposes `sectors()` (Map), `playerShips()` (total + bySize),
  `stations()` (`player`, `known`), `discoveredOnly` + `discoveredOnlyForm`, and `active()`.
- Already drawn today: `map-canvas.component.ts` computes `unknown` / `contested` sets (dim 0.4, red dashed
  stroke); `MapStore.hidesUnknown` / `drawnIds` implement "Discovered only"; `MapSaveMarkers` draws the ship badge;
  `station-markers.html` rings player stations.

## Design

- **One source for the per-sector save status.** New `MapSaveSectors` (`map/save/map-save-sectors.ts`, injectable,
  in `MAP_PROVIDERS`) reads `MapSaveLayer` and exposes `unknown: Set`, `contested: Set` (moved out of the canvas
  component) and `presence: Map<sector, { ships: PlayerShipCount | undefined; stations: number }>` (player stations
  counted from `MapSaveLayer.stations()`). All empty without a save.
- **Contested: hatched.** A `<pattern id="map-contested">` in the canvas `<defs>` (diagonal red lines, `userSpaceOnUse`,
  spacing from `store.fontSize()` so it keeps a fixed on-screen density). Each contested sector gets a second
  polygon with `fill="url(#map-contested)"` and `pointer-events="none"` drawn right after its fill polygon, so the
  owner colour stays visible under the hatch. The outline becomes solid red (drop the dash; it was hard to tell from
  the superhighway dotted lines).
- **Player presence.** The ship badge stays as is (blue, total, size split in its title). Player stations already
  have a ringed marker, so no second badge; instead the presence numbers go into the sector tooltip. When a sector
  has player stations but no ships it gets no badge (the ring markers show it).
- **Explored vs unknown.** Keep the 0.4 dim on fill and stroke; also dim that sector's name label (opacity 0.5).
  Names stay visible: the site shows every sector name without a save, so there is nothing to spoil, and
  "Discovered only" already hides them completely for players who want the in-game view.
- **Tooltip.** New `app-map-save-sector-info` (`map/canvas/map-save-sector-info.ts` + `.html`) inside
  `map-tooltip.html` under the `<dl>`, rendered only with a save: "Contested", "Not discovered", "Your ships: 12
  (S 3, M 9)", "Your stations: 2", each line only when it applies.
- **Legend.** New `app-map-save-legend` (`map/canvas/map-save-legend.ts` + `.html`) inserted in
  `map-legend.component.html` below the links row, only when `store.saveActive()`: hatched swatch "Contested",
  dimmed swatch "Not discovered" (left out while "Discovered only" is on), blue badge "Your ships (count)", ringed
  dot "Your station". Swatch styles live in the `.html`.
- **Always on with a save; no new toggles.** These are facts of the save, low on ink, and the header already has
  "Discovered only" as the one switch. Without a save every part is hidden (the sets are empty and the
  legend/tooltip blocks are `@if`'d out).

## Files touched

- New: `map/save/map-save-sectors.ts` (+ `.spec.ts`), `map/canvas/map-save-sector-info.ts` + `.html`,
  `map/canvas/map-save-legend.ts` + `.html`.
- Modified (small edits):
  - `map/map-providers.ts`: add `MapSaveSectors` (one line).
  - `map/canvas/map-canvas.component.ts`: drop `unknown`/`contested`, inject `MapSaveSectors`.
  - `map/canvas/map-canvas.component.html`: pattern in `<defs>`, hatch polygon, solid contested stroke.
  - `map/canvas/map-layers.ts` + `map-labels-layer.html`: a `dim` flag on sector labels.
  - `map/canvas/map-popups.ts` (import) + `map-tooltip.html` (one element).
  - `map/canvas/map-legend.component.ts` (import) + `.html` (one element).
  - `src/locale/messages.json` + all 12 `messages.<lang>.json`: ~6 new strings.
- Not touched: `map-store.ts`, `map/panels/*` (the mining feature edits those), `map-save-layer.ts`, the extractor.

## Tests

- `map-save-sectors.spec.ts`: unknown/contested sets, presence (ships only, stations only, both), empty without a
  save (using `map-save-testing.ts`).
- `map.component.spec.ts` or a canvas spec: a contested sector renders the hatch polygon; legend save block present
  only with a save; tooltip lines appear for a contested/unknown/player sector.
- Browser check with both test saves (late 7.10 save: 8 player sectors, 832 ships).

## Decisions I made

- Always-on with a save, no new toggles; "Discovered only" remains the single switch.
- Unknown sectors are dimmed with their names kept (dimmed), not hidden.
- Hatch as an overlay polygon so the owner colour stays; solid red outline instead of the dash.
- Player stations: tooltip count only, no extra badge (they already have ringed markers).
- The status sets move to a new service so the canvas, tooltip and legend share them and `map-store.ts` stays
  untouched.

## Open questions for the owner

1. Should player presence also get a separate gold "stations" badge next to the blue ship badge (visible when zoomed
   out, where the ringed dots are tiny), or is the tooltip count enough?
2. Should undiscovered sectors' names be hidden (shown as "Unknown sector") to match the in-game map, instead of
   just dimmed?

## Owner decisions (2026-10-23)

- No separate stations badge; tooltip and ringed markers are enough.
- Undiscovered sectors: dim only, don't hide names.
