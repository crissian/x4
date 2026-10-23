import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MapStore } from '../map-store';
import { MapHostiles } from '../save/map-hostiles';
import { MapSaveAbandoned } from '../save/map-save-abandoned';
import { MapSaveLayer } from '../save/map-save-layer';

/**
 * The legend's "From your save" part: contested and undiscovered sectors, player ships and stations, abandoned
 * ships gone from the save, and the Xenon and Kha'ak layer toggles.
 */
@Component({
	selector: 'app-map-save-legend',
	imports: [FormField],
	templateUrl: './map-save-legend.html',
})
export class MapSaveLegend {
	protected readonly save = inject(MapSaveLayer);
	protected readonly store = inject(MapStore);
	protected readonly abandoned = inject(MapSaveAbandoned);
	protected readonly hostiles = inject(MapHostiles);
	protected readonly colors = MapHostiles.COLORS;
}
