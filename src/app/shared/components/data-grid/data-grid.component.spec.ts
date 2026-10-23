import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { DataGridComponent, GridColumn } from './data-grid.component';
import { GridLookups } from './grid-lookups';

interface Row {
	id: number;
	name: string;
	size: string;
	price: number;
}

const ROWS: Row[] = Array.from({ length: 25 }, (_, i) => ({
	id: i + 1,
	name: `Item ${i + 1}`,
	size: i % 2 ? 'small' : 'large',
	price: (i + 1) * 10,
}));

@Component({
	imports: [DataGridComponent],
	template: `<app-data-grid [data]="rows" [columns]="columns" storageKey="test" (rowClick)="clicked.set($event)" />`,
})
class HostComponent {
	readonly rows = ROWS;
	readonly columns: GridColumn<Row>[] = [
		{ key: 'name', caption: 'Name' },
		{ key: 'size', caption: 'Size', lookup: GridLookups.of(['small', 'large']) },
		{ key: 'price', caption: 'Price', type: 'number' },
		{ key: 'id', caption: 'Id', type: 'number', hidden: true },
	];
	readonly clicked = signal<Row | undefined>(undefined);
}

@Component({
	imports: [DataGridComponent],
	template: `<app-data-grid
		[data]="rows"
		[columns]="columns"
		[clickable]="true"
		[selected]="selected()"
		[sort]="{ key: 'price', direction: -1 }"
		(rowClick)="selected.set($event)"
	/>`,
})
class SelectHostComponent {
	readonly rows = ROWS.slice(0, 3);
	readonly columns: GridColumn<Row>[] = [
		{
			key: 'name',
			caption: 'Name',
			link: (x) => ['/items', x.id],
			queryParams: (x) => ({ size: x.size }),
			title: (x) => `About ${x.name}`,
		},
		{ key: 'price', caption: 'Price', type: 'number' },
	];
	readonly selected = signal<Row | undefined>(ROWS[1]);
}

@Component({
	imports: [DataGridComponent],
	template: `<app-data-grid [data]="rows" [columns]="columns()" storageKey="dynamic" />`,
})
class DynamicHostComponent {
	readonly rows = ROWS.slice(0, 2);
	readonly name: GridColumn<Row> = { key: 'name', caption: 'Name' };
	readonly price: GridColumn<Row> = { key: 'price', caption: 'Price', type: 'number' };
	readonly size: GridColumn<Row> = { key: 'size', caption: 'Size', hidden: true };
	readonly columns = signal<GridColumn<Row>[]>([this.name, this.size]);
}

