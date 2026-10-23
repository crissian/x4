import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveLicences } from '../map/save-map-model';

const PLAYER_FACTION = 'player';

/** Reads the licences the player holds from savegame/universe/factions/faction[id=player]/licences. */
export class LicencesExtractor implements XmlExtractor<SaveLicences> {
	readonly key = 'licences';
	private readonly licences: SaveLicences = {};
	private inPlayer = false;
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (path.length === 4 && name === 'faction') {
			this.inPlayer = path[3] === 'faction' && attrs()['id'] === PLAYER_FACTION;
			return;
		}
		if (!this.inPlayer || path.length !== 6 || path[4] !== 'licences' || name !== 'licence') {
			return;
		}
		const a = attrs();
		const type = a['type'];
		if (!type) {
			return;
		}
		const factions = (a['factions'] ?? '').split(/\s+/).filter((x) => x);
		this.licences[type] = [...new Set([...(this.licences[type] ?? []), ...factions])];
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

	result(): SaveLicences {
		return this.licences;
	}
}
