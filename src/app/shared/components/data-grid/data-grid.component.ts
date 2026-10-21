import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';

export interface GridLookupItem {
	value: unknown;
	label: string;
}

export interface GridColumn<T> {
	/** Unique column key. Also used as the (dotted) data path when `value` is not set. */
	key: string;
	caption: string;
	/** Raw value used for filtering and sorting. Defaults to the value at `key`. */
	value?: (row: T) => unknown;
	/** Text shown in the cell. Defaults to the formatted value. */
	display?: (row: T) => string;
	type?: 'string' | 'number';
	/** Number format for `number` columns. Defaults to whole numbers with grouping. */
	format?: Intl.NumberFormatOptions;
	/** Values for the filter dropdown; cells show the matching label. */
	lookup?: readonly GridLookupItem[];
	sortable?: boolean;
	filterable?: boolean;
}

interface SortState {
	key: string;
	direction: 1 | -1;
}

interface PreparedRow<T> {
	row: T;
	values: Record<string, unknown>;
	texts: Record<string, string>;
}

const NUMBER_FILTER = /^\s*(<=|>=|<>|!=|<|>|=)?\s*(-?\d+(?:[.,]\d+)?)\s*$/;

/** Builds a lookup list from plain string values. */
export function lookupOf(values: readonly string[]): GridLookupItem[] {
	return values.map((x) => ({ value: x, label: x }));
}

function getPath(row: unknown, path: string): unknown {
	return path.split('.').reduce<any>((obj, key) => (obj == null ? undefined : obj[key]), row);
}

function compareValues(a: unknown, b: unknown): number {
	if (a == null || a === '') {
		return b == null || b === '' ? 0 : -1;
	}
	if (b == null || b === '') {
		return 1;
	}
	if (typeof a === 'number' && typeof b === 'number') {
		return a - b;
	}
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function matchesNumber(value: unknown, filter: string): boolean {
	const match = NUMBER_FILTER.exec(filter);
	if (!match) {
		return String(value ?? '').includes(filter.trim());
	}
	if (typeof value !== 'number') {
		return false;
	}

	const target = Number(match[2].replace(',', '.'));
	switch (match[1]) {
		case '<':
			return value < target;
		case '<=':
			return value <= target;
		case '>':
			return value > target;
		case '>=':
			return value >= target;
		case '<>':
		case '!=':
			return value !== target;
		default:
			return value === target;
	}
}

@Component({
	selector: 'app-data-grid',
	imports: [FormField],
	templateUrl: './data-grid.component.html',
})
export class DataGridComponent<T> {
	readonly data = input.required<readonly T[]>();
	readonly columns = input.required<readonly GridColumn<T>[]>();
	readonly trackBy = input<(row: T) => unknown>((row: any) => row?.id ?? row);
	/** Shows the filter row, pager and count footer. */
	readonly features = input(true);
	readonly pageSizes = input<readonly number[]>([10, 20, 50, 100]);
	readonly clickable = input(false);

	readonly rowClick = output<T>();

	/** Filter values per column key, edited through a signal form. */
	readonly filterModel = linkedSignal<Record<string, string>>(() =>
		Object.fromEntries(this.columns().map((c) => [c.key, '']))
	);
	readonly filterForm = form(this.filterModel);

	readonly sorts = signal<SortState[]>([]);
	readonly pageSize = linkedSignal(() => this.pageSizes()[1] ?? this.pageSizes()[0]);

	private readonly formatters = computed(() => {
		const result: Record<string, Intl.NumberFormat> = {};
		for (const column of this.columns()) {
			if (column.type === 'number') {
				result[column.key] = new Intl.NumberFormat(undefined, column.format ?? { maximumFractionDigits: 0 });
			}
		}
		return result;
	});

	private readonly prepared = computed<PreparedRow<T>[]>(() => {
		const columns = this.columns();
		const formatters = this.formatters();

		return this.data().map((row) => {
			const values: Record<string, unknown> = {};
			const texts: Record<string, string> = {};
			for (const column of columns) {
				const value = column.value ? column.value(row) : getPath(row, column.key);
				values[column.key] = value;
				texts[column.key] = this.toText(column, row, value, formatters[column.key]);
			}
			return { row, values, texts };
		});
	});

	readonly filtered = computed(() => {
		const filters = this.filterModel();
		const active = this.columns().filter((c) => c.filterable !== false && filters[c.key]?.trim());

		let rows = this.prepared();
		if (active.length) {
			rows = rows.filter((row) => active.every((column) => this.matches(column, row, filters[column.key])));
		}

		const sorts = this.sorts();
		if (sorts.length) {
			rows = [...rows].sort((a, b) => {
				for (const sort of sorts) {
					const result = compareValues(a.values[sort.key], b.values[sort.key]);
					if (result !== 0) {
						return result * sort.direction;
					}
				}
				return 0;
			});
		}

		return rows;
	});

	readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

	/** Current page, reset whenever filters, sorting or page size change. */
	readonly page = linkedSignal({
		source: () => [this.filterModel(), this.sorts(), this.pageSize()],
		computation: () => 0,
	});

	readonly visibleRows = computed(() => {
		if (!this.features()) {
			return this.filtered();
		}
		const start = Math.min(this.page(), this.pageCount() - 1) * this.pageSize();
		return this.filtered().slice(start, start + this.pageSize());
	});

	toggleSort(column: GridColumn<T>, event: MouseEvent) {
		if (column.sortable === false) {
			return;
		}

		const multiple = event.shiftKey || event.ctrlKey || event.metaKey;
		this.sorts.update((sorts) => {
			const current = sorts.find((x) => x.key === column.key);
			const next: SortState | null =
				current == null
					? { key: column.key, direction: 1 }
					: current.direction === 1
						? { key: column.key, direction: -1 }
						: null;

			if (!multiple) {
				return next ? [next] : [];
			}

			const others = sorts.filter((x) => x.key !== column.key);
			if (!next) {
				return others;
			}
			return current ? sorts.map((x) => (x.key === column.key ? next : x)) : [...others, next];
		});
	}

	sortOf(column: GridColumn<T>) {
		const sorts = this.sorts();
		const index = sorts.findIndex((x) => x.key === column.key);
		return index < 0 ? null : { direction: sorts[index].direction, order: sorts.length > 1 ? index + 1 : null };
	}

	setPageSize(value: string) {
		this.pageSize.set(Number(value));
	}

	goTo(page: number) {
		this.page.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
	}

	private toText(column: GridColumn<T>, row: T, value: unknown, formatter?: Intl.NumberFormat): string {
		if (column.display) {
			return column.display(row) ?? '';
		}
		if (column.lookup) {
			return column.lookup.find((x) => x.value === value)?.label ?? String(value ?? '');
		}
		if (value == null) {
			return '';
		}
		if (formatter && typeof value === 'number') {
			return formatter.format(value);
		}
		return String(value);
	}

	private matches(column: GridColumn<T>, row: PreparedRow<T>, filter: string) {
		if (column.lookup) {
			return String(row.values[column.key] ?? '') === filter;
		}
		if (column.type === 'number') {
			return matchesNumber(row.values[column.key], filter);
		}
		return row.texts[column.key].toLowerCase().includes(filter.trim().toLowerCase());
	}
}
