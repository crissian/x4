import type { SaveStation } from '../../savegame/map/save-map-model';
import { Size } from '../../shared/services/data/size-data';
import type { GodStation } from '../../shared/services/model/model';
import { ShipBuildClasses } from './ship-build-classes';

describe('ShipBuildClasses', () => {
	it('reads the ship sizes from the build module ids', () => {
		expect(ShipBuildClasses.ofModule('buildmodule_gen_ships_s')).toEqual([Size.small]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_ships_m')).toEqual([Size.medium]);
		expect(ShipBuildClasses.ofModule('buildmodule_arg_ships_m_dockarea_01')).toEqual([Size.small, Size.medium]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_ships_l')).toEqual([Size.large]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_ships_xl')).toEqual([Size.extralarge]);
		expect(ShipBuildClasses.ofModule('buildmodule_xen_ships_xl')).toEqual([Size.large, Size.extralarge]);
	});

	it('gives no ship sizes for equipment, carrier and other modules', () => {
		expect(ShipBuildClasses.ofModule('buildmodule_gen_equip_l')).toEqual([]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_equip_m_dockarea_01')).toEqual([]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_carrier')).toEqual([]);
		expect(ShipBuildClasses.ofModule('buildmodule_gen_stations_01')).toEqual([]);
		expect(ShipBuildClasses.ofModule('prod_gen_energycells')).toEqual([]);
	});

	it('joins the sizes of a save station, ignoring case', () => {
		const station = {
			modules: ['BuildModule_Gen_Ships_L', 'buildmodule_gen_ships_xl', 'buildmodule_gen_ships_l', 'dockarea_arg_m_01'],
		} as SaveStation;
		expect(ShipBuildClasses.ofSave(station)).toEqual([Size.large, Size.extralarge]);
	});

	it('uses the station type at game start, with the XL only shipyards', () => {
		const god = (id: string, type: GodStation['type']) => ({ id, type, sector: 's', version: 0 }) as GodStation;
		expect(ShipBuildClasses.ofGameStart(god('wharf_argon_01', 'wharf'))).toEqual([Size.small, Size.medium]);
		expect(ShipBuildClasses.ofGameStart(god('shipyard_argon_01', 'shipyard'))).toEqual([Size.large, Size.extralarge]);
		expect(ShipBuildClasses.ofGameStart(god('shipyard_alliance', 'shipyard'))).toEqual([Size.extralarge]);
		expect(ShipBuildClasses.ofGameStart(god('shipyard_split_warforge_01', 'shipyard'))).toEqual([Size.extralarge]);
		expect(ShipBuildClasses.ofGameStart(god('equipmentdock_argon_01', 'equipmentdock'))).toEqual([]);
	});
});
