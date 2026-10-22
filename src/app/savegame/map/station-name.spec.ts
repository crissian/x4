import type { SaveStation } from './save-map-model';
import { StationNamer, type NamingTables } from './station-name';
import type { StationModuleInfo } from './station-type';

const TEXTS: Record<string, string> = {
	'{20102,1001}': 'Factory',
	'{20102,1041}': 'Defence Platform',
	'{20102,1061}': 'Equipment Dock',
	'{20102,1071}': 'Shipyard',
	'{20102,1081}': 'Wharf',
	'{20102,1091}': 'Scrap Processing Factory',
	'{20102,1441}': 'Xenon Wharf',
	'{20102,2011}': 'Headquarters',
};
const GROUPS: Record<string, { factoryName: string; priority: number }> = {
	microchips: { factoryName: 'High Tech Factory', priority: 10 },
	smartchips: { factoryName: 'High Tech Factory', priority: 10 },
	refinedmetals: { factoryName: 'Refined Goods Complex', priority: 4 },
	energycells: { factoryName: 'Energy Complex', priority: 1 },
};
const MODULES: Record<string, StationModuleInfo> = {
	buildmodule_gen_ships_l: { type: 'Build Module', macro: 'x', product: [] },
	buildmodule_gen_ships_m: { type: 'Build Module', macro: 'x', product: [] },
	buildmodule_gen_equip_l: { type: 'Build Module', macro: 'x', product: [] },
	defence_arg_disc_01: { type: 'Defense Module', macro: 'x', product: [] },
	prod_gen_energycells: { type: 'Production', macro: 'x', product: ['energycells'] },
	prod_gen_refinedmetals: { type: 'Production', macro: 'x', product: ['refinedmetals'] },
	prod_gen_microchips: { type: 'Production', macro: 'x', product: ['microchips'] },
	prod_gen_smartchips: { type: 'Production', macro: 'x', product: ['smartchips'] },
	proc_gen_scrapworks: { type: 'Processing', macro: 'x', product: ['scrap'] },
	storage_gen_m_01: { type: 'Storage', macro: 'x', product: [] },
};

const tables: NamingTables = {
	factionShort: (owner) => ({ xenon: 'XEN', teladi: 'TEL', freesplit: 'FRF' })[owner],
	sectorName: (sector) => ({ s1: "Heretic's End" })[sector],
	text: (ref) => TEXTS[ref],
	macroName: (macro) => ({ station_gen_tradestation_01: 'Trading Station' })[macro],
	wareFactoryName: (ware) => ({ energycells: 'Solar Power Plant' })[ware],
	wareGroup: (ware) => GROUPS[ware],
	module: (id) => MODULES[id],
};

const namer = new StationNamer(tables);

function station(extra: Partial<SaveStation>): SaveStation {
	return {
		code: 'ABC-123',
		macro: 'station_gen_factory_base_01',
		owner: 'player',
		sector: 's1',
		x: 0,
		z: 0,
		known: true,
		modules: [],
		...extra,
	};
}

describe('StationNamer', () => {
	it('names NPC stations after their base name', () => {
		expect(namer.name(station({ owner: 'xenon', basename: '{20102,1441}' }))).toBe('XEN Xenon Wharf');
	});

	it('uses the original product factory name', () => {
		expect(namer.name(station({ owner: 'freesplit', product: 'energycells' }))).toBe('FRF Solar Power Plant');
	});

	it('uses the macro name', () => {
		const npc = station({ owner: 'teladi', macro: 'station_gen_tradestation_01' });
		expect(namer.name(npc)).toBe('TEL Trading Station');
	});

	it('guesses from the products of the modules', () => {
		const npc = station({ owner: 'teladi', modules: ['prod_gen_refinedmetals'] });
		expect(namer.name(npc)).toBe('TEL Refined Goods Complex');
	});

	it('names player shipyards, wharfs and equipment docks with a numeral', () => {
		const name = (modules: string[], nameIndex: number) => namer.name(station({ nameIndex, modules }));
		expect(name(['buildmodule_gen_ships_l'], 1)).toBe("Heretic's End Shipyard I");
		expect(name(['buildmodule_gen_ships_m'], 2)).toBe("Heretic's End Wharf II");
		expect(name(['buildmodule_gen_equip_l'], 3)).toBe("Heretic's End Equipment Dock III");
	});

	it('names scrap stations after the scrap ware factory or the generic text', () => {
		const scrap = station({ nameIndex: 1, modules: ['proc_gen_scrapworks'] });
		expect(namer.name(scrap)).toBe("Heretic's End Scrap Processing Factory I");
		const own = { ...tables, wareFactoryName: (ware: string) => (ware === 'scrap' ? 'Recycler' : undefined) };
		expect(new StationNamer(own).name(scrap)).toBe("Heretic's End Recycler I");
	});

	it('names production stations after the group with the highest priority', () => {
		const modules = ['prod_gen_microchips', 'prod_gen_smartchips', 'prod_gen_refinedmetals'];
		expect(namer.name(station({ nameIndex: 4, modules }))).toBe("Heretic's End High Tech Factory IV");
	});

	it('names defence stations', () => {
		expect(namer.name(station({ nameIndex: 2, modules: ['defence_arg_disc_01'] }))).toBe(
			"Heretic's End Defence Platform II"
		);
	});

	it('names a player station with only storage modules like a factory', () => {
		expect(namer.name(station({ nameIndex: 1, modules: ['storage_gen_m_01'] }))).toBe("Heretic's End Factory I");
	});

	it('looks module ids up in lowercase', () => {
		expect(namer.name(station({ nameIndex: 2, modules: ['DEFENCE_ARG_DISC_01'] }))).toBe(
			"Heretic's End Defence Platform II"
		);
	});

	it('names an empty player station without a numeral', () => {
		expect(namer.name(station({ nameIndex: 5 }))).toBe("Heretic's End Factory");
	});

	it('names the headquarters by its base name', () => {
		expect(namer.name(station({ basename: '{20102,2011}', nameIndex: 1 }))).toBe('Headquarters');
	});

	it('prefers a literal name', () => {
		expect(namer.name(station({ owner: 'teladi', name: 'ANT Argon Raumdock' }))).toBe('ANT Argon Raumdock');
	});

	it('resolves a text reference name and skips an unresolved one', () => {
		expect(namer.name(station({ owner: 'teladi', name: '{20102,1441}' }))).toBe('Xenon Wharf');
		const unresolved = station({ owner: 'teladi', name: '{20102,9999}', product: 'energycells' });
		expect(namer.name(unresolved)).toBe('TEL Solar Power Plant');
	});

	it('falls back when tables lack the module, ware and text', () => {
		const empty: NamingTables = {
			factionShort: () => undefined,
			sectorName: () => undefined,
			text: () => undefined,
			macroName: () => undefined,
			wareFactoryName: () => undefined,
			wareGroup: () => undefined,
			module: () => undefined,
		};
		for (const owner of ['player', 'teladi']) {
			const lost = station({
				owner,
				name: '{1,2}',
				basename: '{3,4}',
				product: 'x',
				modules: ['unknown_macro'],
				nameIndex: 1,
			});
			const name = new StationNamer(empty).name(lost);
			expect(name).toBe('ABC-123');
			expect(name).not.toContain('{');
		}
	});
});
