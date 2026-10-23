/**
 * The player headquarters station, for the calculator's Headquarters setting. The game tags a station macro as a
 * headquarters through its module set: `libraries/modulesets.xml` line 28 has the only set of type `headquarters`
 * (`headquarters_player`, macro `station_pla_headquarters_base_01_macro`, which uses that set in
 * `assets/structures/macros/station_pla_headquarters_base_01_macro.xml`), and `libraries/scriptproperties.xml` line
 * 867 defines `isheadquarters` as "this station macro is tagged as a headquarters. Normally only true for the Player HQ".
 */
export class PlayerHeadquarters {
	/** The headquarters station macro id, as a save names it (lowercased without `_macro`). */
	static readonly MACRO = 'station_pla_headquarters_base_01';

	static is(stationMacro: string | undefined): boolean {
		return stationMacro === PlayerHeadquarters.MACRO;
	}
}
