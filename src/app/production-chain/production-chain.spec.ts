import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ModuleService } from '../shared/services/module.service';
import { WareService } from '../shared/services/ware.service';
import { ChainRecipes } from './chain-recipes';
import { ChainSettings, ProductionChain } from './production-chain';

describe('ProductionChain', () => {
	const settings: ChainSettings = { direction: 'inputs', method: 'default', modules: 1, overrides: {}, depth: 0 };
	const services = () => {
		const wares = TestBed.inject(WareService);
		const recipes = new ChainRecipes(wares, TestBed.inject(ModuleService));
		return { wares, recipes, chain: new ProductionChain(wares, recipes) };
	};
	const node = (graph: ReturnType<ProductionChain['build']>, id: string) =>
		graph!.nodes.find((x) => x.ware.id === id)!;

	it('follows a ware down to its raw resources with the rates of its modules', () => {
		// refined metals: 88 per 150 s from 90 energy cells and 240 ore
		const graph = services().chain.build('refinedmetals', { ...settings, modules: 2 });
		expect(graph!.nodes.map((x) => x.ware.id)).toEqual(['refinedmetals', 'energycells', 'ore']);
		expect(node(graph, 'refinedmetals').rate).toBeCloseTo(2 * 88 * 24);
		expect(node(graph, 'refinedmetals').modules).toBeCloseTo(2);
		expect(node(graph, 'energycells').rate).toBeCloseTo(2 * 90 * 24);
		expect(node(graph, 'ore')).toMatchObject({ rate: 2 * 240 * 24, modules: 0, production: undefined });
		expect(graph!.edges).toContainEqual({ from: 'refinedmetals', to: 'ore', rate: 2 * 240 * 24 });
		expect(ProductionChain.calculatorRows(graph!)).toEqual([
			{ moduleId: 'module_gen_prod_refinedmetals_01', count: 2 },
			{ moduleId: 'module_gen_prod_energycells_01', count: 1 },
		]);
	});

	it('adds up a ware needed by several wares of the chain', () => {
		const graph = services().chain.build('advancedcomposites', settings)!;
		const energy = graph.edges.filter((x) => x.to === 'energycells').reduce((sum, x) => sum + x.rate, 0);
		expect(graph.nodes.filter((x) => x.ware.id === 'energycells')).toHaveLength(1);
		expect(graph.edges.filter((x) => x.to === 'energycells').length).toBeGreaterThan(1);
		expect(node(graph, 'energycells').rate).toBeCloseTo(energy);
		// every ware comes after the wares needing it
		const index = (id: string) => graph.nodes.findIndex((x) => x.ware.id === id);
		expect(graph.edges.every((x) => index(x.from) < index(x.to))).toBe(true);
	});

	it('uses the preferred method where a ware has it, and the overrides over it', () => {
		const { chain } = services();
		const teladi = chain.build('advancedcomposites', { ...settings, method: 'teladi' })!;
		expect(node(teladi, 'advancedcomposites').production?.method).toBe('teladi');
		expect(teladi.nodes.some((x) => x.ware.id === 'teladianium')).toBe(true);
		expect(teladi.nodes.some((x) => x.ware.id === 'refinedmetals')).toBe(false);
		// graphene has no Teladi method
		expect(node(teladi, 'graphene').production?.method).toBe('default');

		const back = chain.build('advancedcomposites', {
			...settings,
			method: 'teladi',
			overrides: { advancedcomposites: 'default' },
		})!;
		expect(back.nodes.some((x) => x.ware.id === 'refinedmetals')).toBe(true);
	});

	it('follows a ware up to the wares made from it, for some levels', () => {
		const { chain } = services();
		const direct = chain.build('ore', { ...settings, direction: 'usedBy', depth: 1 })!;
		expect(direct.nodes.some((x) => x.ware.id === 'refinedmetals')).toBe(true);
		expect(direct.nodes.some((x) => x.ware.id === 'hullparts')).toBe(false);
		// one refinery uses 240 ore per 150 s
		expect(direct.edges).toContainEqual({ from: 'ore', to: 'refinedmetals', rate: 240 * 24 });
		expect(node(direct, 'refinedmetals').rate).toBeCloseTo(88 * 24);

		const all = chain.build('ore', { ...settings, direction: 'usedBy', depth: 0 })!;
		expect(all.nodes.some((x) => x.ware.id === 'hullparts')).toBe(true);
		expect(chain.build('unknown', settings)).toBeUndefined();
	});
});

describe('ChainRecipes', () => {
	const recipes = () => new ChainRecipes(TestBed.inject(WareService), TestBed.inject(ModuleService));
	const ware = (id: string) => TestBed.inject(WareService).getEntity(id)!;

	it('picks the production method of a ware', () => {
		expect(ChainRecipes.pick(ware('claytronics'), 'teladi')?.method).toBe('default');
		expect(ChainRecipes.pick(ware('claytronics'), 'recycling')?.method).toBe('recycling');
		expect(ChainRecipes.pick(ware('khaakalloy'), 'default')?.method).toBe('recycling');
		expect(ChainRecipes.pick(ware('hullparts'), 'default', 'teladi')?.method).toBe('teladi');
		expect(ChainRecipes.pick(ware('ore'), 'default')).toBeUndefined();
	});

	it('finds the module making a ware with a method', () => {
		const lookup = recipes();
		expect(lookup.module(ware('hullparts'), 'default')?.id).toBe('module_gen_prod_hullparts_01');
		expect(lookup.module(ware('hullparts'), 'teladi')?.id).toBe('module_tel_prod_hullparts_01');
		expect(lookup.module(ware('hullparts'), 'recycling')?.id).toBe('module_gen_prod_scrap_recycler');
		// the Argon module queues food rations with a method the ware lacks: the default one
		expect(lookup.module(ware('foodrations'), 'default')?.id).toBe('module_arg_prod_foodrations_01');
		expect(lookup.module(ware('scrapmetal'), 'processing')?.id).toBe('module_gen_proc_scrapworks');
	});

	it('lists the methods a chain can prefer', () => {
		const options = ChainRecipes.methodOptions(TestBed.inject(WareService).getEntities(), 'Universal');
		expect(options[0]).toEqual({ id: 'default', name: 'Universal' });
		expect(options.map((x) => x.id)).toEqual(expect.arrayContaining(['teladi', 'terran', 'boron', 'recycling']));
		expect(options.some((x) => x.id === 'processing')).toBe(false);
	});
});
