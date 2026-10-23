import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import * as urlon from 'urlon';
import { describe, expect, it } from 'vitest';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { StationLayoutLink } from '../station-layout-link';
import StationCalculatorComponent from './station-calculator.component';
import {
	HQ_WORKFORCE,
	ResourceCalculator,
	StationModuleModel,
	StationCalculatorModel,
} from './station-calculator.model';

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
		expect(StationCalculatorComponent.parseSharedLayout(value)).toEqual([
			{ moduleId: HULL_PARTS, count: 4 },
			{ moduleId: HABITAT, count: 2 },
		]);
		expect(StationCalculatorComponent.parseSharedLayout(undefined)).toBeUndefined();
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

	it('alternates the scrap recycler between its products', () => {
		const recycler = model('module_gen_prod_scrap_recycler', 1);
		// one 5 minute cycle of each in turn: 6 cycles per hour of 60 claytronics and 6 of 200 hull parts
		expect(recycler.production?.map((x) => [x.ware.id, x.amount])).toEqual([
			['claytronics', 360],
			['hullparts', 1200],
		]);
		const needs = (id: string) =>
			recycler.needs.filter((x) => x.ware.id === id).reduce((sum, x) => sum + x.amount, 0);
		expect(needs('energycells')).toBe(93000);
		expect(needs('scrapmetal')).toBe(2250);
	});

	it("recycles Kha'ak scrap into alloy", () => {
		// 100 alloy every 5 minutes from 6000 energy cells, 300 Kha'ak scrap and 200 nividium
		const recycler = model('module_gen_prod_scrap_recyclerkhaak', 1);
		expect(recycler.production?.map((x) => [x.ware.id, x.amount])).toEqual([['khaakalloy', 1200]]);
		expect(recycler.needs.map((x) => [x.ware.id, x.amount])).toEqual([
			['energycells', 72000],
			['khaakscrapmetal', 3600],
			['nividium', 2400],
		]);
	});

	it('processes raw scrap into scrap metal', () => {
		// 150 scrap metal per minute, each from 1 raw scrap and 10 energy cells
		const processor = model('module_gen_proc_scrapworks', 1);
		expect(processor.production?.map((x) => [x.ware.id, x.amount])).toEqual([['scrapmetal', 9000]]);
		expect(processor.needs.map((x) => [x.ware.id, x.amount])).toEqual([
			['energycells', 90000],
			['rawscrap', 9000],
		]);
	});

	it('uses the production method the module queues', () => {
		const teladi = model('module_tel_prod_hullparts_01', 1);
		expect(teladi.production?.[0].value.method).toBe('teladi');
		expect(teladi.needs.map((x) => x.ware.id)).toContain('teladianium');
	});

	it('rounds the workforce bonus down each cycle like the game', () => {
		// 50 energy cells per cycle at +43%: 50 + floor(21.5) = 71
		expect(StationCalculatorModel.amountPerCycle(50, 0.43)).toBe(71);
		expect(StationCalculatorModel.amountPerCycle(294, 0)).toBe(294);

		const modules = [model(HABITAT, 1), model(HULL_PARTS, 1)];
		const workforce = ResourceCalculator.calculateWorkforce(modules).value;
		const resources = ResourceCalculator.calculate(modules, 100, workforce);
		// 294 + floor(294 * 0.37) = 402 hull parts, 4 cycles per hour
		expect(resources.find((x) => x.ware.id === 'hullparts')?.amount).toBe(4 * 402);
	});

	it('counts the headquarters workers', () => {
		const modules = [model(HABITAT, 2), model(HULL_PARTS, 1)];
		const workforce = ResourceCalculator.calculateWorkforce(modules).value;
		expect(ResourceCalculator.calculateWorkforce(modules, true).value).toBe(workforce + HQ_WORKFORCE);

		// the HQ workers fill the habitats, so they eat more
		const food = (isHq: boolean) => {
			const needed = ResourceCalculator.calculateWorkforce(modules, isHq);
			const resources = ResourceCalculator.calculate(modules, 100, Math.min(needed.value, needed.capacity), isHq);
			return resources.find((x) => x.ware.id === 'foodrations')?.amount ?? 0;
		};
		expect(food(true)).toBeLessThan(food(false));
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

	it('shows where to start until a module is picked', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		expect(fixture.componentInstance.hasModules()).toBe(false);
		expect(element.textContent).toContain('Start by picking a module');

		fixture.componentInstance.rows.set([{ moduleId: HULL_PARTS, count: 1 }]);
		await fixture.whenStable();
		expect(element.textContent).not.toContain('Start by picking a module');
	});

	it('opens a shared layout at the sunlight of the link', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		fixture.componentRef.setInput('l', share([{ module: HULL_PARTS, count: 1 }]));
		fixture.componentRef.setInput('sun', '50');
		await fixture.whenStable();
		expect(fixture.componentInstance.settings().sunlight).toBe(50);
		expect(StationLayoutLink.params([{ moduleId: HULL_PARTS, count: 1 }], 49.6)).toEqual({
			l: share([{ module: HULL_PARTS, count: 1 }]),
			sun: 50,
		});
		expect(StationLayoutLink.parseSunlight('abc')).toBeUndefined();
		expect(StationLayoutLink.parseSunlight(undefined)).toBeUndefined();
	});

	it('opens a station of a save with the workers it really has', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		fixture.componentRef.setInput(
			'l',
			share([
				{ module: HULL_PARTS, count: 4 },
				{ module: HABITAT, count: 2 },
			])
		);
		fixture.componentRef.setInput('wf', '600');
		await fixture.whenStable();
		const component = fixture.componentInstance;
		expect(component.settings().autoWorkforce).toBe(false);
		expect(component.partialWorkforce()).toBe(600);
		expect(StationLayoutLink.params([{ moduleId: HABITAT, count: 1 }], undefined, 600)).toEqual({
			l: share([{ module: HABITAT, count: 1 }]),
			wf: 600,
		});
		expect(StationLayoutLink.parseWorkforce('-1')).toBeUndefined();
	});

	it('autofills the production chain from the button', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		fixture.componentRef.setInput('l', share([{ module: HULL_PARTS, count: 2 }]));
		await fixture.whenStable();

		const element = fixture.nativeElement as HTMLElement;
		const button = [...element.querySelectorAll('button')].find((x) => x.textContent?.includes('Autofill'));
		button!.click();
		await fixture.whenStable();

		const modules = TestBed.inject(ModuleService);
		const rows = fixture.componentInstance.rows();
		expect(rows[0]).toMatchObject({ moduleId: HULL_PARTS, count: 2 });
		expect(rows.map((x) => modules.getEntity(x.moduleId)?.product?.[0].id)).toEqual(
			expect.arrayContaining(['energycells', 'graphene', 'refinedmetals'])
		);
	});
});
