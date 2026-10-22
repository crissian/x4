import { Component, input, output } from '@angular/core';
import { LucideExpand, LucideMaximize2, LucideZoomIn, LucideZoomOut } from '@lucide/angular';

/** The zoom in, zoom out, fit and (optionally) enlarge buttons in the corner of a map. */
@Component({
	selector: 'app-map-zoom-buttons',
	imports: [LucideZoomIn, LucideZoomOut, LucideExpand, LucideMaximize2],
	templateUrl: './map-zoom-buttons.component.html',
})
export class MapZoomButtonsComponent {
	/** The title of the fit button, already translated. */
	readonly resetLabel = input.required<string>();
	/** Shows the button that opens a larger map. */
	readonly expandable = input(true);
	readonly zoomIn = output();
	readonly zoomOut = output();
	readonly fit = output();
	readonly expand = output();
}
