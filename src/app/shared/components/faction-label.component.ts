import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ColorDotComponent } from './color-dot.component';

/** What a faction label needs of a faction. */
export interface FactionLabelFaction {
	id: string;
	name: string;
	color?: string;
}

/**
 * A faction's colour dot and name, linking to its page. Without a faction the projected content is shown instead,
 * e.g. `<app-faction-label [faction]="owner"><ng-container i18n>Unclaimed</ng-container></app-faction-label>`.
 */
@Component({
	selector: 'app-faction-label',
	imports: [RouterLink, ColorDotComponent],
	templateUrl: './faction-label.component.html',
})
export class FactionLabelComponent {
	readonly faction = input<FactionLabelFaction | null>();
	/** Links the name to the faction page. */
	readonly link = input(true);
	/** Shows the faction colour in front of the name. */
	readonly dot = input(true);
	readonly size = input<'sm' | 'md'>('sm');
}
