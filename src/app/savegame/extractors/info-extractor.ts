import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { SavegameInfo } from '../savegame-model';

const INFO_PATH = 'savegame/info';

function num(value: string | undefined): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

export function createInfoExtractor(): XmlExtractor<SavegameInfo | null> {
	const info: SavegameInfo = {
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
	let seen = false;
	let finished = false;
	const handlers: Record<string, (a: XmlAttributes) => void> = {
		[`${INFO_PATH}/save`]: (a) => {
			info.saveName = a['name'] ?? '';
			info.savedAt = num(a['date']) * 1000;
		},
		[`${INFO_PATH}/game`]: (a) => {
			info.gameVersion = num(a['version']);
			info.gameBuild = num(a['build']);
			info.originalVersion = num(a['original']);
			info.start = a['start'] ?? '';
			info.gameTime = num(a['time']);
			info.guid = a['guid'] ?? '';
			info.modified = a['modified'] === '1';
		},
		[`${INFO_PATH}/player`]: (a) => {
			info.playerName = a['name'] ?? '';
			info.money = num(a['money']);
		},
		[`${INFO_PATH}/patches/patch`]: (a) => {
			info.extensions.push({ id: a['extension'] ?? '', version: num(a['version']) });
		},
	};
	return {
		key: 'info',
		open(_name, path, attrs) {
			if (path.length < 3 || path.length > 4 || path[1] !== 'info') {
				return;
			}
			const handler = handlers[path.join('/')];
			if (handler) {
				seen = true;
				handler(attrs());
			}
		},
		close(name, path) {
			if (name === 'info' && path.length === 2 && path[0] === 'savegame') {
				finished = true;
			}
		},
		done: () => finished,
		result: () => (seen ? info : null),
	};
}
