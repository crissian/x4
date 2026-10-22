import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { RoutePlanner } from '../route-planner';
import { MapFocusLinkComponent } from './map-focus-link.component';

@Component({
	selector: 'app-map-stations-panel',
	imports: [FormField, MapFocusLinkComponent],
	templateUrl: './map-stations-panel.component.html',
})
export class MapStationsPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	protected readonly form = this.stations.stationsForm;
	protected readonly routes = RoutePlanner;
}
