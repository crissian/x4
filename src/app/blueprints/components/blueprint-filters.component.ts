import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { BlueprintsStore } from '../blueprints-store';

/** The category, search and completion filters of the blueprints page. */
@Component({
	selector: 'app-blueprint-filters',
	imports: [FormField],
	templateUrl: './blueprint-filters.component.html',
})
export class BlueprintFiltersComponent {
	protected readonly store = inject(BlueprintsStore);
	protected readonly form = this.store.form;
}
