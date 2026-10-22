# Savegame Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Players load X4 saves in the browser, keep one entry per playthrough, and pick an active save from the header.

**Architecture:** Generic building blocks (streaming XML scanner, byte-stream opener, worker task runner, IndexedDB key-value store, file drop zone, progress bar) live in `core/` and `shared/`; `src/app/savegame/` is thin glue on top: an info extractor, a worker, a repository, a signal store, a header selector and a `/saves` page.

**Tech Stack:** Angular 22 (standalone, signals, Signal Forms), Tailwind 4, lucide, vitest via `@angular/build:unit-test`, browser `DecompressionStream`/`CompressionStream`/`TextDecoderStream`, IndexedDB, module Web Worker.

**Spec:** `docs/superpowers/specs/2026-10-22-savegame-loading-design.md`

## Global Constraints

- Repo `D:\Work\x4`, branch `dev`. **Do not commit**: the user commits on request. Each task ends with a "ready to commit" checkpoint listing the files instead.
- Code is generic and reusable wherever it can be; every file stays **under 300 lines**. Feature-specific code only in `src/app/savegame/`.
- No new npm dependencies.
- Controls bind with Signal Forms `[formField]`, never `(change)`/`$any` handlers.
- All UI text marked `i18n` / `$localize`; after the UI task run `npx ng extract-i18n` and add every new id to all 12 `src/locale/messages.<lang>.json`.
- Storage must tolerate being unavailable (same spirit as `core/services/local-storage.ts`).
- Tabs for indentation, single quotes, match existing file style (see `src/app/map/map-store.ts`, `*.spec.ts`).
- Saves never leave the browser; nothing is uploaded.
- Test saves: `E:\Temp\X4\saves\mine\save_001.xml.gz` (9.00), `E:\Temp\X4\saves\halfdan\save_004.xml.gz` (7.10, 921 MB XML), `E:\Temp\X4\saves\bawlislaf\save_006.xml.gz` (7.60).
- Run one spec: `npx ng test --watch=false --include=<path>`; all: `npx ng test --watch=false`; lint: `npx ng lint`; build: `npx ng build`.

## Review Focus

1. An attribute value containing a literal `>` or `/` (legal unescaped in XML) must not end the tag early — scanner test `keeps > inside quoted attribute values` (Task 1).
2. A UTF-8 multi-byte character (player name `Müller`, `Hatikvah's`) split across byte chunks must decode intact — reader test `decodes multi-byte characters split across chunks` (Task 2).
3. A save cut off mid-download (truncated gzip) must fail with `truncated`, never be stored — reader test `reports a truncated gzip` (Task 2).
4. Starting a second load while one runs must not interleave — store test `refuses a second load while one is running` (Task 5).
5. Storage quota exceeded on the file blob keeps the summary with `fileKept: false` — repository test `keeps the summary when the file cannot be stored` (Task 4).

---

### Task 1: Generic streaming XML scanner

**Files:**
- Create: `src/app/core/xml/xml-stream-scanner.ts`
- Test: `src/app/core/xml/xml-stream-scanner.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  export type XmlAttributes = Record<string, string>;
  export interface XmlScanHandler {
  	/** path = names of the open elements including this one; live array, copy to keep. attrs parses on demand. */
  	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void;
  	close?(name: string, path: readonly string[]): void;
  }
  export type XmlScanErrorCode = 'invalid-xml' | 'truncated';
  export class XmlScanError extends Error { constructor(readonly code: XmlScanErrorCode, message: string) }
  export class XmlStreamScanner {
  	constructor(handler: XmlScanHandler);
  	write(chunk: string): void;
  	/** throws XmlScanError('truncated') when elements are still open or no root was seen */
  	end(): void;
  	get depth(): number;
  }
  export function decodeXmlEntities(value: string): string;
  ```

