import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveRelations } from '../map/save-map-model';

const PLAYER_FACTION = 'player';

/** Reads the player faction's relations (relation plus booster) from savegame/universe/factions. */
export class RelationsExtractor implements XmlExtractor<SaveRelations> {
	readonly key = 'relations';
	private readonly base: SaveRelations = {};
	private readonly boost: SaveRelations = {};
	private inPlayer = false;
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (path.length === 4 && name === 'faction') {
			this.inPlayer = path[3] === 'faction' && attrs()['id'] === PLAYER_FACTION;
			return;
		}
		if (!this.inPlayer || path.length !== 6 || path[4] !== 'relations') {
			return;
		}
		if (name !== 'relation' && name !== 'booster') {
			return;
		}
		const a = attrs();
		const faction = a['faction'];
		const value = Number(a['relation']);
		if (!faction || !Number.isFinite(value)) {
			return;
		}
		const target = name === 'relation' ? this.base : this.boost;
		target[faction] = (target[faction] ?? 0) + value;
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'faction' && path.length === 4 && this.inPlayer) {
			this.inPlayer = false;
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveRelations {
		const result: SaveRelations = {};
		for (const faction of new Set([...Object.keys(this.base), ...Object.keys(this.boost)])) {
			const sum = (this.base[faction] ?? 0) + (this.boost[faction] ?? 0);
			result[faction] = Math.max(-1, Math.min(1, sum));
		}
		return result;
	}
}
