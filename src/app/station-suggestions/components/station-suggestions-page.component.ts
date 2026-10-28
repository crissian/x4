import { Component, computed, inject } from '@angular/core';
import { PlacementRanking } from '../../economy/placement-ranking';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import type { StationSuggestionRow } from '../station-suggestions-row';
import { StationSuggestionsStore } from '../station-suggestions-store';
import { StationSuggestionsColumns } from './station-suggestions-columns';
import { StationSuggestionsDetailComponent } from './station-suggestions-detail.component';
import { StationSuggestionsFiltersComponent } from './station-suggestions-filters.component';
import { StationSuggestionsHelpComponent } from './station-suggestions-help.component';
import { StationSuggestionsMapComponent } from './station-suggestions-map.component';
import { SavePageComponent } from '../../shared/components/save-page/save-page.component';

/** Suggests where to build a factory, or what to build in a sector, from the shortages around each sector. */
@Component({
	imports: [
		DataGridComponent,
		SavePageComponent,
		StationSuggestionsFiltersComponent,
		StationSuggestionsHelpComponent,
		StationSuggestionsMapComponent,
		StationSuggestionsDetailComponent,
	],
	templateUrl: './station-suggestions-page.component.html',
	providers: [StationSuggestionsStore],
})
export default class StationSuggestionsPageComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly columns = computed(() =>
		StationSuggestionsColumns.all((id) => this.store.wareName(id), this.store.closed())
	);
	protected readonly trackBy = (row: StationSuggestionRow) => row.key;
	protected readonly maxRows = PlacementRanking.MAX_ROWS;
	/** More spots were found than listed. */
	protected readonly cut = computed(() => this.store.result().total > this.store.rows().length);
}