- [ ] **Step 1: Write the failing tests** (`describe('XmlStreamScanner')`), feeding text through a helper that records `open`/`close` events as strings:
  - `reports elements with their path and lazily parsed attributes`: `<a x="1"><b y="2"/></a>` → opens `a [a] {x:'1'}`, `b [a,b] {y:'2'}`; closes `b`, `a`.
  - `gives the same events for every chunk split`: for a sample `<?xml version="1.0"?>\n<savegame>\n<info>\n<save name="#004" date="1"/>\n</info>\n<universe a="x &amp; y"></universe>\n</savegame>`, split at every index i into two writes; events equal the single-write events.
  - `keeps > inside quoted attribute values`: `<a t="x > y / z"/>` → attrs `{t:'x > y / z'}`, one open + one close.
  - `decodes entities in attribute values`: `&amp; &lt; &gt; &quot; &apos; &#65; &#x42;` → `& < > " ' A B`.
  - `skips the declaration, comments and text`: `<?xml ...?><!-- c --><a>text</a>` → only `a` events.
  - `throws invalid-xml on a mismatched close tag`: `<a></b>` → `XmlScanError` with `code === 'invalid-xml'`.
  - `throws truncated when input ends inside an element`: `<a><b/>` then `end()` → code `truncated`; empty input then `end()` → `truncated`.

- [ ] **Step 2: Run** `npx ng test --watch=false --include=src/app/core/xml/xml-stream-scanner.spec.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement `xml-stream-scanner.ts`.** Keep an unconsumed `buffer` string; on each `write`, scan for `<`, then for the matching `>` while skipping quoted runs (`"`/`'`); if no complete tag is in the buffer, keep the tail and wait. Only slice the tag name eagerly; `attrs` closes over the tag text and parses `name="value"` pairs with one regex on first call (memoized). Handle `<?…?>`, `<!--…-->` (find `-->`), self-closing `/>` (open then close), and close tags checked against the stack. Speed matters (900 MB): no per-character string concatenation, use `indexOf`.

- [ ] **Step 4: Run** the same command — Expected: PASS.

- [ ] **Step 5: Ready to commit:** `src/app/core/xml/xml-stream-scanner.ts`, `.spec.ts`.

---

### Task 2: Generic byte-stream reader, extractor runner, savegame model and info extractor

**Files:**
- Create: `src/app/core/streams/open-text-stream.ts` (generic: gzip sniffing, progress, optional gzip copy)
- Create: `src/app/core/xml/xml-extractor.ts` (generic: run several extractors in one scan)
- Create: `src/app/savegame/savegame-model.ts`
- Create: `src/app/savegame/extractors/info-extractor.ts`
- Create: `src/app/savegame/read-savegame.ts` (glue)
- Test: `src/app/core/streams/open-text-stream.spec.ts`, `src/app/savegame/read-savegame.spec.ts`, `src/app/savegame/extractors/info-extractor.spec.ts`
- Fixture: `src/app/savegame/testdata/info-9.00.xml` — the first ~30 lines of `E:\Temp\X4\saves\mine\save_001.xml.gz` (`<savegame><info>…</info>`) followed by `<universe></universe></savegame>`; replace the player name with `Müller`.

