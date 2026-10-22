import { ReadSavegameResult } from './read-savegame';
import { SavegameErrorCode, SavegameInfo } from './savegame-model';

export type SavegameWorkerMessage =
	| { type: 'progress'; read: number; total: number }
	| { type: 'info'; info: SavegameInfo }
	| { type: 'done'; result: ReadSavegameResult }
	| { type: 'error'; code: SavegameErrorCode; message: string };
