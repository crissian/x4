import { MacroId } from '../../core/macro-id';
import { ElementStack } from '../../core/xml/element-stack';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import type {
	SaveEmpire,
	SaveFleetShip,
	SaveOwnStation,
	SaveOwnerlessShip,
	SectorShipCounts,
} from '../empire/save-empire-model';
import type { EmpireNode, SectorNode, ShipNode } from './empire-nodes';
import { FleetLinks } from './fleet-links';
import { SavePosition, type SaveZoneNode } from './save-position';
import { StationBuild } from './station-build';

/** ship class -> index in `SectorShipCounts` */
const SHIP_SIZES: Record<string, number> = { ship_s: 0, ship_m: 1, ship_l: 2, ship_xl: 3 };

/**
 * Reads what the player owns beyond the map data: their ships with fleets and orders, their stations' money,
 * storage and built modules, the ownerless ships they can claim, and the Xenon and Kha'ak ship counts per sector. Only components
 * inside a sector count (ships waiting in `jobs` don't).
 */
export class EmpireExtractor implements XmlExtractor<SaveEmpire> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'empire';
	/** The factions whose ships are counted per sector. */
	static readonly HOSTILES = ['xenon', 'khaak'];
	readonly key = EmpireExtractor.KEY;

	private readonly ships: SaveFleetShip[] = [];
	private readonly stations: SaveOwnStation[] = [];
	private readonly builds: StationBuild[] = [];
	private readonly ownerless: ShipNode['ownerless'][] = [];
	private readonly hostileShips: Record<string, SectorShipCounts> = {};
	private readonly fleets = new FleetLinks();
	/** the ship whose `connection connection="commander"` is open, with that element's depth */
	private commanderOf: { ship: SaveFleetShip; depth: number } | undefined;
	private finished = false;
	private readonly stack = new ElementStack<EmpireNode>((_name, path, attrs) => this.select(path, attrs));

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		switch (name) {
			case 'component':
				this.stack.open(name, path, attrs);
				break;
			case 'position':
				if (path[path.length - 2] === 'offset') {
					this.setPosition(this.ancestor(path, 2), attrs());
				}
				break;
			case 'offset': {
				const owner = this.ancestor(path, 1);
				if (owner?.kind === 'zone' && attrs()['default'] === '1') {
					owner.isDefault = true;
				}
				break;
			}
			case 'fleet': {
				const ship = this.ownShip(path, 1);
				const fleet = attrs()['name'];
				if (ship && fleet) {
					ship.fleet = fleet;
				}
				break;
			}
			case 'subordinate': {
				const ship = this.ownShip(path, 1);
				if (ship) {
					this.fleets.setGroup(ship, attrs()['group']);
				}
				break;
			}
			case 'group': {
				const commander = path[path.length - 2] === 'subordinates' ? this.ownId(path, 2) : undefined;
				if (commander) {
					const a = attrs();
					// sic: the save spells it with a double m
					this.fleets.addGroup(commander, a['index'], a['assignmment'] ?? a['assignment']);
				}
				break;
			}
			case 'order': {
				const ship = path[path.length - 2] === 'orders' ? this.ownShip(path, 2) : undefined;
				if (ship) {
					this.addOrder(ship, attrs());
				}
				break;
			}
			case 'connection':
				if (path[path.length - 2] === 'connections') {
					this.openConnection(path, attrs());
				}
				break;
			case 'connected':
				if (this.commanderOf?.depth === path.length - 1) {
					this.fleets.setCommander(this.commanderOf.ship, attrs()['connection']);
					this.commanderOf = undefined;
				}
				break;
			case 'entry': {
				const station =
					path[path.length - 2] === 'sequence' && path[path.length - 3] === 'construction'
						? this.ancestor(path, 3)
						: undefined;
				if (station?.kind === 'station' && station.build) {
					const a = attrs();
					station.build.addEntry(a['id'], a['macro']);
				}
				break;
			}
			case 'account': {
				const station = this.ownStation(path, 1);
				if (station) {
					station.money = SavePosition.num(attrs()['amount']);
				}
				break;
			}
			case 'ware': {
				const storage = path[path.length - 2] === 'cargo' ? this.ancestor(path, 2) : undefined;
				if (storage?.kind === 'storage') {
					EmpireExtractor.addWare(storage.station, attrs());
				}
				break;
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'component') {
			this.stack.close(name, path);
		} else if (name === 'connection' && this.commanderOf?.depth === path.length) {
			this.commanderOf = undefined;
		} else if (name === 'universe' && path.length === 2) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveEmpire {
		this.fleets.apply();
		this.builds.forEach((x) => x.apply());
		return {
			ships: this.ships,
			stations: this.stations,
			ownerless: this.ownerless.flatMap((x) => (x ? [EmpireExtractor.place(x)] : [])),
			hostileShips: this.hostileShips,
		};
	}

	/** Every component gets a node, so a node's depth tells whether an element is directly inside it. */
	private select(path: readonly string[], attrs: () => XmlAttributes): EmpireNode {
		const a = attrs();
		const cls = a['class'] ?? '';
		if (a['construction'] && a['state'] === 'construction') {
			this.stationBuild()?.markBuilding(a['construction']);
		}
		if (cls === 'sector') {
			return { kind: 'sector', id: MacroId.of(a['macro'] ?? '') };
		}
		if (cls === 'zone') {
			return SavePosition.zone(a['macro'] ?? '');
		}
		const sector = this.stack.nearest((n) => n.kind === 'sector')?.value as SectorNode | undefined;
		if (cls.startsWith('ship_')) {
			return sector ? this.readShip(a, sector.id) : { kind: 'ship' };
		}
		if (cls === 'station') {
			const own = sector && a['owner'] === 'player' ? this.readStation(a, sector.id) : undefined;
			const build = own ? new StationBuild(own) : undefined;
			if (build) {
				this.builds.push(build);
			}
			return { kind: 'station', own, build };
		}
		if (cls === 'storage') {
			// station/connections/connection/component class="storage"
			const station = this.ancestor(path, 3);
			if (station?.kind === 'station' && station.own) {
				return { kind: 'storage', station: station.own };
			}
		}
		return { kind: 'other' };
	}

	private readShip(a: XmlAttributes, sector: string): ShipNode {
		const owner = a['owner'];
		const base = { id: a['id'] ?? '', code: a['code'] ?? '', macro: MacroId.of(a['macro'] ?? ''), sector };
		const name = a['name'] !== undefined ? { name: a['name'] } : {};
		const size = SHIP_SIZES[a['class'] ?? ''];
		if (size === undefined) {
			// drones
			return { kind: 'ship' };
		}
		if (owner === 'player') {
			const own: SaveFleetShip = { ...base, ...name };
			this.ships.push(own);
			return { kind: 'ship', own };
		}
		if (owner === 'ownerless') {
			const zone = this.stack.nearest((n) => n.kind === 'zone')?.value as SaveZoneNode | undefined;
			const ownerless = { ship: { ...base, ...name, x: 0, z: 0 }, zone, x: 0, z: 0 };
			this.ownerless.push(ownerless);
			return { kind: 'ship', ownerless };
		}
		if (owner && EmpireExtractor.HOSTILES.includes(owner)) {
			const counts = (this.hostileShips[owner] ??= {});
			(counts[sector] ??= [0, 0, 0, 0])[size]++;
		}
		return { kind: 'ship' };
	}

	private readStation(a: XmlAttributes, sector: string): SaveOwnStation {
		const station: SaveOwnStation = { id: a['id'] ?? '', code: a['code'] ?? '', sector, money: 0 };
		this.stations.push(station);
		return station;
	}

	/** The construction sequence of the player station a module component is in (not one of a ship docked there). */
	private stationBuild(): StationBuild | undefined {
		const node = this.stack.nearest((n) => n.kind === 'station' || n.kind === 'ship')?.value;
		return node?.kind === 'station' ? node.build : undefined;
	}

	/** The default order, and the first order queued after it. */
	private addOrder(ship: SaveFleetShip, a: XmlAttributes): void {
		const order = a['order'];
		if (!order) {
			return;
		}
		if (a['default'] === '1') {
			ship.defaultOrder ??= order;
		} else {
			ship.order ??= order;
		}
	}

	/** `component/connections/connection` of a player ship or station: its fleet links. */
	private openConnection(path: readonly string[], a: XmlAttributes): void {
		const kind = a['connection'];
		if (kind === 'subordinates') {
			const id = this.ownId(path, 2);
			if (id) {
				this.fleets.addSubordinates(id, a['id']);
			}
		} else if (kind === 'commander') {
			const ship = this.ownShip(path, 2);
			this.commanderOf = ship ? { ship, depth: path.length } : undefined;
		}
	}

	private setPosition(owner: EmpireNode | undefined, a: XmlAttributes): void {
		if (owner?.kind === 'zone') {
			owner.x = SavePosition.num(a['x']);
			owner.z = SavePosition.num(a['z']);
		} else if (owner?.kind === 'ship' && owner.ownerless) {
			owner.ownerless.x = SavePosition.num(a['x']);
			owner.ownerless.z = SavePosition.num(a['z']);
		}
	}

	/** The component that is `up` levels above the current element. */
	private ancestor(path: readonly string[], up: number): EmpireNode | undefined {
		return this.stack.nearest((_n, depth) => depth === path.length - up)?.value;
	}

	private ownShip(path: readonly string[], up: number): SaveFleetShip | undefined {
		const node = this.ancestor(path, up);
		return node?.kind === 'ship' ? node.own : undefined;
	}

	private ownStation(path: readonly string[], up: number): SaveOwnStation | undefined {
		const node = this.ancestor(path, up);
		return node?.kind === 'station' ? node.own : undefined;
	}

	/** The component id of the player ship or station `up` levels above. */
	private ownId(path: readonly string[], up: number): string | undefined {
		return (this.ownShip(path, up) ?? this.ownStation(path, up))?.id;
	}

	private static addWare(station: SaveOwnStation, a: XmlAttributes): void {
		const ware = a['ware'];
		const amount = SavePosition.num(a['amount']);
		if (ware && amount > 0) {
			const storage = (station.storage ??= {});
			storage[ware] = (storage[ware] ?? 0) + amount;
		}
	}

	/** The ship with its position: relative to a predefined zone, else to the sector. */
	private static place({ ship, zone, x, z }: NonNullable<ShipNode['ownerless']>): SaveOwnerlessShip {
		return Object.assign(ship, SavePosition.place(zone, x, z));
	}
}
