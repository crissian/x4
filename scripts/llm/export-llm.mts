// Writes the llms.txt, markdown pages and JSON data for language models into the build output.
// Runs after `ng build`: npx tsx scripts/llm/export-llm.mts [output dir, default dist/x4-new]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { EntityPages } from './entity-pages';
import { EquipmentPages } from './equipment-pages';
import { FactionPages } from './faction-pages';
import { JsonExport } from './json-export';
import { LlmsTxt } from './llms-txt';
import { ModulePages } from './module-pages';
import { SectorPages } from './sector-pages';
import { ShipPages } from './ship-pages';
import { WarePages } from './ware-pages';

class ExportLlm {
	static run(out: string): void {
		const pages: EntityPages<{ id: string; name: string }>[] = [
			new ShipPages(),
			new EquipmentPages(),
			new WarePages(),
			new ModulePages(),
			new SectorPages(),
			new FactionPages(),
		];
		let files = 0;
		for (const kind of pages) {
			const dir = join(out, 'md', kind.kind);
			mkdirSync(dir, { recursive: true });
			writeFileSync(join(out, 'md', `${kind.kind}.md`), kind.index());
			for (const entity of kind.entities()) {
				writeFileSync(join(dir, `${entity.id}.md`), kind.page(entity));
				files++;
			}
		}
		const json = new JsonExport();
		json.write(out);
		writeFileSync(join(out, 'llms.txt'), LlmsTxt.build(pages, json));
		console.log(`llms.txt, ${files} markdown pages and ${json.datasets.length} JSON files written to ${out}`);
	}
}

ExportLlm.run(process.argv[2] ?? 'dist/x4-new');