**Interfaces:**
- Consumes: `XmlStreamScanner`, `XmlScanHandler`, `XmlScanError` (Task 1).
- Produces:
  ```ts
  // open-text-stream.ts
  export interface TextStreamOptions { size: number; onProgress?(read: number, total: number): void; keepGzip?: boolean }
  export interface OpenedTextStream {
  	text: ReadableStream<string>;
  	/** true when the input was gzip (first bytes 1f 8b) */
  	gzipped: boolean;
  	/** set when keepGzip and the input was plain: resolves to a gzip Blob of the input once text is fully read */
  	gzipCopy?: Promise<Blob>;
  }
  export function openTextStream(bytes: ReadableStream<Uint8Array>, options: TextStreamOptions): Promise<OpenedTextStream>;

  // xml-extractor.ts
  export interface XmlExtractor<T = unknown> extends XmlScanHandler { readonly key: string; done(): boolean; result(): T }
  /** feeds every chunk to one scanner whose events go to all extractors not yet done; calls end() */
  export function runExtractors(text: ReadableStream<string>, extractors: XmlExtractor[], onDone?: (key: string, result: unknown) => void): Promise<Record<string, unknown>>;

  // savegame-model.ts
  export const SAVEGAME_SCHEMA_VERSION = 1;
  export interface SavegameExtension { id: string; version: number }
  export interface SavegameInfo {
  	saveName: string; savedAt: number /* unix ms */; gameVersion: number; gameBuild: number; originalVersion: number;
  	start: string; gameTime: number /* in-game seconds */; guid: string; playerName: string; money: number;
  	modified: boolean; extensions: SavegameExtension[];
  }
  export interface SavegameSummary {
  	id: string /* = info.guid */; schemaVersion: number; addedAt: number; fileName: string; fileSize: number;
  	fileKept: boolean; info: SavegameInfo; data: Record<string, unknown>;
  }
  export type SavegameListItem = Omit<SavegameSummary, 'data'>;
  export type SavegameErrorCode = 'not-a-savegame' | 'invalid-xml' | 'truncated' | 'read-failed';
  export class SavegameError extends Error { constructor(readonly code: SavegameErrorCode, message: string) }

  // info-extractor.ts
  export function createInfoExtractor(): XmlExtractor<SavegameInfo | null>; // key 'info'

  // read-savegame.ts
  export interface ReadSavegameOptions { size: number; onProgress?(read: number, total: number): void; onInfo?(info: SavegameInfo): void }
  export interface ReadSavegameResult { info: SavegameInfo; data: Record<string, unknown>; gzipCopy?: Blob }
  /** reads the whole file; the extractor list is created inside (info only for now, data = results of the others) */
  export function readSavegame(bytes: ReadableStream<Uint8Array>, options: ReadSavegameOptions): Promise<ReadSavegameResult>;
  ```

- [ ] **Step 1: Write the failing tests.** Build byte streams in tests with `new Blob([...]).stream()`; gzip with `new Response(blob.stream().pipeThrough(new CompressionStream('gzip'))).blob()`; a chunked stream helper that emits given `Uint8Array` slices.
  - `open-text-stream.spec.ts`: `reads plain text and reports progress up to the size` (last progress `read === total`); `gunzips gzip input` (`gzipped === true`, text equals original); `returns a gzip copy of plain input when asked` (gunzipping `gzipCopy` gives the original); `decodes multi-byte characters split across chunks` (`Müller` with the `ü` bytes split over two chunks).
  - `info-extractor.spec.ts` with the fixture: `reads the save header` → `saveName 'Hatikvah\'s Choice I'`, `savedAt 1792661326000`, `gameVersion 900`, `gameBuild 611726`, `originalVersion 600`, `start 'x4ep1_gamestart_pirate1'`, `gameTime 39121.904`, `guid '8A33B22E-2892-403F-B88C-DD0B320D825B'`, `playerName 'Müller'`, `money 68714`, `modified false`, `extensions` has 7 entries incl. `{ id: 'ego_dlc_mini_02', version: 900 }` and no duplicates from `<history>`; `is done after </info>`.
  - `read-savegame.spec.ts`: `reads a gzipped save` (info as above, `gzipCopy` undefined, `onInfo` called once); `returns a gzip copy for an unpacked save`; `rejects a file without <savegame>` (`<foo/>` → `SavegameError` code `not-a-savegame`); `reports a truncated gzip` (gzip fixture with the last 1000 bytes cut → code `truncated`); `reports a save cut off inside the XML` (fixture without `</savegame>` → `truncated`); `reports broken xml` (`<savegame><a></b>` → `invalid-xml`).

- [ ] **Step 2: Run** the three specs with `--include` — Expected: FAIL.

