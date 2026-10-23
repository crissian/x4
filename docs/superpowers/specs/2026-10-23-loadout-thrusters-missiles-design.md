# Loadout builder: thrusters and missiles: design

Feature #5 of the parallel batch. It touches two repos:
- D:\Work\x4-extractor (C#, `master`)
- D:\Work\x4 (Angular 22, `dev`)

It extends the loadout builder (`/ships/:id/loadout`, share code `?l=`).

## Intent

The loadout builder shows speed, shields and gun DPS, but it is blind to two things players pick for every ship:

- **Thrusters.** They decide strafe speed and turn rate. Today the builder offers no thruster choice, and every thruster in the data has `thrust: { forward: 0, reverse: 0 }`.
- **Missiles.** Missile launchers appear as weapon options, but with no stats and no way to choose the missile they fire. The ship's missile storage is never used.

## Goals / non-goals

**Goals**
- A **Thrusters** choice per ship. The builder shows its effect:
  - strafe speed (m/s)
  - pitch, yaw and roll rates (°/s)
- For every weapon or turret group that holds a missile launcher, a **Missile** choice, limited to the missiles that launcher accepts.
- New result rows:
  - missile DPS
  - missile volley (the damage of one shot from every launcher)
  - missile storage
  - time to empty the storage
- Existing `?l=` links keep decoding to the same equipment. Thrusters and missiles are filled in sensibly for old links.

**Non-goals**
- The speed-dependent steering curve (`<steeringcurve>`, which only matters above top speed while boosting or in travel mode).
- Acceleration curves (`accfactors`).
- Countermeasures, missile hit chance and lock-on behaviour beyond showing the lock time.
- Mines, drones and deployables.
- A thruster column in the ship list.
- Changes to the presets' gun logic.

## Game data (evidence)

All paths are relative to `E:\Temp\X4\Unpacked`.

### Thrusters

Source: `assets/props/Engines/macros/thruster_gen_{s,m,l,xl}_{allround,combat}_01_mk{1,2,3}_macro.xml` (18 macros, class `engine`). They have no `forward`/`reverse` attributes, which is why the extractor's `Thrust` class (only `Forward` and `Reverse`) writes zeros:

```xml
<thrust strafe="352" pitch="173.3" yaw="173.3" roll="228" />   <!-- thruster_gen_s_combat_01_mk1 -->
```

### Ship side

Source: `assets/units/size_s/macros/ship_arg_s_fighter_01_a_macro.xml` (Nova Vanguard). Everything here is already in `ships-data.ts`:

```xml
<storage missile="2" />
<physics mass="6"><inertia pitch="1.229" yaw="1.229" roll="1.352" />
  <drag forward="3.58" reverse="11.829" horizontal="4" vertical="4" pitch="2.42" yaw="2.96" roll="2.4" />
<thruster tags="small" />
<steeringcurve><point position="1.01" value="1" /> … <point position="2.7" value="0.18" /></steeringcurve>
```

`ships-data.ts` holds `thruster` as a `Size` enum value (`'Small'`). Thruster equipment carries the connection tags `['thruster', 'small']`.

### Formula

Equipment mods, crew and the steering curve are ignored. The builder uses the same first-order drag model it already uses for `speed = thrust / drag.forward`:

- **Strafe:**
  - horizontal = `strafe / drag.horizontal`
  - vertical = `strafe / drag.vertical`
- **Rotation (steady state):**
  - pitch = `thrust.pitch / drag.pitch`
  - yaw = `thrust.yaw / drag.yaw`
  - roll = `thrust.roll / drag.roll`
- **Response time to about 63 % of the maximum:** `inertia.axis / drag.axis` (seconds). Linear: `mass / drag.horizontal`.

Worked example, Nova Vanguard with S Combat Mk1:

| Value | Calculation | Result |
|---|---|---|
| strafe | 352 / 4 | **88 m/s** |
| pitch | 173.3 / 2.42 | **71.6** |
| yaw | 173.3 / 2.96 | **58.5** |
| roll | 228 / 2.4 | **95** |
| pitch response | 1.229 / 2.42 | 0.5 s |

These are fighter-plausible degrees per second, and the steering curve's multiplier is 1 up to top speed. Neither the Egosoft modding wiki (JPMFlight guide) nor the forum threads I found publish the formula or the angular unit: the wiki describes the values only as unitless parameters. So the unit is the one claim to verify in game (see open questions).

### Missiles

**Launchers.** `assets/props/WeaponSystems/{dumbfire,guided,torpedo}/macros/weapon_gen_{s,m}_*_02_mk1_macro.xml` have class `missilelauncher`. Missile turrets (`turret_*_{dumbfire,guided}_*`) have class `missileturret`. A launcher names its default missile and the ammo tags it accepts:

```xml
<ammunition tags="guided smallguided" />
<bullet class="missile_gen_s_guided_01_mk1_macro" />
```

Launchers are already in `equipment-data.ts` as `type: weapons`. They carry the connection tags `['advanced','missile','small','weapon']` and already match the ship's missile slot, for example the Nova's slot `tags: ['advanced','missile','small','weapon'], types: [TurretType.missile]`. They have no `weapon:` block, because the bullet macro has no `<damage>`.

**Missiles.** `assets/props/WeaponSystems/missile/macros/missile_gen_*_macro.xml`, plus DLC ones in `extensions/ego_dlc_{split,timelines}/…`:

```xml
<ammunition value="8" reload="9" />                     <!-- magazine; absent or value 1 = single shot -->
<missile amount="1" … lifetime="4" range="2800" guided="0" tags="smalldumbfire" />
<explosiondamage value="374" hull="166" />              <!-- hull/shield: extra vs that layer, like bullets -->
<reload time="0.25" />
<lock time="2" range="12000" />                          <!-- guided only -->
```

- **Swarm and interceptor:** `amount="8"` or `amount="5"`.
- **Ware ids:** missile ware ids are the macro name without `_macro`, and so is a launcher's `bullet/@class`.

**Compatibility rule:** a missile fits a launcher when its `missile/@tags` token is in the launcher's `ammunition/@tags`.

| Launcher `ammunition/@tags` | Fits |
|---|---|
| `smallguided guided` | `smallguided` missiles |
| `dumbfire mediumdumbfire` | `mediumdumbfire` |
| `ship_ter_l_flagship_01` | the Terran flagship missiles only |

**Already in the web data:** `equipment-data.ts` already has `missile: { damage, range, lifetime, guided, reload, speed }` for 18 missile wares (`EquipmentWriter.WriteMissile`). Speed is the missile engine's forward thrust divided by drag.forward. The data is missing:
- tags
- amount
- magazine
- lock
- hull and shield extra damage

## Extractor changes (`X4Extractor`)

- **`Program.cs`, model classes (attributes only):**
  - `Thrust`: add `Strafe`, `Pitch`, `Yaw`, `Roll`.
  - `Missile`: add `Tags` (string attribute) and `Swarm`.
  - `Ammunition`: add `Tags`. The launcher uses `tags`; missiles use `value`/`reload`, which are already mapped.
  - `ExplosionDamage`: add `Shield` and `Hull` (double).
  - New `Lock` class (`time`, `range`), plus `[XmlElement("lock")] Lock Lock` on `MacroProperties`.
- **`Writers/EquipmentWriter.cs`:**
  - Write `thrust:` only when forward or reverse is greater than 0. Thruster detail pages stop showing "0 / 0".
  - New `WriteThruster`: when `Thrust.Strafe > 0`, write `thruster: { strafe, pitch, yaw, roll },`.
  - Extend `WriteMissile` with:
    - `amount` (when greater than 1)
    - `shield`/`hull` (when not 0)
    - `magazine: { size, reload }` (when `Ammunition.Value` is greater than 1)
    - `lock` (lock time, when present)
    - `tags: [...]` (missile ammo tags)
  - New `WriteLauncher`: when the macro class is `missilelauncher` or `missileturret`, write `launcher: { ammo: ['guided','smallguided'], missile: 'missile_gen_s_guided_01_mk1' },`.
  - The file grows from about 203 to about 250 lines.
- **Output:** only `equipment-data.ts` changes. `ships-data.ts` does not: thruster size, inertia, drag and `storage.missile` are already there.

**Merge note:** `equipment-data.ts` conflicts only with another feature that also regenerates it. None of the other four specs from 2026-10-23 mention `equipment-data` or `EquipmentWriter`. If one ends up regenerating it, regenerate once after merging both extractor branches instead of hand-merging the file.

## Web changes (`D:\Work\x4`)

### Data shape (`model/equipment.ts`)

```ts
thruster?: { strafe: number; pitch: number; yaw: number; roll: number };
launcher?: { ammo: string[]; missile: string };     // default missile ware id
// MissileData gains:
amount?: number; shield?: number; hull?: number; magazine?: { size: number; reload: number }; lock?: number; tags?: string[];
```

### Calculations: new classes, old files touched minimally

**`shared/services/ship-handling.ts`** (new, about 50 lines)
- `class ShipHandling`
- `static handling(ship, thruster?)` returns `{ strafeH, strafeV, pitch, yaw, roll, pitchResponse, … }` using the formulas above. It returns zeros when there is no thruster.
- `static sizeTag(ship)` maps `Size` `'Small'` to the tag `'small'` via the enum keys.

**`shared/services/loadout-missiles.ts`** (new, about 120 lines)
- `class LoadoutMissiles`
- `static key(group)` returns `` `${group.key}#missile` ``.
- `static isLauncherGroup(group)`: true when any option has `launcher`.
- `static compatible(launcher, all)`: missiles whose `missile.tags` intersect `launcher.ammo`.
- `static effective(launcher, chosenId, get)`: the chosen missile if it is compatible, otherwise the launcher's default.
- `static stats(missile)` returns `{ fireRate, burstDps, sustainedDps, volley }`:
  - interval = `reload`
  - burst = `damage × amount / reload`
  - sustained uses the same magazine factor as `ShipPerformance.weaponStats`: `firing / (firing + magazine.reload)`, with firing = `size / fireRate`.
- `static totals(ship, groups, loadout, get)` returns `{ dps, volley, storage: ship.storage?.missile ?? 0, secondsToEmpty }`:
  - Each group contributes `count × stats`.
  - `secondsToEmpty` = storage ÷ Σ(count × sustained fire rate). One storage missile per launch is assumed.

**`ship-performance.ts`:** `missileDps()` delegates to `LoadoutMissiles.stats(m).sustainedDps`, so the equipment list and detail page include `amount` and the magazine. This is a one-line change.

**`loadout.ts`:**
- Add `'thrusters'` to `SlotKind`/`KIND_TYPES`.
- `slotGroups` appends one thruster group **last**: a synthetic slot `{ size: ship.thruster, hittable: false, tags: ['thruster', sizeTag] }` with count 1. That reuses `fits()`.
- `loadoutStats` adds:
  - `handling: ShipHandling.handling(ship, thruster)`
  - `missiles: LoadoutMissiles.totals(...)`
- `groupLabel` gets a `thrusters` case.
- The file grows by about 25 lines.

A side effect: thruster equipment pages now list fitting ships, because `equipment-detail` uses the same groups.

**`ship-stats.service.ts`:**
- `preset`: thrusters score by `pitch + yaw` for combat and travel, and by negative price for cheapest. Missile keys stay `''`, which means the launcher default.
- Presets keep never picking launchers.
- encode/decode change as described under share link below.

### UI (`ship-loadout.component.*`)

- The thruster group renders like any other group: "Thrusters (S)".
- Option label: "S Combat Thrusters Mk1 - 352 strafe, 173 pitch".
- Under a weapon or turret group whose selected equipment has `launcher`, an indented `<select [formField]="slotsForm[missileKey(group)]">` appears:
  - the first option, value `''`, is labelled "Default (Light Guided Missile)"
  - then the compatible missiles: "Name - 120 DPS, 12 km, lock 2 s"
  - there is no "none" option, because an empty launcher is pointless.
- `toSlots` also creates the missile keys, so Signal Forms has the fields.
- **Results list, new rows:**
  - Strafe (m/s)
  - Pitch / Yaw / Roll (°/s)
  - Missile DPS
  - Missile volley
  - Missile storage
  - Time to empty (s)
- The missile rows appear only when a launcher is equipped.
- Missile-turret DPS moves from Turret DPS to Missile DPS. Missile turrets have no `weapon:` block, so today they add 0.
- New strings use `i18n`/`$localize`, with translations added to all 12 `src/locale/messages.<lang>.json`.
- Equipment detail page: show Strafe / Pitch / Yaw / Roll when the item has `thruster`, and Lock / Magazine / Ammo tags for missiles. That is about 8 template lines.

### Share link (backwards compatible)

The code becomes:
1. the existing groups' segments
2. a **thruster** segment, appended after all old segments
3. one **missile** segment per launcher-capable group, in group order

Example: `ENG.SHD.W1.W2.-` becomes `ENG.SHD.W1.W2.-.thruster_gen_s_combat_01_mk3.-`.

Rules:
- **Old codes are shorter.** In `decode`, any group whose index is at or beyond `ids.length` takes the combat preset's pick, so old links get the best combat thruster.
- **Missile segments:** a missing segment or `'-'` decodes to `''` (launcher default), as does an id that is unknown or incompatible.
- The old segments keep their positions, so every old link decodes to the same equipment.
- **Comparison page:** it matches codes to presets (`encode(preset) === code`), so an old code for an unmodified preset now shows as "custom". This is cosmetic. Once it is re-encoded, it matches again.

## Files touched

**x4-extractor (modified):**
- `X4Extractor/Program.cs` (model classes)
- `X4Extractor/Writers/EquipmentWriter.cs`

**x4 web (new):**
- `src/app/shared/services/ship-handling.ts` and its `.spec.ts`
- `src/app/shared/services/loadout-missiles.ts` and its `.spec.ts`

**x4 web (modified):**
- `shared/services/model/equipment.ts`
- `shared/services/loadout.ts`
- `shared/services/loadout.spec.ts`
- `shared/services/ship-performance.ts`
- `shared/services/ship-stats.service.ts`
- `ship/components/ship-loadout.component.ts` and `.html`
- `equipment/components/equipment-detail.component.html`
- `shared/services/data/equipment-data.ts` (regenerated)
- `src/locale/messages*.json` (13 files, including the source)

## Tests

**`ship-handling.spec`:**
- Nova Vanguard with S Combat Mk1 gives strafe 88 and pitch about 71.6.
- No thruster gives zeros.
- Every ship size resolves at least one thruster option.

**`loadout-missiles.spec`:**
- The S Tracking Launcher's options include `missile_gen_s_guided_01_mk1`, `_swarm_`, `_heatseeker_` and `_emp_`, and exclude `_dumbfire_` and `mediumguided`.
- An incompatible id falls back to the default.
- Swarm DPS = 210 × 8 / 8.
- The magazine factor for `missile_gen_s_dumbfire_01_mk1` is 2 / (2 + 9), with firing = 8 / 4 = 2 s.

**`loadout.spec` additions:**
- A legacy code (current format) decodes to the same groups, plus the combat thruster.
- Encode then decode round-trips missile choices.
- Totals count the thruster once in the price and wares.

**Extractor:** run it and diff `equipment-data.ts`. Expect:
- 18 thrusters with `thruster:`
- every launcher and missile turret with `launcher:`
- missiles with `tags`
- no other changes

## Decisions I made

- Thruster stats go in a new `thruster:` key. Thrusters lose their bogus `thrust: {0,0}`, which keeps `optionLabel`, `flightSpeeds` and the engine-only code paths clean.
- Missile choice is not a `SlotGroup`. It is a second value keyed `group#missile`, so equipment-detail's "ships that fit" and slot counting are untouched.
- `''` means the launcher's default missile. One rule then covers old links, `'-'` and incompatible picks.
- Thrusters count once per ship, as one ware.
- The steady-state rates are shown, and the steering curve is ignored.
- Presets do not start picking launchers. Gun preset results stay the same as today.

## Open questions for the owner

1. Turn rates are computed as `torque / angular drag` and labelled **°/s**. That gives the Nova Vanguard pitch 72, yaw 58 and roll 95 with S Combat Mk1. No source states the unit. Can you check one ship in game? If it is radians, we would multiply by 57.3, or show the values unitless.
2. Should missile turrets' damage count under **Missile DPS** (my plan) or stay under **Turret DPS**?
3. Should the **Combat** preset equip a missile launcher in a missile-capable slot when the launcher's sustained DPS beats the best gun? My plan says no, which keeps presets gun-only as they are now.

## Owner decisions (2026-10-23)

- Turn rates are degrees per second (Roguey's formula thrust/drag gives ~71 for a fighter; the Egosoft wiki lists the same range in °/s). Label °/s.
- Missile turrets count under Missile DPS.
- Combat preset stays guns-only.
