import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { GridColumn } from './data-grid/data-grid.component';
import { ListPageComponent } from './list-page.component';

interface Row {
	id: string;
	name: string;
}

@Component({
	imports: [ListPageComponent],
	template: `<app-list-page heading="Things" [data]="rows" [columns]="columns">
		<a actions href="#">Compare</a>
		<p intro>Intro text</p>
		<p footer>Footer text</p>
	</app-list-page>`,
})
class HostComponent {
	readonly rows: Row[] = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta' },
	];
	readonly columns: GridColumn<Row>[] = [{ key: 'name', caption: 'Name' }];
}

describe('ListPageComponent', () => {
	async function setup() {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		return fixture.nativeElement as HTMLElement;
	}

	it('shows the heading, the projected parts and the rows', async () => {
		const element = await setup();
		expect(element.querySelector('.card-header')?.textContent).toContain('Things');
		expect(element.querySelector('.card-header a')?.textContent).toBe('Compare');
		const body = element.querySelector('.card-body')?.textContent ?? '';
		expect(body.indexOf('Intro text')).toBeLessThan(body.indexOf('Alpha'));
		expect(body.indexOf('Beta')).toBeLessThan(body.indexOf('Footer text'));
	});

	it('opens the detail page of a clicked row', async () => {
		const element = await setup();
		const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
		const row = [...element.querySelectorAll('tbody tr')].find((x) =>
			x.textContent?.includes('Beta')
		) as HTMLElement;
		row.click();
		expect(navigate).toHaveBeenCalledWith(['b'], expect.objectContaining({ relativeTo: expect.anything() }));
	});
});
