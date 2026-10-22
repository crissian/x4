import type { GridColumn } from './data-grid.component';

/** A data row with the raw value and the cell text of each column. */
export interface PreparedRow<T> {
	row: T;
	values: Record<string, unknown>;
	texts: Record<string, string>;
}

/** Reads, formats, filters and compares the cell values of `DataGridComponent` columns. */
export class GridValues {
	/** A number filter: an optional comparison operator and a number. */
	private static readonly NUMBER_FILTER = /^\s*(<=|>=|<>|!=|<|>|=)?\s*(-?\d+(?:[.,]\d+)?)\s*$/;

	static toText<T>(column: GridColumn<T>, row: T, value: unknown, formatter?: Intl.NumberFormat): string {
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

	static matches<T>(column: GridColumn<T>, row: PreparedRow<T>, filter: string) {
		if (column.lookup) {
			return String(row.values[column.key] ?? '') === filter;
		}
		if (column.type === 'number') {
			return GridValues.matchesNumber(row.values[column.key], filter);
		}
		return row.texts[column.key].toLowerCase().includes(filter.trim().toLowerCase());
	}

	static getPath(row: unknown, path: string): unknown {
		return path
			.split('.')
			.reduce<unknown>((obj, key) => (obj == null ? undefined : (obj as Record<string, unknown>)[key]), row);
	}

	static compareValues(a: unknown, b: unknown): number {
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

	private static matchesNumber(value: unknown, filter: string): boolean {
		const match = GridValues.NUMBER_FILTER.exec(filter);
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
}
