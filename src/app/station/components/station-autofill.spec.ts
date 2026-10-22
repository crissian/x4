import { describe, expect, it } from 'vitest';
import type { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { StationAutofill } from './station-autofill';
import { ResourceCalculator, StationModuleModel } from './station-calculator.model';

const HULL_PARTS = 'module_gen_prod_hullparts_01';
const wares = new WareService();
const modules = new ModuleService();

function made(moduleId: string) {
	return modules.getEntity(moduleId)?.product?.[0].id;
}

describe('station autofill', () => {
	it('adds the production chain, leaving only the mined wares short', () => {
		const input = [{ moduleId: HULL_PARTS, count: 2 }];
		const rows = StationAutofill.fill(wares, modules, input, 100, 0);
		expect(input).toEqual([{ moduleId: HULL_PARTS, count: 2 }]);
		expect(rows[0]).toEqual({ moduleId: HULL_PARTS, count: 2 });
		expect(rows.map((x) => made(x.moduleId))).toEqual(
			expect.arrayContaining(['energycells', 'graphene', 'refinedmetals'])
		);
		const models = rows.map((x) => new StationModuleModel(wares, modules, x.moduleId, x.count));
		const short = ResourceCalculator.calculate(models, 100, 0)
			.filter((x) => x.amount < 0)
			.map((x) => x.ware.id);
		expect(short).toContain('ore');
		expect(short.every((ware) => modules.getModuleByWare(ware) == null)).toBe(true);
	});

	it('needs more solar modules at less sunlight', () => {
		const solar = (sunlight: number) =>
			StationAutofill.fill(wares, modules, [{ moduleId: HULL_PARTS, count: 2 }], sunlight, 0).find(
				(x) => made(x.moduleId) === 'energycells'
			)?.count ?? 0;
		expect(solar(50)).toBeGreaterThan(solar(100));
	});

	it('stops when the module of a short ware has no usable production', () => {
		const recycler = (ware: string): StationModule =>
			({
				id: `recycle_${ware}`,
				product: [{ id: ware, production: [{ method: 'recycling', amount: 1, time: 60 }] }],
			}) as unknown as StationModule;
		const stub = Object.create(modules) as ModuleService;
		stub.getModuleByWare = (ware: string) => recycler(ware);
		const rows = StationAutofill.fill(wares, stub, [{ moduleId: HULL_PARTS, count: 1 }], 100, 0);
		expect(rows).toEqual([{ moduleId: HULL_PARTS, count: 1 }]);
	});
});
