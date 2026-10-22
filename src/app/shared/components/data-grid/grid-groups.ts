import type { GridColumn, GridGroup, GridTone } from './grid-column';

/** A header cell above the column headers: a group label spanning its visible columns, or a gap. */
export interface GridGroupHeader {
	/** the group key, empty for columns without a group */
	key: string;
	label: string;
	hint?: string;
	tone?: GridTone;
	span: number;
	/** id of the element holding the hint, for `aria-describedby` */
	hintId: string;
}

/** Works out the group header row and the grouped column chooser of `DataGridComponent`. */
export class GridGroups {
	private static counter = 0;

	/** A unique prefix for the ids of the hints of one grid. */
	static nextPrefix(): string {
		return `grid-${++GridGroups.counter}`;
	}

	/** Runs of neighbouring visible columns of the same group; none when no visible column has a group. */
	static headers<T>(
		columns: readonly GridColumn<T>[],
		groups: readonly GridGroup[],
		prefix: string
	): GridGroupHeader[] {
		if (!columns.some((x) => groups.some((g) => g.key === x.group))) {
			return [];
		}
		const result: GridGroupHeader[] = [];
		for (const column of columns) {
			const group = groups.find((x) => x.key === column.group);
			const key = group?.key ?? '';
			const last = result[result.length - 1];
			if (last && last.key === key) {
				last.span++;
			} else {
				result.push({
					key,
					label: group?.label ?? '',
					hint: group?.hint,
					tone: group?.tone,
					span: 1,
					hintId: `${prefix}-${result.length}`,
				});
			}
		}
		return result;
	}

	/** The tone of a column's group, which tints its cells. */
	static tone<T>(column: GridColumn<T>, groups: readonly GridGroup[]): GridTone | null {
		return groups.find((x) => x.key === column.group)?.tone ?? null;
	}

	/** The columns for the chooser, each with the label of its group when it starts a new one. */
	static chooser<T>(
		columns: readonly GridColumn<T>[],
		groups: readonly GridGroup[]
	): { column: GridColumn<T>; heading?: string; separated?: boolean }[] {
		let previous: string | undefined;
		return columns.map((column) => {
			const group = groups.find((x) => x.key === column.group);
			const heading = group && group.key !== previous ? group.label : undefined;
			// a column without a group right after a group is set apart from it
			const separated = !group && previous !== undefined;
			previous = group?.key;
			return { column, heading, separated };
		});
	}
}
