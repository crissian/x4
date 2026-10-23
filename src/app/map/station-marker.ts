import { StationTrade } from '../savegame/map/station-trade';
import { ShipBuildClasses } from '../ship/sellers/ship-build-classes';
import { entityImage } from '../shared/services/data/images-data';
import type { Size } from '../shared/services/data/size-data';
import type { StationTypeInfo } from '../shared/services/constants';
import { StationTypes } from '../shared/services/station-types';
import type { Faction, GodStation } from '../shared/services/model/model';
import { GalaxyLayout, SectorShape } from './galaxy-layout';
import type { MapSaveStation } from './save/map-save-layer';

/** A station placed on the map: a game start station, or a station of the active save. */
export interface StationMarker {
	id: string;
	sector: string;
	owner: string | undefined;
	/** `StationTypeInfo` id */
	typeId: string;
	type: StationTypeInfo;
	faction: Faction | undefined;
	shape: SectorShape;
	x: number;
	y: number;
	/** the save's station name; game start stations have none */
	name?: string;
	player: boolean;
	known: boolean;
	/** km from the sector centre when beyond the drawing range */
	farKm?: number;
	state?: 'construction' | 'wreck';
	/** ware ids the save station sells and buys */
	sells?: string[];
	buys?: string[];
	/** ship sizes the station builds (see `ShipBuildClasses`); none for stations without build modules */
	shipSizes: Size[];
	/** ware id a save factory produces */
	product?: string;
	/** image of `product`, shown in the marker instead of the factory icon */
	productIcon?: string;
}

/** The station marker under the pointer; x/y are pixels in the map. */
export interface StationHover {
	marker: StationMarker;
	x: number;
	y: number;
}

/** Builds station markers from game start and save stations. */
export class StationMarkers {
	/** Colour of unowned sectors and stations. */
	static readonly NEUTRAL = '#6b7280';

	static fromSave(x: MapSaveStation): StationMarker {
		return {
			id: x.station.code,
			sector: x.station.sector,
			owner: x.station.owner,
			typeId: x.type,
			type: StationTypes.info(x.type),
			faction: x.faction,
			shape: x.shape,
			x: x.x,
			y: x.y,
			name: x.name,
			player: x.player,
			known: x.known,
			farKm: x.farKm,
			state: x.station.state,
			shipSizes: ShipBuildClasses.ofSave(x.station),
			sells: StationTrade.wares(x.station, true),
			buys: StationTrade.wares(x.station, false),
			...StationMarkers.product(x),
		};
	}

	/** The product of a save factory, and its ware image when there is one. */
	private static product(x: MapSaveStation): Pick<StationMarker, 'product' | 'productIcon'> {
		const product = x.type === 'factory' ? x.station.product : undefined;
		return product ? { product, productIcon: entityImage('wares', product) ?? undefined } : {};
	}

	/** A game start station; `index` spreads the stations without a fixed spot around the sector centre. */
	static fromGameStart(
		station: GodStation,
		index: number,
		shape: SectorShape,
		faction: Faction | undefined
	): StationMarker {
		const angle = index * 2.4;
		const position =
			station.x != null
				? GalaxyLayout.markerPosition(shape, station.x, station.z ?? 0)
				: {
						x: shape.x + Math.cos(angle) * shape.r * 0.35,
						y: shape.y + Math.sin(angle) * shape.r * 0.35,
					};
		return {
			id: station.id,
			sector: station.sector,
			owner: station.owner,
			typeId: station.type,
			type: StationTypes.info(station.type),
			faction,
			shape,
			player: false,
			known: true,
			shipSizes: ShipBuildClasses.ofGameStart(station),
			...position,
		};
	}
}
