import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveRepresentatives } from '../map/save-map-model';

/**
 * Reads the factions that have a representative: the owners of the stations holding an
 * `<entity type="factionrepresentative"/>`. Which factions have one differs per save (a faction can die out or appear).
 */
export class RepresentativesExtractor implements XmlExtractor<SaveRepresentatives> {
	readonly key = 'representatives';
	private readonly factions = new Set<string>();
	/** path length of the open station component, 0 outside one */
	private stationDepth = 0;
	private owner = '';
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (name === 'component' && !this.stationDepth) {
			const a = attrs();
			if (a['class'] === 'station') {
				this.stationDepth = path.length;
				this.owner = a['owner'] ?? '';
			}
			return;
		}
		if (this.stationDepth && this.owner && name === 'entity' && attrs()['type'] === 'factionrepresentative') {
			this.factions.add(this.owner);
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'component' && path.length === this.stationDepth) {
			this.stationDepth = 0;
		} else if (name === 'universe' && path.length === 2) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveRepresentatives {
		return [...this.factions];
	}
}
