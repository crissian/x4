import type { Params } from '@angular/router';
import type { Tone } from '../tone-dot/tone-dot.component';

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

/** The context of a cell template (`DataGridComponent.cells`): the row as `let-row`. */
export interface GridCell<T> {
	$implicit: T;
}

export interface SortState {
	key: string;
	direction: 1 | -1;
}
