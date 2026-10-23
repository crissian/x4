import { MacroId } from '../../core/macro-id';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveShip, SaveShips } from '../map/save-map-model';

const SHIP_CLASSES = new Set(['ship_s', 'ship_m', 'ship_l', 'ship_xl']);

/** An open ship component; `ship` is undefined for a ship someone else owns. */
interface OpenShip {
	depth: number;
	ship?: SaveShip;
}

/**
 * Reads the player's ships: `<component class="ship_*" owner="player">` inside a sector, with the engines in
 * its own `connections/connection/component class="engine"` (a docked ship's engines stay with that ship).
 */
export class ShipsExtractor implements XmlExtractor<SaveShips> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'ships';
	readonly key = ShipsExtractor.KEY;
	private readonly ships: SaveShip[] = [];
	/** open sector components by path length */
	private readonly sectors: { depth: number; id: string }[] = [];
	private readonly openShips: OpenShip[] = [];
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (name !== 'component') {
			return;
		}
		const a = attrs();
		const cls = a['class'] ?? '';
		if (cls === 'sector') {
			this.sectors.push({ depth: path.length, id: MacroId.of(a['macro'] ?? '') });
		} else if (SHIP_CLASSES.has(cls)) {
			this.openShips.push({ depth: path.length, ship: this.readShip(a) });
		} else if (cls === 'engine') {
			// component/connections/connection/component: an engine of the innermost open ship
			const owner = this.openShips[this.openShips.length - 1];
			if (owner?.ship && owner.depth === path.length - 3 && a['macro']) {
				owner.ship.engine ??= MacroId.of(a['macro']);
				owner.ship.engines = (owner.ship.engines ?? 0) + 1;
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'component') {
			if (this.openShips[this.openShips.length - 1]?.depth === path.length) {
				this.openShips.pop();
			} else if (this.sectors[this.sectors.length - 1]?.depth === path.length) {
				this.sectors.pop();
			}
		} else if (name === 'universe' && path.length === 2) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveShips {
		return this.ships;
	}

	/** The player's ship in a sector, added to the result; undefined for any other ship. */
	private readShip(a: XmlAttributes): SaveShip | undefined {
		const sector = this.sectors[this.sectors.length - 1];
		if (a['owner'] !== 'player' || !sector) {
			return undefined;
		}
		const ship: SaveShip = {
			id: a['id'] ?? '',
			code: a['code'] ?? '',
			macro: MacroId.of(a['macro'] ?? ''),
			sector: sector.id,
		};
		if (a['name'] !== undefined) {
			ship.name = a['name'];
		}
		if (a['thruster']) {
			ship.thruster = MacroId.of(a['thruster']);
		}
		this.ships.push(ship);
		return ship;
	}
}