- [ ] **Step 3: Implement.**
  - `openTextStream`: read the first chunk to sniff `1f 8b`, re-prepend it; count bytes in a `TransformStream` before decompression (progress, throttled to ≥100 ms, plus a final call); gzip → `DecompressionStream('gzip')`; plain + `keepGzip` → `tee()` one branch into `CompressionStream('gzip')` collected with `new Response(...).blob()`; then `TextDecoderStream('utf-8')`.
  - `runExtractors`: one `XmlStreamScanner` whose handler forwards to extractors where `!done()`; call `onDone` once per extractor when it turns done; keep reading to the end regardless.
  - Info extractor listens to `savegame/info/{save,game,player,patches/patch}` (ignore `patches/history/patch`), done on close of `info`.
  - `readSavegame`: map `XmlScanError` codes 1:1, a decompression `TypeError` → `truncated`, other errors → `read-failed`; first open element not `savegame` → `not-a-savegame`; no info at end → `not-a-savegame`.

- [ ] **Step 4: Run** the specs — Expected: PASS.

- [ ] **Step 5: Ready to commit:** the files above.

---

### Task 3: Generic worker task runner, savegame worker, real-save check

**Files:**
- Create: `src/app/core/workers/worker-task.ts` (generic)
- Create via `npx ng generate web-worker savegame/savegame` (adds `tsconfig.worker.json` and `webWorkerTsConfig` in `angular.json`), then rename/adjust to: `src/app/savegame/savegame.worker.ts`
- Create: `src/app/savegame/savegame-worker-protocol.ts`
- Create: `src/app/savegame/parse-savegame.ts` (page-side client)
- Create: `scripts/check-savegame.ts` (dev only, not in the build)
- Test: `src/app/core/workers/worker-task.spec.ts`

**Interfaces:**
- Consumes: `readSavegame`, `SavegameInfo`, `SavegameErrorCode`, `SavegameError` (Task 2).
- Produces:
  ```ts
  // worker-task.ts — generic
  export interface WorkerLike { postMessage(message: unknown): void; terminate(): void; onmessage: ((e: MessageEvent) => void) | null; onerror: ((e: ErrorEvent) => void) | null }
  export interface WorkerTask<T> { result: Promise<T>; cancel(): void }
  /** posts request; every message goes to onMessage, which returns { done: value } or { fail: error } to settle, or undefined to continue. cancel() terminates and rejects with WorkerCancelled. Worker is terminated when settled. */
  export function runWorkerTask<T>(create: () => WorkerLike, request: unknown, onMessage: (data: unknown) => { done: T } | { fail: unknown } | undefined): WorkerTask<T>;
  export class WorkerCancelled extends Error {}

  // savegame-worker-protocol.ts
  export type SavegameWorkerMessage =
  	| { type: 'progress'; read: number; total: number }
  	| { type: 'info'; info: SavegameInfo }
  	| { type: 'done'; result: ReadSavegameResult }
  	| { type: 'error'; code: SavegameErrorCode; message: string };

  // parse-savegame.ts
  export interface ParseCallbacks { onProgress?(read: number, total: number): void; onInfo?(info: SavegameInfo): void }
  export type SavegameParser = (file: Blob, callbacks: ParseCallbacks) => WorkerTask<ReadSavegameResult>;
  export const parseSavegame: SavegameParser; // new Worker(new URL('./savegame.worker', import.meta.url), { type: 'module' }); errors rejected as SavegameError
  ```

