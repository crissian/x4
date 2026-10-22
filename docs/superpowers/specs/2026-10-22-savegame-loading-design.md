# Savegame loading — design

Date: 2026-10-22 · Issue: crissian/x4#117 · Status: draft

## Intent

Issue #117 (from the admin of the X4 Facebook community) asks for build-where and trade-route advice for the
player's own universe. The site today only knows static game data, so it cannot see a player's universe. Loading
a savegame fixes that.

This is the **foundation** piece: read a save in the browser, keep it, let the player manage several saves and pick
an active one. Later pieces augment existing pages when a save is active, each as its own project, in this order:

1. Map: all stations, owners, sector ownership, discovered sectors, own assets highlighted
2. Blueprints and licences: badges on ships/modules/equipment the player owns
3. Player stations into the station calculator (missing inputs, workforce)
4. Trade routes from real offers, ranked by profit per jump (existing route planner)
5. Economy: supply/demand per sector, station-to-build suggestions that open in the calculator
6. Fleet: list, idle ships, ships without a captain
7. Exploration: lockboxes, data vaults, abandoned ships not yet taken

## Goals

- A player can load an X4 save (`.xml.gz`, or an unpacked `.xml`) from disk, in the browser, with no back end.
- Loading a late-game save (~100 MB compressed, ~900 MB XML) completes without freezing the page, with progress
  and a way to cancel.
- Several saves can be kept; they survive reloads; one is active at a time, or none.
- The active save is visible and switchable from every page.
- With no save active, the site behaves exactly as it does today.
- Later pieces can add data to the summary without the player having to find and upload the file again.

## Non-goals (this piece)

- Any of the seven augmentation features above. This piece only extracts the save's header info, plus the
  machinery the features will plug into.
- The Chromium "pick your save folder" button (File System Access API). Possible later addition.
- Comparing two saves.
- Editing or writing saves.

## Anti-goals

- Uploading anything anywhere. Saves stay in the player's browser; the page says so.
- Freezing or crashing the tab on a big save.
- Making the site slower or heavier for people who never load a save (the worker and save code are lazy-loaded).

## Constraints

- Angular 22 app (`D:\Work\x4`, branch `dev`), signals, Signal Forms (`[formField]`) for controls, Tailwind,
  lucide icons, vitest via `@angular/build:unit-test`.
- Front end only; deployed as static files (x4-game.com).
- UI text is i18n-marked (`i18n` / `$localize`); every new id needs a translation in all 12
  `src/locale/messages.<lang>.json` files.
- Local storage access goes through `core/services/local-storage.ts` (`readStorage`, `writeStorage`,
  `persistedSignal`), which tolerate blocked storage. IndexedDB access must be just as defensive.
- Game-data ids in the app are the save's macro names without `_macro` (e.g. `cluster_46_sector001_macro` →
  `cluster_46_sector001`; modules carry a `macro` field). Later extractors map through these.

## What a save contains (observed)

Two community saves from Egosoft's "X4 Legends" event (Steam, April 2025) were examined, stored at
`E:\Temp\X4\saves\`: `halfdan/save_004.xml.gz` (game 7.10, 109 MB → 921 MB, 31 player stations, ~830 player
ships) and `bawlislaf/save_006.xml.gz` (7.60, 104 MB → 882 MB). A current-version save from the user is at
`mine/save_001.xml.gz` (9.00 build 611726, 45 MB, early game: pirate start, ~11 in-game hours, all DLCs incl.
`ego_dlc_mini_02`). Its header is identical in shape to the 7.x ones; the universe holds 1,455 stations, 12,150
trade offers and an 800 k-entry economy log. One visible change for later pieces: resource areas are stored
differently (`area/fields/field` with region weights, far fewer `resourceareas`/`yields` entries), so the mining
piece must be designed against 9.x saves.

The file is a single gzip member of machine-written XML: one element per line, double-quoted attributes, no
comments or CDATA seen, UTF-8. A Python expat pass over the whole file takes ~26 s.

Header (all this piece extracts):

```xml
<savegame>
<info>
<save name="#004" date="1725323148"/>                <!-- real-world save time, unix seconds -->
<game id="X4" version="710" build="538965" modified="0" time="1302182.249" original="700"
      start="custom_budgeted" seed="..." guid="07D409E1-..."/>  <!-- time = in-game seconds; guid = playthrough -->
<player name="Val Selton" location="{20004,500021}" money="1428034806"/>
<patches>
  <patch extension="ego_dlc_split" version="710" name="Split Vendetta"/>   <!-- names are in the game's language -->
  ...
  <history>...</history>
