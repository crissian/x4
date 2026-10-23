import { Component, input, output } from '@angular/core';

/** One line of a count tile. */
export interface CountTileItem {
	key: string;
	label: string;
	count: number;
	/** shown muted, e.g. for an "unknown" bucket */
	muted?: boolean;
}

/**
 * A compact summary tile: a heading over label/count lines. With `pickTitle`, the labels are buttons that emit their
 * key, e.g. to filter by it.
 */
@Component({
	selector: 'app-count-tile',
	templateUrl: './count-tile.component.html',
})
export class CountTileComponent {
	readonly heading = input.required<string>();
	readonly items = input.required<readonly CountTileItem[]>();
	/** Tooltip of the label buttons; without one the labels are plain text. */
	readonly pickTitle = input<string>();
	/** Shown when there are no items. */
	readonly empty = input('-');

	readonly picked = output<string>();
}
