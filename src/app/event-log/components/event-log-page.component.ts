import { Component, computed, inject } from '@angular/core';
import { SavePageComponent } from '../../shared/components/save-page/save-page.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import type { EventLogTab } from '../event-log-query';
import { EventLogStore } from '../event-log-store';
import { EventLogEventsComponent } from './event-log-events.component';
import { EventLogFiltersComponent } from './event-log-filters.component';
import { LossesComponent } from './losses.component';

/** The logbook of the active save, and the ships the player lost. */
@Component({
	imports: [EventLogEventsComponent, EventLogFiltersComponent, SavePageComponent, LossesComponent, TabsComponent],
	templateUrl: './event-log-page.component.html',
	providers: [EventLogStore],
})
export default class EventLogPageComponent {
	protected readonly store = inject(EventLogStore);

	protected readonly tabs = computed<TabItem<EventLogTab>[]>(() => [
		{ id: 'events', label: $localize`:event log tab:Events`, count: this.store.filteredEvents().length },
		{ id: 'losses', label: $localize`:event log tab:Losses`, count: this.store.filteredLosses().length },
	]);
}
