import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapSaveMarkers } from '../canvas/map-save-markers';
import { MapHostiles } from '../save/map-hostiles';
import { MapFocusLinkComponent } from './map-focus-link.component';

/** The Xenon and Kha'ak of the active save by sector, with the toggles of their map layers. */
@Component({
	selector: 'app-map-hostiles-panel',
	imports: [FormField, MapFocusLinkComponent, RouterLink],
	templateUrl: './map-hostiles-panel.component.html',
})
export class MapHostilesPanelComponent {
	protected readonly hostiles = inject(MapHostiles);
	protected readonly colors = MapHostiles.COLORS;
	protected readonly factionName = MapHostiles.factionName;
	/** [s, m, l, xl] as "S 3, M 9" */
	protected readonly sizeSplit = (ships: number[]) => MapSaveMarkers.sizeSplit([0, ...ships]);
}
