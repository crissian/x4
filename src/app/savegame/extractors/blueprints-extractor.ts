import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveBlueprints } from '../map/save-map-model';

/**
 * Reads the player's blueprints: `<component class="player"><blueprints><blueprint ware=…/>`.
 * The player component sits inside whatever ship or station the player is in, so its depth varies.
 */
export class BlueprintsExtractor implements XmlExtractor<SaveBlueprints> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'blueprints';
	readonly key = BlueprintsExtractor.KEY;
	private readonly wares = new Set<string>();
	/** path length of the open player component, 0 outside it */
	private playerDepth = 0;
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (name === 'component' && !this.playerDepth) {
			if (attrs()['class'] === 'player') {
				this.playerDepth = path.length;
			}
			return;
		}
		if (
			this.playerDepth &&
			name === 'blueprint' &&
			path.length === this.playerDepth + 2 &&
			path[this.playerDepth] === 'blueprints'
		) {
			const ware = attrs()['ware'];
			if (ware) {
				this.wares.add(ware);
			}
		}
	}

	close(name: string, path: readonly string[]): void {
		if (!this.playerDepth) {
			return;
		}
		if (name === 'blueprints' && path.length === this.playerDepth + 1) {
			this.finished = true;
		} else if (name === 'component' && path.length === this.playerDepth) {
			this.playerDepth = 0;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveBlueprints {
		return [...this.wares];
	}
}
