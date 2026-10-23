import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCalculator } from '@lucide/angular';
import { StationLayoutLink } from '../../station/station-layout-link';
import type { OwnStationLayout } from '../own-station-layout';

/**
 * Opens a player station of the save in the station calculator, and names what the calculator leaves out: modules
 * the site doesn't know and modules still being built.
 */
@Component({
	selector: 'app-station-calculator-link',
	imports: [LucideCalculator, RouterLink],
	templateUrl: './station-calculator-link.component.html',
})
export class StationCalculatorLinkComponent {
	readonly layout = input.required<OwnStationLayout>();
	protected readonly path = StationLayoutLink.PATH;
}
