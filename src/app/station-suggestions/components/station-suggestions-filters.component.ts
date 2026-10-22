import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { StationSuggestionsQuery } from '../station-suggestions-query';
import { StationSuggestionsStore } from '../station-suggestions-store';

/** The mode, ware, sector, reach and station filters of the station suggestions page. */
@Component({
	selector: 'app-station-suggestions-filters',
	imports: [FormField],
	templateUrl: './station-suggestions-filters.component.html',
})
export class StationSuggestionsFiltersComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly form = this.store.form;
	protected readonly modes = StationSuggestionsQuery;
}