describe('DataGridComponent', () => {
	beforeEach(() => localStorage.clear());

	async function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		const element: HTMLElement = fixture.nativeElement;
		const stable = () => fixture.whenStable();
		const headerCells = () => element.querySelectorAll('thead tr:first-child th');
		const headers = () => [...headerCells()].map((x) => x.textContent!.trim());
		const firstColumn = () =>
			[...element.querySelectorAll('tbody tr')].map((x) => x.querySelector('td')!.textContent);
		const footer = () => element.querySelector('tfoot')!.textContent!.trim();
		const set = async (selector: string, value: string) => {
			const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
			control.value = value;
			control.dispatchEvent(new Event('input'));
			control.dispatchEvent(new Event('change'));
			await stable();
		};
		const click = async (target: Element, init?: MouseEventInit) => {
			target.dispatchEvent(new MouseEvent('click', { bubbles: true, ...init }));
			await stable();
		};
		return { fixture, element, headerCells, headers, firstColumn, footer, set, click };
	}

	it('shows the first page of the visible columns', async () => {
		const { headers, firstColumn, footer, element } = await setup();
		expect(headers()).toEqual(['Name', 'Size', 'Price']);
		expect(firstColumn().length).toBe(20);
		expect(footer()).toBe('Count: 25');
		expect(element.textContent).toContain('Page 1 of 2');
	});

	it('filters text, lookup and number columns', async () => {
		const { set, firstColumn, footer } = await setup();
		await set('input[aria-label="Filter Name"]', 'item 1');
		expect(footer()).toBe('Count: 11');

		await set('select[aria-label="Filter Size"]', 'small');
		expect(firstColumn()).toEqual(['Item 10', 'Item 12', 'Item 14', 'Item 16', 'Item 18']);

		await set('input[aria-label="Filter Price"]', '>= 160');
		expect(firstColumn()).toEqual(['Item 16', 'Item 18']);
	});

	it('sorts by one column, then by several with shift', async () => {
		const { headerCells, click, firstColumn } = await setup();
		const size = () => headerCells()[1];
		const price = () => headerCells()[2];

		await click(price());
		await click(price());
		expect(firstColumn()[0]).toBe('Item 25');
		expect(price().getAttribute('aria-sort')).toBe('descending');

		await click(size());
		await click(price(), { shiftKey: true });
		expect(firstColumn().slice(0, 2)).toEqual(['Item 1', 'Item 3']);
		expect(size().getAttribute('aria-sort')).toBe('ascending');
		expect(price().getAttribute('aria-sort')).toBe('ascending');
	});

	it('pages through the rows and changes the page size', async () => {
		const { element, click, set, firstColumn } = await setup();
		await click(element.querySelector('button[aria-label="Next page"]')!);
		expect(firstColumn()).toEqual(['Item 21', 'Item 22', 'Item 23', 'Item 24', 'Item 25']);

		await set('select:not([aria-label])', '50');
		expect(firstColumn().length).toBe(25);
		expect(element.textContent).toContain('Page 1 of 1');
	});

	it('remembers the chosen columns', async () => {
		const first = await setup();
		await first.click(first.element.querySelector('button[aria-expanded]')!);
		const checkboxes = first.element.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
		checkboxes[3].click();
		checkboxes[1].click();
		await first.fixture.whenStable();
		expect(first.headers()).toEqual(['Name', 'Price', 'Id']);
		expect(JSON.parse(localStorage.getItem('grid-columns:test')!)).toEqual(['name', 'price', 'id']);

		const second = await setup();
		expect(second.headers()).toEqual(['Name', 'Price', 'Id']);
	});

	it('emits the clicked row', async () => {
		const { fixture, element, click } = await setup();
		await click(element.querySelectorAll('tbody tr')[2]);
		expect(fixture.componentInstance.clicked()?.id).toBe(3);
	});

	it('starts with the given sort, marks the selected row and selects rows with Enter', async () => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		const fixture = TestBed.createComponent(SelectHostComponent);
		await fixture.whenStable();
		const element: HTMLElement = fixture.nativeElement;
		const rows = () => [...element.querySelectorAll('tbody tr')];
		expect(rows().map((x) => x.querySelector('td')!.textContent)).toEqual(['Item 3', 'Item 2', 'Item 1']);
		expect(element.querySelectorAll('thead th')[1].getAttribute('aria-sort')).toBe('descending');
		expect(rows().map((x) => x.getAttribute('aria-current'))).toEqual([null, 'true', null]);
		expect(rows()[0].getAttribute('tabindex')).toBe('0');

		rows()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await fixture.whenStable();
		expect(fixture.componentInstance.selected()?.id).toBe(3);
		expect(rows()[0].getAttribute('aria-current')).toBe('true');
		expect(rows()[1].getAttribute('aria-current')).toBeNull();

		// Space selects too, without scrolling the page
		const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
		rows()[2].dispatchEvent(space);
		await fixture.whenStable();
		expect(space.defaultPrevented).toBe(true);
		expect(fixture.componentInstance.selected()?.id).toBe(1);

		// Enter on a cell link follows the link without selecting the row
		const link = rows()[0].querySelector('a')!;
		link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await fixture.whenStable();
		expect(fixture.componentInstance.selected()?.id).toBe(1);

		const cell = rows()[0].querySelector('td')!;
		expect(cell.getAttribute('title')).toBe('About Item 3');
		expect(cell.querySelector('a')!.getAttribute('href')).toBe('/items/3?size=large');
	});

	it('shows columns added after the saved choice by their default', async () => {
		const create = async () => {
			const fixture = TestBed.createComponent(DynamicHostComponent);
			await fixture.whenStable();
			const headers = () =>
				[...fixture.nativeElement.querySelectorAll('thead tr:first-child th')].map((x: Element) =>
					x.textContent!.trim()
				);
			return { fixture, headers };
		};
		const { fixture, headers } = await create();
		expect(headers()).toEqual(['Name']);

		const host = fixture.componentInstance;
		host.columns.set([host.name, host.price, host.size]);
		await fixture.whenStable();
		expect(headers()).toEqual(['Name', 'Price']);

		// a column the saved choice knew keeps it, even while it is absent
		host.columns.set([host.name, host.size]);
		await fixture.whenStable();
		host.columns.set([host.name, host.price, host.size]);
		await fixture.whenStable();
		expect(headers()).toEqual(['Name', 'Price']);
		expect(JSON.parse(localStorage.getItem('grid-columns-known:dynamic')!)).toEqual(['name', 'price', 'size']);
	});

	it('applies a list saved without the known columns to every column', async () => {
		localStorage.setItem('grid-columns:dynamic', JSON.stringify(['name']));
		const fixture = TestBed.createComponent(DynamicHostComponent);
		const host = fixture.componentInstance;
		host.columns.set([host.name, host.price, host.size]);
		await fixture.whenStable();
		const headers = [...fixture.nativeElement.querySelectorAll('thead tr:first-child th')].map((x: Element) =>
			x.textContent!.trim()
		);
		expect(headers).toEqual(['Name']);
	});
});
