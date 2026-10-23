import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { MapFocusLinkComponent } from './map-focus-link.component';
import { Duration } from '../../core/format/duration';
import { ColorDotComponent } from '../../shared/components/color-dot.component';
import { SearchableSelectComponent } from '../../shared/components/searchable-select/searchable-select.component';

@Component({
	selector: 'app-map-stations-panel',
	imports: [ColorDotComponent, FormField, MapFocusLinkComponent, SearchableSelectComponent],
	templateUrl: './map-stations-panel.component.html',
})
export class MapStationsPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	protected readonly form = this.stations.stationsForm;
	protected readonly duration = Duration.short;
}
