import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPinned } from '@lucide/angular';

/** A sector name linking to the sector page, then a pin that shows the sector on the galaxy map. */
@Component({
	selector: 'app-sector-map-link',
	imports: [LucideMapPinned, RouterLink],
	templateUrl: './sector-map-link.component.html',
	host: { class: 'inline-flex items-center gap-1' },
})
export class SectorMapLinkComponent {
	readonly sector = input.required<string>();
	readonly name = input.required<string>();
}
