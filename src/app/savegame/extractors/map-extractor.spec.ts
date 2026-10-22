import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveMap } from '../map/save-map-model';
import { MAP_FIXTURE } from '../testdata/map-fixture';
import { MapExtractor } from './map-extractor';

function textStream(...chunks: string[]): ReadableStream<string> {
	return new ReadableStream<string>({
		start(controller) {
			chunks.forEach((chunk) => controller.enqueue(chunk));
			controller.close();
		},
	});
}

async function readMap(...chunks: string[]): Promise<SaveMap> {
	const results = await XmlExtractorRunner.run(textStream(...chunks), [new MapExtractor()]);
	return results['map'] as SaveMap;
}

describe('MapExtractor', () => {
	it('reads sector owner, contested and known', async () => {
		const map = await readMap(MAP_FIXTURE);
		expect(map.sectors).toEqual([{ id: 'cluster_409_sector001', owner: 'freesplit', contested: true, known: true }]);
	});

	it('adds the tempzone position to the station', async () => {
		const station = (await readMap(MAP_FIXTURE)).stations.find((s) => s.code === 'ACZ-528')!;
		expect(station).toMatchObject({ macro: 'station_gen_factory_base_01', sector: 'cluster_409_sector001', x: -14, z: 24.3 });
		expect(station.zone).toBeUndefined();
		expect(station.product).toBe('smartchips');
	});

	it('places a station without position at its zone', async () => {
		const station = (await readMap(MAP_FIXTURE)).stations.find((s) => s.code === 'XUS-725')!;
		expect(station).toMatchObject({ x: 20, z: -30, state: 'construction', known: false });
		expect(station.zone).toBeUndefined();
	});

	it('keeps the predefined zone id for default zones', async () => {
		const station = (await readMap(MAP_FIXTURE)).stations.find((s) => s.code === 'HIB-700')!;
		expect(station).toMatchObject({ zone: 'zone004_cluster_409_sector001', x: 3, z: -4, product: 'energycells' });
	});

	it('reads naming ingredients and distinct modules', async () => {
		const stations = (await readMap(MAP_FIXTURE)).stations;
		const split = stations.find((s) => s.code === 'HIB-700')!;
		expect(split).toMatchObject({ name: '{20103,2001}', basename: '{20103,2001}' });
		expect(split.modules).toEqual(['prod_gen_energycells_01', 'dock_arg_m_01']);
		expect(stations.find((s) => s.code === 'ACZ-528')!.modules).toEqual(['pier_spl_harbor_01', 'prod_gen_energycells_01']);
		const player = stations.find((s) => s.code === 'PLR-001')!;
		expect(player).toMatchObject({ owner: 'player', nameIndex: 2, known: true, x: 55.6, z: -12.3 });
		expect('name' in player).toBe(false);
		expect('product' in player).toBe(false);
		expect(player.modules).toEqual([]);
	});

	it('counts player ships per sector including docked ones', async () => {
		expect((await readMap(MAP_FIXTURE)).playerShips).toEqual({ cluster_409_sector001: [0, 1, 0, 1, 0] });
	});

	it('ignores build plots and job ships', async () => {
		const map = await readMap(MAP_FIXTURE);
		expect(map.stations).toHaveLength(4);
		expect(Object.keys(map.playerShips)).toEqual(['cluster_409_sector001']);
	});

	it('gives the same result when fed in 7-character chunks', async () => {
		const chunks = MAP_FIXTURE.match(/[\s\S]{1,7}/g)!;
		expect(await readMap(...chunks)).toEqual(await readMap(MAP_FIXTURE));
	});
});
