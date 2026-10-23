import { STATION_TYPES, StationTypeInfo } from './constants';

/** Looks up the station types the map, the sector pages and the ship sellers show. */
export class StationTypes {
	/** The type with the given id; `other` for an unknown one. */
	static info(id: string): StationTypeInfo {
		return STATION_TYPES.find((x) => x.id === id) ?? STATION_TYPES[STATION_TYPES.length - 1];
	}
}