</patches>
...
</info>
<universe> ... </universe>
```

For the later pieces, the save also holds every station (`component class="station" owner=...`, 1,625 in the
late-game save) with modules, construction sequence and workforce; trade offers and reference prices per station;
an economy log of past trades (3.5 M entries); resource-area yields; player blueprints, ships, crew and orders;
faction relations; collectable drops and recyclable wrecks; known/discovered flags. Most of the file
(scripts, turrets, positions, render data, mission cues) is irrelevant to the site.

## Approaches considered

- **A. Own streaming reader in a Web Worker, no dependency (chosen).** `DecompressionStream('gzip')` →
  `TextDecoderStream` → a small hand-written tag scanner → extractors that keep only what they need → a compact
  summary stored in IndexedDB. Fastest, adds nothing to the bundle; we own a small parser and its tests.
- **B. Same pipeline with a SAX library (`saxes`).** Standards-correct, less own code, but ~40 KB more and
  probably 2–3× slower (a minute or more on big saves); correctness gains don't matter for this regular format.
- Rejected: `xml-js` (used by the plan import) and `DOMParser` build the whole document in memory and would crash
  the tab at 900 MB. A WebAssembly parser adds a second toolchain for little gain over A.

The user picked A.

## Design

### Reading pipeline (worker)

- One module worker, created with `new Worker(new URL('./savegame.worker', import.meta.url), { type: 'module' })`
  only when the player loads a file.
- Input: a `File`/`Blob`. If the first two bytes are `1f 8b`, pipe through `DecompressionStream('gzip')`,
  otherwise read as plain XML. Then `TextDecoderStream('utf-8')`.
- Progress: compressed bytes consumed / file size, posted at most every ~100 ms.
- Cancel: the page terminates the worker.
- **Scanner** (`savegame-scanner.ts`, plain TS, no DOM): consumes text chunks, emits
  `open(name, attrs, depth)` and `close(name, depth)`; handles self-closing tags, tags and attribute values split
  across chunk boundaries, the XML declaration, and attribute entities (`&amp; &lt; &gt; &quot; &apos;` and numeric
  `&#..;`). Text content between tags is ignored (the save stores data in attributes). It must not build strings
  for elements nobody listens to beyond what's needed to find the tag name — speed matters on 900 MB.
- **Extractors**: each one is an object with a name, the element paths it listens to, and a `result()`. The worker
  runs all registered extractors in one pass and posts `{ schemaVersion, data: { [extractorName]: result } }`.
  Every load reads the whole file, even when all extractors are done early (the info extractor is done after
  `</info>`): reaching `</savegame>` is how a truncated or corrupt save is caught before it's stored, and later
  pieces need the full pass anyway. Extractors that are done just stop receiving events. *(Builder's call.)*
- If the input is an unpacked `.xml`, the worker gzips it with `CompressionStream('gzip')` in the same pass (tee
  the byte stream) and returns that blob for storage, so a stored file is always the compressed form.
  *(Builder's call.)*
- This piece ships one extractor, `info`: save name, real date, game version/build, original version, start type,
  in-game time, playthrough guid, player name, money, DLC extensions (ids + versions; names are shown from the
  extension id, not the save's localized name).
- Errors (not gzip/XML, no `<savegame>`, truncated file) come back as a typed error the page can show.

### Storage

- IndexedDB database `x4-savegames`, own small promise wrapper (no dependency), two object stores:
  - `saves`: `{ id, schemaVersion, addedAt, fileName, fileSize, info, data }` — the summary.
  - `files`: `{ id, blob }` — the original compressed file, so a later piece that raises `schemaVersion` can
    re-extract without the player re-uploading.
- One entry per playthrough: `id` = the game `guid`. An entry always holds the newest save of that playthrough
  (by `<save date>`). Loading a newer or same-date save of a stored playthrough replaces the entry (summary and
  file) and keeps it active if it was. Loading an older one leaves the entry unchanged and tells the player a newer
  save of that game is already loaded. A save with a new guid gets its own entry. *(Decided by the user.)*
- On first save, call `navigator.storage.persist()` (best effort). The saves page shows used/available space from
  `navigator.storage.estimate()`.
- If storing the file blob fails (quota), keep the summary and flag the save as "file not kept"; on a later schema
  bump it is marked "reload needed" instead of re-extracted.
- If IndexedDB is unavailable (private window, blocked site data), loading still works for the current page
  session, and the page says saves won't be kept.
- Re-extraction: on startup, any stored save whose `schemaVersion` is behind the current one and has its file is
  re-extracted in the background, one at a time; the selector shows it as "updating".

### State (`SavegameStore`, root service, signals)

- `saves()` — list of summaries without heavy `data`, newest first.
- `activeId` — `persistedSignal('activeSavegame', null)`.
- `active()` — the active summary including `data`, or `null`. Features read this.
- `load(file)`, `cancel()`, `remove(id)`, `select(id | null)`, `loading()` — progress and state for the UI.
- Removing the active save sets `activeId` to `null`. A stored `activeId` that no longer exists is treated as
  `null`.

### UI

- **Header**: a compact save selector next to the language select (Signal Forms `[formField]`), listing "No save"
  plus the stored saves (player name · save name · in-game time), and a link "Manage saves". With no saves stored
  it shows only a "Load save" link. On narrow screens it collapses to an icon.
- **Saves page** (`/saves`, lazy route, added to the nav):
  - Drop zone + file button accepting `.xml.gz` and `.xml`, with a hint where saves live:
    `Documents\Egosoft\X4\<id>\save\` (on many Windows setups under `OneDrive\Documents\...`).
  - Progress bar with cancel while loading.
  - A list of stored saves: player name, save name, real save date, in-game time, credits, game version, DLCs,
    file size, and a status (active, updating, reload needed, file not kept). Actions: make active, delete.
    Updating a game is just loading its newer save.
  - A line stating the save never leaves the browser, plus storage usage.
- All text i18n-marked and translated into all 12 locales; enum-ish labels via `core/enum-labels.ts`.

### Tests

- Scanner: unit tests for chunk boundaries at every position of a small sample, self-closing tags, entities,
  depth tracking, early stop.
- Info extractor: against a trimmed fixture built from the real save header.
- Store: logic tested against an in-memory implementation of the storage interface (jsdom has no IndexedDB).
- A dev-only Node script (not in the build) runs the worker pipeline on a real save and prints timing, used to
  check the 9.00 save and the two 7.x community saves.

## Left to the builder

- File and folder names inside the app; where the worker and scanner live (suggested: `src/app/savegame/`).
- The IndexedDB wrapper shape and the in-memory test double.
- Exact header and saves-page layout, within the app's existing Tailwind style.
- Progress throttling details and chunk handling inside the scanner.
