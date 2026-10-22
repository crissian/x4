// Dev only: node-side check of the station suggestions. Run: npx -y tsx scripts/check-suggestions.mts <save.xml.gz>...
import { openAsBlob } from 'node:fs';
import { SavegameReader } from '../src/app/savegame/read-savegame';
import type { SaveMap, SaveRelations } from '../src/app/savegame/map/save-map-model';
import { Economy } from '../src/app/economy/economy';
import { PlacementContext } from '../src/app/economy/placement-context';
import type { PlacementOptions, PlacementSpot } from '../src/app/economy/placement-model';
import { PlacementRanking } from '../src/app/economy/placement-ranking';
import { PlacementRecipes } from '../src/app/economy/placement-recipes';
import { WareClasses } from '../src/app/economy/ware-classes';
import { ModuleService } from '../src/app/shared/services/module.service';
import { ShipService } from '../src/app/shared/services/ship.service';
import { WareService } from '../src/app/shared/services/ware.service';
import { Sectors } from '../src/app/shared/services/data/sectors-data';
import type { Sector } from '../src/app/shared/services/model/model';

class CheckSuggestions {
	static readonly ARGON_PRIME = 'cluster_14_sector001';
	static readonly GETSU_FUNE = 'cluster_48_sector001';
	static readonly OPTIONS: PlacementOptions = { loop: 'closed', jumps: 3, hideHostile: true, includePlayer: true };
	static readonly OPEN: PlacementOptions = { ...CheckSuggestions.OPTIONS, loop: 'open' };

	static async run(paths: string[]): Promise<void> {
		for (const path of paths) {
			const blob = await openAsBlob(path);
			const { data } = await SavegameReader.read(blob.stream() as ReadableStream<Uint8Array>, {
				size: blob.size,
			});
			console.log(path);
			const map = data['map'] as SaveMap | undefined;
			if (map) {
				CheckSuggestions.check(map, data['relations'] as SaveRelations | undefined);
			}
		}
	}

	private static check(map: SaveMap, relations: SaveRelations | undefined): void {
		const sectors = Sectors.all as unknown as Sector[];
		const wares = new WareService();
		const modules = new ModuleService();
		const building = WareClasses.buildingMaterials(
			new ShipService().getEntities(),
			modules.getEntities(),
			wares.getEntities()
		);
		const names = new Map(sectors.map((x) => [x.id, x.name]));
		const name = (id: string) => names.get(id) ?? id;
		const economy = new Economy(map, wares, modules, sectors, building);
		economy.rows();

		let started = performance.now();
		const context = new PlacementContext(
			economy,
			wares,
			new PlacementRecipes(wares, modules),
			sectors,
			map,
			relations,
			building.only
		);
		const candidates = context.candidates();
		const where = PlacementRanking.where(context, candidates, CheckSuggestions.OPTIONS);
		const whereMs = performance.now() - started;
		started = performance.now();
		const here = PlacementRanking.here(context, CheckSuggestions.ARGON_PRIME, candidates, CheckSuggestions.OPTIONS);
		const hereMs = performance.now() - started;

		const line = (x: PlacementSpot) =>
			`    ${x.ware.padEnd(22)} ${name(x.sector).padEnd(26)} ${Math.round(x.crPerHour).toString().padStart(10)} Cr/h` +
			` ~${x.modules} modules, absorbs ${Math.round(x.absorbable)}/h, coverage ${x.coverage.toFixed(2)},` +
			` security ${x.security ?? '-'}; ` +
			x.targets
				.filter((y) => y.pull > 0)
				.slice(0, 2)
				.map((y) => `${name(y.sector)} ${y.jumps} jumps`)
				.join(', ');
		console.log(
			`  where to build: ${where.total} spots for ${candidates.length} wares in ${whereMs.toFixed(0)} ms` +
				` (incl. context); Argon Prime ${hereMs.toFixed(0)} ms`
		);
		console.log('  top 10 galaxy-wide, closed loop:');
		where.spots.slice(0, 10).forEach((x) => console.log(line(x)));
		const first = where.spots[0];
		const recipe0 = first && context.recipes.recipe(first.ware);
		if (first && recipe0) {
			const chain = context.recipes.chains.chain(
				recipe0.module,
				first.modules,
				context.sector(first.sector)?.sunlight ?? 1
			);
			console.log(
				`    chain of #1: ${chain.modules.map((x) => `${x.moduleId} x${x.count}`).join(', ')}; workforce ${chain.workforce}`
			);
			console.log(
				`    mined: ${chain.mined.map((x) => `${x.ware} ${Math.round(x.amount)}/h`).join(', ') || '-'}; missing: ${chain.missing.join(', ') || '-'}`
			);
			console.log(
				`    resources: ${first.resources.map((x) => `${x.ware} ${x.jumps ?? 'x'}`).join(', ') || '-'}`
			);
		}
		started = performance.now();
		const open = PlacementRanking.where(context, candidates, CheckSuggestions.OPEN);
		console.log(`  top 10 galaxy-wide, buy inputs (${(performance.now() - started).toFixed(0)} ms):`);
		open.spots.slice(0, 10).forEach((x) => console.log(line(x)));
		const sample = context.recipes.recipe('hullparts');
		if (sample) {
			started = performance.now();
			const chain = context.recipes.chains.chain(sample.module, 10, 1);
			console.log(
				`  hullparts x10 chain (${(performance.now() - started).toFixed(0)} ms): ${chain.modules.map((x) => `${x.moduleId} x${x.count}`).join(', ')}; mined ${chain.mined.map((x) => x.ware).join(', ')}`
			);
		}
		console.log(`  top 5 in Argon Prime (${here.total} wares):`);
		here.spots.slice(0, 5).forEach((x) => console.log(line(x)));

		const mre = PlacementRanking.greedy(context, 'terranmre', CheckSuggestions.OPTIONS);
		console.log(
			`  terranmre: ${mre.length} spots; Getsu Fune own net ${Math.round(context.localNet('terranmre', true).get(CheckSuggestions.GETSU_FUNE) ?? 0)}/h`
		);
		mre.slice(0, 5).forEach((x) => console.log(line(x)));
		const recipe = context.recipes.recipe('terranmre');
		const net = context.localNet('terranmre', true);
		const around = context
			.reach(CheckSuggestions.GETSU_FUNE, 3)
			.filter((x) => net.get(x.sector))
			.map((x) => `${name(x.sector)} ${x.jumps}j ${Math.round(net.get(x.sector)!)}`);
		console.log(
			`  terranmre module ${recipe?.module} ${Math.round(recipe?.output ?? 0)}/h; around Getsu Fune: ${around.join(', ')}`
		);
		const prime = mre.findIndex((x) => x.sector === CheckSuggestions.ARGON_PRIME);
		console.log(`  terranmre in Argon Prime: ${prime < 0 ? 'not listed' : `#${prime + 1}`}`);
	}
}

await CheckSuggestions.run(process.argv.slice(2));
