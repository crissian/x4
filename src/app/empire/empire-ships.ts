import { GameTextRef } from '../core/game-text-ref';
import type { SaveFleetShip } from '../savegame/empire/save-empire-model';
import type { ShipListItem } from '../shared/services/model/model';
import type { EmpireShipRow } from './empire-model';

/** What `EmpireShips.build` looks things up in. */
export interface EmpireShipLookups {
	model(id: string): ShipListItem | undefined;
	sectorName(id: string): string;
	/** resolves a `{page,id}` game text reference, the form the save gives story and preset ship names */
	text(ref: string): string | undefined;
	/** the name of a player station by component id; undefined for an unknown id */
	stationName(id: string): string | undefined;
	/** the game's name of an order id; undefined when the game data has none */
	orderName(id: string): string | undefined;
	/** the game's name of a fleet assignment id; undefined when the game data has none */
	assignmentName(id: string): string | undefined;
}

/**
 * Turns the save's ships into the empire page's rows in fleet order: each top commander (by name) followed by its
 * subordinates, depth first; a ship whose commander is a station starts a fleet named after the station.
 */
export class EmpireShips {
	static build(ships: readonly SaveFleetShip[], lookups: EmpireShipLookups): EmpireShipRow[] {
		const byId = new Map(ships.map((x) => [x.id, x]));
		const labels = new Map(ships.map((x) => [x.id, EmpireShips.label(x, lookups)]));
		const children = new Map<string, SaveFleetShip[]>();
		const roots: SaveFleetShip[] = [];
		for (const ship of ships) {
			const commander = ship.commander && byId.has(ship.commander) ? ship.commander : undefined;
			if (commander) {
				children.set(commander, [...(children.get(commander) ?? []), ship]);
			} else {
				roots.push(ship);
			}
		}
		const byLabel = (a: SaveFleetShip, b: SaveFleetShip) =>
			(labels.get(a.id) ?? '').localeCompare(labels.get(b.id) ?? '');
		const rows: EmpireShipRow[] = [];
		const visited = new Set<string>();
		const visit = (ship: SaveFleetShip, depth: number, fleet: string) => {
			visited.add(ship.id);
			const commander = ship.commander
				? (labels.get(ship.commander) ?? lookups.stationName(ship.commander))
				: undefined;
			const row = EmpireShips.row(ship, lookups, {
				label: labels.get(ship.id) ?? ship.code,
				depth,
				fleet,
				commander,
				commanderId: commander ? ship.commander : undefined,
				subordinates: 0,
			});
			rows.push(row);
			const first = rows.length;
			for (const child of [...(children.get(ship.id) ?? [])].sort(byLabel)) {
				if (!visited.has(child.id)) {
					visit(child, depth + 1, fleet);
				}
			}
			row.subordinates = rows.length - first;
		};
		const start = (root: SaveFleetShip) => {
			const station = root.commander ? lookups.stationName(root.commander) : undefined;
			const fleet = children.has(root.id) ? (root.fleet ?? labels.get(root.id) ?? root.code) : (station ?? '');
			visit(root, 0, fleet);
		};
		[...roots].sort(byLabel).forEach(start);
		// ships commanding each other in a loop have no top commander; they still get listed
		for (const ship of ships) {
			if (!visited.has(ship.id)) {
				start(ship);
			}
		}
		return rows;
	}

	/**
	 * The ship's name, with game text references resolved. A ship the player never renamed has no name in the save and
	 * the game shows its model's name; the code is the last resort for an unknown model.
	 */
	static label(ship: SaveFleetShip, lookups: Pick<EmpireShipLookups, 'text' | 'model'>): string {
		const name = ship.name && GameTextRef.isRef(ship.name) ? lookups.text(ship.name) : ship.name;
		return name || lookups.model(ship.macro)?.name || ship.code;
	}

	private static row(
		ship: SaveFleetShip,
		lookups: EmpireShipLookups,
		place: Pick<EmpireShipRow, 'label' | 'depth' | 'fleet' | 'commander' | 'commanderId' | 'subordinates'>
	): EmpireShipRow {
		const model = lookups.model(ship.macro);
		const current = ship.order ?? ship.defaultOrder;
		return {
			id: ship.id,
			code: ship.code,
			modelId: ship.macro,
			model,
			modelName: model?.name ?? ship.macro,
			size: model?.size ?? '',
			purpose: model?.purpose ?? '',
			sector: ship.sector,
			sectorName: lookups.sectorName(ship.sector),
			order: current ? (lookups.orderName(current) ?? current) : '',
			orderId: current,
			defaultOrder:
				ship.order && ship.defaultOrder ? (lookups.orderName(ship.defaultOrder) ?? ship.defaultOrder) : undefined,
			assignment: ship.assignment ? (lookups.assignmentName(ship.assignment) ?? ship.assignment) : undefined,
			assignmentId: ship.assignment,
			...place,
		};
	}
}
