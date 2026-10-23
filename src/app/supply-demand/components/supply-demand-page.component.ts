import { Component, inject } from '@angular/core';
import { DataGridComponent, SortState } from '../../shared/components/data-grid/data-grid.component';
import { SupplyDemandMapComponent } from './supply-demand-map.component';
import type { SupplyDemandRow } from '../supply-demand-model';
import { SupplyDemandStore } from '../supply-demand-store';
import { SupplyDemandColumns } from './supply-demand-columns';
import { SupplyDemandDetailComponent } from './supply-demand-detail.component';
import { SupplyDemandFiltersComponent } from './supply-demand-filters.component';
import { SupplyDemandHelpComponent } from './supply-demand-help.component';
import { SavePageComponent } from '../../shared/components/save-page/save-page.component';

/** Shows which wares are short or in surplus in the active save, from what its stations make and use. */
@Component({
	imports: [
		DataGridComponent,
		SavePageComponent,
		SupplyDemandFiltersComponent,
		SupplyDemandHelpComponent,
		SupplyDemandMapComponent,
		SupplyDemandDetailComponent,
	],
	templateUrl: './supply-demand-page.component.html',
	providers: [SupplyDemandStore],
})
export default class SupplyDemandPageComponent {
	protected readonly store = inject(SupplyDemandStore);
	protected readonly columns = SupplyDemandColumns.all();
	protected readonly groups = SupplyDemandColumns.groups();
	protected readonly sort: SortState = { key: 'value', direction: 1 };
	protected readonly trackBy = (row: SupplyDemandRow) => row.ware;
}
