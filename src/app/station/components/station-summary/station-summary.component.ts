import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { StationModuleModel, StationResourceModel, StationSettings } from '../station-calculator.model';
import { StationCostsComponent } from './station-costs.component';
import { StationProfitComponent } from './station-profit.component';
import { StationWorkforceComponent } from './station-workforce.component';

/**
 * The Station Summary component: workforce, hourly profit and build costs of the station.
 */
@Component({
	selector: 'app-station-summary',
	imports: [StationWorkforceComponent, StationProfitComponent, StationCostsComponent],
	host: { class: 'flex flex-col gap-4' },
	template: `
		<app-station-workforce [modules]="modules()" [workforce]="workforce()" [settings]="settings()" />
		<app-station-profit [resources]="resources()" [settings]="settings()" />
		<app-station-costs [modules]="modules()" [settings]="settings()" />
	`,
})
export class StationSummaryComponent {
	readonly modules = input.required<StationModuleModel[]>();
	readonly resources = input.required<StationResourceModel[]>();
	readonly workforce = input.required<{ value: number; capacity: number }>();
	readonly settings = input.required<FieldTree<StationSettings>>();
}
