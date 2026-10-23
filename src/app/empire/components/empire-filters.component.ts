import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { OptionSelectComponent } from '../../shared/components/option-select.component';
import { EmpireStore } from '../empire-store';

/** The empire page's filters: text and sector for both tabs, size and role for the ships. */
@Component({
	selector: 'app-empire-filters',
	imports: [FormField, OptionSelectComponent],
	templateUrl: './empire-filters.component.html',
})
export class EmpireFiltersComponent {
	protected readonly store = inject(EmpireStore);
	protected readonly form = this.store.form;
}
