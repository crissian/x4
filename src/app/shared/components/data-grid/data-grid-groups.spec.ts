import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DataGridComponent, GridColumn, GridGroup } from './data-grid.component';
import { GridGroups } from './grid-groups';

interface Row {
	id: number;
	name: string;
	net: number;
	level: number;
}

const ROWS: Row[] = [
	{ id: 1, name: 'Alpha', net: -0.5, level: 2 },
	{ id: 2, name: 'Beta', net: 0.25, level: 0 },
	{ id: 3, name: 'Gamma', net: 0, level: 1 },
];

const GROUPS: GridGroup[] = [
	{ key: 'a', label: 'First', hint: 'About the first group', tone: 'teal' },
	{ key: 'b', label: 'Second', tone: 'amber' },
];

@Component({
	imports: [DataGridComponent],
	template: `<app-data-grid [data]="rows" [columns]="columns()" [groups]="groups" storageKey="groups" />`,
})
class HostComponent {
	readonly rows = ROWS;
	readonly groups = GROUPS;
	readonly columns = signal<GridColumn<Row>[]>([
		{ key: 'name', caption: 'Name' },
		{ key: 'net', caption: 'Net', type: 'number', group: 'a', bar: (x) => x.net },
		{
			key: 'level',
			caption: 'Level',
			type: 'number',
			group: 'a',
			sortValue: (x) => -x.level,
			dot: (x) => (x.level ? { tone: 'red', level: x.level > 1 ? 3 : 1 } : undefined),
		},
		{ key: 'id', caption: 'Id', type: 'number', group: 'b' },
		{ key: 'hidden', caption: 'Hidden', group: 'b', hidden: true },
	]);
}

describe('DataGridComponent groups', () => {
	beforeEach(() => localStorage.clear());

	async function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		const element: HTMLElement = fixture.nativeElement;
		const groupCells = () => [...element.querySelectorAll('thead tr.grid-groups th')];
		return { fixture, element, groupCells };
	}

	it('spans each group over its visible columns, with a gap for columns without one', async () => {
		const { element, groupCells } = await setup();
		expect(groupCells().map((x) => [x.firstChild?.textContent?.trim() ?? '', x.getAttribute('colspan')])).toEqual([
			['', '1'],
			['First', '2'],
			['Second', '1'],
		]);
		expect(groupCells()[1].getAttribute('data-tone')).toBe('teal');
		expect(element.querySelectorAll('thead tr')[1].querySelectorAll('th').length).toBe(4);
	});

	it('explains a group with a hint button that describes itself', async () => {
		const { element, groupCells } = await setup();
		const button = groupCells()[1].querySelector('button')!;
		expect(button.getAttribute('title')).toBe('About the first group');
		const described = element.querySelector(`#${button.getAttribute('aria-describedby')}`)!;
		expect(described.textContent).toBe('About the first group');
		expect(groupCells()[2].querySelector('button')).toBeNull();
	});

	it('tints the cells of a group and leaves the others', async () => {
		const { element } = await setup();
		const cells = element.querySelectorAll('tbody tr:first-child td');
		expect([...cells].map((x) => x.getAttribute('data-tone'))).toEqual([null, 'teal', 'teal', 'amber']);
	});

	it('draws a dot and a bar before the cell text', async () => {
		const { element } = await setup();
		const rows = element.querySelectorAll('tbody tr');
		const dot = rows[0].querySelector('app-tone-dot')!;
		expect([dot.getAttribute('data-tone'), dot.getAttribute('data-level')]).toEqual(['red', '3']);
		expect(rows[1].querySelector('app-tone-dot')).toBeNull();
		const bars = [...rows].map((x) => x.querySelector('.grid-bar'));
		expect(bars.map((x) => x!.getAttribute('data-negative'))).toEqual(['true', 'false', 'false']);
		expect(bars.map((x) => (x!.firstElementChild as HTMLElement).style.width)).toEqual(['25%', '12.5%', '0%']);
	});

	it('sorts by the sort value of a column', async () => {
		const { fixture, element } = await setup();
		const header = [...element.querySelectorAll('thead tr:nth-child(2) th')][2];
		header.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await fixture.whenStable();
		const names = () => [...element.querySelectorAll('tbody tr')].map((x) => x.querySelector('td')!.textContent);
		// ascending by -level: the highest level first
		expect(names()).toEqual(['Alpha', 'Gamma', 'Beta']);
	});

	it('lists the chooser columns under the group labels', async () => {
		const { fixture, element } = await setup();
		element.querySelector<HTMLButtonElement>('button[aria-expanded]')!.click();
		await fixture.whenStable();
		const headings = [...element.querySelectorAll('.text-xs.font-semibold')].map((x) => x.textContent!.trim());
		expect(headings).toEqual(['First', 'Second']);
	});

	it('works out the headers from the visible columns only', () => {
		const columns: GridColumn<Row>[] = [
			{ key: 'a', caption: 'A', group: 'a' },
			{ key: 'b', caption: 'B', group: 'b' },
			{ key: 'c', caption: 'C', group: 'a' },
		];
		expect(GridGroups.headers(columns, GROUPS, 'p').map((x) => [x.key, x.span])).toEqual([
			['a', 1],
			['b', 1],
			['a', 1],
		]);
		expect(GridGroups.headers(columns, [], 'p')).toEqual([]);
		expect(GridGroups.headers([{ key: 'x', caption: 'X' }], GROUPS, 'p')).toEqual([]);
	});
});

