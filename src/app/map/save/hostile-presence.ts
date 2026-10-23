import type { SectorShipCounts } from '../../savegame/empire/save-empire-model';
import type { SaveStation } from '../../savegame/map/save-map-model';

/** The factions of the hostile presence layer. */
export type HostileFaction = 'xenon' | 'khaak';

/** One faction's stations and ships in one sector. */
export interface HostileSector {
	faction: HostileFaction;
	sector: string;
	/** station counts by name (the game's name of the station macro), the most first */
	kinds: { name: string; count: number }[];
	stations: number;
	/** ship counts [s, m, l, xl] */
	ships: [number, number, number, number];
	shipTotal: number;
}

/** Collects where the Xenon and Kha'ak have stations and ships in a save. */
export class HostilePresence {
	static readonly FACTIONS: readonly HostileFaction[] = ['xenon', 'khaak'];

	/**
	 * Per faction and sector: the stations (wrecks left out) and the ship counts. `name` gives a station's name,
	 * e.g. the game's name of its macro; `include` picks the stations that count, e.g. only discovered ones.
	 */
	static build(
		stations: readonly SaveStation[],
		ships: Partial<Record<string, SectorShipCounts>>,
		name: (station: SaveStation) => string,
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
			const label = name(station);
			const known = item.kinds.find((x) => x.name === label);
			if (known) {
				known.count++;
			} else {
				item.kinds.push({ name: label, count: 1 });
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
			item.kinds.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
		}
		return [...result.values()];
	}
}
