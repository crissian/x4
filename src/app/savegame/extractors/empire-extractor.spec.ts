import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import type { SaveEmpire } from '../empire/save-empire-model';
import { EmpireExtractor } from './empire-extractor';

class EmpireRunner {
	static async read(xml: string): Promise<SaveEmpire> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new EmpireExtractor()]);
		return results[EmpireExtractor.KEY] as SaveEmpire;
	}

	static component(attrs: string, inner = '', connections = ''): string {
		return `<connection><component ${attrs}>${inner}<connections>${connections}</connections></component></connection>`;
	}

	static sector(macro: string, zoneInner: string, zoneOffset = '<offset default="1"/>'): string {
		return EmpireRunner.component(
			`class="sector" macro="${macro}"`,
			'',
			EmpireRunner.component('class="zone" macro="zone001_macro"', zoneOffset, zoneInner)
		);
	}

	static save(sectors: string, jobs = ''): string {
		return (
			`<savegame><universe><jobs>${jobs}</jobs><component class="galaxy"><connections>${sectors}` +
			`</connections></component></universe><economylog/></savegame>`
		);
	}
}

describe('EmpireExtractor', () => {
	const sector = 'cluster_01_sector001_macro';

	it('links subordinates to their commander ship or station with the group assignment', async () => {
		const carrier = EmpireRunner.component(
			'class="ship_xl" macro="ship_arg_xl_carrier_01_a_macro" code="AAA-001" owner="player" id="[0x1]"',
			'<fleet name="Home Fleet"/><subordinates><group index="1" assignmment="interception"/></subordinates>' +
				'<orders><order id="[0x10]" default="1" order="Wait"/><order id="[0x11]" order="ProtectStation"/></orders>',
			'<connection connection="subordinates" id="[0x2]"><connected connection="[0x5]"/></connection>'
		);
		const fighter = EmpireRunner.component(
			'class="ship_s" macro="ship_arg_s_fighter_01_a_macro" code="BBB-002" owner="player" name="Wing" id="[0x4]"',
			'<subordinate group="1"/><orders><order id="[0x12]" default="1" order="Escort"/></orders>',
			'<connection connection="commander" id="[0x5]"><connected connection="[0x2]"/></connection>'
		);
		const station = EmpireRunner.component(
			'class="station" macro="station_gen_factory_base_01_macro" code="CCC-003" owner="player" id="[0x6]"',
			'<account id="[0x100]" amount="12345" own="1"/>',
			'<connection connection="subordinates" id="[0x7]"/>' +
				EmpireRunner.component(
					'class="storage" macro="storage_x_macro" id="[0x8]"',
					'<cargo><ware ware="energycells" amount="500"/><ware ware="hullparts" amount="20"/></cargo>'
				) +
				EmpireRunner.component(
					'class="storage" macro="storage_y_macro" id="[0x9]"',
					'<cargo><ware ware="energycells" amount="100"/></cargo>'
				)
		);
		const trader = EmpireRunner.component(
			'class="ship_m" macro="ship_arg_m_trans_container_01_a_macro" code="DDD-004" owner="player" id="[0xa]"',
			'<orders><order id="[0x13]" default="1" order="TradeRoutine"/></orders>',
			'<connection connection="commander" id="[0xb]"><connected connection="[0x7]"/></connection>'
		);
		const empire = await EmpireRunner.read(EmpireRunner.save(EmpireRunner.sector(sector, carrier + fighter + station + trader)));

		expect(empire.ships).toEqual([
			{
				id: '[0x1]',
				code: 'AAA-001',
				macro: 'ship_arg_xl_carrier_01_a',
				sector: 'cluster_01_sector001',
				fleet: 'Home Fleet',
				defaultOrder: 'Wait',
				order: 'ProtectStation',
			},
			{
				id: '[0x4]',
				code: 'BBB-002',
				macro: 'ship_arg_s_fighter_01_a',
				sector: 'cluster_01_sector001',
				name: 'Wing',
				defaultOrder: 'Escort',
				commander: '[0x1]',
				assignment: 'interception',
			},
			{
				id: '[0xa]',
				code: 'DDD-004',
				macro: 'ship_arg_m_trans_container_01_a',
				sector: 'cluster_01_sector001',
				defaultOrder: 'TradeRoutine',
				commander: '[0x6]',
			},
		]);
		expect(empire.stations).toEqual([
			{
				id: '[0x6]',
				code: 'CCC-003',
				sector: 'cluster_01_sector001',
				money: 12345,
				storage: { energycells: 600, hullparts: 20 },
			},
		]);
	});

	it('reads ownerless ships with their position and counts Xenon and Kha\'ak ships per sector', async () => {
		const ship = (attrs: string, offset = '') => EmpireRunner.component(attrs, offset);
		const at = (x: number, z: number) => `<offset><position x="${x}" y="0" z="${z}"/></offset>`;
		const ships =
			ship('class="ship_l" macro="ship_par_l_destroyer_01_a_macro" code="ZLK-539" owner="ownerless" id="[0x20]"', at(-1500, 2500)) +
			ship('class="ship_s" macro="ship_xen_s_fighter_01_a_macro" owner="xenon" id="[0x21]"') +
			ship('class="ship_s" macro="ship_xen_s_fighter_01_a_macro" owner="xenon" id="[0x22]"') +
			ship('class="ship_xl" macro="ship_xen_xl_carrier_01_a_macro" owner="xenon" id="[0x23]"') +
			ship('class="ship_m" macro="ship_kha_m_fighter_01_a_macro" owner="khaak" id="[0x24]"') +
			ship('class="ship_xs" macro="ship_gen_xs_cargodrone_01_a_macro" owner="player" id="[0x25]"');
		const empire = await EmpireRunner.read(
			EmpireRunner.save(
				EmpireRunner.sector(sector, ships, at(100000, -50000)),
				// a ship waiting for a job is not in a sector
				ship('class="ship_s" macro="ship_arg_s_scout_01_a_macro" owner="ownerless" id="[0x30]"')
			)
		);

		expect(empire.ownerless).toEqual([
			{ id: '[0x20]', code: 'ZLK-539', macro: 'ship_par_l_destroyer_01_a', sector: 'cluster_01_sector001', x: 98.5, z: -47.5 },
		]);
		expect(empire.hostileShips).toEqual({
			xenon: { cluster_01_sector001: [2, 0, 0, 1] },
			khaak: { cluster_01_sector001: [0, 1, 0, 0] },
		});
		// drones are not ships of the fleet
		expect(empire.ships).toEqual([]);
	});

	it('gives the zone of a ship in a predefined zone, with the position relative to it', async () => {
		const empire = await EmpireRunner.read(
			EmpireRunner.save(
				EmpireRunner.sector(
					sector,
					EmpireRunner.component(
						'class="ship_s" macro="ship_ter_s_heavyfighter_01_a_macro" code="YZZ-825" owner="ownerless" name="{30225,201}" id="[0x40]"',
						'<offset><position x="-15300" z="5100"/></offset>'
					)
				)
			)
		);
		expect(empire.ownerless[0]).toMatchObject({ zone: 'zone001', x: -15.3, z: 5.1, name: '{30225,201}' });
	});
});
