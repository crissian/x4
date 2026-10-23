import { describe, expect, it } from 'vitest';
import { XmlExtractorRunner } from '../../core/xml/xml-extractor';
import { SaveShip } from '../map/save-map-model';
import { ShipsExtractor } from './ships-extractor';

class ShipsRunner {
	static async read(xml: string): Promise<SaveShip[]> {
		const stream = new ReadableStream<string>({
			start(controller) {
				controller.enqueue(xml);
				controller.close();
			},
		});
		const results = await XmlExtractorRunner.run(stream, [new ShipsExtractor()]);
		return results['ships'] as SaveShip[];
	}

	static engine(macro: string): string {
		return `<connection connection="con_engine_01"><component class="engine" macro="${macro}" id="[0x9]"/></connection>`;
	}

	static ship(attrs: string, inner = ''): string {
		return `<connection connection="space"><component ${attrs}><connections>${inner}</connections></component></connection>`;
	}

	static sector(macro: string, ships: string): string {
		return (
			`<connection><component class="sector" macro="${macro}"><connections><connection>` +
			`<component class="zone" macro="zone001_macro"><connections>${ships}</connections></component>` +
			`</connection></connections></component></connection>`
		);
	}

	static save(sectors: string): string {
		return `<savegame><universe><component class="galaxy"><connections>${sectors}</connections></component></universe><economylog/></savegame>`;
	}
}

describe('ShipsExtractor', () => {
	const engine = ShipsRunner.engine('engine_par_m_combat_01_mk2_macro');

	it('reads the player ships with their sector, name and installed engines', async () => {
		const xml = ShipsRunner.save(
			ShipsRunner.sector(
				'cluster_24_sector001_macro',
				ShipsRunner.ship(
					'class="ship_m" macro="ship_par_m_miner_liquid_01_b_macro" code="YPK-210" owner="player" ' +
						'thruster="thruster_gen_m_combat_01_mk2_macro" id="[0x48a13]"',
					engine + engine
				) +
					ShipsRunner.ship(
						'class="ship_s" macro="ship_par_s_scout_01_b_macro" code="MPA-451" owner="argon" id="[0x2]"',
						engine
					)
			) +
				ShipsRunner.sector(
					'cluster_29_sector001_macro',
					ShipsRunner.ship(
						'class="ship_l" macro="Ship_Arg_L_Trans_Container_04_a_macro" code="ABC-001" owner="player" name="Hauler 1" id="[0x3]"'
					)
				)
		);
		expect(await ShipsRunner.read(xml)).toEqual([
			{
				id: '[0x48a13]',
				code: 'YPK-210',
				macro: 'ship_par_m_miner_liquid_01_b',
				sector: 'cluster_24_sector001',
				engine: 'engine_par_m_combat_01_mk2',
				engines: 2,
				thruster: 'thruster_gen_m_combat_01_mk2',
			},
			{
				id: '[0x3]',
				code: 'ABC-001',
				macro: 'ship_arg_l_trans_container_04_a',
				sector: 'cluster_29_sector001',
				name: 'Hauler 1',
			},
		]);
	});

	it('keeps the engines of a docked ship with that ship', async () => {
		const docked = ShipsRunner.ship(
			'class="ship_s" macro="ship_arg_s_fighter_01_a_macro" code="S-1" owner="player" id="[0x5]"',
			ShipsRunner.engine('engine_arg_s_combat_01_mk1_macro')
		);
		const carrier = ShipsRunner.ship(
			'class="ship_xl" macro="ship_arg_xl_carrier_01_a_macro" code="XL-1" owner="player" id="[0x4]"',
			ShipsRunner.engine('engine_arg_xl_allround_01_mk1_macro') +
				`<connection connection="con_dock"><component class="dockingbay" id="[0x6]"><connections>${docked}</connections></component></connection>`
		);
		const ships = await ShipsRunner.read(ShipsRunner.save(ShipsRunner.sector('cluster_01_sector001_macro', carrier)));
		expect(ships.map((x) => [x.code, x.engine, x.engines])).toEqual([
			['XL-1', 'engine_arg_xl_allround_01_mk1', 1],
			['S-1', 'engine_arg_s_combat_01_mk1', 1],
		]);
	});

	it('leaves out drones and ships outside a sector', async () => {
		const xml = ShipsRunner.save(
			ShipsRunner.sector(
				'cluster_01_sector001_macro',
				ShipsRunner.ship('class="ship_xs" macro="ship_gen_xs_cargodrone_empty_01_a_macro" owner="player" id="[0x7]"')
			) + ShipsRunner.ship('class="ship_s" macro="ship_arg_s_scout_01_a_macro" owner="player" id="[0x8]"')
		);
		expect(await ShipsRunner.read(xml)).toEqual([]);
	});
});
