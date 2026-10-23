import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { StationSuggestionsQuery } from '../station-suggestions-query';
import { StationSuggestionsStore } from '../station-suggestions-store';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';

/** The mode, ware, sector, reach and station filters of the station suggestions page. */
@Component({
	selector: 'app-station-suggestions-filters',
	imports: [OptionSelectComponent, SectorInputComponent, FormField],
	templateUrl: './station-suggestions-filters.component.html',
})
export class StationSuggestionsFiltersComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly form = this.store.form;
	protected readonly modes = StationSuggestionsQuery;
}