describe('DataGridComponent hideable', () => {
	beforeEach(() => localStorage.clear());

	@Component({
		imports: [DataGridComponent],
		template: `<app-data-grid [data]="rows" [columns]="columns" storageKey="fixed" />`,
	})
	class FixedHostComponent {
		readonly rows = ROWS;
		readonly columns: GridColumn<Row>[] = [
			{ key: 'name', caption: 'Name', hideable: false },
			{ key: 'net', caption: 'Net', type: 'number', hidden: true },
		];
	}

	const headers = (element: HTMLElement) =>
		[...element.querySelectorAll('thead tr:first-child th')].map((x) => x.textContent!.trim());

	it('keeps a column that is not hideable out of the chooser', async () => {
		const fixture = TestBed.createComponent(FixedHostComponent);
		await fixture.whenStable();
		const element: HTMLElement = fixture.nativeElement;
		element.querySelector<HTMLButtonElement>('button[aria-expanded]')!.click();
		await fixture.whenStable();
		expect(element.querySelectorAll('input[type=checkbox]').length).toBe(1);
		expect(element.querySelector('label')!.textContent).toContain('Net');
	});

	it('shows it even when a saved choice leaves it out', async () => {
		localStorage.setItem('grid-columns:fixed', JSON.stringify(['net']));
		const fixture = TestBed.createComponent(FixedHostComponent);
		await fixture.whenStable();
		expect(headers(fixture.nativeElement)).toEqual(['Name', 'Net']);
	});
});

describe('GridGroups with a column between two groups', () => {
	const columns: GridColumn<Row>[] = [
		{ key: 'a1', caption: 'A1', group: 'a' },
		{ key: 'plain', caption: 'Plain' },
		{ key: 'b1', caption: 'B1', group: 'b' },
		{ key: 'b2', caption: 'B2', group: 'b' },
	];

	it('gives the ungrouped column a blank header cell of its own', () => {
		const headers = GridGroups.headers(columns, GROUPS, 'g');
		expect(headers.map((x) => [x.key, x.label, x.span])).toEqual([
			['a', 'First', 1],
			['', '', 1],
			['b', 'Second', 2],
		]);
	});

	it('sets the ungrouped column apart in the chooser without a heading', () => {
		const items = GridGroups.chooser(columns, GROUPS);
		expect(items.map((x) => [x.column.key, x.heading, !!x.separated])).toEqual([
			['a1', 'First', false],
			['plain', undefined, true],
			['b1', 'Second', false],
			['b2', undefined, false],
		]);
	});
});
