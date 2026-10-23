import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SavegameInfo } from '../savegame-model';

const INFO_PATH = 'savegame/info';

export class InfoExtractor implements XmlExtractor<SavegameInfo | null> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'info';
	readonly key = InfoExtractor.KEY;
	private readonly info: SavegameInfo = {
		saveName: '',
		savedAt: 0,
		gameVersion: 0,
		gameBuild: 0,
		originalVersion: 0,
		start: '',
		gameTime: 0,
		guid: '',
		playerName: '',
		money: 0,
		modified: false,
		extensions: [],
	};
	private seen = false;
	private finished = false;
	private readonly handlers: Record<string, (a: XmlAttributes) => void> = {
		[`${INFO_PATH}/save`]: (a) => {
			this.info.saveName = a['name'] ?? '';
			this.info.savedAt = InfoExtractor.num(a['date']) * 1000;
		},
		[`${INFO_PATH}/game`]: (a) => {
			this.info.gameVersion = InfoExtractor.num(a['version']);
			this.info.gameBuild = InfoExtractor.num(a['build']);
			this.info.originalVersion = InfoExtractor.num(a['original']);
			this.info.start = a['start'] ?? '';
			this.info.gameTime = InfoExtractor.num(a['time']);
			this.info.guid = a['guid'] ?? '';
			this.info.modified = a['modified'] === '1';
		},
		[`${INFO_PATH}/player`]: (a) => {
			this.info.playerName = a['name'] ?? '';
			this.info.money = InfoExtractor.num(a['money']);
		},
		[`${INFO_PATH}/patches/patch`]: (a) => {
			this.info.extensions.push({ id: a['extension'] ?? '', version: InfoExtractor.num(a['version']) });
		},
	};

	open(_name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (path.length < 3 || path.length > 4 || path[1] !== 'info') {
			return;
		}
		const handler = this.handlers[path.join('/')];
		if (handler) {
			this.seen = true;
			handler(attrs());
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'info' && path.length === 2 && path[0] === 'savegame') {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SavegameInfo | null {
		return this.seen ? this.info : null;
	}

	private static num(value: string | undefined): number {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
}
