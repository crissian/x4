import { Component, input, output } from '@angular/core';

/** One label/count line of a stat tile. */
export interface StatTileItem {
	key: string;
	label: string;
	count: number;
	/** shown muted, e.g. for an "unknown" bucket */
	muted?: boolean;
}

/**
 * A small summary tile for the rows on top of a page: a label over a large value and an optional muted line, or
 * over label/count lines. With `pickTitle`, the line labels are buttons that emit their key, e.g. to filter by it.
 */
@Component({
	selector: 'app-stat-tile',
	templateUrl: './stat-tile.component.html',
	host: { class: 'block rounded-md border border-line bg-surface-2 px-3 py-2' },
})
export class StatTileComponent {
	readonly label = input.required<string>();
	readonly value = input<string | number>();
	/** a muted line below the value, such as a breakdown */
	readonly detail = input<string>();
	/** label/count lines below the label, instead of or after the value */
	readonly items = input<readonly StatTileItem[]>();
	/** Tooltip of the line buttons; without one the line labels are plain text. */
	readonly pickTitle = input<string>();
	/** Shown when `items` is empty. */
	readonly empty = input('-');

	readonly picked = output<string>();
}
