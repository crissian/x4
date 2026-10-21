import { Layout } from '../../shared/services/module-config';
import { ModuleService } from '../../shared/services/module.service';
import { importConstructionPlans } from './construction-plans';

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

	it('reports an error on malformed XML', () => {
		const result = importXml(`not valid <<< xml`);
		expect(result.error).toBeTruthy();
	});
});
