import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NumberFormats } from '../../core/format/number-formats';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { ExperimentalBadgeComponent } from '../../shared/components/experimental-badge.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { SectorMapLinkComponent } from '../../shared/components/sector-map-link.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { WareService } from '../../shared/services/ware.service';
import type { TerraformingView } from '../terraforming-query';
import { TerraformingStore } from '../terraforming-store';
import { TerraformingColumns, type TerraformingGridRow } from './terraforming-columns';
import { TerraformingGraphComponent } from './terraforming-graph.component';
import { TerraformingStatsComponent } from './terraforming-stats.component';

/**
 * The terraforming planner: pick a planet to see its stats on the game's ranges and the projects it offers, with
 * what each costs, does and needs; from the active save, or without one as the game's scripts set the planet up.
 */
@Component({
	imports: [
		DataGridComponent,
		ExperimentalBadgeComponent,
		FormField,
		OptionSelectComponent,
		RouterLink,
		SectorMapLinkComponent,
		TabsComponent,
		TerraformingGraphComponent,
		TerraformingStatsComponent,
	],
	templateUrl: './terraforming-page.component.html',
	providers: [TerraformingStore],
})
export default class TerraformingPageComponent {
	protected readonly store = inject(TerraformingStore);
	private readonly wares = inject(WareService);

	protected readonly label = (key: string) => this.store.catalog.label(key);
	protected readonly columns = TerraformingColumns.build({
		conditions: this.label('conditions'),
		effects: this.label('primaryEffects'),
		duration: this.label('duration'),
		completed: this.label('timesCompleted'),
		required: this.label('requiredProjects'),
	});
	protected readonly sort = TerraformingColumns.SORT;
	protected readonly trackBy = (row: TerraformingGridRow) => row.id;
	protected readonly tabs: TabItem<TerraformingView>[] = [
		{ id: 'list', label: $localize`:terraforming view:List` },
		{ id: 'graph', label: $localize`:terraforming view:Graph` },
	];

	protected readonly rows = computed<TerraformingGridRow[]>(() => {
		const { catalog, text } = this.store;
		return (this.store.state()?.projects ?? []).map((row) => ({
			id: row.id,
			row,
			group: row.project ? catalog.groupName(row.project.group) : '',
			conditions: (row.project?.conditions ?? []).flatMap((x) => text.condition(x) ?? []).join(', '),
			effects: (row.project?.effects ?? []).map((x) => text.effect(x)).join(', '),
			wares: row.wares
				.map((x) => `${this.wares.getEntity(x.ware)?.name ?? x.ware} ${NumberFormats.whole(x.amount)}`)
				.join(', '),
			value: row.scaled ? this.store.value(row.wares) : undefined,
			predecessors: row.predecessors.map((x) => catalog.projectName(x)).join(row.any ? ' / ' : ', '),
		}));
	});
	protected readonly count = computed(() => this.store.state()?.projects.length ?? 0);
}
