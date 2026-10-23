import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPinned } from '@lucide/angular';

/** A "Show on map" link with a pin that opens the galaxy map on a sector, optionally with a map layer shown. */
@Component({
	selector: 'app-show-on-map-link',
	imports: [LucideMapPinned, RouterLink],
	templateUrl: './show-on-map-link.component.html',
})
export class ShowOnMapLinkComponent {
	/** the sector id */
	readonly sector = input.required<string>();
	/** a map layer to show, e.g. `vaults` */
	readonly layer = input<string>();

	protected readonly params = computed(() =>
		this.layer() ? { sector: this.sector(), layer: this.layer() } : { sector: this.sector() }
	);
}
