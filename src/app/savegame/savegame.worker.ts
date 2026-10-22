/// <reference lib="webworker" />

import { SavegameReader } from './read-savegame';
import { SavegameWorkerMessage } from './savegame-worker-protocol';
import { SavegameError } from './savegame-model';

/** Reads the savegame file posted to the worker and posts progress, the info and the result back. */
class SavegameWorker {
	static async read(file: Blob) {
		try {
			const result = await SavegameReader.read(file.stream(), {
				size: file.size,
				onProgress: (read, total) => SavegameWorker.send({ type: 'progress', read, total }),
				onInfo: (info) => SavegameWorker.send({ type: 'info', info }),
			});
			SavegameWorker.send({ type: 'done', result });
		} catch (error) {
			if (error instanceof SavegameError) {
				SavegameWorker.send({ type: 'error', code: error.code, message: error.message });
			} else {
				SavegameWorker.send({
					type: 'error',
					code: 'read-failed',
					message: error instanceof Error ? error.message : String(error),
				});
			}
		}
	}

	private static send(message: SavegameWorkerMessage) {
		postMessage(message);
	}
}

addEventListener('message', ({ data: file }: MessageEvent<Blob>) => SavegameWorker.read(file));
