import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MapStore } from '../map-store';
import { RoutePlanner } from '../route-planner';
import { MinersNeededComponent } from './miners-needed.component';
import { MiningBuyersStore } from './mining-buyers-store';

/** The Mining tab's table with a save: the best buyer per mining sector, expanding to its top buyers. */
@Component({
	selector: 'app-mining-buyers-table',
	imports: [DecimalPipe, FormField, MinersNeededComponent],
	templateUrl: './mining-buyers-table.component.html',
})
export class MiningBuyersTableComponent {
	protected readonly store = inject(MiningBuyersStore);
	protected readonly map = inject(MapStore);
	protected readonly routes = RoutePlanner;
}
