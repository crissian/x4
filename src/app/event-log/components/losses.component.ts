import { Component, computed, inject } from '@angular/core';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import type { LossRow } from '../event-log-rows';
import { EventLogStore } from '../event-log-store';
import { CountTileComponent, type CountTileItem } from './count-tile.component';
import { EventLogColumns } from './event-log-columns';
import { SectorLinksComponent } from './sector-links.component';

/** The player-owned ships and stations the log reports destroyed: totals per sector and killer, then the list. */
@Component({
	selector: 'app-losses',
	imports: [CountTileComponent, DataGridComponent, SectorLinksComponent],
	templateUrl: './losses.component.html',
})
export class LossesComponent {
	protected readonly store = inject(EventLogStore);
	protected readonly columns = new EventLogColumns();
	protected readonly pageSizes = [20, 50, 100, 250];
	protected readonly trackBy = (row: LossRow) => row.id;

	protected readonly sectors = computed<CountTileItem[]>(() =>
		this.store.summary().bySector.map((x) => ({ key: x.key, label: x.value?.name ?? x.key, count: x.count }))
	);
	protected readonly killers = computed<CountTileItem[]>(() =>
		this.store.summary().byKiller.map((x) => ({ key: x.key, label: x.key, count: x.count }))
	);
}
