export const SAVEGAME_SCHEMA_VERSION = 5;

export interface SavegameExtension {
	id: string;
	version: number;
}

export interface SavegameInfo {
	saveName: string;
	/** unix ms */
	savedAt: number;
	gameVersion: number;
	gameBuild: number;
	originalVersion: number;
	start: string;
	/** in-game seconds */
	gameTime: number;
	guid: string;
	playerName: string;
	money: number;
	modified: boolean;
	extensions: SavegameExtension[];
}

export interface SavegameSummary {
	/** = info.guid */
	id: string;
	schemaVersion: number;
	addedAt: number;
	fileName: string;
	fileSize: number;
	fileKept: boolean;
	info: SavegameInfo;
	data: Record<string, unknown>;
}

export type SavegameListItem = Omit<SavegameSummary, 'data'>;

export type SavegameErrorCode = 'not-a-savegame' | 'invalid-xml' | 'truncated' | 'read-failed' | 'store-failed';

export class SavegameError extends Error {
	constructor(
		readonly code: SavegameErrorCode,
		message: string,
	) {
		super(message);
		this.name = 'SavegameError';
	}
}
