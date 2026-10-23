import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it } from 'vitest';
import { QueryParamSync } from './query-param-sync';

@Component({ template: '' })
class PageComponent {
	readonly page = signal(1);
	readonly applied: number[] = [];

	constructor() {
		QueryParamSync.connect(
			this.page,
			{
				read: (params) => Number(params.get('page') ?? 1) || 1,
				write: (page) => ({ page: page === 1 ? null : page }),
			},
			(page) => {
				this.applied.push(page);
				this.page.set(page);
			}
		);
	}
}

describe('QueryParamSync', () => {
	async function setup(url: string) {
		TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'page', component: PageComponent }])] });
		const harness = await RouterTestingHarness.create();
		const page = await harness.navigateByUrl(url, PageComponent);
		await harness.fixture.whenStable();
		return { harness, page, router: TestBed.inject(Router) };
	}

	it('writes the state to the URL, leaving defaults out and keeping other params', async () => {
		const { harness, page, router } = await setup('/page?page=1&other=x');
		expect(router.url).toBe('/page?other=x');
		page.page.set(3);
		await harness.fixture.whenStable();
		expect(router.url).toBe('/page?other=x&page=3');
	});

	it('reads URL changes it did not write back into the state', async () => {
		const { harness, page, router } = await setup('/page?page=2');
		expect(page.applied).toEqual([]);
		await router.navigateByUrl('/page?page=5');
		await harness.fixture.whenStable();
		expect(page.page()).toBe(5);
		expect(page.applied).toEqual([5]);
		page.page.set(6);
		await harness.fixture.whenStable();
		// its own write is not read back
		expect(page.applied).toEqual([5]);
		expect(router.url).toBe('/page?page=6');
	});

	it('picks the row the URL names, else the first', () => {
		const rows = [{ id: 'a' }, { id: 'b' }];
		expect(QueryParamSync.pick(rows, 'b', (x) => x.id)).toBe(rows[1]);
		expect(QueryParamSync.pick(rows, 'z', (x) => x.id)).toBe(rows[0]);
		expect(QueryParamSync.pick([], 'z', (x: { id: string }) => x.id)).toBeUndefined();
	});
});
