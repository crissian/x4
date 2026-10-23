/** The faction of a logbook entry: a faction id of the game data, or else a name to show as it is. */
export interface LogFaction {
	faction?: string;
	factionName?: string;
}

/**
 * Logbook entries name their faction by its name text reference, `{20203,201}` for the Argon Federation. The ids are
 * those of `libraries/factions.xml` (with the DLCs); the names are the English texts of factions that have no entry
 * in the game data, such as the Rhak Patriarchy.
 */
export class LogFactionRefs {
	private static readonly IDS: Readonly<Record<number, string>> = {
		101: 'player',
		201: 'argon',
		301: 'antigone',
		401: 'paranid',
		501: 'holyorder',
		601: 'teladi',
		701: 'ministry',
		801: 'alliance',
		901: 'hatikvah',
		1001: 'scaleplate',
		1101: 'xenon',
		1301: 'boron',
		1501: 'khaak',
		1601: 'freesplit',
		1701: 'fallensplit',
		1801: 'court',
		2001: 'split',
		2301: 'trinity',
		2401: 'buccaneers',
		2601: 'holyorderfanatic',
		2801: 'yaki',
		2901: 'pioneers',
		3001: 'terran',
		3201: 'scavenger',
		3301: 'loanshark',
		3601: 'kaori',
		10101: 'criminal',
		10301: 'civilian',
		20101: 'visitor',
	};

	private static readonly NAMES: Readonly<Record<number, string>> = {
		1201: 'Terran Mandate',
		1401: 'Family Zyarth',
		1901: 'Cabal of Curbs',
		2101: 'Nhuut Patriarchy',
		2201: 'Rhak Patriarchy',
		2501: "Duke's Tempest",
		3401: 'Provinces Adrift',
		3501: 'Tharka Patriarchy',
		3701: 'United Space Command',
		3801: 'AGI Task Force',
		3901: 'Terraformer',
		4001: 'Argon Confederation',
		4101: 'Paranid Empire',
		10201: 'Enemy',
	};

	private static readonly REF = /^\{\s*(\d+)\s*,\s*(\d+)\s*\}$/;
	private static readonly FACTION_PAGE = 20203;

	/** The faction of a `faction` attribute; a text reference that is no faction name gives nothing. */
	static resolve(value: string | undefined): LogFaction {
		const text = value?.trim();
		if (!text) {
			return {};
		}
		const ref = LogFactionRefs.REF.exec(text);
		if (!ref) {
			return { factionName: text };
		}
		if (Number(ref[1]) !== LogFactionRefs.FACTION_PAGE) {
			return {};
		}
		const id = Number(ref[2]);
		const faction = LogFactionRefs.IDS[id];
		if (faction) {
			return { faction };
		}
		const factionName = LogFactionRefs.NAMES[id];
		return factionName ? { factionName } : {};
	}
}
