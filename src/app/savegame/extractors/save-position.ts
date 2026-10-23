import { MacroId } from '../../core/macro-id';

/** An open zone component of the save: predefined when its `offset` has `default="1"`, with its offset in metres. */
export interface SaveZoneNode {
	kind: 'zone';
	macro: string;
	isDefault: boolean;
	x: number;
	z: number;
}

/** Positions of objects in a sector of the save, as the pages show them. */
export class SavePosition {
	static zone(macro: string): SaveZoneNode {
		return { kind: 'zone', macro, isDefault: false, x: 0, z: 0 };
	}

	/**
	 * Where an object at x/z metres in a zone is: relative to the zone when it is predefined (the pages know where those
	 * are), else relative to the sector; in km.
	 */
	static place(zone: SaveZoneNode | undefined, x: number, z: number): { zone?: string; x: number; z: number } {
		if (zone?.isDefault) {
			return { zone: MacroId.of(zone.macro), x: SavePosition.km(x), z: SavePosition.km(z) };
		}
		return { x: SavePosition.km(x + (zone?.x ?? 0)), z: SavePosition.km(z + (zone?.z ?? 0)) };
	}

	/** km rounded to 0.1 */
	static km(metres: number): number {
		return Math.round(metres / 100) / 10;
	}

	/** A number attribute, 0 when missing or invalid. */
	static num(value: string | undefined): number {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
}
