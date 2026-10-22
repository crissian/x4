import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { StationModuleModel, StationResourceModel, StationSettings } from '../station-calculator.model';
import { StationCostsComponent } from './station-costs.component';
import { StationProfitComponent } from './station-profit.component';
import { StationStorageComponent } from './station-storage.component';
import { StationWorkforceComponent } from './station-workforce.component';

/**
 * The Station Summary component: workforce, hourly profit, storage and build costs of the station.
 */
@Component({
	selector: 'app-station-summary',
	imports: [StationWorkforceComponent, StationProfitComponent, StationStorageComponent, StationCostsComponent],
	templateUrl: './station-summary.component.html',
})
export class StationSummaryComponent {
	readonly modules = input.required<StationModuleModel[]>();
	readonly resources = input.required<StationResourceModel[]>();
	readonly workforce = input.required<{ value: number; capacity: number }>();
	readonly settings = input.required<FieldTree<StationSettings>>();
}
