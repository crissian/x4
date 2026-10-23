import { MacroId } from '../../core/macro-id';
import { ElementStack } from '../../core/xml/element-stack';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveMap, SaveSector, SaveStation, ShipCounts } from '../map/save-map-model';
import { StationDetails } from './station-details';
import { SavePosition } from './save-position';

const SHIP_CLASSES: Record<string, number> = { ship_xs: 0, ship_s: 1, ship_m: 2, ship_l: 3, ship_xl: 4 };

interface ZoneNode {
	kind: 'zone';
	macro: string;
	isDefault: boolean;
	x: number;
	z: number;
}
interface SectorNode {
	kind: 'sector';
	sector: SaveSector;
}
interface StationNode {
	kind: 'station';
	station: SaveStation;
	zone?: ZoneNode;
	x: number;
	z: number;
	details: StationDetails;
}
interface ShipNode {
	kind: 'ship';
}
type MapNode = ZoneNode | SectorNode | StationNode | ShipNode;

export class MapExtractor implements XmlExtractor<SaveMap> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'map';
	readonly key = MapExtractor.KEY;
	private readonly sectors: SaveSector[] = [];
	private readonly playerShips: ShipCounts = {};
	private readonly stations: StationNode[] = [];
	private finished = false;
	private readonly stack = new ElementStack<MapNode>((name, _path, attrs) => this.select(name, attrs));

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		switch (name) {
			case 'component':
				this.stack.open(name, path, attrs);
				break;
			case 'position': {
				if (path[path.length - 2] !== 'offset') {
					break;
				}
				const owner = this.ancestor(path, 2);
				if (owner?.kind === 'station' || owner?.kind === 'zone') {
					const a = attrs();
					owner.x = SavePosition.num(a['x']);
					owner.z = SavePosition.num(a['z']);
				}
				break;
			}
			case 'offset': {
				const owner = this.ancestor(path, 1);
				if (owner?.kind === 'zone' && attrs()['default'] === '1') {
					owner.isDefault = true;
				}
				break;
			}
			case 'production': {
				const owner = this.ancestor(path, 1);
				if (owner?.kind === 'station') {
					const product = attrs()['originalproduct'];
					if (product !== undefined) {
						owner.station.product = product;
					}
				}
				break;
			}
			case 'entry': {
				if (path[path.length - 2] !== 'sequence' || path[path.length - 3] !== 'construction') {
					break;
				}
				const owner = this.ancestor(path, 3);
				if (owner?.kind === 'station') {
					owner.details.addModule(attrs()['macro']);
				}
				break;
			}
			case 'trade': {
				// component/trade/offers/<group>/trade: the station's own offers, not those in ship orders
				if (path[path.length - 3] !== 'offers' || path[path.length - 4] !== 'trade') {
					break;
				}
				const owner = this.ancestor(path, 4);
				if (owner?.kind === 'station') {
					owner.details.addOffer(attrs());
				}
				break;
			}
			case 'restrictions': {
				if (path[path.length - 2] !== 'trade' || path[path.length - 4] !== 'offers') {
					break;
				}
				const owner = this.ancestor(path, 5);
				if (owner?.kind === 'station') {
					owner.details.restrict(attrs());
				}
				break;
			}
			case 'workforce': {
				if (path[path.length - 2] !== 'workforces') {
					break;
				}
				const owner = this.ancestor(path, 2);
				if (owner?.kind === 'station') {
					owner.details.addWorkforce(attrs());
				}
				break;
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'component') {
			this.stack.close(name, path);
		} else if (path.length === 1) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveMap {
		return {
			sectors: this.sectors,
			stations: this.stations.map((node) => this.finishStation(node)),
			playerShips: this.playerShips,
		};
	}

	/** the node a `component` element opens, if it is one this extractor tracks */
	private select(name: string, attrs: () => XmlAttributes): MapNode | undefined {
		if (name !== 'component') {
			return undefined;
		}
		const a = attrs();
		const cls = a['class'];
		if (cls === 'zone') {
			return { kind: 'zone', macro: a['macro'] ?? '', isDefault: false, x: 0, z: 0 };
		}
		if (cls === 'sector') {
			const sector: SaveSector = {
				id: MacroId.of(a['macro'] ?? ''),
				owner: a['owner'] ?? '',
				contested: a['contested'] === '1',
				known: a['knownto'] === 'player',
			};
			this.sectors.push(sector);
			return { kind: 'sector', sector };
		}
		const size = cls === undefined ? undefined : SHIP_CLASSES[cls];
		if (cls !== 'station' && size === undefined) {
			return undefined;
		}
		const sectorEntry = this.stack.nearest((n) => n.kind === 'sector');
		if (!sectorEntry) {
			return undefined;
		}
		const sectorId = (sectorEntry.value as SectorNode).sector.id;
		if (size !== undefined) {
			if (a['owner'] === 'player') {
				(this.playerShips[sectorId] ??= [0, 0, 0, 0, 0])[size]++;
			}
			return { kind: 'ship' };
		}
		const zone = this.stack.nearest((n) => n.kind === 'zone')?.value as ZoneNode | undefined;
		const node: StationNode = {
			kind: 'station',
			station: MapExtractor.createStation(a, sectorId),
			zone,
			x: 0,
			z: 0,
			details: new StationDetails(a['id']),
		};
		this.stations.push(node);
		return node;
	}

	/** the open component that is `up` levels above the current element */
	private ancestor(path: readonly string[], up: number): MapNode | undefined {
		return this.stack.nearest((_n, depth) => depth === path.length - up)?.value;
	}

	private finishStation(node: StationNode): SaveStation {
		const { station, zone } = node;
		let x = node.x;
		let z = node.z;
		if (zone?.isDefault) {
			station.zone = MacroId.of(zone.macro);
		} else if (zone) {
			x += zone.x;
			z += zone.z;
		}
		station.x = SavePosition.km(x);
		station.z = SavePosition.km(z);
		node.details.applyTo(station);
		return station;
	}

	private static createStation(a: XmlAttributes, sectorId: string): SaveStation {
		const station: SaveStation = {
			code: a['code'] ?? '',
			macro: MacroId.of(a['macro'] ?? ''),
			owner: a['owner'] ?? '',
			sector: sectorId,
			x: 0,
			z: 0,
			known: a['knownto'] === 'player',
			modules: [],
		};
		if (a['state'] === 'construction' || a['state'] === 'wreck') {
			station.state = a['state'];
		}
		if (a['name'] !== undefined) {
			station.name = a['name'];
		}
		if (a['basename'] !== undefined) {
			station.basename = a['basename'];
		}
		if (a['nameindex'] !== undefined) {
			station.nameIndex = SavePosition.num(a['nameindex']);
		}
		return station;
	}
}
