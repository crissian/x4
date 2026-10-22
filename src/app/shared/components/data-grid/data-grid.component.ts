import { Component, computed, effect, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { EnumLabels } from '../../../core/enum-labels';
import { LocalStorage } from '../../../core/services/local-storage';
import { GridValues, PreparedRow } from './grid-values';
import {
	LucideArrowUpNarrowWide,
	LucideArrowDownWideNarrow,
	LucideChevronsLeft,
	LucideChevronLeft,
	LucideChevronRight,
	LucideChevronsRight,
	LucideColumns3,
} from '@lucide/angular';

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
	/** Router link commands that make the cell a link. */
	link?: (row: T) => readonly unknown[] | undefined;
	/** Hidden until the user turns the column on in the column chooser. */
	hidden?: boolean;
}

interface SortState {
	key: string;
	direction: 1 | -1;
}

@Component({
	selector: 'app-data-grid',
	imports: [
		FormField,
		RouterLink,
		LucideArrowUpNarrowWide,
		LucideArrowDownWideNarrow,
		LucideChevronsLeft,
		LucideChevronLeft,
		LucideChevronRight,
		LucideChevronsRight,
		LucideColumns3,
	],
	templateUrl: './data-grid.component.html',
})
export class DataGridComponent<T> {
	/** Builds a lookup list from plain string values. */
	static lookupOf(values: readonly string[]): GridLookupItem[] {
		return values.map((x) => ({ value: x, label: EnumLabels.label(x) }));
	}

	readonly data = input.required<readonly T[]>();
	readonly columns = input.required<readonly GridColumn<T>[]>();
	readonly trackBy = input<(row: T) => unknown>((row) => (row as { id?: unknown } | null)?.id ?? row);
	/** Shows the filter row, pager and count footer. */
	readonly features = input(true);
	readonly pageSizes = input<readonly number[]>([10, 20, 50, 100]);
	readonly clickable = input(false);
	/** Remembers the columns chosen by the user in local storage under this key. */
	readonly storageKey = input<string>();

	readonly rowClick = output<T>();

	/** Shown flag per column key, edited through the column chooser. Starts with the columns that are not `hidden`. */
	readonly shownModel = linkedSignal<Record<string, boolean>>(() => {
		const key = this.storageKey();
		const saved = key
			? LocalStorage.read<string[] | null>(`grid-columns:${key}`, null, (x) => (Array.isArray(x) ? x : undefined))
			: null;
		return Object.fromEntries(this.columns().map((c) => [c.key, saved ? saved.includes(c.key) : !c.hidden]));
	});
	readonly shownForm = form(this.shownModel);

	readonly visibleColumns = computed(() => {
		const shown = this.shownModel();
		return this.columns().filter((c) => shown[c.key]);
	});

	/** The column chooser is offered when some columns start hidden. */
	readonly choosable = computed(() => this.columns().some((c) => c.hidden));
	readonly chooserOpen = signal(false);

	/** Filter values per column key, edited through a signal form. */
	readonly filterModel = linkedSignal<Record<string, string>>(() =>
		Object.fromEntries(this.columns().map((c) => [c.key, '']))
	);
	readonly filterForm = form(this.filterModel);

	readonly sorts = signal<SortState[]>([]);
	/** Sorts on the visible columns only, so hiding a column drops its sort. */
	private readonly activeSorts = computed(() => {
		const shown = this.shownModel();
		return this.sorts().filter((x) => shown[x.key]);
	});

	readonly pagerModel = linkedSignal(() => ({ pageSize: String(this.pageSizes()[1] ?? this.pageSizes()[0]) }));
	readonly pagerForm = form(this.pagerModel);
	readonly pageSize = computed(() => Number(this.pagerModel().pageSize));

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
				const value = column.value ? column.value(row) : GridValues.getPath(row, column.key);
				values[column.key] = value;
				texts[column.key] = GridValues.toText(column, row, value, formatters[column.key]);
			}
			return { row, values, texts };
		});
	});

	readonly filtered = computed(() => {
		const filters = this.filterModel();
		const active = this.visibleColumns().filter((c) => c.filterable !== false && filters[c.key]?.trim());

		let rows = this.prepared();
		if (active.length) {
			rows = rows.filter((row) => active.every((column) => GridValues.matches(column, row, filters[column.key])));
		}

		const sorts = this.activeSorts();
		if (sorts.length) {
			rows = [...rows].sort((a, b) => {
				for (const sort of sorts) {
					const result = GridValues.compareValues(a.values[sort.key], b.values[sort.key]);
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
		source: () => [this.filterModel(), this.activeSorts(), this.pageSize()],
		computation: () => 0,
	});

	readonly visibleRows = computed(() => {
		if (!this.features()) {
			return this.filtered();
		}
		const start = Math.min(this.page(), this.pageCount() - 1) * this.pageSize();
		return this.filtered().slice(start, start + this.pageSize());
	});

	constructor() {
		effect(() => {
			const key = this.storageKey();
			const shown = this.visibleColumns().map((c) => c.key);
			if (key) {
				LocalStorage.write(`grid-columns:${key}`, shown);
			}
		});
	}

	resetColumns() {
		this.shownModel.set(Object.fromEntries(this.columns().map((c) => [c.key, !c.hidden])));
	}

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
		const sorts = this.activeSorts();
		const index = sorts.findIndex((x) => x.key === column.key);
		return index < 0 ? null : { direction: sorts[index].direction, order: sorts.length > 1 ? index + 1 : null };
	}

	filterLabel(column: GridColumn<T>) {
		return $localize`Filter ${column.caption}:column:`;
	}

	goTo(page: number) {
		this.page.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
	}
}
