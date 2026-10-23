import { Component, input } from '@angular/core';

/** A small tile with a label, a large value and an optional line below, for summary rows on top of a page. */
@Component({
	selector: 'app-stat-tile',
	templateUrl: './stat-tile.component.html',
	host: { class: 'block rounded-md border border-line bg-surface-2 px-3 py-2' },
})
export class StatTileComponent {
	readonly label = input.required<string>();
	readonly value = input.required<string>();
	/** a muted line below the value, such as a breakdown */
	readonly detail = input<string>();
}
