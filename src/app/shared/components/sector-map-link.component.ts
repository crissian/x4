import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMapPinned } from '@lucide/angular';

/**
 * A sector name linking to the sector page, then a pin that shows the sector on the galaxy map; without a sector,
 * the muted fallback text (e.g. a location the game wrote as text).
 */
@Component({
	selector: 'app-sector-map-link',
	imports: [LucideMapPinned, RouterLink],
	templateUrl: './sector-map-link.component.html',
	host: { class: 'inline-flex items-center gap-1 whitespace-nowrap' },
})
export class SectorMapLinkComponent {
	/** the sector id */
	readonly sector = input<string>();
	/** the sector name; defaults to the id */
	readonly name = input<string>();
	readonly fallback = input<string>();
}
