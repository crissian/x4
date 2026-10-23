import type { SaveFleetShip } from '../empire/save-empire-model';

/**
 * Links subordinate ships to their commanders while the save streams. A commander's `connections/connection
 * connection="subordinates"` has an id that the subordinate's `connection connection="commander"` names in its
 * `<connected connection>`; the commander's `subordinates/group` elements give each group's assignment and the
 * subordinate's `<subordinate group>` its group.
 */
export class FleetLinks {
	/** subordinates connection id -> component id of the commander */
	private readonly commanders = new Map<string, string>();
	/** component id of the commander -> assignment by group index */
	private readonly groups = new Map<string, Record<string, string>>();
	/** ship -> the commander connection id it names, and its group */
	private readonly links = new Map<SaveFleetShip, { connection?: string; group?: string }>();

	/** `connection connection="subordinates"` of a commander */
	addSubordinates(commander: string, connection: string | undefined): void {
		if (connection) {
			this.commanders.set(connection, commander);
		}
	}

	/** `subordinates/group` of a commander */
	addGroup(commander: string, index: string | undefined, assignment: string | undefined): void {
		if (index && assignment) {
			const groups = this.groups.get(commander) ?? {};
			groups[index] = assignment;
			this.groups.set(commander, groups);
		}
	}

	/** `connection connection="commander"/connected` of a subordinate */
	setCommander(ship: SaveFleetShip, connection: string | undefined): void {
		if (connection) {
			this.links.set(ship, { ...this.links.get(ship), connection });
		}
	}

	/** `<subordinate group>` of a subordinate */
	setGroup(ship: SaveFleetShip, group: string | undefined): void {
		if (group) {
			this.links.set(ship, { ...this.links.get(ship), group });
		}
	}

	/** Sets the commander and assignment of every linked ship whose commander was seen. */
	apply(): void {
		for (const [ship, { connection, group }] of this.links) {
			const commander = connection ? this.commanders.get(connection) : undefined;
			if (!commander) {
				continue;
			}
			ship.commander = commander;
			const assignment = group ? this.groups.get(commander)?.[group] : undefined;
			if (assignment) {
				ship.assignment = assignment;
			}
		}
	}
}
