import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { SupplyDemandStore } from '../supply-demand-store';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';

/** The scope, ware group and station filters of the supply and demand page. */
@Component({
	selector: 'app-supply-demand-filters',
	imports: [OptionSelectComponent, SectorInputComponent, FormField],
	templateUrl: './supply-demand-filters.component.html',
})
export class SupplyDemandFiltersComponent {
	protected readonly store = inject(SupplyDemandStore);
	protected readonly form = this.store.form;
}
