import { Component, input } from '@angular/core';

/** A small round swatch of a given colour, such as a faction or station type colour. Decorative: the text next to it says it. */
@Component({
	selector: 'app-color-dot',
	templateUrl: './color-dot.component.html',
	styleUrl: './color-dot.component.css',
	host: { '[style.background]': 'color()', '[attr.data-size]': 'size()', 'aria-hidden': 'true' },
})
export class ColorDotComponent {
	/** Any CSS colour. */
	readonly color = input<string>();
	readonly size = input<'sm' | 'md'>('md');
}
