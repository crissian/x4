import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MapStore } from '../map-store';
import { MinersNeededComponent } from './miners-needed.component';
import { MiningBuyersStore } from './mining-buyers-store';
import { JumpsPipe } from '../../core/format/jumps.pipe';
import { Duration } from '../../core/format/duration';

/** The Mining tab's table with a save: the best buyer per mining sector, expanding to its top buyers. */
@Component({
	selector: 'app-mining-buyers-table',
	imports: [JumpsPipe, DecimalPipe, FormField, MinersNeededComponent],
	templateUrl: './mining-buyers-table.component.html',
})
export class MiningBuyersTableComponent {
	protected readonly store = inject(MiningBuyersStore);
	protected readonly map = inject(MapStore);
	protected readonly duration = Duration.short;
}
