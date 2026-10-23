import { Component, inject } from '@angular/core';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { SectorMapLinkComponent } from '../../shared/components/sector-map-link.component';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import type { EventRow } from '../event-log-rows';
import { EventLogStore } from '../event-log-store';
import { EventLogColumns } from './event-log-columns';

/** The logbook entries the filters leave, newest first. */
@Component({
	selector: 'app-event-log-events',
	imports: [DataGridComponent, FactionLabelComponent, SectorMapLinkComponent],
	templateUrl: './event-log-events.component.html',
})
export class EventLogEventsComponent {
	protected readonly store = inject(EventLogStore);
	protected readonly columns = new EventLogColumns();
	protected readonly pageSizes = [20, 50, 100, 250];
	protected readonly trackBy = (row: EventRow) => row.id;
}
