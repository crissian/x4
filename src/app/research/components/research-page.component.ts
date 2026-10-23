import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NumberFormats } from '../../core/format/number-formats';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { ExperimentalBadgeComponent } from '../../shared/components/experimental-badge.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { WareService } from '../../shared/services/ware.service';
import type { ResearchView } from '../research-query';
import { ResearchStore } from '../research-store';
import { ResearchColumns, type ResearchRow } from './research-columns';
import { ResearchDetailComponent } from './research-detail.component';
import { ResearchGraphComponent } from './research-graph.component';
import { ResearchNextComponent } from './research-next.component';

/**
 * The research projects of the player's headquarters as a tree and a list, with the research done in the active
 * save: what can be started next, what a project costs and what it still takes from the research done.
 */
@Component({
	imports: [
		DataGridComponent,
		ExperimentalBadgeComponent,
		FormField,
		ResearchDetailComponent,
		ResearchGraphComponent,
		ResearchNextComponent,
		RouterLink,
		TabsComponent,
	],
	templateUrl: './research-page.component.html',
	providers: [ResearchStore],
})
export default class ResearchPageComponent {
	protected readonly store = inject(ResearchStore);
	private readonly wares = inject(WareService);

	protected readonly columns = ResearchColumns.build();
	protected readonly sort = ResearchColumns.SORT;
	protected readonly trackBy = (row: ResearchRow) => row.id;
	protected readonly tabs: TabItem<ResearchView>[] = [
		{ id: 'tree', label: $localize`:research view:Tree` },
		{ id: 'list', label: $localize`:research view:List` },
	];

	protected readonly rows = computed<ResearchRow[]>(() => {
		const progress = this.store.progress();
		return this.store.rows().map((project) => ({
			id: project.id,
			project,
			state: progress.state(project),
			value: this.store.value(project.wares),
			cost: project.wares
				.map((x) => `${this.wares.getEntity(x.ware)?.name ?? x.ware} ${NumberFormats.whole(x.amount)}`)
				.join(', '),
			requires: progress
				.requires(project)
				.map((x) => x.name)
				.join(', '),
		}));
	});
	protected readonly selectedRow = computed(() => this.rows().find((x) => x.id === this.store.selectedId()));
}