- [ ] **Step 1: Write the failing tests** for `runWorkerTask` with a fake `WorkerLike`: `settles with the done value and terminates`; `forwards intermediate messages without settling`; `rejects with WorkerCancelled on cancel and terminates`; `rejects when the worker errors`.
- [ ] **Step 2: Run** `--include=src/app/core/workers/worker-task.spec.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** `worker-task.ts`, the protocol, the worker (`onmessage = ({ data: file }) => readSavegame(file.stream(), { size: file.size, onProgress, onInfo })`, posting protocol messages; errors mapped to `{ type: 'error' }`), and `parseSavegame`.
- [ ] **Step 4: Run** the spec — Expected: PASS. Run `npx ng build` — Expected: success, output lists a separate worker chunk.
- [ ] **Step 5: Write `scripts/check-savegame.ts`**: for each path argument, `fs.createReadStream` → `Readable.toWeb` → `readSavegame`, print file, info (player, version, guid, saveName) and elapsed seconds. Run `npx tsx scripts/check-savegame.ts E:/Temp/X4/saves/mine/save_001.xml.gz E:/Temp/X4/saves/halfdan/save_004.xml.gz E:/Temp/X4/saves/bawlislaf/save_006.xml.gz` — Expected: three headers (9.00 Cristian, 7.10 Val Selton, 7.60 Raibu Hariken), no errors; note the timings in the task report (target: halfdan under ~40 s).
- [ ] **Step 6: Ready to commit:** the files above, `angular.json`, `tsconfig.worker.json`.

---

### Task 4: Generic key-value storage and the savegame repository

**Files:**
- Create: `src/app/core/storage/key-value-store.ts` (generic interface + `MemoryKeyValueStore`)
- Create: `src/app/core/storage/indexed-db-store.ts` (generic IndexedDB implementation)
- Create: `src/app/savegame/savegame-repository.ts`
- Test: `src/app/core/storage/key-value-store.spec.ts`, `src/app/savegame/savegame-repository.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  // key-value-store.ts
  export interface KeyValueStore<T> { get(key: string): Promise<T | undefined>; getAll(): Promise<T[]>; put(key: string, value: T): Promise<void>; delete(key: string): Promise<void> }
  export class MemoryKeyValueStore<T> implements KeyValueStore<T> {}

  // indexed-db-store.ts
  /** opens (and creates) the database with the given object stores; resolves null when IndexedDB is unavailable or fails to open */
  export function openIndexedDb(name: string, version: number, stores: string[]): Promise<IDBDatabase | null>;
  export class IndexedDbStore<T> implements KeyValueStore<T> { constructor(db: IDBDatabase, store: string) }

  // savegame-repository.ts
  export interface SavegameRepository {
  	readonly persistent: boolean;
  	list(): Promise<SavegameListItem[]>;            // newest savedAt first, without data
  	get(id: string): Promise<SavegameSummary | undefined>;
  	getFile(id: string): Promise<Blob | undefined>;
  	/** stores summary; stores file when given; on file failure keeps summary with fileKept=false */
  	save(summary: Omit<SavegameSummary, 'fileKept'>, file: Blob | undefined): Promise<SavegameSummary>;
  	remove(id: string): Promise<void>;
  }
  export function createSavegameRepository(summaries: KeyValueStore<SavegameSummary>, files: KeyValueStore<Blob>, persistent: boolean): SavegameRepository;
  /** IndexedDB 'x4-savegames' v1, stores 'saves' and 'files'; falls back to memory stores with persistent=false */
  export function openSavegameRepository(): Promise<SavegameRepository>;
  export const SAVEGAME_REPOSITORY: InjectionToken<() => Promise<SavegameRepository>>; // default factory openSavegameRepository
  ```

- [ ] **Step 1: Write the failing tests.** `MemoryKeyValueStore`: `puts, gets, lists and deletes`. Repository over memory stores: `lists newest save first without data`; `stores the file and marks it kept`; `keeps the summary when the file cannot be stored` (files store whose `put` rejects with `QuotaExceededError` → `fileKept false`, summary present); `stores no file when none is given` (`fileKept false`); `removes summary and file`.
- [ ] **Step 2: Run** both specs — Expected: FAIL.
- [ ] **Step 3: Implement.** `IndexedDbStore` wraps each request in a promise via one small `request<T>(req: IDBRequest<T>): Promise<T>` helper; `openIndexedDb` catches every error (and a missing `indexedDB`) and returns `null`. It is exercised in the browser in Task 6.
- [ ] **Step 4: Run** both specs — Expected: PASS.
- [ ] **Step 5: Ready to commit:** the files above.

---

### Task 5: SavegameStore (signals)

**Files:**
- Create: `src/app/savegame/savegame-store.ts`
- Test: `src/app/savegame/savegame-store.spec.ts`

**Interfaces:**
- Consumes: `SavegameRepository`, `SAVEGAME_REPOSITORY` (Task 4); `SavegameParser`, `parseSavegame`, `WorkerCancelled` (Task 3); model (Task 2); `persistedSignal` (`core/services/local-storage.ts`).
- Produces:
  ```ts
  export const SAVEGAME_PARSER: InjectionToken<SavegameParser>; // default parseSavegame
  export interface SavegameLoadState { fileName: string; read: number; total: number }
  export type SavegameLoadOutcome =
  	| { status: 'added' | 'replaced'; id: string }
  	| { status: 'older'; id: string }   // a newer save of this playthrough is stored; nothing changed
  	| { status: 'cancelled' } | { status: 'busy' }
  	| { status: 'error'; code: SavegameErrorCode };
  export type SavegameStatus = 'ok' | 'updating' | 'reload-needed';
  @Injectable({ providedIn: 'root' }) export class SavegameStore {
  	readonly saves: Signal<SavegameListItem[]>;
  	readonly activeId: Signal<string | null>;          // persistedSignal('activeSavegame', null); a missing id reads as null
  	readonly active: Signal<SavegameSummary | null>;
  	readonly loading: Signal<SavegameLoadState | null>;
  	readonly persistent: Signal<boolean>;
  	readonly storage: Signal<{ usage: number; quota: number } | null>; // navigator.storage.estimate()
  	status(id: string): SavegameStatus;
  	load(file: File): Promise<SavegameLoadOutcome>;
  	cancel(): void;
  	select(id: string | null): void;
  	remove(id: string): Promise<void>;
  }
  ```
- Behavior pinned by the spec: id = `info.guid`; replace when `savedAt >=` stored, keep active state; on `onInfo` with an older `savedAt` cancel the parse and return `older`; first successful save calls `navigator.storage.persist()` (guard for absence); on init, saves with `schemaVersion < SAVEGAME_SCHEMA_VERSION` and `fileKept` are re-parsed one at a time from `getFile` (status `updating`), those without a file are `reload-needed`; removing the active save sets `activeId` to null.

- [ ] **Step 1: Write the failing tests** with `TestBed`, `MemoryKeyValueStore`-backed repository and a fake parser that resolves given infos (and calls `onInfo` first):
  `adds a save and lists it`; `replaces the entry for a newer save of the same playthrough and keeps it active`; `ignores an older save of a stored playthrough` (outcome `older`, fake parse cancelled, stored entry unchanged); `adds a second playthrough as its own entry`; `refuses a second load while one is running` (`busy`); `reports parser errors` (`{ status: 'error', code: 'truncated' }`, nothing stored); `cancel resolves the load as cancelled`; `treats a stored active id that no longer exists as none`; `clears the active save when it is removed`; `re-reads outdated saves that kept their file` (stored `schemaVersion: 0` → parser called with the stored blob, summary updated to version 1); `marks outdated saves without a file as reload-needed`. Clear `localStorage` key `activeSavegame` after each test.
- [ ] **Step 2: Run** `--include=src/app/savegame/savegame-store.spec.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** `savegame-store.ts` (repository obtained once from the factory; `active` loaded via `repository.get` whenever `activeId` changes).
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Ready to commit:** the files above.

