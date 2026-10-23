import { Component, inject } from '@angular/core';
import { MapSaveLayer } from '../save/map-save-layer';

/** The legend's "From your save" part: contested and undiscovered sectors, player ships and stations. */
@Component({
	selector: 'app-map-save-legend',
	templateUrl: './map-save-legend.html',
})
export class MapSaveLegend {
	protected readonly save = inject(MapSaveLayer);
}
