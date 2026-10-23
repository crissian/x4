import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SaveResearch } from '../map/save-map-model';

/**
 * Reads the research the player has completed: `<component class="player"><research><research ware=…/>`, next to
 * the blueprints. The player component sits inside whatever ship or station the player is in, so its depth varies.
 */
export class ResearchExtractor implements XmlExtractor<SaveResearch> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'research';
	readonly key = ResearchExtractor.KEY;
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
			name === 'research' &&
			path.length === this.playerDepth + 2 &&
			path[this.playerDepth] === 'research'
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
		if (name === 'research' && path.length === this.playerDepth + 1) {
			this.finished = true;
		} else if (name === 'component' && path.length === this.playerDepth) {
			this.playerDepth = 0;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveResearch {
		return [...this.wares];
	}
}
