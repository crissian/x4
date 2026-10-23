import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { StationSuggestionsQuery } from '../station-suggestions-query';
import { StationSuggestionsStore } from '../station-suggestions-store';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { SearchableSelectComponent } from '../../shared/components/searchable-select/searchable-select.component';

/** The mode, ware, sector, reach and station filters of the station suggestions page. */
@Component({
	selector: 'app-station-suggestions-filters',
	imports: [OptionSelectComponent, SearchableSelectComponent, SectorInputComponent, FormField],
	templateUrl: './station-suggestions-filters.component.html',
})
export class StationSuggestionsFiltersComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly form = this.store.form;
	protected readonly modes = StationSuggestionsQuery;
	/** The wares a factory can be suggested for (about 50), searchable. */
	protected readonly wareOptions = computed(() => this.store.wares().map(({ id, name }) => ({ id, name })));
}
