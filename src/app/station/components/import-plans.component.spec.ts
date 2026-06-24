import { ImportPlansComponent } from './import-plans.component';
import { ModuleService } from '../../shared/services/module.service';
import { Layout } from '../../shared/services/module-config';

describe('ImportPlansComponent import', () => {
    let component: ImportPlansComponent;
    let saved: Layout[];
    let closeArg: any;

    // A macro known to exist in modules-data.ts
    const macroA = 'prod_arg_medicalsupplies_macro';
    const macroB = 'dockarea_arg_m_station_02_macro';

    function entry(macro: string): string {
        return `<entry index="1" macro="${macro}"/>`;
    }

    beforeEach(() => {
        saved = [];
        closeArg = undefined;
        const activeModal: any = { close: (a: any) => (closeArg = a) };
        const layoutService: any = {
            saveLayout: (l: Layout) => saved.push(l),
            getLayouts: () => []
        };
        component = new ImportPlansComponent(activeModal, new ModuleService(), layoutService);
    });

    it('imports a single <plan> with multiple entries (the reported bug)', () => {
        component.xml =
            `<plans><plan name="medgoods">${entry(macroA)}${entry(macroB)}</plan></plans>`;
        component.importPlans();

        expect(closeArg.error).toBeNull();
        expect(closeArg.layouts).toEqual(['medgoods']);
        expect(saved.length).toBe(1);
        expect(saved[0].name).toBe('medgoods');
        expect(saved[0].config.length).toBe(2); // two distinct modules
    });

    it('imports a single <plan> with a single <entry> (entry-object case)', () => {
        component.xml = `<plans><plan name="solo">${entry(macroA)}</plan></plans>`;
        component.importPlans();

        expect(closeArg.error).toBeNull();
        expect(closeArg.layouts).toEqual(['solo']);
        expect(saved[0].config.length).toBe(1);
    });

    it('still imports multiple <plan> elements (backwards compatible)', () => {
        component.xml =
            `<plans>` +
            `<plan name="p1">${entry(macroA)}</plan>` +
            `<plan name="p2">${entry(macroB)}</plan>` +
            `</plans>`;
        component.importPlans();

        expect(closeArg.error).toBeNull();
        expect(closeArg.layouts).toEqual(['p1', 'p2']);
        expect(saved.length).toBe(2);
    });

    it('aggregates count for repeated macros and ignores unknown macros', () => {
        component.xml =
            `<plans><plan name="agg">` +
            `${entry(macroA)}${entry(macroA)}${entry('does_not_exist_macro')}` +
            `</plan></plans>`;
        component.importPlans();

        expect(closeArg.error).toBeNull();
        expect(saved[0].config.length).toBe(1);   // unknown macro skipped
        expect(saved[0].config[0].count).toBe(2);  // duplicate aggregated
    });

    it('reports an error on malformed XML', () => {
        component.xml = `not valid <<< xml`;
        component.importPlans();
        expect(closeArg.error).toBeTruthy();
    });
});
