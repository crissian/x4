import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { EnumLabelPipe, EnumLabels } from '../../core/enum-labels';
import { TradeRoutesStore } from '../trade-routes-store';

/** The ship, location and ware filters of the trade routes page. */
@Component({
	selector: 'app-trade-route-filters',
	imports: [DecimalPipe, EnumLabelPipe, FormField],
	templateUrl: './trade-route-filters.component.html',
})
export class TradeRouteFiltersComponent {
	protected readonly store = inject(TradeRoutesStore);
	protected readonly form = this.store.form;
	protected readonly custom = TradeRoutesStore.CUSTOM;
	protected readonly cargoTypes = TradeRoutesStore.CARGO_TYPES.map((id) => ({
		id,
		label: EnumLabels.label(id.charAt(0).toUpperCase() + id.slice(1)),
	}));
}
