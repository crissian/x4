import { Component, input } from '@angular/core';
import { DataGridComponent, GridColumn } from './data-grid/data-grid.component';
import { RowNavigation } from './row-navigation';

/**
 * A list page: a card with the heading (and the projected `[actions]`) over the projected `[intro]`, the data grid
 * and the projected `[footer]`. A clicked row opens its detail page under the current route.
 */
@Component({
	selector: 'app-list-page',
	imports: [DataGridComponent],
	templateUrl: './list-page.component.html',
})
export class ListPageComponent<T extends { id: string }> {
	readonly heading = input.required<string>();
	readonly data = input.required<readonly T[]>();
	readonly columns = input.required<readonly GridColumn<T>[]>();
	/** Keeps the grid's column and page size choices under this key. */
	readonly storageKey = input<string>();

	protected readonly open = RowNavigation.inject<T>();
}
