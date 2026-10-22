// Dev only: node-side check of the savegame reader. Run: npx -y tsx scripts/check-savegame.mts <save.xml.gz>...
import { openAsBlob } from 'node:fs';
import { SavegameReader } from '../src/app/savegame/read-savegame';
import { SaveMap, SaveRelations } from '../src/app/savegame/map/save-map-model';
import { Sectors } from '../src/app/shared/services/data/sectors-data';
import { AllWares } from '../src/app/shared/services/data/wares-data';
import type { Sector, Ware } from '../src/app/shared/services/model/model';
import { TradeRouteFinder } from '../src/app/trade/trade-route-finder';
import { TradeShips } from '../src/app/trade/trade-ships';

class CheckSavegame {
	static async run(paths: string[]): Promise<void> {
		for (const path of paths) {
			await CheckSavegame.check(path);
		}
	}

	private static async check(path: string): Promise<void> {
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
			const relations = data['relations'] as SaveRelations | undefined;
			if (map) {
				CheckSavegame.printMap(map);
				CheckSavegame.printRoutes(map, relations);
			}
			if (relations) {
				const hostile = Object.entries(relations)
					.filter(([, value]) => value <= -0.01)
					.map(([faction, value]) => `${faction} ${Number(value.toFixed(3))}`);
				console.log(`  relations: ${Object.keys(relations).length} factions, hostile: ${hostile.join(', ')}`);
			}
		} catch (error) {
			console.log(path);
			console.log(`  ERROR ${error instanceof Error ? error.message : error}`);
		}
	}

	private static printMap(map: SaveMap): void {
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
			map.stations.find((x) => x.code === process.env['STATION']) ?? map.stations.find((x) => x.offers?.length);
		if (sample) {
			console.log(`  sample ${JSON.stringify(sample)}`);
		}
	}

	/** The top routes of the default custom ship, and how long finding them takes. */
	private static printRoutes(map: SaveMap, relations: SaveRelations | undefined): void {
		const ids = new Set(map.sectors.map((x) => x.id));
		const sectors = (Sectors.all as unknown as Sector[]).filter((x) => ids.has(x.id));
		const wares = new Map((AllWares as unknown as Ware[]).map((x) => [x.id, x]));
		const input = {
			map,
			relations,
			sectors,
			ware: (id: string) => {
				const ware = wares.get(id);
				return ware ? TradeShips.wareInfo(ware) : undefined;
			},
			ship: TradeShips.CUSTOM,
			filters: { hideHostile: true, playerOnly: false, hideIllegal: false },
		};
		const started = performance.now();
		const result = TradeRouteFinder.find(input);
		const ms = performance.now() - started;
		console.log(`  trade routes: ${result.total} found, find ${ms.toFixed(0)} ms`);
		const hidden = TradeRouteFinder.find({ ...input, filters: { ...input.filters, hideIllegal: true } });
		// the finder keeps the top routes only, so the illegal ones are counted ware by ware
		const illegal = [...wares.values()]
			.filter((x) => x.illegal?.length)
			.flatMap((x) => TradeRouteFinder.find({ ...input, filters: { ...input.filters, ware: x.id } }).routes)
			.filter((x) => x.illegalSectors.length);
		const ends = (x: (typeof illegal)[number]) =>
			x.illegalSectors.some((id) => id === x.seller.sector || id === x.buyer.sector);
		console.log(
			`  illegal: ${result.total - hidden.total} of ${result.total} routes; ` +
				`${illegal.filter((x) => !ends(x)).length} of the ${illegal.length} top ones by illegal ware are by transit only`
		);
		for (const route of result.routes.slice(0, 10)) {
			console.log(
				`    ${route.ware} ${route.seller.code} > ${route.buyer.code} margin ${route.margin} x ${route.units}` +
					` = ${Math.round(route.profit)} Cr, ${route.jumps} jumps, ${Math.round(route.seconds)} s,` +
					` ${Math.round(route.profitPerMinute)} Cr/min`
			);
		}
	}
}

await CheckSavegame.run(process.argv.slice(2));
