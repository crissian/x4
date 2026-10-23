import { Duration } from '../../core/format/duration';
import type { GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { ResearchLabels } from '../research-labels';
import type { ResearchData, ResearchState } from '../research-model';
import { ResearchProgress } from '../research-progress';

/** A row of the research list. */
export interface ResearchRow {
	id: string;
	project: ResearchData;
	state: ResearchState;
	/** the wares at average prices */
	value: number;
	/** the wares with their amounts, as text */
	cost: string;
	requires: string;
}

/** The data grid columns of the research list; the name cell is a template of the page. */
export class ResearchColumns {
	static readonly SORT: SortState = { key: 'state', direction: 1 };
	/** keeps a time on one line */
	private static readonly NO_BREAK = String.fromCharCode(0xa0);
	private static readonly STATES: readonly ResearchState[] = ['available', 'locked', 'story', 'mission', 'done'];

	static build(): GridColumn<ResearchRow>[] {
		return [
			{ key: 'name', caption: $localize`Project`, value: (x) => x.project.name, hideable: false },
			{
				key: 'state',
				caption: $localize`State`,
				value: (x) => x.state,
				sortValue: (x) => ResearchProgress.rank(x.state) * 1000 + x.project.sortOrder,
				lookup: ResearchColumns.STATES.map((value) => ({ value, label: ResearchLabels.state(value) })),
				dot: (x) => ({ tone: ResearchLabels.TONES[x.state], level: 3 }),
			},
			{
				key: 'time',
				caption: $localize`Time`,
				type: 'number',
				value: (x) => x.project.time,
				display: (x) => Duration.short(x.project.time).replace(' ', ResearchColumns.NO_BREAK),
				filterable: false,
			},
			{ key: 'cost', caption: $localize`Wares`, value: (x) => x.cost, sortValue: (x) => x.value },
			{ key: 'value', caption: $localize`Cost value (Cr)`, type: 'number', value: (x) => x.value },
			{ key: 'requires', caption: $localize`Requires`, value: (x) => x.requires },
			{
				key: 'unlocks',
				caption: $localize`Unlocks`,
				type: 'number',
				value: (x) => x.project.unlocks.length,
				title: (x) => x.project.unlocks.map((u) => u.name).join('\n') || undefined,
			},
		];
	}
}
