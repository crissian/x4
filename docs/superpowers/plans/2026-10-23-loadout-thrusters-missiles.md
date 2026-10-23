# Loadout thrusters + missiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The loadout builder offers a thruster choice (strafe + turn rates) and a missile choice per launcher group, with missile DPS / volley / storage / time-to-empty rows, while old `?l=` links decode to the same equipment.

**Architecture:** The extractor writes `thruster:` and `launcher:` blocks and richer `missile:` blocks into `equipment-data.ts`. The web app adds two static helper classes (`ShipHandling`, `LoadoutMissiles`), appends a synthetic thruster slot group in `Loadouts.slotGroups`, keeps missile picks as extra loadout keys `<group.key>#missile`, and appends thruster + missile segments to the share code.

**Tech Stack:** C# (.NET 7, XmlSerializer) extractor; Angular 22 with Signal Forms, Jasmine/Karma tests.

**Spec:** `docs/superpowers/specs/2026-10-23-loadout-thrusters-missiles-design.md` (its "Owner decisions" override: turn rates °/s, missile turrets under Missile DPS, Combat preset guns-only).

## Global Constraints

- Classes with static helpers, no exported free functions; files < ~300 lines.
- Controls via Signal Forms `[formField]`; template in `.html`; UI text `i18n`/`$localize`, translated in all 12 locales.
- Only `equipment-data.ts` is regenerated/copied into the web app (LF line endings).
- Program.cs edits limited to the thruster/missile model classes (another branch adds a writer there).
- Old share codes keep their segment positions and decode to the same equipment.

## Review Focus

- Ship with no thruster size or no matching thruster: no thruster group, handling zeros (ShipHandling spec "no thruster gives zeros").
- Old code shorter than the new group list: missing thruster segment takes the combat pick (loadout spec "legacy code").
- Missile segment with an unknown/incompatible id: decodes to `''` default (loadout-missiles spec "incompatible falls back").
- Launcher with no compatible missile in the data (e.g. flagship-only tags): `effective` returns the default, or undefined without crashing; totals skip it.
- Ship with launchers but `storage.missile` 0: time to empty shows 0/'-', no division by zero.

---

### Task 1: Extractor — thruster, launcher and richer missile data

**Files:** Modify `X4Extractor/Program.cs` (Thrust, Missile, Ammunition, ExplosionDamage, new Lock, MacroProperties.Lock), `X4Extractor/Writers/EquipmentWriter.cs`.

- [ ] Add attributes: `Thrust.Strafe/Pitch/Yaw/Roll`, `Missile.Tags` (string), `Missile.Swarm` (int), `Ammunition.Tags` (string), `ExplosionDamage.Shield/Hull` (double), class `Lock { Time, Range }`, `[XmlElement("lock")] Lock Lock`.
- [ ] Writer: `thrust:` only when forward or reverse > 0; `WriteThruster` → `thruster: { strafe, pitch, yaw, roll },` when strafe > 0; `WriteMissile` adds `amount` (>1), `shield`/`hull` (≠0), `magazine: { size, reload }` (value > 1), `lock` (time), `tags: [...]`; `WriteLauncher` for classes `missilelauncher`/`missileturret` → `launcher: { ammo: [...], missile: '<bullet class without _macro>' },`.
- [ ] `dotnet build`, run the extractor, diff `equipment-data.ts` against the web repo copy: expect 18 `thruster:`, 29 `launcher:`, 18 missiles with `tags`, no other churn.
- [ ] Commit in the extractor worktree; copy `equipment-data.ts` (CRLF stripped) to the web worktree and commit together with Task 2's model types.

### Task 2: Web data model

**Files:** Modify `src/app/shared/services/model/equipment.ts`.

- **Produces:** `Equipment.thruster?: ThrusterData { strafe; pitch; yaw; roll }`, `Equipment.launcher?: LauncherData { ammo: string[]; missile: string }`, `MissileData` gains `amount?, shield?, hull?, magazine?: { size; reload }, lock?, tags?: string[]`.
- [ ] Add the types, `npx ng build` compiles with the regenerated data. Commit.

### Task 3: ShipHandling

**Files:** Create `src/app/shared/services/ship-handling.ts`, `ship-handling.spec.ts`.

