import { Injectable } from '@angular/core';
import { WorkerTask } from '../core/workers/worker-task';
import { ReadSavegameResult } from './read-savegame';
import { SavegameError, SavegameInfo } from './savegame-model';
import { SavegameWorkerMessage } from './savegame-worker-protocol';

export interface ParseCallbacks {
	onProgress?(read: number, total: number): void;
	onInfo?(info: SavegameInfo): void;
}

/** Parses the savegame in a dedicated worker so the page stays responsive. */
@Injectable({ providedIn: 'root' })
export class SavegameParser {
	parse(file: Blob, callbacks: ParseCallbacks): WorkerTask<ReadSavegameResult> {
		return WorkerTask.run<ReadSavegameResult>(
			() => new Worker(new URL('./savegame.worker', import.meta.url), { type: 'module' }),
			file,
			(data) => {
				const message = data as SavegameWorkerMessage;
				switch (message.type) {
					case 'progress':
						callbacks.onProgress?.(message.read, message.total);
						return undefined;
					case 'info':
						callbacks.onInfo?.(message.info);
						return undefined;
					case 'done':
						return { done: message.result };
					case 'error':
						return { fail: new SavegameError(message.code, message.message) };
					default:
						return { fail: new Error('Unknown message from the savegame worker.') };
				}
			},
		);
	}
}
