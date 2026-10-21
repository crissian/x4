import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import * as urlon from 'urlon';
import { describe, expect, it } from 'vitest';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import StationCalculatorComponent, { parseSharedLayout } from './station-calculator.component';
import { ResourceCalculator, StationModuleModel } from './station-calculator.model';

const HULL_PARTS = 'module_gen_prod_hullparts_01';
const HABITAT = 'module_arg_hab_m_01';

function model(moduleId: string, count: number) {
	return new StationModuleModel(TestBed.inject(WareService), TestBed.inject(ModuleService), moduleId, count);
}

function share(rows: { module: string; count: number }[]) {
	return urlon.stringify(rows).replace(/=/g, '-').replace(/&/g, ',');
}

describe('station calculator', () => {
	it('reads shared layout links', () => {
		const value = share([
			{ module: HULL_PARTS, count: 4 },
			{ module: HABITAT, count: 2 },
		]);
		expect(parseSharedLayout(value)).toEqual([
			{ moduleId: HULL_PARTS, count: 4 },
			{ moduleId: HABITAT, count: 2 },
		]);
		expect(parseSharedLayout(undefined)).toBeUndefined();
	});

	it('works out what a production module makes and needs per hour', () => {
		const hullParts = model(HULL_PARTS, 1);
		// 294 hull parts every 15 minutes from 80 energy cells, 40 graphene and 280 refined metals
		expect(hullParts.production?.[0].amount).toBeCloseTo(1176);
		expect(hullParts.needs.map((x) => [x.ware.id, x.amount])).toEqual([
			['energycells', 320],
			['graphene', 160],
			['refinedmetals', 1120],
		]);
		expect(model('', 1).module).toBeUndefined();
	});

	it('feeds the workers of habitats', () => {
		const habitat = model(HABITAT, 1);
		expect(habitat.needs.map((x) => x.ware.id)).toEqual(['foodrations', 'medicalsupplies']);
		expect(ResourceCalculator.calculateWorkforce([habitat, model(HULL_PARTS, 4)])).toEqual({
			value: 1080,
			capacity: 500,
		});
	});

	it('totals production and needs of the station', () => {
		const resources = ResourceCalculator.calculate([model(HULL_PARTS, 4)], 100, 0);
		const total = (id: string) => resources.find((x) => x.ware.id === id)?.amount;
		expect(total('hullparts')).toBeCloseTo(4 * 1176);
		expect(total('energycells')).toBeCloseTo(-4 * 320);
		expect(total('refinedmetals')).toBeCloseTo(-4 * 1120);
	});

	it('loads a shared layout from the query parameter', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		fixture.componentRef.setInput(
			'l',
			share([
				{ module: HULL_PARTS, count: 4 },
				{ module: HABITAT, count: 2 },
			])
		);
		await fixture.whenStable();

		const component = fixture.componentInstance;
		expect(component.rows().map((x) => x.moduleId)).toEqual([HULL_PARTS, HABITAT]);
		expect(component.workforce()).toEqual({ value: 1080, capacity: 1000 });
		expect(component.partialWorkforce()).toBe(1000);
		const text = (fixture.nativeElement as HTMLElement).textContent;
		expect(text).toContain('4 x Hull Part Production');
		expect(text).toContain('Food Rations');
	});
});
