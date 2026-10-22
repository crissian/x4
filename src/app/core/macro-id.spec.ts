import { MacroId } from './macro-id';

describe('MacroId', () => {
	it('lowercases and drops the _macro suffix', () => {
		expect(MacroId.of('Zone004_Cluster_409_Sector001_macro')).toBe('zone004_cluster_409_sector001');
		expect(MacroId.of('buildmodule_gen_ships_l_MACRO')).toBe('buildmodule_gen_ships_l');
		expect(MacroId.of('station_gen_factory_01')).toBe('station_gen_factory_01');
	});
});
