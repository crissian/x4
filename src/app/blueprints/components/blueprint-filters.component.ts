import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { BlueprintsStore } from '../blueprints-store';

/** The category, search and completion filters of the blueprints page, and the shopping list's seller and money ones. */
@Component({
	selector: 'app-blueprint-filters',
	imports: [DecimalPipe, FormField],
	templateUrl: './blueprint-filters.component.html',
})
export class BlueprintFiltersComponent {
	protected readonly store = inject(BlueprintsStore);
	protected readonly form = this.store.form;
}