---

### Task 6: UI — generic drop zone and progress bar, saves page, header selector, translations

**Files:**
- Create: `src/app/shared/components/file-drop.component.ts` (+ `.html`) — generic
- Create: `src/app/shared/components/progress-bar.component.ts` — generic
- Create: `src/app/savegame/components/savegames-page.component.ts` (+ `.html`)
- Create: `src/app/savegame/components/savegame-card.component.ts` (+ `.html`) — one stored save
- Create: `src/app/savegame/components/savegame-selector.component.ts` (+ `.html`) — header select
- Create: `src/app/savegame/savegame-format.ts` — `formatGameTime(seconds)`, `formatGameVersion(900) → '9.00'`, `extensionLabel(id)` (localized DLC names keyed by extension id, `$localize`)
- Modify: `src/app/app.routes.ts` (add `saves`), `src/app/header.component.ts/.html` (nav link `/saves` with `LucideSave`, selector before the language select)
- Modify: `src/locale/messages*.json` (13 files)
- Test: `src/app/savegame/savegame-format.spec.ts`, `src/app/shared/components/file-drop.component.spec.ts`

**Interfaces:**
- Consumes: `SavegameStore` (Task 5).
- Produces:
  ```ts
  // file-drop.component.ts
  @Component({ selector: 'app-file-drop' }) class FileDropComponent { accept = input<string>(''); disabled = input(false); files = output<File[]>() } // drop + click-to-pick, content projection for the label
  // progress-bar.component.ts
  @Component({ selector: 'app-progress-bar' }) class ProgressBarComponent { value = input.required<number>(); max = input.required<number>(); label = input<string>('') }
  ```
