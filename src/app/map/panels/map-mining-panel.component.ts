import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../core/enum-labels';
import { MapStore } from '../map-store';
import { RoutePlanner } from '../route-planner';

@Component({
	selector: 'app-map-mining-panel',
	imports: [DecimalPipe, EnumLabelPipe, FormField, RouterLink],
	templateUrl: './map-mining-panel.component.html',
})
export class MapMiningPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.miningForm;
	protected readonly routes = RoutePlanner;
}
