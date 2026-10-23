import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { EventLogQuery } from '../event-log-query';
import { EventLogStore } from '../event-log-store';

/** The search, category, faction, sector and time filters of the event log page. */
@Component({
	selector: 'app-event-log-filters',
	imports: [FormField],
	templateUrl: './event-log-filters.component.html',
})
export class EventLogFiltersComponent {
	protected readonly store = inject(EventLogStore);
	protected readonly form = this.store.form;
	protected readonly since = EventLogQuery.SINCE;
	protected readonly entryPlaceholder = $localize`Title or text`;
	protected readonly shipPlaceholder = $localize`Ship, type or killer`;
}
