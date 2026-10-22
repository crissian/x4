import { Layout } from '../../shared/services/module-config';
import { ModuleService } from '../../shared/services/module.service';
import { PLAYER_HQ_MACRO, importConstructionPlans } from './construction-plans';
import { AGREFITS_PLAN } from './testdata/agrefits-plan';

describe('importConstructionPlans', () => {
	let saved: Layout[];
	const moduleService = new ModuleService();
	const importXml = (xml: string) => importConstructionPlans(xml, moduleService, (layout) => saved.push(layout));

	// macros known to exist in modules-data.ts
	const macroA = 'prod_arg_medicalsupplies_macro';
	const macroB = 'dockarea_arg_m_station_02_macro';

	function entry(macro: string): string {
		return `<entry index="1" macro="${macro}"/>`;
	}

	beforeEach(() => {
		saved = [];
	});

	it('imports a single <plan> with multiple entries (the reported bug)', () => {
		const result = importXml(`<plans><plan name="medgoods">${entry(macroA)}${entry(macroB)}</plan></plans>`);

		expect(result.error).toBeNull();
		expect(result.layouts).toEqual(['medgoods']);
		expect(saved.length).toBe(1);
		expect(saved[0].name).toBe('medgoods');
		expect(saved[0].config.length).toBe(2); // two distinct modules
	});

	it('imports a single <plan> with a single <entry> (entry-object case)', () => {
		const result = importXml(`<plans><plan name="solo">${entry(macroA)}</plan></plans>`);

		expect(result.error).toBeNull();
		expect(result.layouts).toEqual(['solo']);
		expect(saved[0].config.length).toBe(1);
	});

	it('still imports multiple <plan> elements (backwards compatible)', () => {
		const result = importXml(
			`<plans>` +
				`<plan name="p1">${entry(macroA)}</plan>` +
				`<plan name="p2">${entry(macroB)}</plan>` +
				`</plans>`
		);

		expect(result.error).toBeNull();
		expect(result.layouts).toEqual(['p1', 'p2']);
		expect(saved.length).toBe(2);
	});

	it('aggregates count for repeated macros and ignores unknown macros', () => {
		const result = importXml(
			`<plans><plan name="agg">` +
				`${entry(macroA)}${entry(macroA)}${entry('does_not_exist_macro')}` +
				`</plan></plans>`
		);

		expect(result.error).toBeNull();
		expect(saved[0].config.length).toBe(1); // unknown macro skipped
		expect(saved[0].config[0].count).toBe(2); // duplicate aggregated
	});

	it('imports an exported 8.00 plan including the Antigone landmark modules', () => {
		const result = importXml(AGREFITS_PLAN);

		expect(result.error).toBeNull();
		expect(result.layouts).toEqual(['Agrefits']);
		const count = saved[0].config.reduce((sum, x) => sum + x.count, 0);
		expect(count).toBe(100); // every entry matched a module
		expect(saved[0].isHeadquarters).toBeUndefined();
	});

	it('turns the player HQ landmark into the Headquarters setting', () => {
		importXml(`<plans><plan name="hq">${entry(PLAYER_HQ_MACRO)}${entry(macroA)}</plan></plans>`);

		expect(saved[0].isHeadquarters).toBe(true);
		expect(saved[0].config.length).toBe(1);
	});

	it('returns the imported layout names sorted case-insensitively', () => {
		const result = importXml(
			`<plans>` +
				`<plan name="beta">${entry(macroA)}</plan>` +
				`<plan name="Alpha">${entry(macroA)}</plan>` +
				`<plan name="gamma">${entry(macroA)}</plan>` +
				`</plans>`
		);

		expect(result.layouts).toEqual(['Alpha', 'beta', 'gamma']);
	});

	it('reports an error on malformed XML', () => {
		const result = importXml(`not valid <<< xml`);
		expect(result.error).toBeTruthy();
	});
});
