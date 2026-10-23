import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnumLabels } from '../../core/enum-labels';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import type { LossRow } from '../event-log-rows';
import { EventLogStore } from '../event-log-store';
import { CountTileComponent, type CountTileItem } from './count-tile.component';
import { EventLogColumns } from './event-log-columns';
import { SectorLinksComponent } from './sector-links.component';

/** The player-owned ships the log reports destroyed: totals per class, sector and enemy faction, then the list. */
@Component({
	selector: 'app-ship-losses',
	imports: [CountTileComponent, DataGridComponent, FactionLabelComponent, RouterLink, SectorLinksComponent],
	templateUrl: './ship-losses.component.html',
})
export class ShipLossesComponent {
	protected readonly store = inject(EventLogStore);
	protected readonly columns = new EventLogColumns();
	protected readonly pageSizes = [20, 50, 100, 250];
	protected readonly trackBy = (row: LossRow) => row.id;

	protected readonly sizes = computed<CountTileItem[]>(() =>
		this.store.summary().bySize.map((x) => ({
			key: x.key,
			label: x.value ? EnumLabels.label(x.value) : $localize`Unknown type`,
			count: x.count,
			muted: !x.value,
		}))
	);
	protected readonly sectors = computed<CountTileItem[]>(() =>
		this.store.summary().bySector.map((x) => ({ key: x.key, label: x.value?.name ?? x.key, count: x.count }))
	);
	protected readonly factions = computed<CountTileItem[]>(() =>
		this.store.summary().byFaction.map((x) => ({ key: x.key, label: x.value?.name ?? x.key, count: x.count }))
	);
}
