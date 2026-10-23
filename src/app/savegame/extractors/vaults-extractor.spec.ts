import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveVaults, VaultsExtractor } from './vaults-extractor';

class VaultsRunner {
	static async read(xml: string): Promise<SaveVaults> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new VaultsExtractor()]);
		return results[VaultsExtractor.KEY] as SaveVaults;
	}

	/** A save with one sector holding the given zones. */
	static save(zones: string): string {
		return (
			'<savegame><universe><component class="galaxy"><connections><connection>' +
			'<component class="cluster"><connections><connection>' +
			`<component class="sector" macro="cluster_18_sector001_macro"><connections>${zones}</connections></component>` +
			'</connection></connections></component></connection></connections></component></universe></savegame>'
		);
	}

	static zone(macro: string, offset: string, objects: string): string {
		return (
			`<connection><component class="zone" macro="${macro}">${offset}` +
			`<connections><connection connection="objects">${objects}</connection></connections></component></connection>`
		);
	}
}

describe('VaultsExtractor', () => {
	it('keeps the predefined zone and reads an opened vault', async () => {
		const vault =
			'<component class="datavault" macro="landmarks_vault_01_macro" knownto="player">' +
			'<removed><connection macro="connection_pickup"/></removed>' +
			'<movement><offset><position x="9" y="9" z="9"/></offset></movement>' +
			'<offset><position x="-2087" y="300" z="2604"/></offset><unlock state="unlocked"/></component>';
		const xml = VaultsRunner.save(
			VaultsRunner.zone('zone004_cluster_18_sector001_macro', '<offset default="1"/>', vault)
		);
		expect(await VaultsRunner.read(xml)).toEqual([
			{
				macro: 'landmarks_vault_01',
				sector: 'cluster_18_sector001',
				zone: 'zone004_cluster_18_sector001',
				x: -2.1,
				y: 0.3,
				z: 2.6,
				known: true,
				unlocked: true,
			},
		]);
	});

	it('adds a temporary zone position and ignores the signal leak inside', async () => {
		const vault =
			'<component class="object" macro="landmarks_erlking_vault_05_macro">' +
			'<offset><position x="1000" y="0" z="-500"/></offset>' +
			'<connections><connection><component class="signalleak" macro="dataleak_xs_vault_01_macro"/></connection></connections>' +
			'</component>';
		const xml = VaultsRunner.save(
			VaultsRunner.zone('tempzone', '<offset><position x="20000" y="0" z="30000"/></offset>', vault)
		);
		expect(await VaultsRunner.read(xml)).toEqual([
			{
				macro: 'landmarks_erlking_vault_05',
				sector: 'cluster_18_sector001',
				x: 21,
				y: 0,
				z: 29.5,
				known: false,
				unlocked: false,
			},
		]);
	});

	it('returns nothing without vaults', async () => {
		expect(await VaultsRunner.read(VaultsRunner.save(''))).toEqual([]);
	});
});
