import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ResearchData } from '../research-model';

/** Links to the research projects unlocking something, for the detail pages of what they unlock. */
@Component({
	selector: 'app-research-needed',
	imports: [RouterLink],
	templateUrl: './research-needed.component.html',
})
export class ResearchNeededComponent {
	readonly projects = input.required<readonly ResearchData[]>();
}
