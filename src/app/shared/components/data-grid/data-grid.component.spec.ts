import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DataGridComponent, GridColumn } from './data-grid.component';

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
		{ key: 'size', caption: 'Size', lookup: DataGridComponent.lookupOf(['small', 'large']) },
		{ key: 'price', caption: 'Price', type: 'number' },
		{ key: 'id', caption: 'Id', type: 'number', hidden: true },
	];
	readonly clicked = signal<Row | undefined>(undefined);
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
		const firstColumn = () => [...element.querySelectorAll('tbody tr')].map((x) => x.querySelector('td')!.textContent);
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
});
