import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../core/enum-labels';
import { MapStore } from '../map-store';
import { RoutePlanner, StepType } from '../route-planner';

@Component({
	selector: 'app-map-route-panel',
	imports: [DecimalPipe, EnumLabelPipe, FormField, RouterLink],
	templateUrl: './map-route-panel.component.html',
})
export class MapRoutePanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.routeForm;
	protected readonly routes = RoutePlanner;
	protected readonly stepLabels: Record<Exclude<StepType, 'start'>, string> = {
		gate: $localize`gate`,
		accelerator: $localize`accelerator`,
		highway: $localize`highway`,
	};
}
