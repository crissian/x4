/// <reference lib="webworker" />

import { readSavegame } from './read-savegame';
import { SavegameWorkerMessage } from './savegame-worker-protocol';
import { SavegameError } from './savegame-model';

function send(message: SavegameWorkerMessage) {
	postMessage(message);
}

addEventListener('message', async ({ data: file }: MessageEvent<Blob>) => {
	try {
		const result = await readSavegame(file.stream(), {
			size: file.size,
			onProgress: (read, total) => send({ type: 'progress', read, total }),
			onInfo: (info) => send({ type: 'info', info }),
		});
		send({ type: 'done', result });
	} catch (error) {
		if (error instanceof SavegameError) {
			send({ type: 'error', code: error.code, message: error.message });
		} else {
			send({ type: 'error', code: 'read-failed', message: error instanceof Error ? error.message : String(error) });
		}
	}
});
