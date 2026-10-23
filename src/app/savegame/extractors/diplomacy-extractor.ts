import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';

/**
 * The diplomacy state of a save: whether each agent action is shown in the diplomacy menu. `found` is false for a
 * save without diplomacy (before the game's 8.0 update).
 */
export interface SaveDiplomacy {
	found: boolean;
	/** shown (true) or hidden (false), by action id */
	actions: Record<string, boolean>;
}

/**
 * Reads `savegame/universe/diplomacy/actions/action id= hidden=`: the game sets the flag with
 * set_diplomacy_action_hidden (md/diplomacy.xml) as it unlocks the actions. Agents, influence and running actions are
 * not read: no save at hand has them.
 */
export class DiplomacyExtractor implements XmlExtractor<SaveDiplomacy> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'diplomacy';
	readonly key = DiplomacyExtractor.KEY;
	private readonly actions: Record<string, boolean> = {};
	private found = false;
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (name === 'diplomacy' && DiplomacyExtractor.isUniverse(path, 3)) {
			this.found = true;
			return;
		}
		if (name === 'action' && path.length === 5 && path[3] === 'actions' && DiplomacyExtractor.isUniverse(path, 3)) {
			const a = attrs();
			if (a['id']) {
				this.actions[a['id']] = a['hidden'] !== '1';
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'diplomacy' && DiplomacyExtractor.isUniverse(path, 3)) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveDiplomacy {
		return { found: this.found, actions: { ...this.actions } };
	}

	/** The path runs through savegame/universe/diplomacy (its first `length` elements). */
	private static isUniverse(path: readonly string[], length: number): boolean {
		return path.length >= length && path[0] === 'savegame' && path[1] === 'universe' && path[2] === 'diplomacy';
	}
}
