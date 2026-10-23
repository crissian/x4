import { Duration } from '../../core/format/duration';
import type { GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import type { TerraformingProjectRow } from '../terraforming-planet-state';

/** A row of the planet's project list. */
export interface TerraformingGridRow {
	id: string;
	row: TerraformingProjectRow;
	group: string;
	conditions: string;
	effects: string;
	/** the wares with their amounts, as text */
	wares: string;
	/** the save's wares at average prices; undefined for the library's proportions */
	value?: number;
	predecessors: string;
}

/** The data grid columns of the terraforming project list. */
export class TerraformingColumns {
	static readonly SORT: SortState = { key: 'name', direction: 1 };

	/** @param labels the game's menu texts: conditions, primary effects, duration, times completed */
	static build(labels: {
		conditions: string;
		effects: string;
		duration: string;
		completed: string;
		required: string;
	}): GridColumn<TerraformingGridRow>[] {
		return [
			{
				key: 'name',
				caption: $localize`Project`,
				value: (x) => x.row.name,
				link: (x) => (x.row.project ? ['/terraforming/projects', x.id] : undefined),
				hideable: false,
			},
			{ key: 'group', caption: $localize`Group`, value: (x) => x.group },
			{ key: 'conditions', caption: labels.conditions, value: (x) => x.conditions },
			{ key: 'effects', caption: labels.effects, value: (x) => x.effects },
			{ key: 'predecessors', caption: labels.required, value: (x) => x.predecessors },
			{ key: 'wares', caption: $localize`Wares`, value: (x) => x.wares, sortValue: (x) => x.value ?? -1 },
			{ key: 'value', caption: $localize`Wares value (Cr)`, type: 'number', value: (x) => x.value },
			{
				key: 'duration',
				caption: labels.duration,
				type: 'number',
				value: (x) => x.row.project?.duration,
				display: (x) => (x.row.project?.duration ? Duration.short(x.row.project.duration) : ''),
				filterable: false,
			},
			{ key: 'completed', caption: labels.completed, type: 'number', value: (x) => x.row.completed || undefined },
		];
	}
}
