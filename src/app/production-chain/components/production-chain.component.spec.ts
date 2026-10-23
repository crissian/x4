import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ProductionChainComponent } from './production-chain.component';

describe('ProductionChainComponent', () => {
	const render = async (ware: string) => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(ProductionChainComponent);
		fixture.componentRef.setInput('ware', ware);
		await fixture.whenStable();
		return fixture.nativeElement as HTMLElement;
	};

	it('draws the chain of a ware with a link to the station calculator', async () => {
		const element = await render('refinedmetals');
		const wares = [...element.querySelectorAll('[data-ware]')].map((x) => x.getAttribute('data-ware'));
		expect(wares).toEqual(['refinedmetals', 'energycells', 'ore']);
		expect(element.querySelector('[data-plan]')?.getAttribute('href')).toContain(
			'module_gen_prod_refinedmetals_01'
		);
		expect(element.querySelector('[data-chain-raw]')?.textContent).toContain('Ore');
	});

	it('says when a ware is a raw resource', async () => {
		const element = await render('ore');
		expect(element.querySelector('[data-chain-empty]')).not.toBeNull();
		expect(element.querySelector('[data-chain-graph]')).toBeNull();
	});
});