- **Produces:** `class ShipHandling { static handling(ship: Ship, thruster?: Equipment): Handling; static sizeTag(ship: Ship): string | undefined }`, `Handling { strafeH; strafeV; pitch; yaw; roll; pitchResponse; yawResponse; rollResponse; strafeResponse }`.
- [ ] Tests: Nova Vanguard (`ship_arg_s_fighter_01_a`) + `thruster_gen_s_combat_01_mk1` → strafeH 88, pitch ≈ 71.6, yaw ≈ 58.5, roll 95, pitchResponse ≈ 0.508; no thruster → all zeros; `sizeTag` of Nova is `'small'`.
- [ ] Implement (strafe/drag.horizontal, thrust.axis/drag.axis, inertia.axis/drag.axis, mass/drag.horizontal), tests pass, commit.

### Task 4: LoadoutMissiles + ShipPerformance.missileDps

**Files:** Create `src/app/shared/services/loadout-missiles.ts`, `loadout-missiles.spec.ts`; modify `ship-performance.ts` (`missileDps` delegates).

- **Produces:** `class LoadoutMissiles { static key(group: SlotGroup): string; static isLauncherGroup(group: SlotGroup): boolean; static compatible(launcher: LauncherData, all: readonly Equipment[]): Equipment[]; static effective(launcher: LauncherData, chosenId: string | undefined, get): Equipment | undefined; static stats(missile: MissileData): MissileStats; static totals(ship, groups, loadout, get): MissileTotals }`, `MissileStats { fireRate; burstDps; sustainedDps; volley; sustainedRate }`, `MissileTotals { dps; volley; storage; secondsToEmpty; launchers }`.
- [ ] Tests: S Tracking Launcher compatible includes `missile_gen_s_guided_01_mk1`, `missile_gen_s_swarm_01_mk1`, `missile_gen_s_heatseeker_01_mk1`, `missile_gen_s_emp_01_mk1`, excludes `missile_gen_s_dumbfire_01_mk1` and `missile_gen_m_guided_01_mk1`; incompatible id → default; swarm burst DPS = 210×8/8; dumbfire mk1 sustained = burst × 2/(2+9); totals on a launcher loadout: storage = ship.storage.missile, secondsToEmpty = storage / Σ count × sustainedRate.
- [ ] Implement, tests pass, commit.

### Task 5: Loadouts + ShipStatsService (thruster group, stats, presets, encode/decode)

**Files:** Modify `loadout.ts`, `loadout.spec.ts`, `ship-stats.service.ts`.

- **Consumes:** Tasks 3–4. **Produces:** `SlotKind` includes `'thrusters'`; `LoadoutStats.handling: Handling`, `LoadoutStats.missiles: MissileTotals`, `LoadoutStats.missileDps` moved off `turretDps`.
- [ ] Tests: Nova groups end with a thrusters group (1 slot); a legacy code (current format without thruster segment) decodes to the same groups + combat thruster; encode/decode round-trips a missile choice; thruster counted once in `counts`.
- [ ] Implement: synthetic slot `{ size: ship.thruster, hittable: false, tags: ['thruster', sizeTag] }`; presets score thrusters by pitch+yaw (combat/travel) or -price (cheapest); encode appends missile segments for launcher-capable groups ('-' for default); decode fills groups beyond `ids.length` from the combat preset. Tests pass, commit.

### Task 6: UI — loadout builder and equipment detail

**Files:** Modify `ship-loadout.component.ts/.html`, `equipment-detail.component.html`, `src/locale/messages*.json`.

- [ ] Loadout: `toSlots` creates `#missile` keys for launcher groups; missile `<select [formField]>` under groups whose selection has `launcher` (first option "Default (name)", then "Name - N DPS, X km, lock T s"); thruster option label "Name - 352 strafe, 173 pitch"; result rows Strafe, Pitch / Yaw / Roll (°/s), and missile rows when a launcher is equipped.
- [ ] Equipment detail: Strafe/Pitch/Yaw/Roll for thrusters; Lock / Magazine / Ammo tags for missiles.
- [ ] `npx ng extract-i18n`, translate new ids in all 12 locales, remove dropped ids. `npx ng test --watch=false` and `npx ng build` clean. Commit.
