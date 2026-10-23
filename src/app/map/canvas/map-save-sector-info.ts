import { Component, computed, inject, input } from '@angular/core';
import { MapSaveSectors } from '../save/map-save-sectors';
import { MapSaveMarkers } from './map-save-markers';

/** The save facts of one sector in its tooltip: contested, undiscovered and what the player has there. */
@Component({
	selector: 'app-map-save-sector-info',
	templateUrl: './map-save-sector-info.html',
})
export class MapSaveSectorInfo {
	readonly sector = input.required<string>();

	private readonly sectors = inject(MapSaveSectors);

	protected readonly contested = computed(() => this.sectors.contested().has(this.sector()));
	protected readonly unknown = computed(() => this.sectors.unknown().has(this.sector()));
	protected readonly presence = computed(() => this.sectors.presence().get(this.sector()));
	protected readonly any = computed(() => this.contested() || this.unknown() || !!this.presence());
	protected readonly sizeSplit = MapSaveMarkers.sizeSplit;
}
