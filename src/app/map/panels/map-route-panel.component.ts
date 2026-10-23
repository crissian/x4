import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { EnumLabelPipe } from '../../core/enum-labels';
import { MapStore } from '../map-store';
import { StepType } from '../route-planner';
import { JumpsPipe } from '../../core/format/jumps.pipe';
import { Duration } from '../../core/format/duration';
import { SectorInputComponent } from '../../shared/components/sector-input.component';

@Component({
	selector: 'app-map-route-panel',
	imports: [SectorInputComponent, JumpsPipe, DecimalPipe, EnumLabelPipe, FormField, RouterLink],
	templateUrl: './map-route-panel.component.html',
})
export class MapRoutePanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.routeForm;
	protected readonly duration = Duration.short;
	protected readonly stepLabels: Record<Exclude<StepType, 'start'>, string> = {
		gate: $localize`gate`,
		accelerator: $localize`accelerator`,
		highway: $localize`highway`,
	};
}