- Page content (spec "UI"): drop zone accepting `.gz,.xml` with hint `Documents\Egosoft\X4\<id>\save\` (on many Windows setups under `OneDrive\Documents\...`); while loading: file name, progress bar, Cancel; outcome messages for `older`, `busy`, each error code; a list of `SavegameCard`s (player name, save name, real save date, in-game time, credits, game version, DLC labels, file size, status badge: active / updating / reload needed / file not kept; actions: Make active, Delete via the existing `confirm` component); a line "Your saves stay in this browser; nothing is uploaded." plus storage usage; a note when `persistent()` is false that saves won't be kept.
- Selector: Signal Form over `{ active: string }`, options "No save" (`''`) + one per save (`player · save name · in-game time`), effect writes to `store.select`; when no saves exist render a "Load save" router link instead; icon-only under `sm`.

- [ ] **Step 1: Write the failing tests:** `formatGameVersion(900) === '9.00'`, `formatGameVersion(710) === '7.10'`; `formatGameTime(39121.904) === '10h 52m'`, `formatGameTime(59) === '0h 0m'`; `extensionLabel('ego_dlc_mini_02')` is non-empty and unknown ids fall back to the id. File drop: `emits dropped files`, `emits nothing when disabled`.
- [ ] **Step 2: Run** both specs — Expected: FAIL.
- [ ] **Step 3: Implement** the components, route and header changes; keep each file under 300 lines.
- [ ] **Step 4: Run** both specs — Expected: PASS. Then `npx ng extract-i18n`, add every new id to all 12 `messages.<lang>.json` with real translations; check none missing by comparing key sets of `messages.json` and each locale file.
- [ ] **Step 5: Verify in the browser** (`npx ng serve`, open `/saves`): load `E:\Temp\X4\saves\mine\save_001.xml.gz` → card shows Cristian, Hatikvah's Choice I, 9.00, 68,714 credits, 7 DLCs; activate it → header shows it; reload page → still listed and active; load `halfdan/save_004.xml.gz` → progress runs, page stays responsive, cancel works, second run completes; delete the active save → header shows "No save"; switch theme to dark and check both pages; narrow window to 375 px and check the header.
- [ ] **Step 6: Ready to commit:** the files above.

---

### Task 7: Full verification

- [ ] **Step 1:** `npx ng test --watch=false` — Expected: all pass.
- [ ] **Step 2:** `npx ng lint` — Expected: no errors.
- [ ] **Step 3:** `npx ng build` — Expected: success; the savegame worker is its own chunk and the `/saves` page is lazy.
- [ ] **Step 4:** Check line counts: `wc -l` on every new file — Expected: all under 300.
- [ ] **Step 5:** Report to the user with the file list and the timings from Task 3; the user decides on commits.
