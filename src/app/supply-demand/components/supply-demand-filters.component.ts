import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MoreFiltersComponent } from '../../shared/components/more-filters.component';
import { SupplyDemandStore } from '../supply-demand-store';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { OptionSelectComponent } from '../../shared/components/option-select.component';

/**
 * The filters of the supply and demand page: the scope and the ware group in view, the station and mined resource
 * switches (less used) under "More filters".
 */
@Component({
	selector: 'app-supply-demand-filters',
	imports: [OptionSelectComponent, SectorInputComponent, FormField, MoreFiltersComponent],
	templateUrl: './supply-demand-filters.component.html',
})
export class SupplyDemandFiltersComponent {
	protected readonly store = inject(SupplyDemandStore);
	protected readonly form = this.store.form;
}
