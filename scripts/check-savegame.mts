// Dev only: node-side check of the savegame reader. Run: npx -y tsx scripts/check-savegame.mts <save.xml.gz>...
import { openAsBlob } from 'node:fs';
import { SavegameReader } from '../src/app/savegame/read-savegame';
import { SaveMap } from '../src/app/savegame/map/save-map-model';

for (const path of process.argv.slice(2)) {
	const blob = await openAsBlob(path);
	const started = performance.now();
	try {
		const { info, data } = await SavegameReader.read(blob.stream() as ReadableStream<Uint8Array>, {
			size: blob.size,
		});
		const seconds = ((performance.now() - started) / 1000).toFixed(1);
		console.log(path);
		console.log(
			`  player ${info.playerName}, version ${info.gameVersion}, guid ${info.guid}, saveName ${info.saveName}`
		);
		console.log(`  extractors: ${Object.keys(data).join(', ') || '(none)'}; ${seconds} s`);
		const map = data['map'] as SaveMap | undefined;
		if (map) {
			const ships = Object.values(map.playerShips).reduce(
				(sum, counts) => sum + counts.reduce((a, b) => a + b, 0),
				0
			);
			console.log(`  map: ${map.sectors.length} sectors, ${map.stations.length} stations, ${ships} player ships`);
			const kb = (JSON.stringify(map).length / 1024).toFixed(0);
			console.log(`  map data: ${kb} kB as JSON`);
			const offers = map.stations.flatMap((x) => x.offers ?? []);
			const trading = map.stations.filter((x) => x.offers?.length).length;
			const sells = offers.filter((x) => x.sell).length;
			const playerOnly = offers.filter((x) => x.playerOnly).length;
			console.log(`  offers: ${offers.length} (${sells} sell, ${playerOnly} player only) at ${trading} stations`);
			const sample =
				map.stations.find((x) => x.code === process.env['STATION']) ??
				map.stations.find((x) => x.offers?.length);
			if (sample) {
				console.log(`  sample ${JSON.stringify(sample)}`);
			}
		}
	} catch (error) {
		console.log(path);
		console.log(`  ERROR ${error instanceof Error ? error.message : error}`);
	}
}
