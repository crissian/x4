import type { SaveFleetShip, SaveOwnStation, SaveOwnerlessShip } from '../empire/save-empire-model';
import type { SaveZoneNode } from './save-position';

/** The open components the empire extractor keeps: every component gets one, so a node's depth tells what an element is directly inside. */
export interface SectorNode {
	kind: 'sector';
	id: string;
}
export interface ShipNode {
	kind: 'ship';
	/** the player's ship */
	own?: SaveFleetShip;
	/** an ownerless ship, with its zone and offset in metres */
	ownerless?: { ship: SaveOwnerlessShip; zone?: SaveZoneNode; x: number; z: number };
}
export interface StationNode {
	kind: 'station';
	/** the player's station */
	own?: SaveOwnStation;
}
/** a storage module of a player station */
export interface StorageNode {
	kind: 'storage';
	station: SaveOwnStation;
}
export interface OtherNode {
	kind: 'other';
}
export type EmpireNode = SectorNode | SaveZoneNode | ShipNode | StationNode | StorageNode | OtherNode;
