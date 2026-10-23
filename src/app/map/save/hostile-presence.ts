import type { SectorShipCounts } from '../../savegame/empire/save-empire-model';
import type { SaveStation } from '../../savegame/map/save-map-model';

/** The factions of the hostile presence layer. */
export type HostileFaction = 'xenon' | 'khaak';

/** What kind of hostile station a macro is. */
export type HostileStationKind =
	'hive' | 'nest' | 'weaponplatform' | 'shipyard' | 'factory' | 'defence' | 'turret' | 'asteroidbase' | 'other';

/** One faction's stations and ships in one sector. */
export interface HostileSector {
	faction: HostileFaction;
	sector: string;
	/** station counts by kind, the most first */
	kinds: { kind: HostileStationKind; count: number }[];
	stations: number;
	/** ship counts [s, m, l, xl] */
	ships: [number, number, number, number];
	shipTotal: number;
}

/** Collects where the Xenon and Kha'ak have stations and ships in a save. */
export class HostilePresence {
	static readonly FACTIONS: readonly HostileFaction[] = ['xenon', 'khaak'];

	/** The station kind from the macro, e.g. `landmarks_kha_hive_01` is a hive. */
	static kind(macro: string): HostileStationKind {
		const id = macro.toLowerCase();
		if (id.includes('kha_hive')) {
			return 'hive';
		}
		if (id.includes('kha_nest')) {
			return 'nest';
		}
		if (id.includes('weaponplatform')) {
			return 'weaponplatform';
		}
		if (id.includes('shipyard')) {
			return 'shipyard';
		}
		if (id.includes('xen_factory')) {
			return 'factory';
		}
		if (id.includes('defence')) {
			return 'defence';
		}
		if (id.includes('turret')) {
			return 'turret';
		}
		if (id.includes('asteroid')) {
			return 'asteroidbase';
		}
		return 'other';
	}

	/**
	 * Per faction and sector: the stations (wrecks left out) and the ship counts. `include` picks the stations that
	 * count, e.g. only discovered ones.
	 */
	static build(
		stations: readonly SaveStation[],
		ships: Partial<Record<string, SectorShipCounts>>,
		include: (station: SaveStation) => boolean = () => true
	): HostileSector[] {
		const result = new Map<string, HostileSector>();
		const entry = (faction: HostileFaction, sector: string) => {
			const key = `${faction}|${sector}`;
			let found = result.get(key);
			if (!found) {
				found = { faction, sector, kinds: [], stations: 0, ships: [0, 0, 0, 0], shipTotal: 0 };
				result.set(key, found);
			}
			return found;
		};
		for (const station of stations) {
			const faction = station.owner as HostileFaction;
			if (!HostilePresence.FACTIONS.includes(faction) || station.state === 'wreck' || !include(station)) {
				continue;
			}
			const item = entry(faction, station.sector);
			const kind = HostilePresence.kind(station.macro);
			const known = item.kinds.find((x) => x.kind === kind);
			if (known) {
				known.count++;
			} else {
				item.kinds.push({ kind, count: 1 });
			}
			item.stations++;
		}
		for (const faction of HostilePresence.FACTIONS) {
			for (const [sector, counts] of Object.entries(ships[faction] ?? {})) {
				const item = entry(faction, sector);
				item.ships = [...counts];
				item.shipTotal = counts.reduce((a, b) => a + b, 0);
			}
		}
		for (const item of result.values()) {
			item.kinds.sort((a, b) => b.count - a.count);
		}
		return [...result.values()];
	}
}
