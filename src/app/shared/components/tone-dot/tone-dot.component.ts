import { Component, input } from '@angular/core';

/** The colour of a dot or a header tint. */
export type Tone = 'red' | 'orange' | 'amber' | 'green' | 'teal' | 'grey';

/** A small coloured dot; level 1 is the palest shade and 3 the strongest. Decorative: the text next to it says it. */
@Component({
	selector: 'app-tone-dot',
	templateUrl: './tone-dot.component.html',
	styleUrl: './tone-dot.component.css',
	host: { '[attr.data-tone]': 'tone()', '[attr.data-level]': 'level()', 'aria-hidden': 'true' },
})
export class ToneDotComponent {
	readonly tone = input.required<Tone>();
	readonly level = input<1 | 2 | 3>(3);
}
