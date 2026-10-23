import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { EnumLabels } from '../../core/enum-labels';
import { MapStore } from '../map-store';
import { StepType } from '../route-planner';
import { JumpsPipe } from '../../core/format/jumps.pipe';
import { Duration } from '../../core/format/duration';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { SearchableSelectComponent } from '../../shared/components/searchable-select/searchable-select.component';
import { ShipPickerOptions } from '../../savegame/own-ships/ship-picker-options';

@Component({
	selector: 'app-map-route-panel',
	imports: [SectorInputComponent, SearchableSelectComponent, JumpsPipe, DecimalPipe, FormField, RouterLink],
	templateUrl: './map-route-panel.component.html',
})
export class MapRoutePanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.routeForm;
	protected readonly duration = Duration.short;
	/** The player's ships by size, then the ship models; searched by name, model and sector. */
	protected readonly shipOptions = computed(() => [
		...ShipPickerOptions.own(this.store.routeOwnShips(), (own) => `${own.model.name} · ${own.sectorName}`),
		...ShipPickerOptions.models(this.store.routeShips, (ship) => EnumLabels.label(ship.size)),
	]);
	protected readonly stepLabels: Record<Exclude<StepType, 'start'>, string> = {
		gate: $localize`gate`,
		accelerator: $localize`accelerator`,
		highway: $localize`highway`,
	};
}
