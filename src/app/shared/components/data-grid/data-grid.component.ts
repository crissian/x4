import { Component, computed, effect, input, linkedSignal, output, signal, untracked } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { GridColumnPrefs } from './grid-column-prefs';
import { GridGroups } from './grid-groups';
import { ToneDotComponent } from '../tone-dot/tone-dot.component';
import type { GridColumn, GridGroup, SortState } from './grid-column';
import { GridValues, PreparedRow } from './grid-values';
import {
	LucideArrowUpNarrowWide,
	LucideArrowDownWideNarrow,
	LucideChevronsLeft,
	LucideChevronLeft,
	LucideChevronRight,
	LucideChevronsRight,
	LucideColumns3,
	LucideInfo,
} from '@lucide/angular';
import { NumberFormats } from '../../../core/format/number-formats';

export type { GridColumn, GridDot, GridGroup, GridLookupItem, GridTone, SortState } from './grid-column';

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
		LucideInfo,
		ToneDotComponent,
	],
	templateUrl: './data-grid.component.html',
	styleUrl: './data-grid.component.css',
})
export class DataGridComponent<T> {
	readonly data = input.required<readonly T[]>();
	readonly columns = input.required<readonly GridColumn<T>[]>();
	readonly trackBy = input<(row: T) => unknown>((row) => (row as { id?: unknown } | null)?.id ?? row);
	/** Shows the filter row, pager and count footer. */
	readonly features = input(true);
	readonly pageSizes = input<readonly number[]>([10, 20, 50, 100]);
	readonly clickable = input(false);
	/** The row shown as selected, for clickable rows. */
	readonly selected = input<T>();
	/** The sort until the user picks another. */
	readonly sort = input<SortState>();
	/** Headers above the columns of the groups named by `GridColumn.group`. */
	readonly groups = input<readonly GridGroup[]>([]);
	/** Tighter cell padding, for grids with many columns. */
	readonly compact = input(false);
	/** Remembers the columns chosen by the user in local storage under this key. */
	readonly storageKey = input<string>();

	readonly rowClick = output<T>();

	private readonly hintPrefix = GridGroups.nextPrefix();

	/**
	 * Shown flag per column key, edited through the column chooser. Starts with the columns that are not `hidden`;
	 * with a `storageKey`, the saved choice applies to the columns it knew, and newer columns start as defaults.
	 */
	readonly shownModel = linkedSignal<Record<string, boolean>>(() => {
		const saved = GridColumnPrefs.read(this.storageKey());
		return Object.fromEntries(
			this.columns().map((c) => [
				c.key,
				c.hideable === false ||
					(saved && (!saved.known || saved.known.includes(c.key))
						? saved.shown.includes(c.key)
						: this.shownByDefault(c)),
			])
		);
	});
	readonly shownForm = form(this.shownModel);

	readonly visibleColumns = computed(() => {
		const shown = this.shownModel();
		return this.columns().filter((c) => shown[c.key]);
	});

	/** The tone that tints the cells of each column, from its group, by column key. */
	readonly tones = computed(() => {
		const groups = this.groups();
		return new Map(this.columns().map((c) => [c.key, GridGroups.tone(c, groups)]));
	});
	/** The group header row, empty without groups. */
	readonly groupHeaders = computed(() => GridGroups.headers(this.visibleColumns(), this.groups(), this.hintPrefix));
	/** The columns for the chooser, with the group labels. */
	readonly chooserColumns = computed(() =>
		GridGroups.chooser(
			this.columns().filter((c) => c.hideable !== false),
			this.groups()
		)
	);

	/** The column chooser is offered when some columns start hidden. */
	readonly choosable = computed(() => this.columns().some((c) => c.hideable !== false && !this.shownByDefault(c)));
	readonly chooserOpen = signal(false);

	/** Filter values per column key, edited through a signal form. */
	readonly filterModel = linkedSignal<Record<string, string>>(() =>
		Object.fromEntries(this.columns().map((c) => [c.key, '']))
	);
	readonly filterForm = form(this.filterModel);

	readonly sorts = linkedSignal<SortState[]>(() => {
		const sort = this.sort();
		return sort ? [sort] : [];
	});
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
				result[column.key] = NumberFormats.formatter(column.format);
			}
		}
		return result;
	});

	private readonly prepared = computed<PreparedRow<T>[]>(() => {
		const columns = this.columns();
		const formatters = this.formatters();

		return this.data().map((row) => {
			const values: Record<string, unknown> = {};
			const sortValues: Record<string, unknown> = {};
			const texts: Record<string, string> = {};
			for (const column of columns) {
				const value = column.value ? column.value(row) : GridValues.getPath(row, column.key);
				values[column.key] = value;
				sortValues[column.key] = column.sortValue ? column.sortValue(row) : value;
				texts[column.key] = GridValues.toText(column, row, value, formatters[column.key]);
			}
			return { row, values, sortValues, texts };
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
					const result = GridValues.compareValues(a.sortValues[sort.key], b.sortValues[sort.key]);
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
			const columns = this.columns().map((c) => c.key);
			const shown = this.visibleColumns().map((c) => c.key);
			if (key) {
				untracked(() => GridColumnPrefs.write(key, columns, shown));
			}
		});
	}

	private shownByDefault(column: GridColumn<T>): boolean {
		return !column.hidden;
	}

	/** Width in % of the bar of a value, for the template. */
	protected readonly barWidth = GridValues.barWidth;

	resetColumns() {
		this.shownModel.set(Object.fromEntries(this.columns().map((c) => [c.key, this.shownByDefault(c)])));
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
