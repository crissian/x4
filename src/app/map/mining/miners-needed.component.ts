import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { MinersEstimate } from './miners-needed';

/** The miners a buyer needs: built capacity and the demand at save time, kept apart and labelled. */
@Component({
	selector: 'app-miners-needed',
	imports: [DecimalPipe],
	templateUrl: './miners-needed.component.html',
})
export class MinersNeededComponent {
	readonly estimate = input.required<MinersEstimate>();
	/** the miner's name */
	readonly miner = input.required<string>();
	/** the save's game time */
	readonly gameTime = input.required<string>();
}
