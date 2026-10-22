import { Component, input } from '@angular/core';

/** A small round badge with a count and a hover title, drawn inside an SVG. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapCountBadge]',
	templateUrl: './map-count-badge.html',
})
export class MapCountBadge {
	readonly x = input.required<number>();
	readonly y = input.required<number>();
	readonly count = input.required<number>();
	readonly title = input('');
	/** in map units */
	readonly radius = input(1);
	/** false hides the number when the badge is too small to read */
	readonly showCount = input(true);
	readonly color = input('#38bdf8');
}
