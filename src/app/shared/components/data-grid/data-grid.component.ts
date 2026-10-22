import { Component, computed, effect, input, linkedSignal, output, signal, untracked } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Params, RouterLink } from '@angular/router';
import { EnumLabels } from '../../../core/enum-labels';
import { GridColumnPrefs } from './grid-column-prefs';
import { GridGroups } from './grid-groups';
import { Tone, ToneDotComponent } from '../tone-dot/tone-dot.component';
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
	/** Query params of the cell link. */
	queryParams?: (row: T) => Params | undefined;
	/** Tooltip of the cell. */
	title?: (row: T) => string | undefined;
	/** Hidden until the user turns the column on in the column chooser. */
	hidden?: boolean;
	/** False keeps the column always shown: it is not offered in the column chooser and a saved choice can't hide it. */
	hideable?: boolean;
	/** Hidden by default on narrow screens (below 640 px), like `hidden`. */
	narrowHidden?: boolean;
	/** The key of the `GridGroup` the column belongs to; the columns of a group should be neighbours. */
	group?: string;
	/** Raw value used for sorting, when it differs from the one used for filtering. */
	sortValue?: (row: T) => unknown;
	/** A coloured dot before the cell text. */
	dot?: (row: T) => GridDot | undefined;
	/** A bar before the cell text, growing right from the middle for positive values and left for negative ones; -1..1. */
	bar?: (row: T) => number | undefined;
}

/** The colour of a group header or of a dot in a cell. */
export type GridTone = Tone;

/** A coloured dot before the cell text; `level` 1 is the palest shade and 3 the strongest. */
export interface GridDot {
	tone: GridTone;
	level: 1 | 2 | 3;
}

/** A header above the columns of one group; neighbouring visible columns of the group share it. */
export interface GridGroup {
	key: string;
	label: string;
	/** Explains the group in a tooltip behind an info button. */
	hint?: string;
	/** Tints the group header and, lightly, its cells. */
	tone?: GridTone;
}

export interface SortState {
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
		LucideInfo,
		ToneDotComponent,
	],
	templateUrl: './data-grid.component.html',
	styleUrl: './data-grid.component.css',
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

	/**
	 * Shown flag per column key, edited through the column chooser. Starts with the columns that are not `hidden`;
	 * with a `storageKey`, the saved choice applies to the columns it knew, and newer columns start as defaults.
	 */
	private readonly narrow = globalThis.matchMedia?.('(max-width: 639px)').matches ?? false;
	private readonly hintPrefix = GridGroups.nextPrefix();

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
		return !column.hidden && !(this.narrow && column.narrowHidden);
	}

	/** The tone that tints the cells of a column, from its group. */
	toneOf(column: GridColumn<T>) {
		return GridGroups.tone(column, this.groups());
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
