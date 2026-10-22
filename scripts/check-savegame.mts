// Dev only: node-side check of the savegame reader. Run: npx -y tsx scripts/check-savegame.mts <save.xml.gz>...
import { openAsBlob } from 'node:fs';
import { readSavegame } from '../src/app/savegame/read-savegame';

for (const path of process.argv.slice(2)) {
	const blob = await openAsBlob(path);
	const started = performance.now();
	try {
		const { info, data } = await readSavegame(blob.stream() as ReadableStream<Uint8Array>, { size: blob.size });
		const seconds = ((performance.now() - started) / 1000).toFixed(1);
		console.log(path);
		console.log(`  player ${info.playerName}, version ${info.gameVersion}, guid ${info.guid}, saveName ${info.saveName}`);
		console.log(`  extractors: ${Object.keys(data).join(', ') || '(none)'}; ${seconds} s`);
	} catch (error) {
		console.log(path);
		console.log(`  ERROR ${error instanceof Error ? error.message : error}`);
	}
}
