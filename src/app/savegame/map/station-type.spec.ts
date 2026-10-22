import type { SaveStation } from './save-map-model';
import { StationTypes, type StationModuleInfo } from './station-type';

const MODULES: Record<string, StationModuleInfo> = {
	buildmodule_gen_ships_xl: { type: 'Build Module', macro: 'buildmodule_gen_ships_xl_macro', product: [] },
	buildmodule_gen_ships_l: { type: 'Build Module', macro: 'buildmodule_gen_ships_l_macro', product: [] },
	buildmodule_gen_ships_m_dockarea_01: { type: 'Build Module', macro: 'x', product: [] },
	buildmodule_gen_equip_l: { type: 'Build Module', macro: 'x', product: [] },
	defence_arg_disc_01: { type: 'Defense Module', macro: 'x', product: [] },
	prod_gen_energycells: { type: 'Production', macro: 'x', product: ['energycells'] },
	proc_gen_scrapworks: { type: 'Processing', macro: 'x', product: ['scrap'] },
};
const lookup = (id: string) => MODULES[id];
const types = new StationTypes(lookup);

function station(macro: string, modules: string[] = [], extra: Partial<SaveStation> = {}): SaveStation {
	return { code: 'ABC-123', macro, owner: 'player', sector: 's', x: 0, z: 0, known: true, modules, ...extra };
}

describe('StationTypes', () => {
	it('recognises pirate bases and trading stations by macro', () => {
		expect(types.of(station('station_gen_piratebase_01'))).toBe('piratebase');
		expect(types.of(station('station_pir_piratebase_02', ['prod_gen_energycells']))).toBe('piratebase');
		expect(types.of(station('station_par_tradestation_01'))).toBe('tradestation');
	});

	it('recognises ship build modules', () => {
		expect(types.of(station('m', ['buildmodule_gen_ships_l']))).toBe('shipyard');
		expect(types.of(station('m', ['buildmodule_gen_ships_xl', 'buildmodule_gen_ships_m_dockarea_01']))).toBe(
			'shipyard'
		);
		expect(types.of(station('m', ['buildmodule_gen_ships_m_dockarea_01']))).toBe('wharf');
	});

	it('recognises equipment build modules', () => {
		expect(types.of(station('m', ['buildmodule_gen_equip_l']))).toBe('equipmentdock');
	});

	it('recognises defence stations by modules or basename', () => {
		expect(types.of(station('m', ['defence_arg_disc_01']))).toBe('defence');
		expect(types.of(station('m', [], { basename: '{20102,1201}' }))).toBe('defence');
		expect(types.of(station('m', [], { basename: '{20102,6501}' }))).toBe('defence');
		expect(types.of(station('m', [], { basename: '{20102, 2201}' }))).toBe('defence');
		expect(types.of(station('m', [], { basename: '{20102,6131}' }))).toBe('other');
		expect(types.of(station('m', ['defence_arg_disc_01', 'prod_gen_energycells']))).toBe('factory');
	});

	it('recognises factories and others', () => {
		expect(types.of(station('m', ['prod_gen_energycells']))).toBe('factory');
		expect(types.of(station('m', ['proc_gen_scrapworks']))).toBe('factory');
		expect(types.of(station('m'))).toBe('other');
		expect(types.of(station('m', ['unknown_module']))).toBe('other');
	});

	it('types wrecks as other, whatever they were built as', () => {
		expect(types.of(station('station_gen_tradestation_01', [], { state: 'wreck' }))).toBe('other');
		expect(types.of(station('m', ['buildmodule_gen_ships_l'], { state: 'wreck' }))).toBe('other');
		expect(types.of(station('m', ['buildmodule_gen_ships_l'], { state: 'construction' }))).toBe('shipyard');
	});
});
